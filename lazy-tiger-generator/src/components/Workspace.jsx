import React from 'react';
import DraggableCard from './DraggableCard';
import { Plus, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Workspace({ items, onRemove }) {
    const { t } = useTranslation();

    return (
        <div className="flex-1 h-full flex flex-col transition-colors p-6 bg-gray-50">
            {/* Workspace Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">{t('workspace.title')}</h2>
                    <p className="text-sm text-gray-500">{t('workspace.desc')}</p>
                </div>
                <div className="text-xs font-mono bg-gray-200 px-3 py-1 rounded-full text-gray-600">
                    {items.length} {t('workspace.items_selected')}
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
                        <h3 className="text-lg font-bold mb-1">{t('workspace.empty_title')}</h3>
                        <p className="text-sm">{t('workspace.empty_desc')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
