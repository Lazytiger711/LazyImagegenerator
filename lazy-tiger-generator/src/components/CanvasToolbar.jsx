import React from 'react';
import { useTranslation } from 'react-i18next';
import { Brush, Stamp, Trash2, Grid, Plus } from 'lucide-react';
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableColorButton } from './SortableColorButton';
import { STAMPS, INITIAL_PALETTE, EXTRA_COLORS } from '../data/constants';

const CanvasToolbar = React.memo(function CanvasToolbar({
    toolMode,
    setToolMode,
    brushSize,
    setBrushSize,
    clearCanvas,
    showGrid,
    setShowGrid,
    paletteColors,
    selectedColor,
    setSelectedColor,
    handlePaletteDragEnd,
    handleAddObject,
    selectedStamp,
    setSelectedStamp
}) {
    const { t } = useTranslation();

    return (
        <div className="w-full max-w-5xl mb-4 bg-white p-3 rounded-2xl shadow-sm border border-orange-100 flex flex-col">
            <div className="w-full flex items-center justify-between">
                {/* Left: Tools */}
                <div className="flex items-center space-x-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setToolMode('brush')}
                            className={`p-2 rounded-md transition-all ${toolMode === 'brush' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title={t('tools.brush')}
                        >
                            <Brush size={16} />
                        </button>
                        <button
                            onClick={() => setToolMode('stamp')}
                            className={`p-2 rounded-md transition-all ${toolMode === 'stamp' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                            title={t('tools.stamp')}
                        >
                            <Stamp size={16} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 mx-2"></div>

                    {/* Size Slider */}
                    <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 space-x-3">
                        <span className="text-xs font-bold text-gray-400">SIZE</span>
                        <input
                            type="range"
                            min="5"
                            max="200" // Increased to 200
                            value={brushSize}
                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                            className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        />
                        <span className="text-xs font-bold text-gray-400 w-6 text-center">{brushSize}</span>
                    </div>

                    <button
                        onClick={clearCanvas}
                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('tools.clear')}
                    >
                        <Trash2 size={20} />
                    </button>

                    {/* Canvas Guide Toggle */}
                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                    <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`p-2 rounded-lg transition-all ${showGrid ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                        title={t('tools.guide_lines')}
                    >
                        <Grid size={20} />
                    </button>
                </div>

                {/* Right Side: Colors */}
                <div className="flex items-center space-x-2">
                    {/* Drag-and-Drop Sortable Palette */}
                    <DndContext
                        onDragEnd={handlePaletteDragEnd}
                        sensors={useSensors(
                            useSensor(PointerSensor, {
                                activationConstraint: {
                                    distance: 5, // Require 5px movement to activate drag
                                },
                            })
                        )}
                    >
                        <SortableContext
                            items={paletteColors.map((p) => p.id)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex space-x-1.5 bg-gray-50 p-2 px-3 rounded-xl border border-gray-100 overflow-visible isolation-auto">
                                {paletteColors.map((p) => (
                                    <SortableColorButton
                                        key={p.id}
                                        colorItem={p}
                                        isSelected={selectedColor.id === p.id}
                                        onClick={() => setSelectedColor(p)}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Add Object Button */}
                    {paletteColors.length - INITIAL_PALETTE.length < EXTRA_COLORS.length && (
                        <button
                            onClick={handleAddObject}
                            className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors bg-white"
                            title={t('tools.add_object')}
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Stamp Selector (Visible only in Stamp Mode, Moved to bottom row) */}
            {toolMode === 'stamp' && (
                <div className="w-full mt-2 pt-2 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                    <span className="text-[10px] font-bold text-gray-400 shrink-0">{t('tools.stamps_label')}</span>
                    {STAMPS.map(stamp => (
                        <button
                            key={stamp.id}
                            onClick={() => setSelectedStamp(stamp.id)}
                            className={`p-1.5 rounded-lg shrink-0 transition-all ${selectedStamp === stamp.id ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                            title={stamp.label}
                        >
                            <stamp.icon size={18} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

export default CanvasToolbar;
