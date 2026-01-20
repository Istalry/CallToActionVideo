import React, { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { useCanvasRender } from '../../hooks/useCanvasRender';
import { useVideoExport } from '../../hooks/useVideoExport';
import { Loader2, Download } from 'lucide-react';

export const CanvasPreview: React.FC = () => {
    const { format, setFormat } = useStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    // Initialize render loop
    useCanvasRender(canvasRef);

    // Export logic
    const { isRecording, startRecording } = useVideoExport(canvasRef);

    return (
        <div className="flex-1 bg-[#101010] relative flex flex-col">
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
                    onClick={() => !isRecording && startRecording(5000)}
                    disabled={isRecording}
                    className={`
                bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded text-sm font-medium transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] flex items-center gap-2
                ${isRecording ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                >
                    {isRecording ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Recording...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            <span>Export WebM</span>
                        </>
                    )}
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-checkerboard">
                <div className="relative shadow-2xl border border-gray-800 bg-transparent flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={format === 'landscape' ? 1920 : 1080}
                        height={format === 'landscape' ? 1080 : 1920}
                        className="max-w-full max-h-full object-contain"
                        style={{
                            // maintain aspect ratio in preview
                            aspectRatio: format === 'landscape' ? '16/9' : '9/16',
                            height: format === 'landscape' ? 'auto' : '90%',
                            width: format === 'landscape' ? '90%' : 'auto'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
