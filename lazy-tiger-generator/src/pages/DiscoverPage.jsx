import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Globe, TrendingUp, Clock, Loader2, User, BookOpen, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PromptDetailModal from '../components/PromptDetailModal';
import CreatePostModal from '../components/CreatePostModal';
import BottomNav from '../components/BottomNav';

const ITEMS_PER_PAGE = 12;

const SAMPLE_PROMPTS = [
    {
        id: 'sample-2',
        created_at: new Date().toISOString(),
        view_count: 85,
        username: 'LazyTiger',
        image_url: '/radioactive-princess.jpg',
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

export default function DiscoverPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([]);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'recent'
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const lastPromptElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const fetchPublicPrompts = useCallback(async (pageNum = 0, isNewSort = false) => {
        try {
            if (pageNum === 0) setLoading(true);
            else setLoadingMore(true);

            let query = supabase
                .from('prompts')
                .select('*')
                .eq('is_public', true);

            if (sortBy === 'popular') {
                query = query.order('view_count', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const from = pageNum * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;

            const { data, error } = await query.range(from, to);

            if (error) throw error;

            if (data && data.length > 0) {
                setPrompts(prev => (pageNum === 0 || isNewSort ? data : [...prev, ...data]));
                setHasMore(data.length === ITEMS_PER_PAGE);
            } else {
                if (pageNum === 0) setPrompts(SAMPLE_PROMPTS);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching prompts:', error);
            if (pageNum === 0) setPrompts(SAMPLE_PROMPTS);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [sortBy]);

    // Reset page when sorting changes
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchPublicPrompts(0, true);
    }, [sortBy]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch more when page increments
    useEffect(() => {
        if (page > 0) {
            fetchPublicPrompts(page);
        }
    }, [page, fetchPublicPrompts]);


    return (
        <div className="min-h-screen bg-gray-100 page-transition relative">
            {/* Background Image with Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-50"
                style={{
                    backgroundImage: 'url(/community-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'grayscale(30%)'
                }}
            />
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 pb-24 pt-20 custom-scrollbar">

                {/* Header Section with Guide Link */}
                <div className="flex justify-between items-center mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50">
                    <div className="flex space-x-2 bg-gray-200/50 p-1 rounded-xl">
                        <button
                            onClick={() => setSortBy('popular')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${sortBy === 'popular'
                                ? 'bg-white text-orange-600 shadow-sm scale-105'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <TrendingUp size={16} className="mr-1.5" />
                            {t('discover.sort_popular')}
                        </button>
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center ${sortBy === 'recent'
                                ? 'bg-white text-orange-600 shadow-sm scale-105'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Clock size={16} className="mr-1.5" />
                            {t('discover.sort_recent')}
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/guide')}
                        className="px-4 py-2 bg-white text-orange-500 font-bold rounded-xl shadow-sm hover:bg-orange-50 border border-orange-100 transition-all flex items-center text-sm"
                    >
                        <BookOpen size={18} className="mr-1.5" />
                        Guide
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {prompts.map((prompt, index) => {
                        const Card = (
                            <div
                                onClick={() => setSelectedPrompt(prompt)}
                                className="cursor-pointer group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
                            >
                                <img
                                    src={prompt.image_url || '/placeholder-image.jpg'}
                                    alt={prompt.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    <p className="text-white font-bold truncate text-lg">{prompt.title || prompt.settings?.subject || t('discover.no_title')}</p>
                                    <div className="flex justify-between items-center text-gray-300 text-xs mt-1">
                                        <span className="flex items-center"><User size={12} className="mr-1" /> {prompt.username || 'Anonymous'}</span>
                                        <span className="flex items-center"><Eye size={12} className="mr-1" /> {prompt.view_count || 0}</span>
                                    </div>
                                </div>
                            </div>
                        );

                        if (prompts.length === index + 1) {
                            return <div ref={lastPromptElementRef} key={prompt.id}>{Card}</div>;
                        } else {
                            return <div key={prompt.id}>{Card}</div>;
                        }
                    })}
                </div>

                {/* Loading More Indicator */}
                {loadingMore && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
                    </div>
                )}

                {/* End of results message */}
                {!hasMore && prompts.length > 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No more posts to load
                    </div>
                )}

                {/* Empty State */}
                {!loading && prompts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Globe size={48} className="mb-4 opacity-50" />
                        <p>No prompts found yet.</p>
                    </div>
                )}

                {/* Initial Loading State */}
                {loading && page === 0 && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
                    </div>
                )}
            </div>

            {/* Bottom Nav */}
            <BottomNav />

            {/* Modals */}
            {selectedPrompt && (
                <PromptDetailModal
                    prompt={selectedPrompt}
                    onClose={() => setSelectedPrompt(null)}
                />
            )}
            {showCreatePost && (
                <CreatePostModal
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={() => {
                        setPage(0);
                        fetchPublicPrompts(0, true);
                    }}
                />
            )}
        </div>
    );
}
