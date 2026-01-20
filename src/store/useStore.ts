import { create } from 'zustand';

export interface CTAState {
    primaryText: string;
    underText: string;
    imageUrl: string | null;
    accentColor: string;
    format: 'landscape' | 'portrait';
    setPrimaryText: (text: string) => void;
    setUnderText: (text: string) => void;
    setImageUrl: (url: string | null) => void;
    setAccentColor: (color: string) => void;
    setFormat: (format: 'landscape' | 'portrait') => void;
}

export const useStore = create<CTAState>((set) => ({
    primaryText: 'Subscribe',
    underText: 'twitch.tv/mychannel',
    imageUrl: null,
    accentColor: '#8b5cf6', // Default primary color
    format: 'landscape',
    setPrimaryText: (text) => set({ primaryText: text }),
    setUnderText: (text) => set({ underText: text }),
    setImageUrl: (url) => set({ imageUrl: url }),
    setAccentColor: (color) => set({ accentColor: color }),
    setFormat: (format) => set({ format: format }),
}));
