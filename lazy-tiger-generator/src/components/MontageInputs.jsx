import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const MontageInputs = React.memo(function MontageInputs({
    subjectText,
    setSubjectText,
    recordBlur,
    applyChaos
}) {
    const { t } = useTranslation();
    const subjectRef = useRef(null);
    const highlightRef = useRef(null);

    const adjustHeight = () => {
        if (subjectRef.current && highlightRef.current) {
            subjectRef.current.style.height = 'auto';
            const newHeight = `${Math.max(46, subjectRef.current.scrollHeight)}px`;
            subjectRef.current.style.height = newHeight;
            highlightRef.current.style.height = newHeight;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [subjectText]);

    // Sync scrolling between textarea and highlight div
    const handleScroll = () => {
        if (subjectRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = subjectRef.current.scrollTop;
            highlightRef.current.scrollLeft = subjectRef.current.scrollLeft;
        }
    };

    const renderHighlights = (text) => {
        // Splitting by @word while keeping the match
        const parts = text.split(/(@[^\s]+)/g);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span key={index} className="bg-orange-100 text-orange-600 font-bold rounded px-1 -mx-1">{part}</span>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="p-6 pb-4 shrink-0 border-b border-gray-200 bg-white z-20 shadow-sm">
            <div className="mb-3 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center mr-2 shadow-md">
                    <span className="font-black text-xs">S</span>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 leading-none">{t('sections.scene')}</h3>
                    <p className="text-[10px] text-gray-400 font-medium">{t('sections.scene_desc')}</p>
                </div>
            </div>

            <div className="flex flex-col space-y-3">
                <div className="flex-1 w-full relative">
                    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1 cursor-pointer" onClick={() => subjectRef.current?.focus()}>
                        PROMPT (장면 설명)
                    </label>

                    <div className="relative w-full">
                        {/* Highlight Layer */}
                        <div
                            ref={highlightRef}
                            className="absolute top-0 left-0 w-full h-full bg-gray-50 border border-transparent rounded-xl px-4 py-3 text-sm font-medium whitespace-pre-wrap break-words overflow-hidden pointer-events-none text-transparent"
                            style={{ minHeight: '46px', fontFamily: 'inherit', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                            aria-hidden="true"
                        >
                            {renderHighlights(subjectText)}
                        </div>

                        {/* Interactive Textarea */}
                        <textarea
                            ref={subjectRef}
                            rows={1}
                            value={subjectText}
                            onChange={(e) => setSubjectText(e.target.value)}
                            onScroll={handleScroll}
                            onBlur={recordBlur}
                            placeholder={t('placeholders.unified_prompt') || "어떤 장면을 만들고 싶으신가요? (예: 눈 덮인 산을 오르는 호랑이)"}
                            className="w-full relative z-10 bg-transparent text-gray-900 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium resize-none overflow-hidden outline-none caret-orange-500"
                            style={{ minHeight: '46px', margin: 0 }}
                            spellCheck={false}
                        />
                    </div>

                    <p className="text-[10px] mt-1.5 ml-1 font-medium text-gray-400">
                        <span className="text-orange-500 font-bold mr-1">💡 TIP:</span>
                        {t('sections.tagging_hint') || "핵심 피사체 앞에 @를 붙이면 캔버스 영역에 더 정확히 배치됩니다. (예: 숲 속의 @고양이)"}
                    </p>
                </div>

                {/* Chaos Button (New Location) */}
                <button
                    onClick={applyChaos}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center group"
                >
                    <Zap size={18} className="mr-2 fill-white group-hover:rotate-12 transition-transform" />
                    <span>{t('common.chaos_mode')}</span>
                    <span className="text-xs font-normal opacity-80 ml-2">({t('common.chaos_desc')})</span>
                </button>
            </div>
        </div>
    );
});

export default MontageInputs;
