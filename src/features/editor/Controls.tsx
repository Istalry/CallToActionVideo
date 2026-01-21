import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Image as ImageIcon, Palette, Settings, Sparkles } from 'lucide-react';
import { Section } from '../../components/ui/Section';
import { Input } from '../../components/ui/Input';
import { Slider } from '../../components/ui/Slider';
import { ColorPicker } from '../../components/ui/ColorPicker';
import { Switch } from '../../components/ui/Switch';

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
        particles, setParticles,
        subscribedText, setSubscribedText
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

            <div className="">
                {/* 1. Content & Image */}
                <Section title="Content" icon={<ImageIcon className="w-4 h-4" />}>
                    <div className="space-y-4">
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
                                <Input
                                    label="Scale"
                                    type="number" step="0.1"
                                    value={imageTransform.scale}
                                    onChange={(e) => setImageTransform({ scale: parseFloat(e.target.value) })}
                                />
                                <Input
                                    label="Pos X"
                                    type="number"
                                    value={imageTransform.x}
                                    onChange={(e) => setImageTransform({ x: parseFloat(e.target.value) })}
                                />
                                <Input
                                    label="Pos Y"
                                    type="number"
                                    value={imageTransform.y}
                                    onChange={(e) => setImageTransform({ y: parseFloat(e.target.value) })}
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <Input
                                value={primaryText}
                                onChange={(e) => setPrimaryText(e.target.value)}
                                placeholder="Header Text"
                            />
                            <Input
                                value={underText}
                                onChange={(e) => setUnderText(e.target.value)}
                                placeholder="Sub-text"
                            />
                        </div>

                        <div className="pt-2 border-t border-gray-800">
                            <Input
                                label="Subscribed Text"
                                value={subscribedText}
                                onChange={(e) => setSubscribedText(e.target.value)}
                                placeholder="Subscribed Text"
                            />
                        </div>
                    </div>
                </Section>

                {/* 2. Appearance */}
                <Section title="Appearance" icon={<Palette className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Initial State</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ColorPicker
                                    label="Bg"
                                    value={ctaColors.background}
                                    onChange={(e) => setCtaColors({ background: e.target.value })}
                                />
                                <ColorPicker
                                    label="Text"
                                    value={ctaColors.text}
                                    onChange={(e) => setCtaColors({ text: e.target.value })}
                                />
                                <ColorPicker
                                    label="Sub"
                                    value={ctaColors.underText}
                                    onChange={(e) => setCtaColors({ underText: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-800">
                            <h4 className="text-[10px] uppercase text-gray-500 font-bold mb-2">Subscribed State</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <ColorPicker
                                    label="Bg"
                                    value={subscribedColors.background}
                                    onChange={(e) => setSubscribedColors({ background: e.target.value })}
                                />
                                <ColorPicker
                                    label="Text"
                                    value={subscribedColors.text}
                                    onChange={(e) => setSubscribedColors({ text: e.target.value })}
                                />
                                <ColorPicker
                                    label="Sub"
                                    value={subscribedColors.underText}
                                    onChange={(e) => setSubscribedColors({ underText: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <Slider
                                label="Roundness"
                                valueDisplay={`${roundness}px`}
                                min="0" max="100"
                                value={roundness}
                                onChange={(e) => setRoundness(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </Section>

                {/* 3. Animation */}
                <Section title="Animation" icon={<Settings className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <div className="flex-1 space-y-1">
                                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Type</label>
                                <select
                                    value={animation.type}
                                    onChange={(e) => setAnimation({ type: e.target.value as 'smooth' | 'elastic' | 'bounce' })}
                                    className="w-full bg-background border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary h-[34px]"
                                >
                                    <option value="smooth">Smooth</option>
                                    <option value="elastic">Elastic</option>
                                    <option value="bounce">Bounce</option>
                                </select>
                            </div>
                            <div className="w-20">
                                <Input
                                    type="number" step="0.1" min="0.5" max="3.0"
                                    value={animation.duration}
                                    onChange={(e) => setAnimation({ duration: parseFloat(e.target.value) })}
                                    label="Multi"
                                    className="py-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Switch
                                label="Animate Position"
                                checked={animation.position}
                                onChange={(e) => setAnimation({ position: e.target.checked })}
                            />
                            <Switch
                                label="Animate Scale"
                                checked={animation.scale}
                                onChange={(e) => setAnimation({ scale: e.target.checked })}
                            />
                            <Switch
                                label="Animate Opacity"
                                checked={animation.opacity}
                                onChange={(e) => setAnimation({ opacity: e.target.checked })}
                            />
                        </div>

                        <div className="pt-2 border-t border-gray-800">
                            <Switch
                                label="Show Cursor"
                                checked={cursor.visible}
                                onChange={(e) => setCursor({ visible: e.target.checked })}
                            />
                            {cursor.visible && (
                                <div className="flex items-center gap-2 mt-2">
                                    <label className="text-[10px] text-gray-400">Motion</label>
                                    <select
                                        value={cursor.animationType}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCursor({ animationType: e.target.value as 'smooth' | 'elastic' | 'bounce' })}
                                        className="bg-background border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="smooth">Smooth</option>
                                        <option value="elastic">Elastic</option>
                                        <option value="bounce">Bounce</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </Section>

                {/* 4. Particles */}
                <Section title="Particles" icon={<Sparkles className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <Switch
                            label="Enabled"
                            checked={particles.enabled}
                            onChange={(e) => setParticles({ enabled: e.target.checked })}
                        />

                        {particles.enabled && (
                            <>
                                <Slider
                                    label="Count"
                                    valueDisplay={particles.count}
                                    min="0" max="400"
                                    value={particles.count}
                                    onChange={(e) => setParticles({ count: parseInt(e.target.value) })}
                                />
                                <Slider
                                    label="Speed"
                                    valueDisplay={particles.speed}
                                    min="1" max="20"
                                    value={particles.speed}
                                    onChange={(e) => setParticles({ speed: parseInt(e.target.value) })}
                                />
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block">Colors</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {particles.colors.map((color, i) => (
                                            <div key={i} className="relative group">
                                                <ColorPicker
                                                    value={color}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        const newColors = [...particles.colors];
                                                        newColors[i] = e.target.value;
                                                        setParticles({ colors: newColors });
                                                    }}
                                                    className="!w-8 !h-8 rounded-full !p-0 !border-2 border-white/10 overflow-hidden"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </Section>
            </div>
        </div>
    );
};
