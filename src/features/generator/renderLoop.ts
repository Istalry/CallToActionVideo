import type { CTAState } from '../../store/useStore';
import { Easing } from '../../utils/easings';
import { noise2D } from '../../utils/noise';

export interface RenderAssets {
    image: HTMLImageElement | null;
    cursor: HTMLImageElement | null;
    particleImage: HTMLImageElement | null;
    scratchCanvas: HTMLCanvasElement | OffscreenCanvas | null; // Added scratch canvas for tinting
}

export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;
    size: number;
    rotation: number;
    vRotation: number;
}

export const renderFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    state: CTAState,
    assets: RenderAssets,
    particlesRef: React.MutableRefObject<Particle[]>,
    scale: number = 1
) => {
    const {
        primaryText, underText, subscribedText,
        format, imageTransform,
        ctaColors, subscribedColors, roundness,
        animation, cursor, particles
    } = state;

    ctx.clearRect(0, 0, width, height);

    // Apply Global Scale
    ctx.save();
    ctx.scale(scale, scale);

    // --- Timeline ---
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

    // Helper for easing
    const getEase = (t: number) => {
        if (animation.type === 'elastic') return Easing.easeOutElastic(t);
        if (animation.type === 'bounce') return Easing.easeOutBounce(t);
        return Easing.easeOutExpo(t);
    };

    if (tMs < enterDuration) {
        const t = tMs / enterDuration;
        const ease = getEase(t);

        if (animation.position) boxYOffset = 100 * (1 - ease);
        if (animation.opacity) boxOpacity = ease;
        if (animation.scale) boxScale = 0.8 + (0.2 * ease);
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

    // Box Dimensions (Logical)
    const boxW = format === 'landscape' ? 800 : 700;
    const boxH = 200;
    const cx = (width / scale) / 2; // Use logical center
    const cy = (height / scale) / 2 + boxYOffset;

    const x = cx - boxW / 2;
    const y = cy - boxH / 2;

    // Draw Box
    ctx.translate(cx, cy);
    ctx.scale(boxScale, boxScale);
    ctx.translate(-cx, -cy);

    // Click Reaction
    const isClicked = tMs > clickTime;
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

    if (assets.image) {
        const img = assets.image;

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
        const transformScale = imageTransform.scale;
        const tx = imageTransform.x;
        const ty = imageTransform.y;

        // Transform context center of avatar
        ctx.translate(avatarX + avatarSize / 2, avatarY + avatarSize / 2);
        ctx.scale(transformScale, transformScale);
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
    const textGap = 15;
    const primaryHeight = 72 * 0.72; // ~52px
    const underHeight = 36 * 0.72;   // ~26px
    const totalHeight = primaryHeight + textGap + underHeight;
    const blockTopY = textCenterY - (totalHeight / 2);

    ctx.shadowColor = 'transparent';
    const textOffset = isClicked ? 10 : 0;
    const drawX = textX + textOffset;

    ctx.textAlign = 'left';

    // Primary Text
    ctx.fillStyle = isClicked ? subscribedColors.text : ctaColors.text;
    ctx.font = 'bold 72px Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(isClicked ? subscribedText : primaryText, drawX, blockTopY);

    // Under Text
    ctx.fillStyle = isClicked ? subscribedColors.underText : ctaColors.underText;
    ctx.font = '36px Inter, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(underText, drawX, blockTopY + primaryHeight + textGap);

    // Reset Transform (Preserve Global Scale)
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    // --- Particles (Confetti) ---
    if (particles.enabled && tMs >= clickTime && tMs < clickTime + 50) {
        if (particlesRef.current.length === 0) {
            for (let i = 0; i < particles.count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = (particles.speed * 0.5) + Math.random() * particles.speed;
                const life = particles.lifeMin + Math.random() * (particles.lifeMax - particles.lifeMin);

                particlesRef.current.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: life,
                    maxLife: life,
                    color: particles.colors[Math.floor(Math.random() * particles.colors.length)],
                    size: particles.minSize + Math.random() * (particles.maxSize - particles.minSize),
                    rotation: Math.random() * 360,
                    vRotation: (Math.random() - 0.5) * particles.rotationSpeed
                });
            }
        }
    }
    if (tMs < 100) particlesRef.current = [];

    // Update and Draw Particles
    if (particlesRef.current.length > 0) {
        ctx.globalAlpha = 1;
        particlesRef.current.forEach((p) => {
            // Noise
            if (particles.noiseStrength > 0) {
                const n = noise2D(p.x / particles.noiseScale, p.y / particles.noiseScale);
                const angle = n * Math.PI * 2;
                p.vx += Math.cos(angle) * particles.noiseStrength * 0.1;
                p.vy += Math.sin(angle) * particles.noiseStrength * 0.1;
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vy += particles.gravity; // User Gravity
            p.rotation += p.vRotation; // Rotation
            p.life -= 0.02;

            if (p.life > 0) {
                const lifeProgress = p.life / p.maxLife;
                let opacity = 1;
                let scale = 1;

                if (particles.fadeMode === 'opacity' || particles.fadeMode === 'both') {
                    opacity = lifeProgress;
                }
                if (particles.fadeMode === 'scale' || particles.fadeMode === 'both') {
                    scale = lifeProgress;
                }

                ctx.globalAlpha = opacity;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.scale(scale, scale);

                if (particles.shape === 'image' && assets.particleImage) {
                    // Draw Image
                    const size = p.size * 2;
                    let drawSource: CanvasImageSource = assets.particleImage;

                    // Apply Tinting if scratch canvas is available
                    if (assets.scratchCanvas) {
                        const scratchCtx = assets.scratchCanvas.getContext('2d');
                        if (scratchCtx) {
                            // Clear scratch canvas
                            assets.scratchCanvas.width = size; // Resize to fit particle (optimization: could be fixed size if particles are similar)
                            assets.scratchCanvas.height = size;

                            // Draw the image
                            scratchCtx.drawImage(assets.particleImage, 0, 0, size, size);

                            // Composite the color (Multiply to preserve nuance)
                            scratchCtx.globalCompositeOperation = 'multiply';
                            scratchCtx.fillStyle = p.color;
                            scratchCtx.fillRect(0, 0, size, size);

                            // Restore alpha using destination-in (clips back to original image alpha)
                            scratchCtx.globalCompositeOperation = 'destination-in';
                            scratchCtx.drawImage(assets.particleImage, 0, 0, size, size);

                            // Reset composite mode
                            scratchCtx.globalCompositeOperation = 'source-over';

                            drawSource = assets.scratchCanvas;
                        }
                    }

                    ctx.drawImage(drawSource, -size / 2, -size / 2, size, size);
                } else if (particles.shape === 'circle') {
                    // Draw Circle
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Draw Square (Default)
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.rect(-p.size / 2, -p.size / 2, p.size, p.size);
                    ctx.fill();
                }

                ctx.restore();
            }
        });
        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
    }

    // --- Cursor ---
    if (cursor.visible && assets.cursor && tMs < (5000 * D)) {
        let curX = (width / scale) + 50; // Logical width + offset
        let curY = (height / scale) + 100; // Logical height + offset
        let cursorScale = 1;

        const targetX = cx + 200;
        const targetY = cy + 50;

        const cursorEnterStart = 1000 * D;
        const cursorClickTime = 2500 * D;
        const cursorExitStart = 3000 * D;

        if (tMs >= cursorEnterStart && tMs < cursorClickTime) {
            const t = (tMs - cursorEnterStart) / (1500 * D);

            // Cursor specific ease
            let ease = Easing.easeOutExpo(t);
            if (cursor.animationType === 'elastic') ease = Easing.easeOutElastic(t);
            if (cursor.animationType === 'bounce') ease = Easing.easeOutBounce(t);

            curX = (width / scale) * (1 - ease) + targetX * ease;
            curY = (height / scale) * (1 - ease) + targetY * ease;
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
        if (tMs > (cursorClickTime - 100) && tMs < (cursorClickTime + 100)) cursorScale = 0.8;

        // Draw Cursor
        if (tMs > cursorEnterStart) {
            ctx.globalAlpha = 1;
            ctx.filter = 'drop-shadow(2px 2px 2px rgba(0,0,0,0.3))';
            ctx.translate(curX, curY);
            ctx.scale(cursorScale, cursorScale);
            ctx.drawImage(assets.cursor, 0, 0, 32, 32);
            ctx.setTransform(scale, 0, 0, scale, 0, 0); // Restore to Global Scale
            ctx.filter = 'none';
        }
    }

    // Restore initial state (cleanup)
    ctx.restore();
};
