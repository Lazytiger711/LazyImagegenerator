import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lock } from 'lucide-react';
import PixelArtIcon from './PixelArtIcon';

const DraggableAsset = ({ item, type, disabled, onClick, isSelected }) => {
    const { t } = useTranslation();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: item.uid || item.id,
        data: { item, type, source: 'deck' },
        disabled: disabled,
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    // Check if icon is an image path (string) or a React component
    const isImageIcon = typeof item.icon === 'string';
    // Force full bleed for style, lighting and compositions that are images
    const isFullBleed = item.displayStyle === 'full'
        || type === 'style'
        || type === 'lighting'
        || (type === 'composition' && isImageIcon)
        || (isImageIcon && !item.icon.includes('/icons/facing/'));

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            onClick={() => !disabled && onClick && onClick()}
            {/* Fixed dimensions for consistency */}
            className={`snap-center flex-shrink-0 w-40 h-56 flex flex-col items-center justify-center p-0 rounded-xl border shadow-sm transition-all select-none relative
                ${disabled
                    ? 'bg-white opacity-40 grayscale cursor-not-allowed border-gray-100'
                    : isSelected
                        ? 'bg-orange-100 border-orange-500 ring-4 ring-orange-200/50 shadow-lg scale-[1.02] z-10'
                        : 'bg-white border-gray-200 hover:shadow-md cursor-grab active:cursor-grabbing hover:border-orange-300 group active:scale-95 cursor-pointer'
                }
                `}
        >
            {/* Inner Content Wrapper - Handles overflow and rounding */}
            <div className={`w-full h-full flex flex-col items-center justify-center p-4 rounded-xl overflow-hidden relative ${isFullBleed ? 'p-0' : ''}`}>
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

                {/* Background decoration for 'Card' feel - Only for non-full-bleed */}
                {!isFullBleed && <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 -z-0"></div>}

                {/* Lock Icon Overlay */}
                {disabled && <div className="absolute top-2 right-2 z-20"><Lock size={14} className="text-gray-400" /></div>}
            </div>

            {/* Hover Tooltip (Description) - Outside of overflow-hidden wrapper */}
            {item.description && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-gray-900/90 text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-center backdrop-blur-sm">
                    {t(item.description)}
                    {/* Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/90"></div>
                </div>
            )}
        </div>
    );
};

export default DraggableAsset;
