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
        <header className="bg-white border-b-4 border-black py-4 sticky top-0 z-20">
            <div className="max-w-4xl mx-auto px-2 sm:px-4 flex justify-between items-center w-full">
                {/* Left side: Logo and Title */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <span className="text-sm sm:text-lg font-black tracking-tight whitespace-nowrap">
                        Lazy <span className="text-orange-500 hidden sm:inline">Image</span>
                    </span>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-100 flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] overflow-hidden shrink-0">
                        <img src="https://raw.githubusercontent.com/Lazytiger711/LazyImagegenerator/main/public/logo.png" alt="Tiger Logo" className="w-full h-full object-cover" />
                    </div>
                    {/* Supabase Connection Status Indicator (Simple) */}
                    <div className={`w-3 h-3 rounded-full border-2 border-black ${supabase ? 'bg-green-400' : 'bg-red-400'} shrink-0`} title="Supabase Connected"></div>
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center justify-end flex-wrap gap-2 sm:gap-3 ml-auto">
                    <button
                        onClick={() => setShowGallery(true)}
                        className="px-2 sm:px-3 py-1.5 bg-[#FF90E8] text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-none font-bold transition-all flex items-center shrink-0"
                    >
                        <ImageIcon size={16} className="sm:mr-1.5" />
                        <span className="hidden sm:inline">{t('common.my_gallery')}</span>
                    </button>

                    <button
                        onClick={() => setShowFeedback(true)}
                        className="p-1.5 sm:px-3 sm:py-1.5 bg-yellow-300 text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-none font-bold transition-all flex items-center shrink-0"
                        title={t('common.feedback')}
                    >
                        <MessageSquare size={16} />
                        <span className="hidden md:inline ml-1.5">{t('common.feedback')}</span>
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="p-1.5 sm:px-3 sm:py-1.5 bg-white text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-none font-bold transition-all flex items-center text-sm uppercase shrink-0"
                    >
                        {i18n.language === 'en' ? 'EN' : 'KO'}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-1.5 sm:p-2 bg-white text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none rounded-none transition-all shrink-0"
                        title={t('common.reset')}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
