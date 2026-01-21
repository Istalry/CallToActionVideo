import React, { type InputHTMLAttributes } from 'react';

interface SwitchProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ label, className = '', ...props }) => {
    return (
        <label className={`flex items-center justify-between cursor-pointer group ${className}`}>
            {label && <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>}
            <div className="relative inline-flex items-center">
                <input type="checkbox" className="sr-only peer" {...props} />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary hover:bg-gray-600"></div>
            </div>
        </label>
    );
};
