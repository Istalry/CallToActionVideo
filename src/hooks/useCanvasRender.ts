import { useEffect, useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { renderFrame, type Particle } from '../features/generator/renderLoop';

export const useCanvasRender = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const state = useStore();
    const { imageUrl, resolution, format } = state;

    const animationRef = useRef<number>(0);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cursorRef = useRef<HTMLImageElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const particleImageRef = useRef<HTMLImageElement | null>(null);
    const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null); // Ref for scratch canvas

    // Force re-render when assets load
    const [, forceUpdate] = useState({});

    // Stable assets reference
    const assets = {
        image: imageRef.current,
        cursor: cursorRef.current,
        particleImage: particleImageRef.current,
        scratchCanvas: scratchCanvasRef.current
    };

    // Helpers for resolution
    const getBaseDimensions = () => {
        let width = 1920;
        let height = 1080;

        if (resolution === '480p') { width = 854; height = 480; }
        if (resolution === '720p') { width = 1280; height = 720; }
        if (resolution === '1080p') { width = 1920; height = 1080; }
        if (resolution === '2k') { width = 2560; height = 1440; }
        if (resolution === '4k') { width = 3840; height = 2160; }

        if (format === 'portrait') return { width: height, height: width };
        return { width, height };
    };

    // Load user image
    useEffect(() => {
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => {
                imageRef.current = img;
                forceUpdate({});
            };
        } else {
            imageRef.current = null;
        }
    }, [imageUrl]);

    // Load particle image
    useEffect(() => {
        if (state.particles.image) {
            const img = new Image();
            img.src = state.particles.image;
            img.onload = () => {
                particleImageRef.current = img;
                forceUpdate({});
            };
        } else {
            particleImageRef.current = null;
        }
    }, [state.particles.image]);

    // Load cursor image
    useEffect(() => {
        const cursorImg = new Image();
        cursorImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBsMTEuMzcyIDI5Ljk1NiAzLjg2Ny04LjA5NCA5LjQ2NCA4LjA5NCAzLjI1NS0zLjgwNC05LjQ2Mi04LjA5NSA5LjU0Ni0xLjQ0NXoiLz48cGF0aCBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBkPSdNMCAwbDExLjM3MiAyOS45NTYgMy44NjctOC4wOTQgOS40NjQgOC4wOTQgMy4yNTUtMy44MDQtOS40NjItOC4wOTUgOS41NDYtMS40NDV6Jy8+PC9nPjwvc3ZnPg==';
        cursorImg.onload = () => {
            cursorRef.current = cursorImg;
            forceUpdate({});
        };

        // Initialize scratch canvas
        scratchCanvasRef.current = document.createElement('canvas');
        forceUpdate({});
    }, []);

    useEffect(() => {
        const render = (time: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Dimensions
            const { width: baseW, height: baseH } = getBaseDimensions();
            // Apply Supersampling (Preview always 1x or limited)
            // We use 1x for preview to prevent 8K canvas causing browser lag/blinking
            const physicalW = baseW;
            const physicalH = baseH;

            // Set Canvas Size
            if (canvas.width !== physicalW || canvas.height !== physicalH) {
                canvas.width = physicalW;
                canvas.height = physicalH;
            }

            // Calculate Scale
            // Logical Width is ~1920 (Landscape) or ~1080 (Portrait)
            // But we scale based on physical pixels vs base logical reference

            // Standard Reference Frame
            const logicalRefW = format === 'landscape' ? 1920 : 1080;
            const globalScale = physicalW / logicalRefW;

            renderFrame(
                ctx,
                physicalW,
                physicalH,
                time,
                state,
                {
                    image: imageRef.current,
                    cursor: cursorRef.current,
                    particleImage: particleImageRef.current,
                    scratchCanvas: scratchCanvasRef.current
                },
                particlesRef,
                globalScale
            );

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [state]);

    return { assets };
};
