import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, type ChildProcess } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const DIST_PATH = path.join(__dirname, '../dist');
const PUBLIC_PATH = app.isPackaged ? DIST_PATH : path.join(__dirname, '../public');

let mainWindow: BrowserWindow | null = null;
let ffmpegProcess: ChildProcess | null = null;
let currentOutputPath: string | null = null;

function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        icon: path.join(PUBLIC_PATH, 'electron-vite.svg'),
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true,
    });

    mainWindow.setMenu(null);

    if (process.env.VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(DIST_PATH, 'index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.on('render-process-gone', (_event, details) => {
        console.error('Render process gone:', details.reason);
        if (details.reason === 'crashed' || details.reason === 'oom') {
            console.log('Reloading window in 1s...');
            setTimeout(() => {
                mainWindow?.reload();
            }, 1000);
        }
    });
}

// FFmpeg IPC Handlers
// FFmpeg IPC Handlers
ipcMain.handle('ffmpeg-start', async (_event, options: { width: number; height: number; fps: number; bitrate: number; filename: string }) => {
    if (ffmpegProcess) {
        try {
            ffmpegProcess.stdin?.end();
            ffmpegProcess.kill();
        } catch (e) { /* ignore */ }
    }

    // Determine FFmpeg path based on environment
    let binaryPath = ffmpegPath as unknown as string;
    if (app.isPackaged) {
        // In production, ffmpeg is in the resources folder
        binaryPath = path.join(process.resourcesPath, 'ffmpeg.exe');
    }

    if (!binaryPath) throw new Error('FFmpeg binary not found');

    // Filename is now expected to be the full path from the save dialog
    const outputPath = options.filename;
    currentOutputPath = outputPath;

    console.log('[Main] Spawning FFmpeg:', options);
    console.log('[Main] Binary Path:', binaryPath);
    console.log('[Main] Output Path:', outputPath);

    const args = [
        '-y', // Overwrite
        '-f', 'image2pipe',
        '-vcodec', 'png',
        '-r', options.fps.toString(),
        '-i', '-', // Input from stdin
        '-c:v', 'libvpx-vp9',
        '-b:v', options.bitrate.toString(),
        '-pix_fmt', 'yuva420p', // Alpha support
        '-auto-alt-ref', '0', // Disable alt-ref frames for transparency safety (sometimes needed)
        outputPath
    ];

    ffmpegProcess = spawn(binaryPath, args);

    ffmpegProcess.stderr?.on('data', (_data) => {
        // console.error(`[FFmpeg Error]: ${_data}`); // Optional logging
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`[Main] FFmpeg process exited with code ${code}`);
        if (code === 0 && currentOutputPath) {
            shell.showItemInFolder(currentOutputPath);
        }
        ffmpegProcess = null;
        currentOutputPath = null;
    });
});

ipcMain.handle('dialog-save-path', async () => {
    const { canceled, filePath } = await getSaveDialog();
    if (canceled) return null;
    return filePath;
});

async function getSaveDialog() {
    // Import dialog dynamically or move import to top if possible (top is cleaner)
    const { dialog } = await import('electron');
    return dialog.showSaveDialog({
        title: 'Save Video',
        defaultPath: `cta-video-${Date.now()}.webm`,
        filters: [
            { name: 'WebM Video', extensions: ['webm'] }
        ]
    });
}

ipcMain.handle('ffmpeg-feed', async (_event, chunk: ArrayBuffer) => {
    if (!ffmpegProcess || !ffmpegProcess.stdin) return;

    // Write the buffer to stdin
    const buffer = Buffer.from(chunk);

    return new Promise<void>((resolve, reject) => {
        if (!ffmpegProcess?.stdin) return reject('No stdin');

        const canWrite = ffmpegProcess.stdin.write(buffer);
        if (canWrite) {
            resolve();
        } else {
            ffmpegProcess.stdin.once('drain', resolve);
        }
    });
});

ipcMain.handle('ffmpeg-finish', async () => {
    if (!ffmpegProcess || !ffmpegProcess.stdin) return;

    return new Promise<void>((resolve) => {
        ffmpegProcess?.stdin?.end(() => {
            // Wait for process to exit? Or just resolve now that input is done?
            // Better to wait for exit to ensure file is written.
            if (ffmpegProcess) {
                ffmpegProcess.once('close', () => resolve());
            } else {
                resolve();
            }
        });
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

app.whenReady().then(createMainWindow);
