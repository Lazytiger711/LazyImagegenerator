import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import DraggableCard from './DraggableCard';
import { Plus, Info } from 'lucide-react';

export default function Workspace({ items, onRemove }) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'workspace-droppable',
    });

    return (
        <div
            className={`flex-1 h-full flex flex-col transition-colors p-6 ${isOver ? 'bg-orange-50/50' : 'bg-gray-50'}`}
        >
            {/* Workspace Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Workspace</h2>
                    <p className="text-sm text-gray-500">Construct your prompt by dragging cards here.</p>
                </div>
                <div className="text-xs font-mono bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                    {items.length} Items Selected
                </div>
            </div>

            {/* Drop Zone Area */}
            <div
                ref={setNodeRef}
                className={`
            flex-1 rounded-3xl border-2 border-dashed transition-all p-8
            flex content-start flex-wrap overflow-y-auto
            ${isOver ? 'border-orange-400 bg-orange-50/30' : 'border-gray-300 hover:border-gray-400'}
            ${items.length === 0 ? 'items-center justify-center' : ''}
        `}
            >
                <SortableContext items={items.map(i => i.uid)} strategy={rectSortingStrategy}>
                    {items.map((item) => (
                        <DraggableCard
                            key={item.uid}
                            id={item.uid}
                            item={item}
                            onRemove={onRemove}
                        />
                    ))}
                </SortableContext>

                {items.length === 0 && (
                    <div className="text-center text-gray-400 pointer-events-none select-none">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Plus size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">It's empty here!</h3>
                        <p className="text-sm">Drag items from the Asset Deck to start building.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
