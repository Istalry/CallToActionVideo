export const Easing = {
    // Linear
    linear: (t: number) => t,

    // Ease Out Expo (Snappy)
    easeOutExpo: (t: number) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },

    // Ease Out Elastic (Bouncy)
    easeOutElastic: (t: number) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0
            ? 0
            : t === 1
                ? 1
                : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },

    // Ease In Out Cubic (Smooth)
    easeInOutCubic: (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    // Ease Out Back (Overshoot)
    easeOutBack: (t: number) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },

    // Ease In Quad
    easeInQuad: (t: number) => {
        return t * t;
    }
};
