import React, { type InputHTMLAttributes } from 'react';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    valueDisplay?: string | number;
}

export const Slider: React.FC<SliderProps> = ({ label, valueDisplay, className = '', ...props }) => {
    const min = props.min ? Number(props.min) : 0;
    const max = props.max ? Number(props.max) : 100;
    const val = props.value ? Number(props.value) : 0;
    const percentage = ((val - min) / (max - min)) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                {label && <label className="text-xs text-gray-400">{label}</label>}
                {valueDisplay !== undefined && <span className="text-[10px] text-gray-500 font-mono">{valueDisplay}</span>}
            </div>
            <input
                type="range"
                className={`w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50 ${className}`}
                style={{
                    background: `linear-gradient(to right, #8b5cf6 ${percentage}%, #374151 ${percentage}%)`
                }}
                {...props}
            />
            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 14px;
                    width: 14px;
                    border-radius: 50%;
                    background: #ffffff;
                    cursor: pointer;
                    margin-top: 0px; 
                }
            `}</style>
        </div>
    );
};
