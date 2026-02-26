import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Image, Plus } from 'lucide-react';
import SimplePolaroidIcon from './SimplePolaroidIcon';

export default function BottomNav({ onNewPost }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const tabs = [
        {
            id: 'discover',
            label: t('discover.nav_discover'),
            icon: Compass,
            path: '/',
        },
        {
            id: 'post',
            label: 'Post',
            icon: Plus,
            action: onNewPost, // Custom action
            highlight: true // Special styling
        },
        {
            id: 'create',
            label: t('discover.nav_create'),
            icon: Sparkles,
            path: '/create',
        }
    ];

    const isActive = (path) => {
        if (!path) return false;
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black z-50 safe-area-bottom">
            <div className="max-w-screen-xl mx-auto px-2 py-1">
                <div className="flex justify-around items-center">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab.path);

                        if (tab.highlight) {
                            return (
                                <button
                                    key={tab.id}
                                    onClick={tab.action}
                                    className="flex flex-col items-center justify-center p-3 rounded-full bg-[#c0f2a6] border-2 border-black text-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-[#a5e687] hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 active:translate-y-0 active:translate-x-0 active:shadow-none transition-all -mt-4 mb-2"
                                >
                                    <Icon size={28} strokeWidth={2.5} />
                                </button>
                            );
                        }

                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={`
                  flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all min-w-[60px]
                  ${active
                                        ? 'bg-[#FF90E8] text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] -translate-y-1'
                                        : 'text-black hover:bg-yellow-200 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:-translate-y-1'
                                    }
                `}
                            >
                                <Icon
                                    size={24}
                                    className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                <span className="text-[10px] font-black text-black uppercase mt-1">
                                    {tab.label}
                                </span>

                                {/* Active indicator dot */}
                                {active && (
                                    <div className="absolute -top-1 w-2 h-2 border-2 border-black bg-white rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <style>{`
        /* Safe area for iOS devices */
        .safe-area-bottom {
            padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
        </nav>
    );
}
