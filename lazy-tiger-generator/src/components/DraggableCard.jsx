import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import PixelArtIcon from './PixelArtIcon';
import { X } from 'lucide-react';

export default function DraggableCard({ item, id, onRemove }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: id,
        data: { item, type: item.type, source: 'workspace' }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
        relative flex flex-col items-center justify-center p-4 
        bg-white rounded-2xl border-2 shadow-sm 
        w-32 h-32 m-2 cursor-move hover:shadow-md transition-all
        group animate-pop-in
        ${isDragging ? 'border-orange-400 z-50' : 'border-gray-100 hover:border-orange-200'}
      `}
        >
            <div className="w-12 h-12 mb-3 rounded-xl bg-orange-50 flex items-center justify-center">
                <PixelArtIcon type={item.type} name={item.id} className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-gray-700 text-center line-clamp-2 leading-tight px-1">
                {item.label}
            </span>

            {/* Remove Button */}
            <button
                onPointerDown={(e) => {
                    e.stopPropagation(); // Prevent drag start
                    onRemove(id);
                }}
                className="absolute -top-2 -right-2 p-1 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20"
            >
                <X size={14} />
            </button>

            {/* Category Badge */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-100 rounded-full">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{item.type}</span>
            </div>
        </div>
    );
}
