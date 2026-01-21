import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Easing } from '../utils/easings';

// Particle System Types
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

export const useCanvasRender = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const { primaryText, underText, subscribedText, format, imageUrl, imageTransform, ctaColors, subscribedColors, roundness, animation, cursor, particles } = useStore();
    const animationRef = useRef<number>(0);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cursorRef = useRef<HTMLImageElement | null>(null);

    const particlesRef = useRef<Particle[]>([]);

    // Load user image
    useEffect(() => {
        if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
            img.onload = () => { imageRef.current = img; };
        } else {
            imageRef.current = null;
        }
    }, [imageUrl]);

    // Load cursor image
    useEffect(() => {
        const cursorImg = new Image();
        // Polished macOS style arrow cursor
        cursorImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBsMTEuMzcyIDI5Ljk1NiAzLjg2Ny04LjA5NCA5LjQ2NCA4LjA5NCAzLjI1NS0zLjgwNC05LjQ2Mi04LjA5NSA5LjU0Ni0xLjQ0NXoiLz48cGF0aCBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBkPSdNMCAwbDExLjM3MiAyOS45NTYgMy44NjctOC4wOTQgOS40NjQgOC4wOTQgMy4yNTUtMy44MDQtOS40NjItOC4wOTUgOS41NDYtMS40NDV6Jy8+PC9nPjwvc3ZnPg==';
        cursorImg.onload = () => { cursorRef.current = cursorImg; };
    }, []);

    useEffect(() => {
        const render = (time: number) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            // --- Timeline ---
            // Base Duration is 6000ms when animation.duration is 1.0
            // We scale all time based on animation.duration
            // Correct approach: Define standard keyframes and stretch them.

            const D = animation.duration;
            const enterDuration = 1000 * D;
            const clickTime = 2500 * D;
            const exitStartTime = 5000 * D;
            const totalDuration = 6000 * D;

            const tMs = time % totalDuration;

            // 1. Box Entrance
            let boxYOffset = 0;
            let boxOpacity = 1;
            let boxScale = 1;

            // Helper for easing based on types
            const getEase = (t: number) => {
                if (animation.type === 'elastic') return Easing.easeOutElastic(t);
                if (animation.type === 'bounce') return Easing.easeOutBounce(t);
                return Easing.easeOutExpo(t); // Smooth items
            };

            if (tMs < enterDuration) {
                const t = tMs / enterDuration;
                const ease = getEase(t);

                if (animation.position) boxYOffset = 100 * (1 - ease);
                if (animation.opacity) boxOpacity = ease;
                if (animation.scale) boxScale = 0.8 + (0.2 * ease); // Slight scale up
            }
            // Box Exit
            else if (tMs > exitStartTime) {
                const t = (tMs - exitStartTime) / (1000 * D);
                const ease = Easing.easeOutExpo(t);

                if (animation.opacity) boxOpacity = 1 - ease;
                if (animation.scale) boxScale = 1 - (0.1 * ease);
                if (animation.position) boxYOffset = 50 * ease;
            }

            // Context Setup
            ctx.globalAlpha = boxOpacity;

            // Box Dimensions
            const boxW = format === 'landscape' ? 800 : 700;
            const boxH = 200;
            const cx = width / 2;
            const cy = height / 2 + boxYOffset;

            const x = cx - boxW / 2;
            const y = cy - boxH / 2;

            // Draw Box
            ctx.translate(cx, cy);
            ctx.scale(boxScale, boxScale);
            ctx.translate(-cx, -cy);

            // Click Reaction
            let isClicked = tMs > clickTime;
            // Click Bump
            if (tMs > clickTime && tMs < clickTime + 200) {
                const bumpT = (tMs - clickTime) / 200;
                const bumpScale = 1 + Math.sin(bumpT * Math.PI) * 0.05;
                ctx.translate(cx, cy);
                ctx.scale(bumpScale, bumpScale);
                ctx.translate(-cx, -cy);
            }

            ctx.beginPath();
            // BG Color
            ctx.fillStyle = isClicked ? subscribedColors.background : ctaColors.background;
            if (ctx.roundRect) ctx.roundRect(x, y, boxW, boxH, roundness);
            else ctx.rect(x, y, boxW, boxH);
            ctx.fill();

            // Shadow
            ctx.shadowColor = 'rgba(0,0,0,0.2)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetY = 10;

            // Content
            // Avatar
            const avatarSize = 140;
            const avatarX = x + 30;
            const avatarY = y + (boxH - avatarSize) / 2;

            ctx.save();
            ctx.shadowColor = 'transparent';
            ctx.beginPath();
            ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            if (imageRef.current) {
                // Image Transform (Scale & Position) - Applied "Cover" style first
                const img = imageRef.current;

                // Calculate cover dimensions
                const imgRatio = img.width / img.height;
                let drawW = avatarSize;
                let drawH = avatarSize;
                let offsetX = 0;
                let offsetY = 0;

                if (imgRatio > 1) { // Landscape image
                    drawH = avatarSize;
                    drawW = avatarSize * imgRatio;
                    offsetX = -(drawW - avatarSize) / 2;
                } else { // Portrait image
                    drawW = avatarSize;
                    drawH = avatarSize / imgRatio;
                    offsetY = -(drawH - avatarSize) / 2;
                }

                // Apply manual transform
                const scale = imageTransform.scale;
                const tx = imageTransform.x;
                const ty = imageTransform.y;

                // Transform context center of avatar
                ctx.translate(avatarX + avatarSize / 2, avatarY + avatarSize / 2);
                ctx.scale(scale, scale);
                ctx.translate(tx, ty);
                ctx.translate(-(avatarX + avatarSize / 2), -(avatarY + avatarSize / 2));

                ctx.drawImage(img, avatarX + offsetX, avatarY + offsetY, drawW, drawH);
            } else {
                ctx.fillStyle = '#ccc';
                ctx.fill();
            }
            ctx.restore();

            // Text
            const textX = x + 200;
            const textCenterY = y + boxH / 2;

            // Text Rendering with Vertical Centering
            const textGap = 15; // Gap between primary and under text

            // We want to center the GROUP of texts.
            // Let's assume cap-height is roughly 0.72 of fontsize.
            const primaryHeight = 72 * 0.72; // ~52px
            const underHeight = 36 * 0.72;   // ~26px
            const totalHeight = primaryHeight + textGap + underHeight;

            // Top Y of the text block relative to center
            const blockTopY = textCenterY - (totalHeight / 2);

            // Draw Primary
            ctx.shadowColor = 'transparent';
            const textOffset = isClicked ? 10 : 0;
            const drawX = textX + textOffset;

            ctx.textAlign = 'left';

            // Primary Text
            ctx.fillStyle = isClicked ? subscribedColors.text : ctaColors.text;
            ctx.font = 'bold 72px Inter, sans-serif';
            ctx.textBaseline = 'top'; // Easier to control with top baseline logic
            ctx.fillText(isClicked ? subscribedText : primaryText, drawX, blockTopY);

            // Under Text
            ctx.fillStyle = isClicked ? subscribedColors.underText : ctaColors.underText;
            ctx.font = '36px Inter, sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(underText, drawX, blockTopY + primaryHeight + textGap);

            // Reset Transform
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // --- Particles (Confetti) ---
            if (particles.enabled && tMs >= clickTime && tMs < clickTime + 50) {
                // Spawn Burst
                if (particlesRef.current.length === 0) {
                    for (let i = 0; i < particles.count; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = (particles.speed * 0.5) + Math.random() * particles.speed; // Speed based on slider
                        particlesRef.current.push({
                            x: cx,
                            y: cy,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - 5,
                            life: 1.0,
                            color: particles.colors[Math.floor(Math.random() * particles.colors.length)],
                            size: 5 + Math.random() * 10
                        });
                    }
                }
            }
            if (tMs < 100) particlesRef.current = [];

            // Update and Draw Particles
            if (particlesRef.current.length > 0) {
                ctx.globalAlpha = 1;
                particlesRef.current.forEach((p) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.5; // Gravity
                    p.life -= 0.02;

                    if (p.life > 0) {
                        ctx.globalAlpha = p.life;
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.rect(p.x, p.y, p.size, p.size); // Square confetti
                        ctx.fill();
                    }
                });
                particlesRef.current = particlesRef.current.filter(p => p.life > 0);
            }

            // --- Cursor ---
            if (cursor.visible && cursorRef.current && tMs < (5000 * D)) {
                let curX = width + 50;
                let curY = height + 100;
                let scale = 1;

                const targetX = cx + 200;
                const targetY = cy + 50;

                const cursorEnterStart = 1000 * D;
                const cursorClickTime = 2500 * D;
                const cursorExitStart = 3000 * D;

                if (tMs >= cursorEnterStart && tMs < cursorClickTime) {
                    const t = (tMs - cursorEnterStart) / (1500 * D);
                    const ease = Easing.easeOutExpo(t);
                    curX = (width) * (1 - ease) + targetX * ease;
                    curY = (height) * (1 - ease) + targetY * ease;
                } else if (tMs >= cursorClickTime) {
                    curX = targetX;
                    curY = targetY;
                    // Exit
                    if (tMs > cursorExitStart) {
                        const t = (tMs - cursorExitStart) / (1000 * D);
                        const ease = Easing.easeInQuad(t);
                        curY = targetY + (height / 2) * ease;
                        curX = targetX - (100) * ease;
                    }
                }

                // Click press
                if (tMs > (cursorClickTime - 100) && tMs < (cursorClickTime + 100)) scale = 0.8;

                // Draw Cursor
                if (tMs > cursorEnterStart) {
                    ctx.globalAlpha = 1;
                    ctx.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';
                    ctx.translate(curX, curY);
                    ctx.scale(scale, scale);
                    ctx.drawImage(cursorRef.current, 0, 0, 32, 32);
                    ctx.setTransform(1, 0, 0, 1, 0, 0);
                    ctx.filter = 'none';
                }
            }

            animationRef.current = requestAnimationFrame(render);
        };

        animationRef.current = requestAnimationFrame(render);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [primaryText, underText, subscribedText, format, imageUrl, imageTransform, ctaColors, subscribedColors, roundness, animation, cursor, particles]);
};
