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
    const { primaryText, underText, accentColor, format, imageUrl } = useStore();
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
        const cursor = new Image();
        // Polished macOS style arrow cursor
        cursor.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0wIDBsMTEuMzcyIDI5Ljk1NiAzLjg2Ny04LjA5NCA5LjQ2NCA4LjA5NCAzLjI1NS0zLjgwNC05LjQ2Mi04LjA5NSA5LjU0Ni0xLjQ0NXoiLz48cGF0aCBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBkPSdNMCAwbDExLjM3MiAyOS45NTYgMy44NjctOC4wOTQgOS40NjQgOC4wOTQgMy4yNTUtMy44MDQtOS40NjItOC4wOTUgOS41NDYtMS40NDV6Jy8+PC9nPjwvc3ZnPg==';
        cursor.onload = () => { cursorRef.current = cursor; };
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
            const duration = 6000;
            const tMs = time % duration; // Time in MS

            const clickTime = 2500;
            const exitTime = 5000;

            // 1. Box Entrance
            let boxYOffset = 0;
            let boxOpacity = 1;
            let boxScale = 1;

            if (tMs < 1000) {
                const t = tMs / 1000;
                const ease = Easing.easeOutExpo(t);
                boxYOffset = 100 * (1 - ease);
                boxOpacity = ease;
            }
            // Box Exit
            else if (tMs > exitTime) {
                const t = (tMs - exitTime) / 500;
                const ease = Easing.easeOutExpo(t);
                boxOpacity = 1 - ease;
                boxScale = 1 - (0.1 * ease);
                boxYOffset = 50 * ease;
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
            ctx.fillStyle = isClicked ? '#ffffff' : '#f3f4f6';
            if (ctx.roundRect) ctx.roundRect(x, y, boxW, boxH, 100);
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
                ctx.drawImage(imageRef.current, avatarX, avatarY, avatarSize, avatarSize);
            } else {
                ctx.fillStyle = '#ccc';
                ctx.fill();
            }
            ctx.restore();

            // Text
            const textX = x + 200;
            const textCenterY = y + boxH / 2;

            ctx.textAlign = 'left';
            ctx.shadowColor = 'transparent';

            const textOffset = isClicked ? 10 : 0;

            ctx.fillStyle = isClicked ? accentColor : '#000000';
            ctx.font = 'bold 72px Inter, sans-serif';
            ctx.textBaseline = 'bottom';
            ctx.fillText(isClicked ? "SUBSCRIBED" : primaryText, textX + textOffset, textCenterY - 5);

            ctx.fillStyle = '#666';
            ctx.font = '36px Inter, sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText(underText, textX + textOffset, textCenterY + 10);

            // Reset Transform
            ctx.setTransform(1, 0, 0, 1, 0, 0);

            // --- Particles (Confetti) ---
            if (tMs >= clickTime && tMs < clickTime + 50) {
                // Spawn Burst
                if (particlesRef.current.length === 0) {
                    for (let i = 0; i < 50; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 5 + Math.random() * 10;
                        particlesRef.current.push({
                            x: cx,
                            y: cy,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed - 5,
                            life: 1.0,
                            color: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', accentColor][Math.floor(Math.random() * 5)],
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
            if (cursorRef.current && tMs < 5000) {
                let curX = width + 50;
                let curY = height + 100;
                let scale = 1;

                const targetX = cx + 200;
                const targetY = cy + 50;

                if (tMs >= 1000 && tMs < 2500) {
                    const t = (tMs - 1000) / 1500;
                    const ease = Easing.easeOutExpo(t);
                    curX = (width) * (1 - ease) + targetX * ease;
                    curY = (height) * (1 - ease) + targetY * ease;
                } else if (tMs >= 2500) {
                    curX = targetX;
                    curY = targetY;
                    // Exit
                    if (tMs > 3000) {
                        const t = (tMs - 3000) / 1000;
                        const ease = Easing.easeInQuad(t);
                        curY = targetY + (height / 2) * ease;
                        curX = targetX - (100) * ease;
                    }
                }

                // Click press
                if (tMs > 2400 && tMs < 2600) scale = 0.8;

                // Draw Cursor
                if (tMs > 1000) {
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
    }, [primaryText, underText, accentColor, format, imageUrl]);
};
