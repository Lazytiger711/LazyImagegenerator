import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image as ImageIcon, MessageSquare, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Header({
    setShowGallery,
    setShowFeedback,
    toggleLanguage,
    i18n
}) {
    const { t } = useTranslation();

    return (
        <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-20 shadow-sm">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 flex justify-between items-center w-full">
                {/* Left side: Logo and Title */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-sm sm:text-lg font-bold tracking-tight whitespace-nowrap">
                        Lazy <span className="text-orange-500 hidden sm:inline">Image</span>
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                        <img src="/logo.png" alt="Tiger Logo" className="w-full h-full object-cover" />
                    </div>
                    {/* Supabase Connection Status Indicator (Simple) */}
                    <div className={`w-2 h-2 rounded-full ${supabase ? 'bg-green-500' : 'bg-red-500'} shrink-0`} title="Supabase Connected"></div>
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center justify-end flex-wrap gap-1 sm:gap-2 ml-auto">
                    <button
                        onClick={() => setShowGallery(true)}
                        className="px-2 sm:px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-bold transition-colors flex items-center shrink-0"
                    >
                        <ImageIcon size={16} className="sm:mr-1.5" />
                        <span className="hidden sm:inline">{t('common.my_gallery')}</span>
                    </button>

                    <button
                        onClick={() => setShowFeedback(true)}
                        className="p-1.5 sm:px-3 sm:py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm shrink-0"
                        title={t('common.feedback')}
                    >
                        <MessageSquare size={16} />
                        <span className="hidden md:inline ml-1.5">{t('common.feedback')}</span>
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="p-1.5 sm:px-3 sm:py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm uppercase shrink-0"
                    >
                        {i18n.language === 'en' ? 'EN' : 'KO'}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                        title={t('common.reset')}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
