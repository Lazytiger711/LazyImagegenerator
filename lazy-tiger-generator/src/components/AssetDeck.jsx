import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities'; // Import CSS for transform utility
import { ChevronDown, ChevronRight, ChevronLeft, ChevronUp, Grid, Layout, Camera, Video, Palette, User, Monitor, Zap, Lock, Smile } from 'lucide-react';
import PixelArtIcon from './PixelArtIcon';
import {
    SHOT_TYPES,
    ANGLES,
    STYLES,
    COMPOSITIONS,
    FACING_DIRECTIONS,
    RESOLUTIONS,
    LIGHTING,
    MEME_TEMPLATES
} from '../data/constants';

// --- Sub-components ---

// Draggable Icon Card (Updated for Dial/Card Look)
const DraggableAsset = ({ item, type, disabled, onClick, isSelected }) => {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.uid || item.id,
        data: { item, type, source: 'deck' },
        disabled: disabled,
        // Disable drag sensor if only click is desired, but keeping enabled for now as "alternative"
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    // Check if icon is an image path (string) or a React component
    const isImageIcon = typeof item.icon === 'string';
    const isFullBleed = item.displayStyle === 'full' || (isImageIcon && !item.icon.includes('/icons/facing/')); // Default to full for new images, except facing icons which act as diagrams

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => !disabled && onClick && onClick()}
            // Increased size to w-60 (240px) to show ~1 card at a time
            className={`flex-shrink-0 w-60 flex flex-col items-center justify-center p-4 rounded-xl border shadow-sm transition-all select-none relative overflow-hidden
                ${disabled
                    ? 'bg-white opacity-40 grayscale cursor-not-allowed border-gray-100'
                    : isSelected
                        ? 'bg-orange-100 border-orange-500 ring-4 ring-orange-200/50 shadow-lg scale-[1.02] z-10'
                        : 'bg-white border-gray-200 hover:shadow-md cursor-grab active:cursor-grabbing hover:border-orange-300 group active:scale-95 cursor-pointer'
                }
                ${isFullBleed ? 'p-0' : ''} 
                `}
        >
            {isFullBleed ? (
                // Full Bleed Image Layout
                <div className="absolute inset-0 z-0">
                    {isImageIcon && (
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${isSelected ? 'opacity-80' : 'opacity-60 group-hover:opacity-70'}`} />
                </div>
            ) : (
                // Centered Icon Layout (Original)
                <div className="w-16 h-16 mb-2 rounded-md flex items-center justify-center transition-colors z-10">
                    {isImageIcon ? (
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <PixelArtIcon
                            type={type}
                            name={item.id}
                            className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                        />
                    )}
                </div>
            )}

            {/* Label & Subtitle */}
            <div className={`relative z-10 text-center ${isFullBleed ? 'mt-auto w-full px-2 pb-2' : 'w-full px-1'}`}>
                <span className={`text-sm font-bold block mb-0.5 leading-tight line-clamp-1 ${isFullBleed ? 'text-white text-shadow-sm' : 'text-gray-700 group-hover:text-orange-600'}`}>
                    {t(item.label)}
                </span>
                {item.sub && (
                    <span className={`text-xs block mt-0.5 ${isFullBleed ? 'text-gray-200' : 'text-gray-400'}`}>
                        {item.sub}
                    </span>
                )}
            </div>

            {/* Background decoration for 'Card' feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 -z-0"></div>

            {/* Lock Icon Overlay */}
            {disabled && <div className="absolute top-2 right-2 z-20"><Lock size={14} className="text-gray-400" /></div>}
        </div>
    );
};

const CategorySection = ({ title, icon: Icon, items, type, isOpen, onToggle, description, disabledIds, onAssetClick, locked, currentSelections }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 252; // Card width (240) + Gap (12)

            if (direction === 'left') {
                // If at the start (or very close), wrap to the end
                if (current.scrollLeft <= 10) {
                    current.scrollTo({ left: current.scrollWidth, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                // If at the end (or very close), wrap to the start
                // Tolerance of 10px to account for fractional pixels
                if (current.scrollLeft + current.clientWidth >= current.scrollWidth - 10) {
                    current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }
    };

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
            >
                <div className="flex flex-col items-start overflow-hidden">
                    <div className="flex items-center text-gray-700 font-bold text-xs uppercase tracking-wider">
                        <Icon size={14} className="mr-2 text-orange-500" />
                        {t(title)}
                        {locked && <Lock size={12} className="ml-2 text-red-400" />}
                    </div>
                    {/* Brief Description */}
                    <span className="text-[10px] text-gray-400 font-medium ml-6 mt-0.5 truncate max-w-[200px] group-hover:text-gray-500 transition-colors">
                        {t(description)}
                    </span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            </button>

            {isOpen && (
                <div className="relative group/section">
                    {/* Left Scroll Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); scroll('left'); }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-800/80 text-white flex items-center justify-center rounded-r-lg opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0"
                        title="Scroll Left"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Horizontal Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 p-3 pt-0 pb-2 no-scrollbar snap-x mask-linear-fade scroll-smooth"
                    >
                        {/* Padding spacer for start */}
                        <div className="w-1 shrink-0"></div>
                        {items.map((item) => (
                            <DraggableAsset
                                key={item.id}
                                item={item}
                                type={type}
                                disabled={locked || disabledIds?.includes(item.id)}
                                isSelected={currentSelections?.[type]?.id === item.id}
                                onClick={() => onAssetClick && onAssetClick(item, type)}
                            />
                        ))}
                        {/* Padding spacer for end */}
                        <div className="w-1 shrink-0"></div>
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); scroll('right'); }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-800/80 text-white flex items-center justify-center rounded-l-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                        title="Scroll Right"
                    >
                        <ChevronRight size={16} />
                    </button>
                    {/* Sub-Selection (Variants) */}
                    {(() => {
                        const selectedItem = items.find(i => i.id === currentSelections?.[type]?.id);
                        if (selectedItem && selectedItem.variants && selectedItem.variants.length > 0) {
                            const currentVariantId = currentSelections?.[type]?.variantId;

                            return (
                                <div className="mx-4 mb-2 mt-0 flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 justify-center">
                                    {selectedItem.variants.map((variant) => {
                                        const isVarSelected = currentVariantId === variant.id || (!currentVariantId && variant.id === 'standard');
                                        return (
                                            <button
                                                key={variant.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onAssetClick) onAssetClick(selectedItem, type, variant.id);
                                                }}
                                                className={`
                                                px-2.5 py-1 text-[11px] font-medium rounded-full transition-all border
                                                ${isVarSelected
                                                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-white hover:border-gray-200'}
                                            `}
                                            >
                                                {t(variant.label)}
                                            </button>
                                        );
                                    })}
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            )}
        </div>
    );
};

// Update CategorySection to accept currentSelections (it is passed but not explicitly destructured in the previous call, it is passed a `isSelected` logic in the map. Wait, I need to make sure CategorySection receives `currentSelections`? No, I injected the logic directly into the map in the previous tool call.
// BUT, I need to update the AssetDeck component signature to accept `currentSelections`.

export default function AssetDeck({ disabledIds = [], onAssetClick, lockedCategories = [], currentSelections = {}, className = "" }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Default collapsed on mobile

    const [openSections, setOpenSections] = useState({
        shot: true,
        angle: true,
        composition: false,
        style: false,
        facing: false,
        resolution: false,
        lighting: false,
        meme: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => {
            // Close all others, toggle current (Accordion)
            const newState = {
                shot: false, angle: false, composition: false,
                style: false, facing: false, resolution: false, lighting: false, meme: false
            };
            if (!prev[section]) {
                newState[section] = true;
            }
            return newState;
        });
    };

    const handleAssetClickWrapper = (item, type, variantId) => {
        if (onAssetClick) onAssetClick(item, type, variantId);
    };

    // ... (skip down to return) ...

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={`
                    fixed bottom-[60px] left-0 right-0 z-[60] 
                    md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:z-10 md:order-none
                    w-full md:w-80 bg-white md:border-r border-t md:border-t-0 border-gray-200 
                    shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-lg selection-section 
                    md:transform-none flex flex-col
                    md:h-full
                    ${isMobileOpen ? 'h-[60vh]' : 'h-14'}
                    ${className}
                `}
            >
                <style>{`
                    .mask-linear-fade {
                        mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                        -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                    }
                    /* Hide Scrollbar */
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}</style>

                {/* Header (Always Visible) */}
                <div
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-4 border-b border-gray-200 bg-orange-50/50 flex items-center justify-between cursor-pointer md:cursor-default h-14 shrink-0"
                >
                    <div className="flex items-center">
                        <div>
                            <h2 className="font-black text-lg text-gray-800 flex items-center">
                                <Grid size={20} className="mr-2 text-orange-600" />
                                소품 상자
                            </h2>
                            <p className={`text-xs text-gray-500 mt-1 ${!isMobileOpen ? 'hidden md:block' : ''}`}>
                                스튜디오로 아이템을 드래그하세요
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">


                        <div className="md:hidden bg-white p-1 rounded-full shadow-sm">
                            {isMobileOpen ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronUp size={20} className="text-orange-500" />}
                        </div>
                    </div>
                </div>

                {/* Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-white">



                    <CategorySection
                        title="sections.resolution"
                        icon={Monitor}
                        items={RESOLUTIONS}
                        type="resolution"
                        description="sections.resolution_desc"
                        isOpen={openSections.resolution}
                        onToggle={() => toggleSection('resolution')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('resolution')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.style"
                        icon={Palette}
                        items={STYLES}
                        type="style"
                        description="sections.style_desc"
                        isOpen={openSections.style}
                        onToggle={() => toggleSection('style')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('style')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.shot"
                        icon={Camera}
                        items={SHOT_TYPES}
                        type="shot"
                        description="sections.shot_desc"
                        isOpen={openSections.shot}
                        onToggle={() => toggleSection('shot')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('shot')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.angle"
                        icon={Video}
                        items={ANGLES}
                        type="angle"
                        description="sections.angle_desc"
                        isOpen={openSections.angle}
                        onToggle={() => toggleSection('angle')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('angle')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.facing"
                        icon={User}
                        items={FACING_DIRECTIONS}
                        type="facing"
                        description="sections.facing_desc"
                        isOpen={openSections.facing}
                        onToggle={() => toggleSection('facing')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('facing')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.composition"
                        icon={Grid}
                        items={COMPOSITIONS}
                        type="composition"
                        description="sections.composition_desc"
                        isOpen={openSections.composition}
                        onToggle={() => toggleSection('composition')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('composition')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.lighting"
                        icon={Zap}
                        items={LIGHTING}
                        type="lighting"
                        description="sections.lighting_desc"
                        isOpen={openSections.lighting}
                        onToggle={() => toggleSection('lighting')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('lighting')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.meme"
                        icon={Smile}
                        items={MEME_TEMPLATES}
                        type="meme"
                        description="sections.meme_desc"
                        isOpen={openSections.meme}
                        onToggle={() => toggleSection('meme')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('meme')}
                        currentSelections={currentSelections}
                    />

                    {/* Padding at bottom for safe area */}
                    <div className="h-20 md:h-10"></div>
                </div>
            </div>
        </>
    );
}
