import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, RefreshCw, Wand2 } from 'lucide-react';
import CompositionGuides from './CompositionGuides';
import { STAMPS } from '../data/constants';

export default function DrawingArea({
    gridRef,
    canvasRef,
    cursorRef,
    selections,
    toolMode,
    selectedColor,
    selectedStamp,
    showGrid,
    aiVisionText,
    isGenerating,
    generatePrompt,
    handleCanvasPointerDown,
    handleCanvasPointerMove,
    handlePointerLeave
}) {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 flex flex-col items-center relative group-preview overflow-x-auto w-full">

            {/* Grid Container */}
            <div
                ref={gridRef}
                className={`
                    relative rounded-xl overflow-hidden p-0 select-none
                    ${toolMode === 'brush' ? 'cursor-crosshair' : 'cursor-pointer'}
                    ${['16:9', '1:1'].includes(selections.resolution.id) ? 'w-[90%]' : 'w-[75%]'} h-auto md:w-[var(--desktop-width)] md:h-[var(--desktop-height)]
                `}
                style={{
                    '--desktop-width': selections.resolution.id === '16:9' ? '800px' :
                        selections.resolution.id === '1:1' ? '560px' :
                            selections.resolution.id === '9:16' ? '360px' : 'auto',
                    '--desktop-height': selections.resolution.id === '16:9' ? '450px' :
                        selections.resolution.id === '1:1' ? '560px' :
                            selections.resolution.id === '9:16' ? '640px' : '480px',
                    aspectRatio: `${selections.resolution.width} / ${selections.resolution.height}`,
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderWidth: '1px',
                    boxShadow: '0 0 0 4px #f3f4f6',
                    color: '#000000',
                    touchAction: 'none', // Crucial: Prevents scrolling while drawing
                }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerUp={(e) => {
                    // Ensure capture is released
                    e.target.releasePointerCapture(e.pointerId);
                }}
            >
                {/* 1. Background Grid (Reference for Position) */}
                {showGrid && (
                    <div
                        className="absolute inset-0 z-0 pointer-events-none opacity-50"
                        style={{
                            backgroundImage: `
                        linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                        linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                            backgroundSize: '20px 20px'
                        }}
                    />
                )}

                {/* 2. Drawing Canvas (Interactive Layer) - z-10 puts it above z-0 background */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 w-full h-full cursor-none"
                    style={{ touchAction: 'none' }}
                />

                {/* Visual Cursor Overlay - Optimized with Ref */}
                <div
                    ref={cursorRef}
                    className="pointer-events-none absolute flex items-center justify-center transition-opacity duration-75 z-50"
                    style={{
                        left: 0,
                        top: 0,
                        // Initial styles (will be updated by JS)
                        width: '0px',
                        height: '0px',
                        opacity: 0,
                        display: 'none',
                        // Only add background/border for BRUSH mode. Stamp uses SVG.
                        backgroundColor: toolMode === 'stamp' ? 'transparent' : (selectedColor.id === 'erase' ? 'rgba(0,0,0,0.1)' : selectedColor.color),
                        border: toolMode === 'stamp' ? 'none' : '1px solid rgba(255,255,255,0.8)',
                        borderRadius: '50%',
                        boxShadow: toolMode === 'stamp' ? 'none' : '0 0 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {/* Show Stamp Preview in Cursor */}
                    {toolMode === 'stamp' && selectedStamp && (() => {
                        const stamp = STAMPS.find(s => s.id === selectedStamp);
                        return stamp ? (
                            <div className="w-full h-full flex items-center justify-center opacity-50" style={{ color: selectedColor.id === 'erase' ? '#000000' : selectedColor.color }}>
                                {/* Render SVG directly or use Icon component if valid */}
                                <svg viewBox="0 0 256 256" width="100%" height="100%" style={{ overflow: 'visible' }}>
                                    <path d={stamp.path} fill="currentColor" />
                                </svg>
                            </div>
                        ) : null;
                    })()}
                </div>

                {/* 3. Composition Guides (Overlay) - z-20 puts it on top, pointer-events-none lets clicks pass to canvas */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <CompositionGuides type={selections.composition.id} />
                </div>
            </div>

            {/* AI Vision Text Display (Moved Here) */}
            <div className="w-full mt-4 mb-2 bg-black text-orange-400 p-4 rounded-xl font-mono text-sm leading-relaxed shadow-inner overflow-hidden border border-gray-800 relative group-vision text-shadow-sm">
                <div className="absolute top-2 right-2 opacity-50"><Zap size={14} className="text-orange-500" /></div>
                <p className="whitespace-pre-wrap">{aiVisionText || t('placeholders.ai_vision')}</p>
                {/* Scanning Effect Overlay - Orange Tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent bg-[length:100%_200%] animate-scan pointer-events-none"></div>
            </div>

            {/* Canvas Actions below */}
            <div className="mt-1 flex space-x-2">
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        generatePrompt(e);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                    disabled={isGenerating}
                    className={`
                  px-6 py-2 rounded-full font-black text-white shadow-lg 
                  flex items-center space-x-2 z-40 transition-all text-sm whitespace-nowrap
                  ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 hover:shadow-orange-200'}
                `}
                >
                    {isGenerating ? (
                        <RefreshCw className="animate-spin w-4 h-4 mr-1" />
                    ) : (
                        <Wand2 className="w-4 h-4 mr-1" />
                    )}
                    {isGenerating ? t('status.generating') : t('status.generate_prompt')}
                </button>
            </div>
        </div>
    );
}
