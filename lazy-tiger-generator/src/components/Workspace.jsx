import React from 'react';
import DraggableCard from './DraggableCard';
import { Plus, Info } from 'lucide-react';

export default function Workspace({ items, onRemove }) {
    // Simplified Workspace: Just a display container

    return (
        <div className="flex-1 h-full flex flex-col transition-colors p-6 bg-gray-50">
            {/* Workspace Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">스튜디오 (Studio)</h2>
                    <p className="text-sm text-gray-500">선택한 옵션들이 이곳에 표시됩니다.</p>
                </div>
                <div className="text-xs font-mono bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                    {items.length} Items Selected
                </div>
            </div>

            {/* Display Area */}
            <div className={`
                    flex-1 rounded-3xl border-2 border-dashed border-gray-200 transition-all p-8
                    flex content-start flex-wrap overflow-y-auto bg-white/50
                    ${items.length === 0 ? 'items-center justify-center' : ''}
                `}
            >
                {items.map((item) => (
                    <DraggableCard
                        key={item.uid || item.id}
                        id={item.uid || item.id}
                        item={item}
                        onRemove={onRemove}
                    />
                ))}

                {items.length === 0 && (
                    <div className="text-center text-gray-400 pointer-events-none select-none">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <Plus size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">선택된 옵션 없음</h3>
                        <p className="text-sm">왼쪽 소품 상자에서 원하는 스타일을 클릭하세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
