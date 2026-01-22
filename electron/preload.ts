import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    ffmpegStart: (options: any) => ipcRenderer.invoke('ffmpeg-start', options),
    ffmpegFeed: (chunk: ArrayBuffer) => ipcRenderer.invoke('ffmpeg-feed', chunk),
    ffmpegFinish: () => ipcRenderer.invoke('ffmpeg-finish'),
    selectSavePath: () => ipcRenderer.invoke('dialog-save-path'),
});
