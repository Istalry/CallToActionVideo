import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Image as ImageIcon, Palette, Settings, Sparkles, Download } from 'lucide-react';
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
        subscribedText, setSubscribedText,
        resolution, setResolution,
        superSampling, setSuperSampling
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
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Shape</label>
                                        <select
                                            value={particles.shape}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setParticles({ shape: e.target.value as any })}
                                            className="w-full bg-background border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary h-[34px]"
                                        >
                                            <option value="square">Square</option>
                                            <option value="circle">Circle</option>
                                            <option value="image">Image</option>
                                        </select>
                                    </div>
                                    {particles.shape === 'image' && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Image</label>
                                            <div
                                                onClick={() => {
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) {
                                                            const url = URL.createObjectURL(file);
                                                            setParticles({ image: url });
                                                        }
                                                    };
                                                    input.click();
                                                }}
                                                className="w-full h-[34px] border border-gray-700 rounded flex items-center justify-center cursor-pointer hover:bg-white/5"
                                            >
                                                <span className="text-xs text-gray-400">Upload</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

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
                                <div className="grid grid-cols-2 gap-4">
                                    <Slider
                                        label="Min Size"
                                        valueDisplay={particles.minSize}
                                        min="1" max="50"
                                        value={particles.minSize}
                                        onChange={(e) => setParticles({ minSize: parseInt(e.target.value) })}
                                    />
                                    <Slider
                                        label="Max Size"
                                        valueDisplay={particles.maxSize}
                                        min="1" max="50"
                                        value={particles.maxSize}
                                        onChange={(e) => setParticles({ maxSize: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Slider
                                        label="Gravity"
                                        valueDisplay={particles.gravity}
                                        min="-2" max="2" step="0.1"
                                        value={particles.gravity}
                                        onChange={(e) => setParticles({ gravity: parseFloat(e.target.value) })}
                                    />
                                    <Slider
                                        label="Rotation"
                                        valueDisplay={particles.rotationSpeed}
                                        min="0" max="20"
                                        value={particles.rotationSpeed}
                                        onChange={(e) => setParticles({ rotationSpeed: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Slider
                                        label="Life Min"
                                        valueDisplay={particles.lifeMin}
                                        min="0.1" max="2.0" step="0.1"
                                        value={particles.lifeMin}
                                        onChange={(e) => setParticles({ lifeMin: parseFloat(e.target.value) })}
                                    />
                                    <Slider
                                        label="Life Max"
                                        valueDisplay={particles.lifeMax}
                                        min="0.1" max="3.0" step="0.1"
                                        value={particles.lifeMax}
                                        onChange={(e) => setParticles({ lifeMax: parseFloat(e.target.value) })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Fade Mode</label>
                                    <select
                                        value={particles.fadeMode}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setParticles({ fadeMode: e.target.value as 'opacity' | 'scale' | 'both' | 'none' })}
                                        className="w-full bg-background border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary h-[34px]"
                                    >
                                        <option value="opacity">Opacity</option>
                                        <option value="scale">Scale</option>
                                        <option value="both">Both</option>
                                        <option value="none">None</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Slider
                                        label="Noise Strength"
                                        valueDisplay={particles.noiseStrength}
                                        min="0" max="20"
                                        value={particles.noiseStrength}
                                        onChange={(e) => setParticles({ noiseStrength: parseInt(e.target.value) })}
                                    />
                                    <Slider
                                        label="Noise Scale"
                                        valueDisplay={particles.noiseScale}
                                        min="10" max="500"
                                        value={particles.noiseScale}
                                        onChange={(e) => setParticles({ noiseScale: parseInt(e.target.value) })}
                                    />
                                </div>

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

                {/* 5. Output Settings */}
                <Section title="Output Settings" icon={<Download className="w-4 h-4" />}>
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Resolution</label>
                            <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value as any)}
                                className="w-full bg-background border border-gray-700 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:border-primary h-[34px]"
                            >
                                <option value="480p">480p (SD)</option>
                                <option value="720p">720p (HD)</option>
                                <option value="1080p">1080p (Full HD)</option>
                                <option value="2k">2K (QHD)</option>
                                <option value="4k">4K (UHD)</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-300">Antialiasing (2x Supersampling)</label>
                            <div
                                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${superSampling === 2 ? 'bg-primary' : 'bg-gray-700'}`}
                                onClick={() => setSuperSampling(superSampling === 2 ? 1 : 2)}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${superSampling === 2 ? 'translate-x-4' : ''}`} />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500">
                            Exports at higher resolution and scales down for smoother edges.
                            {superSampling === 2 && ' (Output will be ' + (resolution === '4k' ? '8K' : 'Double Resolution') + ' internal)'}
                        </p>
                    </div>
                </Section>
            </div>
        </div>
    );
};
