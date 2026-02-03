import { create } from 'zustand';

export interface CTAState {
    primaryText: string;
    primaryTextSize: number;
    underText: string;
    underTextSize: number;
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
        seed: number;
        damping: number;
    };

    subscribedText: string;
    subscribedTextSize: number;

    setPrimaryText: (text: string) => void;
    setPrimaryTextSize: (size: number) => void;
    setUnderText: (text: string) => void;
    setUnderTextSize: (size: number) => void;
    setSubscribedText: (text: string) => void;
    setSubscribedTextSize: (size: number) => void;
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
        seed: number;
        damping: number;
    }>) => void;

    // Output Settings
    resolution: '480p' | '720p' | '1080p' | '2k' | '4k';
    superSampling: 1 | 2;
    exportFormat: 'webm' | 'mov';
    setResolution: (res: '480p' | '720p' | '1080p' | '2k' | '4k') => void;
    setSuperSampling: (ss: 1 | 2) => void;
    setExportFormat: (format: 'webm' | 'mov') => void;
}

export const useStore = create<CTAState>((set) => ({
    primaryText: 'Subscribe',
    primaryTextSize: 72,
    underText: 'twitch.tv/mychannel',
    underTextSize: 36,
    subscribedText: 'SUBSCRIBED',
    subscribedTextSize: 72,
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
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#8b5cf6'],
        seed: 12345,
        damping: 1.0
    },

    resolution: '1080p',
    superSampling: 1,
    exportFormat: 'mov',

    setPrimaryText: (text) => set({ primaryText: text }),
    setPrimaryTextSize: (size) => set({ primaryTextSize: size }),
    setUnderText: (text) => set({ underText: text }),
    setUnderTextSize: (size) => set({ underTextSize: size }),
    setSubscribedText: (text) => set({ subscribedText: text }),
    setSubscribedTextSize: (size) => set({ subscribedTextSize: size }),
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
    setExportFormat: (format) => set({ exportFormat: format }),
}));
