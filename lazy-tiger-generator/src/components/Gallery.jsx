import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { X, Trash2, Wand2, Loader2, Calendar, Globe, Clock, TrendingUp } from 'lucide-react';

export default function Gallery({ onClose, onLoad }) {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [galleryMode, setGalleryMode] = useState('my'); // 'my' | 'explore'
    const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'popular'

    // Fetch prompts from Supabase
    useEffect(() => {
        fetchPrompts();
    }, [fetchPrompts]);

    const fetchPrompts = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase.from('prompts').select('*');

            // Filter by mode
            if (galleryMode === 'explore') {
                query = query.eq('is_public', true);
            }

            // Sort
            if (sortBy === 'popular') {
                query = query.order('view_count', { ascending: false });
            } else {
                query = query.order('created_at', { ascending: false });
            }

            const { data, error } = await query;

            if (error) throw error;
            setPrompts(data || []);
        } catch (error) {
            console.error('Error fetching prompts:', error);
        } finally {
            setLoading(false);
        }
    }, [galleryMode, sortBy]);

    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Prevent triggering onLoad
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const { error } = await supabase
                .from('prompts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            // Remove from local state
            setPrompts(prompts.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting prompt:', error);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <span className="bg-orange-100 p-2 rounded-lg mr-3 text-orange-600">
                                {galleryMode === 'my' ? <Calendar size={24} /> : <Globe size={24} />}
                            </span>
                            {galleryMode === 'my' ? '내 갤러리' : '탐색하기'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1 ml-12">
                            {galleryMode === 'my' ? '저장된 프롬프트 목록입니다.' : '다른 사람들의 공개 프롬프트를 탐색하세요.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tab Toggle + Sort */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    {/* Mode Toggle */}
                    <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                        <button
                            onClick={() => setGalleryMode('my')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${galleryMode === 'my'
                                ? 'bg-orange-500 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Calendar size={16} className="mr-1.5" />
                            내 갤러리
                        </button>
                        <button
                            onClick={() => setGalleryMode('explore')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center ${galleryMode === 'explore'
                                ? 'bg-blue-500 text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Globe size={16} className="mr-1.5" />
                            탐색하기
                        </button>
                    </div>

                    {/* Sort Options (Explore Only) */}
                    {galleryMode === 'explore' && (
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200 text-sm">
                            <button
                                onClick={() => setSortBy('recent')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center ${sortBy === 'recent'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Clock size={14} className="mr-1" />
                                최신순
                            </button>
                            <button
                                onClick={() => setSortBy('popular')}
                                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center ${sortBy === 'popular'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <TrendingUp size={14} className="mr-1" />
                                인기순
                            </button>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Loader2 size={32} className="animate-spin mb-3 text-orange-500" />
                            <p>불러오는 중...</p>
                        </div>
                    ) : prompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                            <p className="text-lg font-medium mb-2">
                                {galleryMode === 'my' ? '저장된 프롬프트가 없습니다.' : '공개된 프롬프트가 없습니다.'}
                            </p>
                            <p className="text-sm">
                                {galleryMode === 'my' ? '멋진 프롬프트를 만들고 저장해보세요!' : '첫 번째로 공유해보세요!'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {prompts.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onLoad(item.settings)}
                                    className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group relative"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                            {galleryMode === 'explore' && item.view_count > 0 && (
                                                <span className="text-xs text-gray-400 flex items-center">
                                                    👁️ {item.view_count}
                                                </span>
                                            )}
                                        </div>
                                        {galleryMode === 'my' && (
                                            <button
                                                onClick={(e) => handleDelete(item.id, e)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-1">
                                        {item.settings.subject || "제목 없음"}
                                    </h3>

                                    <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 font-mono mb-4 line-clamp-3 border border-gray-100 leading-relaxed">
                                        {item.prompt_text}
                                    </div>

                                    <div className="flex items-center text-orange-600 text-sm font-bold group-hover:underline">
                                        <Wand2 size={14} className="mr-1.5" />
                                        불러오기
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
