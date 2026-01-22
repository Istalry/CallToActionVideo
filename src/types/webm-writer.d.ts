declare module 'webm-writer' {
    interface WebMWriterOptions {
        quality?: number; // 0.0 - 1.0
        fileWriter?: any; // For streaming to file (Node.js)
        fd?: any; // File descriptor
        frameDuration?: number; // Default duration of frames in ms
        frameRate?: number; // fps
        transparent?: boolean; // Enable alpha channel
        alphaQuality?: number; // 0.0 - 1.0 (defaults to quality)
    }

    class WebMWriter {
        constructor(options?: WebMWriterOptions);

        addFrame(canvas: HTMLCanvasElement | OffscreenCanvas | HTMLImageElement, duration?: number): void;

        complete(): Promise<Blob>;
    }

    export default WebMWriter;
}
