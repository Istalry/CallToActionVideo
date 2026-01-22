export interface ElectronAPI {
    ffmpegStart: (options: { width: number; height: number; fps: number; bitrate: number; filename: string }) => Promise<void>;
    ffmpegFeed: (chunk: ArrayBuffer) => Promise<void>;
    ffmpegFinish: () => Promise<void>;
    selectSavePath: () => Promise<string | null>;
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}
