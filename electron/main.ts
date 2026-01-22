import { app, BrowserWindow } from 'electron';
import path from 'node:path'; // Using node: prefix for explicit node module usage
import { fileURLToPath } from 'node:url';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const DIST_PATH = path.join(__dirname, '../dist');
const PUBLIC_PATH = app.isPackaged ? DIST_PATH : path.join(__dirname, '../public');

let mainWindow: BrowserWindow | null = null;

function createMainWindow(): void {
    mainWindow = new BrowserWindow({
        icon: path.join(PUBLIC_PATH, 'electron-vite.svg'), // Placeholder icon, verify if exists or remove
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false
        },
        autoHideMenuBar: true, // Hide the default menu bar
    });

    mainWindow.setMenu(null); // Completely remove the menu bar

    // Test active push message to Reference loading logic
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
        // Reload if it crashed or was killed by OOM
        if (details.reason === 'crashed' || details.reason === 'oom') {
            console.log('Reloading window in 1s...');
            setTimeout(() => {
                mainWindow?.reload();
            }, 1000);
        }
    });
}

// App lifecycle
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
