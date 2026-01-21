import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const Section: React.FC<SectionProps> = ({ title, icon, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-800 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    {icon}
                    <h3>{title}</h3>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
            </button>

            {isOpen && (
                <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
};
