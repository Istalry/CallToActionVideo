import React, { type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="space-y-1">
            {label && <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{label}</label>}
            <input
                className={`w-full bg-background border border-gray-700 rounded px-3 py-2 text-sm text-white focus:border-primary focus:outline-none placeholder:text-gray-600 transition-colors ${className}`}
                {...props}
            />
        </div>
    );
};
