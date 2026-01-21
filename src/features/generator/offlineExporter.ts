import { Muxer, ArrayBufferTarget } from 'webm-muxer';
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

        console.log(`[OfflineExport] Starting export. Res: ${resolution}, SS: ${superSampling}, Dims: ${physicalW}x${physicalH}, FPS: ${fps}`);

        // Calculate Global Scale
        const logicalRefW = format === 'landscape' ? 1920 : 1080;
        const globalScale = physicalW / logicalRefW;

        // 2. Setup Canvas
        console.log('[OfflineExport] Creating OffscreenCanvas...');
        const offscreenCanvas = new OffscreenCanvas(physicalW, physicalH);
        const ctx = offscreenCanvas.getContext('2d', {
            willReadFrequently: true,
            alpha: true
        }) as OffscreenCanvasRenderingContext2D; // Optimized attributes
        if (!ctx) throw new Error('Could not create offscreen context');

        // 3. Setup Muxer & Encoder
        const durationSec = 6.0 * animation.duration;
        const totalFrames = Math.ceil(durationSec * fps);
        console.log(`[OfflineExport] Total Frames: ${totalFrames}`);

        const muxer = new Muxer({
            target: new ArrayBufferTarget(),
            video: {
                codec: 'V_VP9',
                width: physicalW,
                height: physicalH,
                frameRate: fps
            }
        });

        const videoEncoder = new VideoEncoder({
            output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
            error: (e) => {
                console.error('[OfflineExport] Encoder Error:', e);
                onError(e);
            }
        });

        const bitrate = Math.min(100_000_000, physicalW * physicalH * fps * 0.1);
        console.log(`[OfflineExport] Configuring Encoder. Codec: vp09.00.41.08, Bitrate: ${bitrate}`);

        videoEncoder.configure({
            codec: 'vp09.00.41.08', // VP9 Profile 0, Level 4.1
            width: physicalW,
            height: physicalH,
            bitrate: bitrate,
            framerate: fps
        });

        // 4. Render Loop
        const particlesRef = { current: [] as Particle[] };

        console.log('[OfflineExport] Starting Render Loop...');
        for (let i = 0; i < totalFrames; i++) {
            if (videoEncoder.state === 'closed') {
                console.error('[OfflineExport] Encoder closed unexpectedly at frame ' + i);
                throw new Error('VideoEncoder closed unexpectedly');
            }

            const time = (i / fps) * 1000; // time in ms

            // Render
            try {
                // console.log(`[OfflineExport] Render Frame ${i}`); // Verbose log
                renderFrame(
                    ctx as any, // Cast to any because renderFrame expects CanvasRenderingContext2D
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

            // Create VideoFrame
            let frame: VideoFrame | null = null;
            try {
                frame = new VideoFrame(offscreenCanvas, { timestamp: time * 1000 });
            } catch (frameErr) {
                console.error(`[OfflineExport] VideoFrame creation failed at frame ${i}:`, frameErr);
                throw frameErr;
            }

            // Encode
            try {
                videoEncoder.encode(frame, { keyFrame: i % 60 === 0 });
            } catch (e) {
                console.error('[OfflineExport] Encode failed at frame ' + i, e);
                frame.close();
                throw e;
            }
            frame.close(); // Important to close frame to release memory

            // Report Progress
            if (i % 30 === 0) console.log(`[OfflineExport] Progress: ${i}/${totalFrames}`);
            onProgress((i / totalFrames) * 100);

            // Allow UI to breathe - Slightly increased delay to prevent browser freeze
            if (i % 2 === 0) await new Promise(r => setTimeout(r, 0));
        }

        console.log('[OfflineExport] Rendering done. Flushing encoder...');

        // 5. Finalize
        if (videoEncoder.state === 'configured') {
            await videoEncoder.flush();
        }

        console.log('[OfflineExport] Encoder flushed. Finalizing muxer...');
        muxer.finalize();

        const { buffer } = muxer.target;
        console.log(`[OfflineExport] Muxing complete. Buffer size: ${buffer.byteLength}`);

        const blob = new Blob([buffer], { type: 'video/webm' });

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
