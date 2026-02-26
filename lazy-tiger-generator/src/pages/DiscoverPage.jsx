import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Globe, TrendingUp, Clock, Loader2, User, BookOpen, Eye, Heart } from 'lucide-react';
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
            } else if (sortBy === 'likes') {
                query = query.order('likes_count', { ascending: false });
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
                <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 mb-6 bg-white p-3 sm:p-4 rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-4 border-black">
                    <div className="flex space-x-1 sm:space-x-2 bg-white p-1 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setSortBy('popular')}
                            className={`px-3 py-2 sm:px-4 rounded-xl font-black text-sm uppercase transition-all flex items-center whitespace-nowrap shrink-0 border-2 border-transparent ${sortBy === 'popular'
                                ? 'bg-[#FF90E8] text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] -translate-y-0.5'
                                : 'text-black hover:bg-yellow-200 hover:border-black'
                                }`}
                        >
                            <TrendingUp size={16} className="mr-1.5" />
                            {t('discover.sort_popular')}
                        </button>
                        <button
                            onClick={() => setSortBy('recent')}
                            className={`px-3 py-2 sm:px-4 rounded-xl font-black text-sm uppercase transition-all flex items-center whitespace-nowrap shrink-0 border-2 border-transparent ${sortBy === 'recent'
                                ? 'bg-[#FF90E8] text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] -translate-y-0.5'
                                : 'text-black hover:bg-yellow-200 hover:border-black'
                                }`}
                        >
                            <Clock size={16} className="mr-1.5" />
                            {t('discover.sort_recent')}
                        </button>
                        <button
                            onClick={() => setSortBy('likes')}
                            className={`px-3 py-2 sm:px-4 rounded-xl font-black text-sm uppercase transition-all flex items-center whitespace-nowrap shrink-0 border-2 border-transparent ${sortBy === 'likes'
                                ? 'bg-[#FF90E8] text-black border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] -translate-y-0.5'
                                : 'text-black hover:bg-yellow-200 hover:border-black'
                                }`}
                        >
                            <Heart size={16} className="mr-1.5" />
                            {t('discover.sort_likes') || 'Likes'}
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/guide')}
                        className="px-3 py-2 sm:px-4 bg-white text-black font-black uppercase rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:bg-[#c0f2a6] hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none border-2 border-black transition-all flex items-center text-sm whitespace-nowrap shrink-0"
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
                                className="cursor-pointer group relative aspect-[3/4] rounded-xl overflow-hidden border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[8px_8px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-2 hover:-translate-x-1 bg-white"
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
                                        <div className="flex items-center gap-2">
                                            <span className="flex items-center"><Heart size={12} className="mr-1 text-red-400 fill-red-400" /> {prompt.likes_count || 0}</span>
                                            <span className="flex items-center"><Eye size={12} className="mr-1" /> {prompt.view_count || 0}</span>
                                        </div>
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
            <BottomNav onNewPost={() => setShowCreatePost(true)} />

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
