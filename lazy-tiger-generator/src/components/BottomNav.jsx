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
            icon: SimplePolaroidIcon,
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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
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
                                    className="flex flex-col items-center justify-center p-2 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600 hover:scale-105 transition-all -mt-4 mb-1"
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
                                        ? 'text-orange-600 bg-orange-50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }
                `}
                            >
                                <Icon
                                    size={24}
                                    className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}
                                    strokeWidth={active ? 2.5 : 2}
                                />
                                <span className={`text-[10px] font-bold ${active ? 'text-orange-600' : 'text-gray-600'}`}>
                                    {tab.label}
                                </span>

                                {/* Active indicator dot */}
                                {active && (
                                    <div className="absolute -top-1 w-1 h-1 bg-orange-500 rounded-full" />
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
