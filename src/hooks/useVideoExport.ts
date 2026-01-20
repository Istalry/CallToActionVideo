import { useState, useCallback } from 'react';

interface UseVideoExportReturn {
    isRecording: boolean;
    startRecording: (durationMs?: number) => void;
}

export const useVideoExport = (canvasRef: React.RefObject<HTMLCanvasElement | null>): UseVideoExportReturn => {
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = useCallback((durationMs: number = 5000) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        try {
            // 60 FPS capture
            const stream = canvas.captureStream(60);

            // Prefer VP9 for transparency, fallback to VP8
            let mimeType = 'video/webm; codecs=vp9';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'video/webm; codecs=vp8';
                if (!MediaRecorder.isTypeSupported(mimeType)) {
                    mimeType = 'video/webm';
                }
            }

            const recorder = new MediaRecorder(stream, {
                mimeType,
                videoBitsPerSecond: 25000000 // 25 Mbps
            });

            const chunks: Blob[] = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: mimeType });
                const defaultName = `cta-export-${Date.now()}.webm`;

                // Attempt File System Access API
                if ('showSaveFilePicker' in window) {
                    try {
                        // @ts-ignore - TS might not allow window.showSaveFilePicker yet without proper configs
                        const handle = await window.showSaveFilePicker({
                            suggestedName: defaultName,
                            types: [{
                                description: 'WebM Video',
                                accept: { 'video/webm': ['.webm'] },
                            }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                    } catch (err: any) {
                        // User cancelled or error, fallback if not cancellation
                        if (err.name !== 'AbortError') {
                            console.error('File Picker Error', err);
                            downloadAnchor(blob, defaultName);
                        }
                    }
                } else {
                    // Fallback
                    downloadAnchor(blob, defaultName);
                }

                setIsRecording(false);
            };

            recorder.start();
            setIsRecording(true);

            // Stop after duration
            setTimeout(() => {
                if (recorder.state === 'recording') {
                    recorder.stop();
                }
            }, durationMs);

        } catch (err) {
            console.error("Export failed:", err);
            setIsRecording(false);
        }
    }, [canvasRef]);

    // Helper for anchor download
    const downloadAnchor = (blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return { isRecording, startRecording };
};
