import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useCanvasRender } from '../../hooks/useCanvasRender';
import { useOfflineExport } from '../../hooks/useOfflineExport';
import { Loader2, Video } from 'lucide-react';

export const CanvasPreview: React.FC = () => {
    const { format, setFormat } = useStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Initialize render loop AND get access to loaded assets
    const { assets } = useCanvasRender(canvasRef) as any; // Temporary cast to fix build until hook types are perfected

    // Export logic
    const { isExporting, progress, startOfflineExport } = useOfflineExport();

    return (
        <div className="flex-1 bg-[#101010] relative flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-surface/30">
                <div className="flex items-center gap-2">
                    <div className="flex bg-surface rounded-md p-1 border border-gray-700">
                        <button
                            onClick={() => setFormat('landscape')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${format === 'landscape' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            Landscape
                        </button>
                        <button
                            onClick={() => setFormat('portrait')}
                            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${format === 'portrait' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        >
                            Portrait
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => !isExporting && startOfflineExport(assets)}
                    disabled={isExporting}
                    className={`
                bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] flex items-center gap-2
                ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                >
                    {isExporting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{Math.round(progress)}%</span>
                        </>
                    ) : (
                        <>
                            <Video className="w-4 h-4" />
                            <span>Export Video</span>
                        </>
                    )}
                </button>
            </div>

            {/* Progress Bar Overlay */}
            {isExporting && (
                <div className="absolute top-0 left-0 w-full h-1 z-50 bg-gray-800">
                    <div
                        className="h-full bg-primary transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(139,92,246,0.8)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Canvas Area */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-8 overflow-hidden bg-checkerboard cursor-zoom-in">
                <div
                    className="relative shadow-2xl border border-gray-800 bg-transparent flex items-center justify-center"
                    style={{
                        aspectRatio: format === 'landscape' ? '16 / 9' : '9 / 16',
                        maxHeight: '100%',
                        maxWidth: '100%'
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain block"
                    />
                </div>
            </div>
        </div>
    );
};
