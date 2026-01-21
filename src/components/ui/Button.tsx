import React, { type ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white px-4 py-2 shadow-lg shadow-purple-900/20",
        secondary: "border border-gray-700 hover:border-gray-600 bg-surface text-gray-300 hover:text-white px-4 py-2",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5 px-2 py-1",
        icon: "p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-md"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {!isLoading && icon}
            {children}
        </button>
    );
};
