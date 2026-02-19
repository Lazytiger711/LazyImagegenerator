import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check } from 'lucide-react';

export function SortableColorButton({ colorItem, isSelected, onClick }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: colorItem.id,
        // Add activation constraint to prevent conflict with onClick
        // User must drag at least 5px to activate sorting
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: colorItem.color || '#eee',
    };

    // Handle click separately from drag
    const handleClick = (e) => {
        // Only trigger onClick if not dragging
        if (!isDragging) {
            onClick(e);
        }
    };

    return (
        <button
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={`
        w-9 h-10 rounded-lg shadow-sm border-2 border-white flex items-center justify-center transition-all relative cursor-grab active:cursor-grabbing
        ${isSelected ? 'ring-2 ring-orange-500 z-30 scale-110 shadow-lg -translate-y-1' : 'hover:scale-105 hover:-translate-y-1 hover:z-40 hover:shadow-md'}
      `}
            title={colorItem.label}
        >
            {colorItem.icon && <colorItem.icon size={14} className="text-gray-500" />}
            {isSelected && !colorItem.icon && <Check size={14} className="text-white drop-shadow-md" />}
        </button>
    );
}
