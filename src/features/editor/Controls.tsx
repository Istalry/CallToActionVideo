import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Image as ImageIcon, Palette, MousePointer2, Sparkles } from 'lucide-react';

export const Controls: React.FC = () => {
    const {
        primaryText, setPrimaryText,
        underText, setUnderText,
        imageUrl, setImageUrl,
        imageTransform, setImageTransform,
        ctaColors, setCtaColors,
        subscribedColors, setSubscribedColors,
        roundness, setRoundness,
        animation, setAnimation,
        cursor, setCursor,
        particles, setParticles
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
        <div className="w-80 bg-surface border-r border-gray-800 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="p-4 border-b border-gray-800">
                <h2 className="font-semibold text-lg text-white">Configuration</h2>
                <p className="text-sm text-gray-400">Customize your CTA</p>
            </div>

            <div className="p-4 space-y-8">
                {/* 1. Content & Image */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm border-b border-gray-800 pb-2">
                        <ImageIcon className="w-4 h-4" />
                        <h3>Content</h3>
                    </div>

                    <div className="space-y-3">
                        {/* Image Upload */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="h-24 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors hover:bg-white/5 relative overflow-hidden group"
                        >
                            {imageUrl ? (
                                <img src={imageUrl} className="w-full h-full object-contain opacity-50 group-hover:opacity-30 transition-opacity" alt="Preview" />
                            ) : (
                                <span className="text-sm text-gray-500">Upload Logo</span>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </div>

                        {/* Image Adjustments */}
                        {imageUrl && (
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500">Scale</label>
                                    <input
                                        type="number" step="0.1"
                                        value={imageTransform.scale}
                                        onChange={(e) => setImageTransform({ scale: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-gray-700 rounded px-1 py-1 text-xs text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500">Pos X</label>
                                    <input
                                        type="number"
                                        value={imageTransform.x}
                                        onChange={(e) => setImageTransform({ x: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-gray-700 rounded px-1 py-1 text-xs text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-gray-500">Pos Y</label>
                                    <input
                                        type="number"
                                        value={imageTransform.y}
                                        onChange={(e) => setImageTransform({ y: parseFloat(e.target.value) })}
                                        className="w-full bg-background border border-gray-700 rounded px-1 py-1 text-xs text-white"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2 pt-2">
                            <input
                                type="text"
                                value={primaryText}
                                onChange={(e) => setPrimaryText(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none text-white"
                                placeholder="Header Text"
                            />
                            <input
                                type="text"
                                value={underText}
                                onChange={(e) => setUnderText(e.target.value)}
                                className="w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm focus:border-primary focus:outline-none text-white"
                                placeholder="Sub-text"
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Colors */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm border-b border-gray-800 pb-2">
                        <Palette className="w-4 h-4" />
                        <h3>Appearance</h3>
                    </div>

                    {/* Initial State */}
                    <div className="space-y-2">
                        <h4 className="text-[10px] uppercase text-gray-500 font-bold">Initial State</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Background</label>
                                <input
                                    type="color"
                                    value={ctaColors.background}
                                    onChange={(e) => setCtaColors({ background: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Text</label>
                                <input
                                    type="color"
                                    value={ctaColors.text}
                                    onChange={(e) => setCtaColors({ text: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Sub-text</label>
                                <input
                                    type="color"
                                    value={ctaColors.underText}
                                    onChange={(e) => setCtaColors({ underText: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Subscribed State */}
                    <div className="space-y-2 pt-2 border-t border-gray-800">
                        <h4 className="text-[10px] uppercase text-gray-500 font-bold">Subscribed State</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Background</label>
                                <input
                                    type="color"
                                    value={subscribedColors.background}
                                    onChange={(e) => setSubscribedColors({ background: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Text</label>
                                <input
                                    type="color"
                                    value={subscribedColors.text}
                                    onChange={(e) => setSubscribedColors({ text: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-400 block">Sub-text</label>
                                <input
                                    type="color"
                                    value={subscribedColors.underText}
                                    onChange={(e) => setSubscribedColors({ underText: e.target.value })}
                                    className="w-full h-8 rounded cursor-pointer bg-transparent"
                                />
                            </div>

                        </div>
                    </div>

                    <div className="space-y-1 pt-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400">Roundness</label>
                            <span className="text-[10px] text-gray-500">{roundness}px</span>
                        </div>
                        <input
                            type="range" min="0" max="100"
                            value={roundness}
                            onChange={(e) => setRoundness(parseInt(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>
                </div>

                {/* 3. Animation */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm border-b border-gray-800 pb-2">
                        <Settings className="w-4 h-4" />
                        <h3>Animation</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <select
                                value={animation.type}
                                onChange={(e) => setAnimation({ type: e.target.value as any })}
                                className="flex-1 bg-background border border-gray-700 rounded px-2 py-1 text-sm text-white"
                            >
                                <option value="smooth">Smooth</option>
                                <option value="elastic">Elastic</option>
                                <option value="bounce">Bounce</option>
                            </select>
                            <div className="flex items-center gap-1 bg-background border border-gray-700 rounded px-2">
                                <span className="text-xs text-gray-400">Dur:</span>
                                <input
                                    type="number" step="0.1" min="0.5" max="3.0"
                                    value={animation.duration}
                                    onChange={(e) => setAnimation({ duration: parseFloat(e.target.value) })}
                                    className="w-12 bg-transparent text-sm text-white focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={animation.position}
                                    onChange={(e) => setAnimation({ position: e.target.checked })}
                                    className="rounded border-gray-700 bg-background text-primary"
                                />
                                <span className="text-xs text-gray-300">Pos</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={animation.scale}
                                    onChange={(e) => setAnimation({ scale: e.target.checked })}
                                    className="rounded border-gray-700 bg-background text-primary"
                                />
                                <span className="text-xs text-gray-300">Scale</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={animation.opacity}
                                    onChange={(e) => setAnimation({ opacity: e.target.checked })}
                                    className="rounded border-gray-700 bg-background text-primary"
                                />
                                <span className="text-xs text-gray-300">Fade</span>
                            </label>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                <MousePointer2 className="w-3 h-3" /> Show Cursor
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={cursor.visible}
                                    onChange={(e) => setCursor({ visible: e.target.checked })}
                                />
                                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 4. Particles */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary font-medium text-sm border-b border-gray-800 pb-2">
                        <Sparkles className="w-4 h-4" />
                        <h3>Particles</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Count</span>
                            <input
                                type="range" min="0" max="400"
                                value={particles.count}
                                onChange={(e) => setParticles({ count: parseInt(e.target.value) })}
                                className="w-32 accent-primary"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Speed</span>
                            <input
                                type="range" min="1" max="20"
                                value={particles.speed}
                                onChange={(e) => setParticles({ speed: parseInt(e.target.value) })}
                                className="w-32 accent-primary"
                            />
                        </div>

                        <div className="flex gap-1 flex-wrap">
                            {particles.colors.map((color, i) => (
                                <input
                                    key={i}
                                    type="color"
                                    value={color}
                                    onChange={(e) => {
                                        const newColors = [...particles.colors];
                                        newColors[i] = e.target.value;
                                        setParticles({ colors: newColors });
                                    }}
                                    className="w-6 h-6 rounded-full cursor-pointer bg-transparent p-0 border-none"
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
