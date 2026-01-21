import { create } from 'zustand';

export interface CTAState {
    primaryText: string;
    underText: string;
    imageUrl: string | null;
    format: 'landscape' | 'portrait';
    imageTransform: { scale: number; x: number; y: number };
    ctaColors: { background: string; text: string; underText: string };
    subscribedColors: { background: string; text: string; underText: string };
    roundness: number;
    animation: {
        type: 'smooth' | 'elastic' | 'bounce';
        duration: number;
        position: boolean;
        scale: boolean;
        opacity: boolean;
    };
    cursor: { visible: boolean; animationType: 'smooth' | 'elastic' | 'bounce' };
    particles: {
        enabled: boolean;
        count: number;
        speed: number;
        minSize: number;
        maxSize: number;
        gravity: number;
        rotationSpeed: number;
        lifeMin: number;
        lifeMax: number;
        fadeMode: 'opacity' | 'scale' | 'both' | 'none';
        noiseStrength: number;
        noiseScale: number;
        shape: 'square' | 'circle' | 'image';
        image: string | null;
        colors: string[];
    };

    subscribedText: string;

    setPrimaryText: (text: string) => void;
    setUnderText: (text: string) => void;
    setSubscribedText: (text: string) => void;
    setImageUrl: (url: string | null) => void;
    setImageTransform: (transform: Partial<{ scale: number; x: number; y: number }>) => void;
    setRoundness: (roundness: number) => void;
    setCtaColors: (colors: Partial<{ background: string; text: string; underText: string }>) => void;
    setSubscribedColors: (colors: Partial<{ background: string; text: string; underText: string }>) => void;
    setFormat: (format: 'landscape' | 'portrait') => void;
    setAnimation: (animation: Partial<{
        type: 'smooth' | 'elastic' | 'bounce';
        duration: number;
        position: boolean;
        scale: boolean;
        opacity: boolean;
    }>) => void;
    setCursor: (cursor: Partial<{ visible: boolean; animationType: 'smooth' | 'elastic' | 'bounce' }>) => void;
    setParticles: (particles: Partial<{
        enabled: boolean;
        count: number;
        speed: number;
        minSize: number;
        maxSize: number;
        gravity: number;
        rotationSpeed: number;
        lifeMin: number;
        lifeMax: number;
        fadeMode: 'opacity' | 'scale' | 'both' | 'none';
        noiseStrength: number;
        noiseScale: number;
        shape: 'square' | 'circle' | 'image';
        image: string | null;
        colors: string[];
    }>) => void;

    // Output Settings
    resolution: '480p' | '720p' | '1080p' | '2k' | '4k';
    superSampling: 1 | 2;
    setResolution: (res: '480p' | '720p' | '1080p' | '2k' | '4k') => void;
    setSuperSampling: (ss: 1 | 2) => void;
}

export const useStore = create<CTAState>((set) => ({
    primaryText: 'Subscribe',
    underText: 'twitch.tv/mychannel',
    subscribedText: 'SUBSCRIBED',
    imageUrl: null,
    imageTransform: { scale: 1, x: 0, y: 0 },
    ctaColors: {
        background: '#f3f4f6',
        text: '#000000',
        underText: '#666666'
    },
    subscribedColors: {
        background: '#ffffff',
        text: '#8b5cf6',
        underText: '#666666'
    },
    roundness: 100,
    format: 'landscape',
    animation: {
        type: 'elastic',
        duration: 1.0,
        position: true,
        scale: true,
        opacity: true
    },
    cursor: { visible: true, animationType: 'smooth' },
    particles: {
        enabled: true,
        count: 50,
        speed: 10,
        minSize: 5,
        maxSize: 15,
        gravity: 0.5,
        rotationSpeed: 0,
        lifeMin: 0.5,
        lifeMax: 1.5,
        fadeMode: 'opacity',
        noiseStrength: 0,
        noiseScale: 100,
        shape: 'square',
        image: null,
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#8b5cf6']
    },

    resolution: '1080p',
    superSampling: 1,

    setPrimaryText: (text) => set({ primaryText: text }),
    setUnderText: (text) => set({ underText: text }),
    setSubscribedText: (text) => set({ subscribedText: text }),
    setImageUrl: (url) => set({ imageUrl: url }),
    setImageTransform: (transform) => set((state) => ({ imageTransform: { ...state.imageTransform, ...transform } })),
    setRoundness: (roundness) => set({ roundness }),
    setCtaColors: (colors) => set((state) => ({ ctaColors: { ...state.ctaColors, ...colors } })),
    setSubscribedColors: (colors) => set((state) => ({ subscribedColors: { ...state.subscribedColors, ...colors } })),
    setFormat: (format) => set({ format: format }),
    setAnimation: (anim) => set((state) => ({ animation: { ...state.animation, ...anim } })),
    setCursor: (cursor) => set((state) => ({ cursor: { ...state.cursor, ...cursor } })),
    setParticles: (particles) => set((state) => ({ particles: { ...state.particles, ...particles } })),
    setResolution: (res) => set({ resolution: res }),
    setSuperSampling: (ss) => set({ superSampling: ss }),
}));
