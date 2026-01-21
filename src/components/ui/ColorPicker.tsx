import React, { type InputHTMLAttributes } from 'react';

interface ColorPickerProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ label, className = '', value, ...props }) => {
    return (
        <div className="space-y-1">
            {label && <label className="text-[10px] text-gray-400 block">{label}</label>}
            <div className="flex items-center gap-2">
                <div className={`relative w-full h-8 rounded overflow-hidden border border-gray-700 hover:border-gray-500 transition-colors ${className}`}>
                    <input
                        type="color"
                        value={value}
                        className="absolute -top-2 -left-2 w-[200%] h-[200%] cursor-pointer p-0 m-0 border-0"
                        {...props}
                    />
                </div>
                {/* Hex code display could be added here later */}
            </div>
        </div>
    );
};
