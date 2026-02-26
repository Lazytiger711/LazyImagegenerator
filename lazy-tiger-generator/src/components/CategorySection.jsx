import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import DraggableAsset from './DraggableAsset';

const CategorySection = ({ title, icon: CategoryIcon, items, type, isOpen, onToggle, description, disabledIds, onAssetClick, locked, currentSelections }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 172; // Card width (160) + Gap (12)

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
        <div className="border-b-4 border-black last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 bg-white hover:bg-yellow-200 transition-colors group"
            >
                <div className="flex flex-col items-start overflow-hidden">
                    <div className="flex items-center text-black font-black text-xs uppercase tracking-wider">
                        <CategoryIcon size={14} className="mr-2 text-black" />
                        {t(title)}
                        {locked && <Lock size={12} className="ml-2 text-red-500" />}
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
                        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-black flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all disabled:opacity-0 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none"
                        title="Scroll Left"
                    >
                        <ChevronLeft size={20} />
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
                        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-12 bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] text-black flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none"
                        title="Scroll Right"
                    >
                        <ChevronRight size={20} />
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

export default CategorySection;
