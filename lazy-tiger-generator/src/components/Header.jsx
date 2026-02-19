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
            <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold tracking-tight">Lazy <span className="text-orange-500">Image Generator</span></span>
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-2 shadow-md overflow-hidden">
                        <img src="/logo.png" alt="Tiger Logo" className="w-full h-full object-cover" />
                    </div>
                    {/* Supabase Connection Status Indicator (Simple) */}
                    <div className={`w-2 h-2 rounded-full ${supabase ? 'bg-green-500' : 'bg-red-500'}`} title="Supabase Connected"></div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowGallery(true)}
                        className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-bold transition-colors flex items-center"
                    >
                        <ImageIcon size={16} className="mr-1.5" />
                        <span className="hidden sm:inline">{t('common.my_gallery')}</span>
                    </button>

                    <button
                        onClick={() => setShowFeedback(true)}
                        className="px-3 py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm"
                        title={t('common.feedback')}
                    >
                        <MessageSquare size={16} className="mr-1.5" />
                        <span className="hidden md:inline">{t('common.feedback')}</span>
                    </button>
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm uppercase"
                    >
                        {i18n.language === 'en' ? 'EN' : 'KO'}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title={t('common.reset')}
                    >
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
