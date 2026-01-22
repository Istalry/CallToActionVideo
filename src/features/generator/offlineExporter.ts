import WebMWriter from 'webm-writer';
import { renderFrame } from './renderLoop';
import type { RenderAssets, Particle } from './renderLoop';
import type { CTAState } from '../../store/useStore';

export const exportVideoOffline = async (
    state: CTAState,
    assets: RenderAssets,
    onProgress: (progress: number) => void,
    onComplete: () => void,
    onError: (err: unknown) => void
) => {
    try {
        const { resolution, superSampling, format, animation } = state;

        // 1. Calculate Dimensions
        const getBaseDimensions = () => {
            let w = 1920;
            let h = 1080;
            if (resolution === '480p') { w = 854; h = 480; }
            if (resolution === '720p') { w = 1280; h = 720; }
            if (resolution === '1080p') { w = 1920; h = 1080; }
            if (resolution === '2k') { w = 2560; h = 1440; }
            if (resolution === '4k') { w = 3840; h = 2160; }
            if (format === 'portrait') return { width: h, height: w };
            return { width: w, height: h };
        };

        const { width: baseW, height: baseH } = getBaseDimensions();
        const physicalW = baseW * superSampling;
        const physicalH = baseH * superSampling;
        const fps = 60;
        const msPerFrame = 1000 / fps;

        console.log(`[OfflineExport] Starting export (webm-writer). Res: ${resolution}, SS: ${superSampling}, Dims: ${physicalW}x${physicalH}, FPS: ${fps}`);

        // Calculate Global Scale
        const logicalRefW = format === 'landscape' ? 1920 : 1080;
        const globalScale = physicalW / logicalRefW;

        // 2. Setup Canvas
        console.log('[OfflineExport] Creating CanvasElement...');
        const canvas = document.createElement('canvas');
        canvas.width = physicalW;
        canvas.height = physicalH;

        const ctx = canvas.getContext('2d', {
            willReadFrequently: true,
            alpha: true
        });
        if (!ctx) throw new Error('Could not create canvas context');

        // 3. Setup WebM Writer
        console.log('[OfflineExport] Initializing Video Writer...');
        const videoWriter = new WebMWriter({
            quality: 0.9,
            frameRate: fps,
            transparent: true, // Critical for alpha channel
        });

        // 4. Render Loop
        const durationSec = 6.0 * animation.duration;
        const totalFrames = Math.ceil(durationSec * fps);
        const particlesRef = { current: [] as Particle[] };

        console.log(`[OfflineExport] Starting Render Loop. Total Frames: ${totalFrames}`);

        for (let i = 0; i < totalFrames; i++) {
            const time = i * msPerFrame;

            // Render
            try {
                renderFrame(
                    ctx as any, // Cast because renderFrame expects DOM canvas context
                    physicalW,
                    physicalH,
                    time,
                    state,
                    assets,
                    particlesRef,
                    globalScale
                );
            } catch (renderErr) {
                console.error(`[OfflineExport] Render error at frame ${i}:`, renderErr);
                throw renderErr;
            }

            // Add Frame to Writer
            // webm-writer accepts canvas directly
            try {
                videoWriter.addFrame(canvas); // Pass standard canvas
            } catch (writeErr) {
                console.error(`[OfflineExport] Writer error at frame ${i}:`, writeErr);
                throw writeErr;
            }

            // Report Progress
            if (i % 30 === 0) console.log(`[OfflineExport] Progress: ${i}/${totalFrames}`);
            onProgress((i / totalFrames) * 100);

            // Yield to event loop to keep UI responsive
            if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }

        console.log('[OfflineExport] Rendering done. Finalizing video...');

        // 5. Finalize
        const blob = await videoWriter.complete();
        console.log(`[OfflineExport] Encoding complete. Blob size: ${blob.size}`);

        // Download
        const defaultName = `cta-${resolution}-${Date.now()}.webm`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = defaultName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('[OfflineExport] Download triggered.');
        onComplete();

    } catch (err) {
        console.error('[OfflineExport] Critical Error:', err);
        onError(err);
    }
};
