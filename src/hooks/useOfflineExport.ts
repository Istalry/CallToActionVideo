import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { exportVideoOffline } from '../features/generator/offlineExporter';
import type { RenderAssets } from '../features/generator/renderLoop';

export const useOfflineExport = () => {
    const state = useStore();
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const startOfflineExport = useCallback(async (assets: RenderAssets) => {
        setIsExporting(true);
        setProgress(0);
        setError(null);

        // Small delay to let UI show "Preparing..."
        await new Promise(r => setTimeout(r, 100));

        exportVideoOffline(
            state,
            assets,
            (p) => setProgress(p),
            () => {
                setIsExporting(false);
                setProgress(100);
            },
            (err) => {
                setIsExporting(false);
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        );
    }, [state]);

    return { isExporting, progress, error, startOfflineExport };
};
