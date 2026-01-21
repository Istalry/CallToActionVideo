import { useState, useCallback } from 'react';
import { startExport } from '../features/generator/exporter';

interface UseVideoExportReturn {
    isRecording: boolean;
    startRecording: (durationMs?: number) => void;
}

export const useVideoExport = (canvasRef: React.RefObject<HTMLCanvasElement | null>): UseVideoExportReturn => {
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = useCallback((durationMs: number = 5000) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsRecording(true);

        startExport(
            canvas,
            durationMs,
            () => {
                setIsRecording(false);
            },
            (err) => {
                console.error("Export failed:", err);
                setIsRecording(false);
            }
        );
    }, [canvasRef]);

    return { isRecording, startRecording };
};
