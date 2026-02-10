import React, { useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, BoxSelect, Check, Info } from 'lucide-react';
import PixelArtIcon from './PixelArtIcon';
import { useTranslation } from 'react-i18next';

const SelectionSection = ({ title, description, items, selectedId, onSelect, type = 'card', disabledItems = [] }) => {
    const { t } = useTranslation();
    const scrollRef = useRef(null);

    // Scroll selected item into view when it changes
    useEffect(() => {
        if (scrollRef.current) {
            const selectedEl = scrollRef.current.querySelector(`[data-id="${selectedId}"]`);
            if (selectedEl) {
                selectedEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [selectedId]);

    const handlePrev = () => {
        const currentIndex = items.findIndex(i => i.id === selectedId);
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        onSelect(items[prevIndex]);
    };

    const handleNext = () => {
        const currentIndex = items.findIndex(i => i.id === selectedId);
        const nextIndex = (currentIndex + 1) % items.length;
        onSelect(items[nextIndex]);
    };

    return (
        <div className="mb-8 last:mb-0">
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1 text-orange-500" /> {t(title) || title}
                </h3>
                <div className="flex items-center space-x-1 sm:hidden">
                    <button onClick={handlePrev} className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={handleNext} className="p-1 rounded-full bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-600">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="relative group">
                <button
                    onClick={handlePrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-30 w-8 h-8 bg-white/90 border border-gray-200 shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 hidden sm:flex"
                    title={t("common.back")}
                >
                    <ChevronLeft size={20} />
                </button>

                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto pb-8 -mx-1 px-[15%] sm:px-[calc(50%-160px)] scrollbar-hide snap-x snap-mandatory space-x-0"
                >
                    {items.map((item) => {
                        const isSelected = selectedId === item.id;
                        const isDisabled = disabledItems.includes(item.id);
                        const Icon = item.icon || BoxSelect;

                        return (
                            <div
                                key={item.id}
                                className="w-full flex-shrink-0 snap-center px-4"
                            >
                                <button
                                    data-id={item.id}
                                    onClick={() => !isDisabled && onSelect(item)}
                                    disabled={isDisabled}
                                    className={`
                    transition-all duration-300 border-2 rounded-2xl relative overflow-hidden group/item text-left mx-auto
                    w-full max-w-[320px] aspect-[8.56/5.4] block
                    ${isDisabled
                                            ? 'border-gray-100 bg-gray-50 opacity-30 grayscale cursor-not-allowed'
                                            : isSelected
                                                ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 ring-offset-2 z-10 shadow-lg opacity-100'
                                                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-md opacity-60 hover:opacity-90 scale-95 hover:scale-100'}
                  `}
                                >
                                    {type === 'resolution' ? (
                                        <div className="flex flex-col items-center justify-between h-full p-4">
                                            <div className="flex-1 flex items-center justify-center w-full">
                                                <Icon className={`w-12 h-12 ${isSelected ? 'text-orange-500' : 'text-gray-400'}`} />
                                            </div>
                                            <div className="text-center w-full">
                                                <span className={`block font-bold text-lg ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>{t(item.label)}</span>
                                                <span className="text-sm text-gray-400 mt-1 block">{item.sub}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full p-4 relative">
                                            <div className="flex justify-between items-start mb-1 z-10 w-full shrink-0">
                                                <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {typeof item.icon === 'string' ? (
                                                        <img src={item.icon} alt="" className="w-4 h-4 object-contain" />
                                                    ) : (
                                                        <Icon size={16} />
                                                    )}
                                                </div>
                                                {isSelected && <Check size={18} className="text-orange-500" />}
                                            </div>

                                            {/* --- Image Container (Flexible but limited height) --- */}
                                            <div className={`flex-1 flex items-center justify-center w-full min-h-0 my-1 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-60'}`}>
                                                {typeof item.icon === 'string' ? (
                                                    <div className={`
                                relative w-full h-32 mx-auto
                                rounded-xl overflow-hidden border transition-all
                                ${isSelected ? 'bg-orange-100/50 border-orange-200/50 scale-105 shadow-sm' : 'bg-gray-200 border-gray-100'}
                            `}>
                                                        <img
                                                            src={item.icon}
                                                            alt={t(item.label)}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('bg-red-200'); }}
                                                        />
                                                    </div>
                                                ) : title.includes('Shot') || title.includes('Angle') || title.includes('Composition') || title.includes('Facing') ? (
                                                    <div className={`
                                relative aspect-square h-full max-h-[100px] sm:max-h-[120px]
                                rounded-xl p-1 border transition-all 
                                ${isSelected ? 'bg-orange-100/50 border-orange-200/50 scale-105' : 'bg-gray-50 border-gray-100'}
                            `}>
                                                        <PixelArtIcon type={item.id} />
                                                    </div>
                                                ) : (
                                                    <Icon className={`w-12 h-12 transition-colors ${isSelected ? 'text-orange-300' : 'text-gray-200'}`} strokeWidth={1} />
                                                )}
                                            </div>

                                            <div className="mt-auto relative z-10 w-full text-center sm:text-left shrink-0">
                                                <span className={`block font-bold text-sm sm:text-base truncate ${isSelected ? 'text-orange-800' : 'text-gray-700'}`}>{t(item.label)}</span>
                                                <span className={`text-[10px] sm:text-xs truncate block ${isSelected ? 'text-orange-600/80' : 'text-gray-400'}`}>{item.sub}</span>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-30 w-8 h-8 bg-white/90 border border-gray-200 shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-orange-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 sm:opacity-100 hidden sm:flex"
                    title={t("common.next")}
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            {description && (
                <div className="mt-3 px-1 text-center">
                    <p className="text-xs text-gray-400 font-medium bg-gray-50/50 py-2 rounded-lg border border-gray-100 inline-block px-4">
                        <Info size={12} className="inline mr-1.5 -mt-0.5" />
                        {description}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SelectionSection;
