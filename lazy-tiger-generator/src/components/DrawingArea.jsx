import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, RefreshCw, Wand2, Plus, Eraser } from 'lucide-react';
import CompositionGuides from './CompositionGuides';
import { SortableColorButton } from './SortableColorButton';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { STAMPS, INITIAL_PALETTE, EXTRA_COLORS } from '../data/constants';

const DrawingArea = React.memo(function DrawingArea({
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
    handlePointerLeave,
    // Mobile palette props
    paletteColors,
    setSelectedColor,
    handlePaletteDragEnd,
    handleAddObject,
}) {
    const { t } = useTranslation();

    // Separate eraser from palette for mobile too
    const eraserItem = paletteColors ? paletteColors.find(p => p.id === 'erase') : null;
    const paletteWithoutEraser = paletteColors ? paletteColors.filter(p => p.id !== 'erase') : [];

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
                    touchAction: 'none',
                }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerLeave={handlePointerLeave}
                onPointerUp={(e) => {
                    e.target.releasePointerCapture(e.pointerId);
                }}
            >
                {/* 1. Background Grid */}
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

                {/* 2. Drawing Canvas */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 z-10 w-full h-full cursor-none"
                    style={{ touchAction: 'none' }}
                />

                {/* Visual Cursor Overlay */}
                <div
                    ref={cursorRef}
                    className="pointer-events-none absolute flex items-center justify-center transition-opacity duration-75 z-50"
                    style={{
                        left: 0,
                        top: 0,
                        width: '0px',
                        height: '0px',
                        opacity: 0,
                        display: 'none',
                        backgroundColor: toolMode === 'stamp' ? 'transparent' : (selectedColor.id === 'erase' ? 'rgba(0,0,0,0.1)' : selectedColor.color),
                        border: toolMode === 'stamp' ? 'none' : '1px solid rgba(255,255,255,0.8)',
                        borderRadius: '50%',
                        boxShadow: toolMode === 'stamp' ? 'none' : '0 0 2px rgba(0,0,0,0.5)'
                    }}
                >
                    {toolMode === 'stamp' && selectedStamp && (() => {
                        const stamp = STAMPS.find(s => s.id === selectedStamp);
                        return stamp ? (
                            <div className="w-full h-full flex items-center justify-center opacity-50" style={{ color: selectedColor.id === 'erase' ? '#000000' : selectedColor.color }}>
                                <svg viewBox="0 0 256 256" width="100%" height="100%" style={{ overflow: 'visible' }}>
                                    <path d={stamp.path} fill="currentColor" />
                                </svg>
                            </div>
                        ) : null;
                    })()}
                </div>

                {/* 3. Composition Guides */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <CompositionGuides type={selections.composition.id} />
                </div>
            </div>

            {/* ── Mobile Palette (between canvas and AI Vision text) ── */}
            {paletteColors && (
                <div className="flex md:hidden w-full mt-3 items-center gap-2">
                    <DndContext
                        onDragEnd={handlePaletteDragEnd}
                        sensors={useSensors(
                            useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
                        )}
                    >
                        <SortableContext
                            items={paletteWithoutEraser.map(p => p.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex -space-x-2 bg-gray-50 py-2 pl-4 pr-3 rounded-xl border border-gray-100 isolation-auto flex-1" style={{ touchAction: 'none' }}>
                                {paletteWithoutEraser.map((p) => (
                                    <SortableColorButton
                                        key={p.id}
                                        colorItem={p}
                                        isSelected={selectedColor.id === p.id}
                                        onClick={() => setSelectedColor(p)}
                                    />
                                ))}
                                {/* Add Object Button inside palette */}
                                {paletteColors.length - INITIAL_PALETTE.length < EXTRA_COLORS.length && (
                                    <button
                                        onClick={handleAddObject}
                                        className="w-9 h-10 rounded-lg shadow-sm border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors bg-white z-10 relative shrink-0"
                                        title={t('tools.add_object')}
                                    >
                                        <Plus size={16} />
                                    </button>
                                )}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Eraser — separated, square */}
                    {eraserItem && (
                        <button
                            onClick={() => setSelectedColor(eraserItem)}
                            className={`w-9 h-10 rounded-lg border-2 flex items-center justify-center transition-all shrink-0
                                ${selectedColor.id === 'erase'
                                    ? 'bg-gray-200 border-gray-500 text-gray-700 shadow-md scale-105'
                                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:border-gray-400'
                                }`}
                            title={t('tools.eraser', 'Eraser')}
                        >
                            <Eraser size={16} />
                        </button>
                    )}
                </div>
            )}

            {/* AI Vision Text Display */}
            <div className="w-full mt-4 mb-2 bg-black text-orange-400 p-4 rounded-xl font-mono text-sm leading-relaxed shadow-inner overflow-hidden border border-gray-800 relative group-vision text-shadow-sm">
                <div className="absolute top-2 right-2 opacity-50"><Zap size={14} className="text-orange-500" /></div>
                <p className="whitespace-pre-wrap">{aiVisionText || t('placeholders.ai_vision')}</p>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent bg-[length:100%_200%] animate-scan pointer-events-none"></div>
            </div>

            {/* Canvas Actions */}
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
});

export default DrawingArea;
