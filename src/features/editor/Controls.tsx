import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';

export const Controls: React.FC = () => {
    const {
        primaryText, setPrimaryText,
        underText, setUnderText,
        accentColor, setAccentColor,
        setImageUrl
    } = useStore();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
        }
    };

    return (
        <div className="w-80 bg-surface border-r border-gray-800 flex flex-col h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-lg text-white">Configuration</h2>
                <p className="text-sm text-gray-400">Customize your CTA</p>
            </div>

            <div className="p-4 space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Profile Image</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-20 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors hover:bg-white/5"
                    >
                        <span className="text-sm text-gray-500">Click to Upload Image</span>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Primary Text</label>
                    <input
                        type="text"
                        value={primaryText}
                        onChange={(e) => setPrimaryText(e.target.value)}
                        className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors text-white"
                        placeholder="e.g. Subscribe"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Under Text</label>
                    <input
                        type="text"
                        value={underText}
                        onChange={(e) => setUnderText(e.target.value)}
                        className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors text-white"
                        placeholder="e.g. twitch.tv/user"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-400 uppercase">Accent Color</label>
                    <div className="flex gap-2">
                        {['#8b5cf6', '#ec4899', '#06b6d4', '#eab308', '#ef4444'].map(color => (
                            <button
                                key={color}
                                onClick={() => setAccentColor(color)}
                                className={`w-8 h-8 rounded-full border-2 ${accentColor === color ? 'border-white' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
