import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, Box, Zap } from 'lucide-react';

const MontageInputs = React.memo(function MontageInputs({
    subjectType,
    setSubjectType,
    subjectText,
    setSubjectText,
    recordBlur,
    contextText,
    setContextText,
    applyChaos
}) {
    const { t } = useTranslation();

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
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 ml-1">
                        <label className="block text-xs font-bold text-gray-500">
                            {subjectType === 'character' ? t('sections.main_character') : t('sections.main_subject')}
                        </label>

                        {/* Subject Type Toggle */}
                        <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                            <button
                                onClick={() => setSubjectType('character')}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center transition-all ${subjectType === 'character' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Character Mode"
                            >
                                <User size={12} className="mr-1" /> {t('common.character')}
                            </button>
                            <button
                                onClick={() => setSubjectType('object')}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center transition-all ${subjectType === 'object' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                title="Object Mode"
                            >
                                <Box size={12} className="mr-1" /> {t('common.object')}
                            </button>
                        </div>
                    </div>

                    <p className={`text-[10px] mb-2 ml-1 font-medium ${subjectType === 'character' ? 'text-orange-500' : 'text-blue-500'}`}>
                        {subjectType === 'character'
                            ? t('sections.character_hint')
                            : t('sections.object_hint')}
                    </p>
                    <input
                        type="text"
                        value={subjectText}
                        onChange={(e) => setSubjectText(e.target.value)}
                        onBlur={recordBlur}
                        placeholder={subjectType === 'character' ? t('placeholders.character') : t('placeholders.object')}
                        className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all font-medium ${subjectType === 'character' ? 'focus:ring-orange-200 focus:border-orange-400' : 'focus:ring-blue-200 focus:border-blue-400'}`}
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">{t('sections.context')}</label>
                    <input
                        type="text"
                        value={contextText}
                        onChange={(e) => setContextText(e.target.value)}
                        onBlur={recordBlur}
                        placeholder={t('placeholders.context')}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium"
                    />
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
