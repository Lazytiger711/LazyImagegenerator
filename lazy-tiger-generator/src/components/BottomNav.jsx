import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, BookOpen } from 'lucide-react';

export default function BottomNav() {
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
            id: 'create',
            label: t('discover.nav_create'),
            icon: Sparkles,
            path: '/create',
        },
        {
            id: 'guide',
            label: t('discover.nav_guide'),
            icon: BookOpen,
            path: '/guide',
        },
    ];

    const isActive = (path) => {
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

                        return (
                            <button
                                key={tab.id}
                                onClick={() => navigate(tab.path)}
                                className={`
                  flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all min-w-[70px]
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
                                <span className={`text-xs font-bold ${active ? 'text-orange-600' : 'text-gray-600'}`}>
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
