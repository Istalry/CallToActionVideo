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
        const { resolution, superSampling, format, animation, exportFormat } = state;

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

        // Calculate Bitrate (Simple heuristic)
        // 4K ~ 25Mbps, 1080p ~ 8Mbps
        let bitrate = 8_000_000;
        if (resolution === '2k') bitrate = 15_000_000;
        if (resolution === '4k') bitrate = 25_000_000;

        console.log(`[OfflineExport] Starting Native FFmpeg export. Res: ${resolution} (${physicalW}x${physicalH}), Bitrate: ${bitrate / 1e6}Mbps`);

        // 2. Setup Canvas
        const canvas = document.createElement('canvas');
        canvas.width = physicalW;
        canvas.height = physicalH;

        const ctx = canvas.getContext('2d', {
            alpha: true
        });
        if (!ctx) throw new Error('Could not create canvas context');

        // Quality settings
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // 3. Start FFmpeg via IPC
        // Ask user for save path
        const filename = await window.electron.selectSavePath(exportFormat);
        if (!filename) {
            console.log('[OfflineExport] User cancelled save dialog.');
            onComplete(); // Or should we just return?
            return;
        }

        await window.electron.ffmpegStart({
            width: physicalW,
            height: physicalH,
            fps,
            bitrate,
            filename // Now full path
        });

        // 4. Render Loop
        const durationSec = 6.0 * animation.duration;
        const totalFrames = Math.ceil(durationSec * fps);
        const particlesRef = { current: [] as Particle[] };
        const logicalRefW = format === 'landscape' ? 1920 : 1080;
        const globalScale = physicalW / logicalRefW;

        console.log(`[OfflineExport] Starting Render Loop. Frames: ${totalFrames}`);

        for (let i = 0; i < totalFrames; i++) {
            const time = i * msPerFrame;

            // Render to Canvas
            try {
                renderFrame(
                    ctx as any,
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

            // Convert to PNG Buffer (Lossless high quality)
            // This is the heavy part, but ensures perfect quality send to FFmpeg
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            if (!blob) throw new Error('Failed to create frame blob');

            const buffer = await blob.arrayBuffer();

            // Send to FFmpeg
            await window.electron.ffmpegFeed(buffer);

            // Progress
            if (i % 30 === 0) console.log(`[OfflineExport] Sent: ${i}/${totalFrames}`);
            onProgress((i / totalFrames) * 100);

            // Yield
            if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
        }

        console.log('[OfflineExport] Rendering done. Finishing FFmpeg...');

        // 5. Finish
        await window.electron.ffmpegFinish();

        console.log('[OfflineExport] Export Complete.');
        onComplete();

    } catch (err) {
        console.error('[OfflineExport] Critical Error:', err);
        onError(err);
    }
};
