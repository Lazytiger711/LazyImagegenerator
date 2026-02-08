import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Globe, TrendingUp, Clock, ArrowRight, Loader2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PromptDetailModal from '../components/PromptDetailModal';
import BottomNav from '../components/BottomNav';

export default function DiscoverPage() {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'recent'
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Sample prompts to show when DB is empty
    const SAMPLE_PROMPTS = [
        {
            id: 'sample-2',
            created_at: new Date().toISOString(),
            view_count: 85,
            username: 'LazyTiger',
            image_url: null, // Placeholder or upload image to public/
            settings: {
                subject: 'Radioactive Princess',
                context: 'Summoning a demon in a futuristic laboratory',
                shot: { label: 'Full Shot' },
                angle: { label: 'Low Angle' },
                style: { label: 'Concept Art' },
                composition: { label: 'Golden Ratio' },
                lighting: { label: 'Dramatic' },
                resolution: { label: '9:16' }
            },
            prompt_text: 'Digital concept art, speed painting, fantasy atmosphere, matte painting, highly detailed, sharp focus. Low angle, full body shot. Radioactive Princess summoning a demon in a futuristic laboratory, body facing away from camera, back visible, head turned left looking over left shoulder, three-quarter rear view, left side of face partially visible, glancing back towards left, back shoulder stance, rear angle with left head turn, dynamic pose, action shot. Golden ratio composition, fibonacci spiral, aesthetically pleasing balance, artistic layout, perfect proportions. Dramatic lighting, chiaroscuro, high contrast, heavy shadows, cinematic lighting, moody atmosphere. --ar 9:16 --no photo, low quality, sketch'
        },
        {
            id: 'sample-1',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            view_count: 142,
            username: 'LazyTiger',
            image_url: '/sample-cat-butterfly.jpg',
            settings: {
                subject: 'A curious kitten',
                context: 'watching a yellow butterfly in a Van Gogh style garden',
                shot: { label: 'Medium Shot' },
                angle: { label: 'Eye Level' },
                style: { label: 'Van Gogh' },
                composition: { label: 'Rule of Thirds' }
            },
            prompt_text: 'A curious gray tabby kitten with large expressive eyes, sitting in a vibrant garden, gazing up at a yellow butterfly. Vincent van Gogh impressionist style, swirling brushstrokes, warm golden sunlight, medium shot, eye level angle, rule of thirds composition, oil painting texture, dreamy atmosphere, soft focus background.'
        }
    ];

    useEffect(() => {
        fetchPublicPrompts();
    }, [sortBy]);

    const fetchPublicPrompts = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from('prompts')
                .select('*')
                .eq('is_public', true);

            if (sortBy === 'popular') {
                query = query.order('view_count', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query.limit(12);

            if (error) throw error;

            // If no data, use sample prompts
            setPrompts(data && data.length > 0 ? data : SAMPLE_PROMPTS);
        } catch (error) {
            console.error('Error fetching prompts:', error);
            // On error, show sample prompts
            setPrompts(SAMPLE_PROMPTS);
        } finally {
            setLoading(false);
        }
    };

    const handlePromptClick = (promptId) => {
        // Don't navigate for sample prompts, just go to create page
        if (promptId.startsWith('sample-')) {
            navigate('/create');
        } else {
            navigate(`/create?prompt=${promptId}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 page-transition relative">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-50"
                style={{
                    backgroundImage: 'url(/community-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            />
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90" />

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-md overflow-hidden">
                                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold">
                                Lazy <span className="text-orange-500">Image Generator</span>
                            </span>
                        </div>
                        <button
                            onClick={() => navigate('/create')}
                            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform flex items-center"
                        >
                            {t('discover.start')}
                            <ArrowRight size={18} className="ml-2" />
                        </button>
                    </div>
                </header>

                {/* Sort Options - Minimal */}
                <section className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-center items-center space-x-4">
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${sortBy === 'popular'
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <TrendingUp size={16} className="mr-1.5" />
                                {t('discover.sort_popular')}
                            </button>
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${sortBy === 'recent'
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Clock size={16} className="mr-1.5" />
                                {t('discover.sort_recent')}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Prompts Grid */}
                <section className="max-w-7xl mx-auto px-4 pb-20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Loader2 size={48} className="animate-spin mb-4 text-orange-500" />
                            <p className="text-lg">{t('discover.loading')}</p>
                        </div>
                    ) : prompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                            <Globe size={64} className="mb-4 opacity-20" />
                            <p className="text-xl font-medium mb-2">{t('discover.no_prompts_title')}</p>
                            <p className="text-sm mb-6">{t('discover.no_prompts_desc')}</p>
                            <button
                                onClick={() => navigate('/create')}
                                className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
                            >
                                {t('discover.create_prompt')}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {prompts.map((prompt) => (
                                <div
                                    key={prompt.id}
                                    onClick={() => setSelectedPrompt(prompt)}
                                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden border border-gray-100"
                                >
                                    {/* Image - Larger, more prominent */}
                                    {prompt.image_url ? (
                                        <div className="relative overflow-hidden bg-gray-100 aspect-square">
                                            <img
                                                src={prompt.image_url}
                                                alt={prompt.settings?.subject || 'Generated image'}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}

                                    {/* Simple Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2 text-sm">
                                            {prompt.settings?.subject || t('discover.no_title')}
                                        </h3>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <User size={12} className="mr-1" />
                                            {prompt.username || prompt.user_id || t('discover.anonymous')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Prompt Detail Modal */}
                {selectedPrompt && (
                    <PromptDetailModal
                        prompt={selectedPrompt}
                        onClose={() => setSelectedPrompt(null)}
                    />
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
