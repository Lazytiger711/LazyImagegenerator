import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, Eye, Calendar, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromptDetailModal({ prompt, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!prompt) return null;

    const handleUsePrompt = () => {
        if (prompt?.id?.toString().startsWith('sample-')) {
            navigate('/create');
        } else {
            navigate(`/create?prompt=${prompt.id}`);
        }
    };

    const [isEditing, setIsEditing] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(prompt.title || prompt.settings?.subject || '');
    const [editDescription, setEditDescription] = React.useState(prompt.description || prompt.settings?.context || '');

    // Like logic
    const [likesCount, setLikesCount] = React.useState(prompt.likes_count || 0);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        if (prompt?.id) {
            const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
            setIsLiked(likedPosts.includes(prompt.id));

            // View count logic
            const isDevMode = localStorage.getItem('dev_mode') === 'true';
            if (!isDevMode && !prompt.id.toString().startsWith('sample-')) {
                import('../lib/supabaseClient').then(m => {
                    m.supabase.rpc('increment_view_count', { p_id: prompt.id })
                        .catch(err => console.error("View count increment failed:", err));
                });
            }
        }
    }, [prompt?.id]);

    const handleLike = async () => {
        if (isLiked || !prompt?.id || prompt.id.toString().startsWith('sample-')) return;

        try {
            const { error } = await import('../lib/supabaseClient').then(m => m.supabase.rpc('increment_likes', {
                p_id: prompt.id
            }));

            if (error) throw error;

            // Update local state
            setLikesCount(prev => prev + 1);
            setIsLiked(true);

            // Update localStorage
            const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '[]');
            likedPosts.push(prompt.id);
            localStorage.setItem('liked_posts', JSON.stringify(likedPosts));

        } catch (err) {
            console.error("Like failed:", err);
        }
    };

    const handleSaveEdit = async () => {
        const password = window.prompt("비밀번호를 입력하세요");
        if (!password) return;

        try {
            const { data, error } = await import('../lib/supabaseClient').then(m => m.supabase.rpc('update_prompt_verified', {
                p_id: prompt.id,
                p_password: password,
                p_title: editTitle,
                p_description: editDescription
            }));

            if (error) throw error;

            if (data === true) {
                alert("수정되었습니다.");
                setIsEditing(false);
                window.location.reload();
            } else {
                alert("비밀번호가 일치하지 않습니다.");
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                    <h2 className="text-xl font-bold text-gray-800">{t('modal.title')}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - 2 Column Layout */}
                <div className="flex flex-col md:flex-row h-[80vh]">
                    {/* Left Column: Image + Info (Scrollable) */}
                    <div className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
                        {/* Image Section */}
                        <div className="p-6 pb-0">
                            {prompt.image_url ? (
                                <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                                    <img
                                        src={prompt.image_url}
                                        alt={prompt.settings?.subject || 'Generated image'}
                                        className="w-full h-auto object-contain max-h-[50vh] mx-auto"
                                    />
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square flex items-center justify-center">
                                    <span className="text-gray-400 text-lg">{t('modal.no_image')}</span>
                                </div>
                            )}
                        </div>

                        {/* Info Section (Below Image) */}
                        <div className="p-6 space-y-4">
                            {/* Title & User */}
                            {/* Title & User */}
                            <div>
                                {isEditing ? (
                                    <div className="mb-4 space-y-3">
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full text-xl font-bold text-gray-800 border-b-2 border-orange-200 focus:border-orange-500 outline-none py-1 transition-colors"
                                            placeholder="제목을 입력하세요"
                                        />
                                        <div className="flex items-center justify-between opacity-50 pointer-events-none">
                                            <p className="text-gray-600 flex items-center">
                                                <User size={16} className="mr-2" />
                                                by {prompt.username || prompt.user_id || t('discover.anonymous')}
                                            </p>
                                        </div>
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="w-full text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200 focus:border-orange-500 outline-none resize-none h-24 transition-colors"
                                            placeholder="설명을 입력하세요"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                            {prompt.title || prompt.settings?.subject || t('discover.no_title')}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <p className="text-gray-600 flex items-center">
                                                <User size={16} className="mr-2" />
                                                by {prompt.username || prompt.user_id || t('discover.anonymous')}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <Calendar size={12} className="mr-1" />
                                                    {new Date(prompt.created_at).toLocaleDateString()}
                                                </span>
                                                {likesCount > 0 && (
                                                    <span className="flex items-center">
                                                        <Heart size={12} className="mr-1 text-red-400 fill-red-400" />
                                                        {likesCount}
                                                    </span>
                                                )}
                                                {prompt.view_count > 0 && (
                                                    <span className="flex items-center">
                                                        <Eye size={12} className="mr-1" />
                                                        {prompt.view_count}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {(prompt.settings?.context) && (
                                            <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                {prompt.settings.context}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Card Attributes - Hide in Edit Mode or Keep? Keep for reference */}
                            {prompt.settings && !isEditing && (
                                <div className="pt-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('modal.card_combo')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.settings.shot && (
                                            <div className="bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-blue-100">
                                                🎬 {prompt.settings.shot.label ? t(prompt.settings.shot.label) : prompt.settings.shot}
                                            </div>
                                        )}
                                        {prompt.settings.angle && (
                                            <div className="bg-green-50 text-green-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-green-100">
                                                📐 {prompt.settings.angle.label ? t(prompt.settings.angle.label) : prompt.settings.angle}
                                            </div>
                                        )}
                                        {prompt.settings.style && (
                                            <div className="bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-purple-100">
                                                🎨 {prompt.settings.style.label ? t(prompt.settings.style.label) : prompt.settings.style}
                                            </div>
                                        )}
                                        {prompt.settings.composition && (
                                            <div className="bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-orange-100">
                                                📏 {prompt.settings.composition.label ? t(prompt.settings.composition.label) : prompt.settings.composition}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Prompt + Action (Scrollable) */}
                    <div className="w-full md:w-1/2 flex flex-col bg-gray-50/50 h-full">
                        <div className="flex-1 overflow-y-auto p-6">
                            <h4 className="flex items-center text-sm font-bold text-gray-700 mb-4">
                                <Sparkles size={16} className="mr-2 text-orange-500" />
                                {t('modal.generated_prompt')}
                            </h4>
                            <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800">
                                <div className="p-5">
                                    <pre className="text-orange-300 text-sm font-mono leading-relaxed whitespace-pre-wrap font-medium">
                                        {(prompt.prompt_text && prompt.prompt_text !== "Uploaded Image")
                                            ? prompt.prompt_text
                                            : (prompt.description || t('modal.no_prompt'))}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Bottom Action */}
                        <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                            {!isEditing ? (
                                <>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUsePrompt}
                                            className="flex-[2] py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center text-lg"
                                        >
                                            <Sparkles size={20} className="mr-2" />
                                            {t('modal.use_this')}
                                        </button>
                                        {!prompt.id?.toString().startsWith('sample-') && (
                                            <button
                                                onClick={handleLike}
                                                disabled={isLiked}
                                                className={`flex-1 py-3.5 rounded-xl border-2 transition-all flex items-center justify-center font-bold ${isLiked
                                                    ? 'bg-red-50 border-red-200 text-red-500'
                                                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                                                    }`}
                                            >
                                                <Heart size={20} className={`mr-2 ${isLiked ? 'fill-red-500' : ''}`} />
                                                {likesCount}
                                            </button>
                                        )}
                                    </div>

                                    {/* Action Buttons for Uploaded Prompts */}
                                    {prompt?.id && !prompt.id.toString().startsWith('sample-') && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center text-sm"
                                            >
                                                게시물 수정
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    const password = window.prompt("비밀번호를 입력하세요");
                                                    if (!password) return;

                                                    try {
                                                        const { data, error } = await import('../lib/supabaseClient').then(m => m.supabase.rpc('delete_prompt_verified', {
                                                            p_id: prompt.id,
                                                            p_password: password
                                                        }));

                                                        if (error) throw error;

                                                        if (data === true) {
                                                            alert("삭제되었습니다.");
                                                            onClose();
                                                            window.location.reload();
                                                        } else {
                                                            alert("비밀번호가 일치하지 않습니다.");
                                                        }
                                                    } catch (err) {
                                                        console.error("Delete failed:", err);
                                                        alert("삭제 중 오류가 발생했습니다.");
                                                    }
                                                }}
                                                className="flex-1 py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-sm"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-md"
                                    >
                                        저장하기
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="w-full py-3 bg-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-300 transition-all"
                                    >
                                        취소
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
