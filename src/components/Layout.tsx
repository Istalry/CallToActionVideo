import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="h-screen overflow-hidden bg-background text-gray-100 flex flex-col">
            <header className="h-16 border-b border-gray-800 flex items-center px-6 bg-surface/50 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                    </div>
                    <h1 className="font-bold text-xl tracking-tight">CTA Generator</h1>
                </div>
                <div className="ml-auto flex items-center gap-4">
                    <a href="https://github.com/Istalry/CallToActionVideo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-white transition-colors">
                        GitHub
                    </a>
                </div>
            </header>
            <main className="flex-1 flex overflow-hidden">
                {children}
            </main>
        </div>
    );
};
