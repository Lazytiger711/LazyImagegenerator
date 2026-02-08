import React from 'react';
import PixelArtIcon from './PixelArtIcon';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DraggableCard({ item, id, onRemove, onClick }) {
    const { t } = useTranslation();

    return (
        <div
            onClick={onClick}
            className={`
        relative flex flex-col items-center justify-center pt-7 px-2 pb-2 
        bg-white rounded-2xl border-2 shadow-sm 
        w-32 h-32 m-2 hover:shadow-md transition-all
        group animate-pop-in border-gray-100 hover:border-orange-200 cursor-pointer
      `}
        >
            <div className="w-12 h-12 mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                <PixelArtIcon type={item.type} name={item.id} className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-gray-700 text-center line-clamp-2 leading-tight px-1">
                {t(item.label)}
            </span>
            {item.variantId && item.variantId !== 'standard' && (
                <span className="text-[10px] text-orange-500 font-medium mt-1 bg-orange-50 px-1.5 py-0.5 rounded-full">
                    {t(item.variants?.find(v => v.id === item.variantId)?.label || 'Variant')}
                </span>
            )}

            {/* Remove Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(id);
                }}
                className="absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all z-20 opacity-0 group-hover:opacity-100"
                title="Remove Item"
            >
                <X size={14} strokeWidth={3} />
            </button>

            {/* Category Badge */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-100 rounded-full">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
            </div>
        </div>
    );
}
