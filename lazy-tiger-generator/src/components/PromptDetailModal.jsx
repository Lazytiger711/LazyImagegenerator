import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Sparkles, Eye, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromptDetailModal({ prompt, onClose }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (!prompt) return null;

    const handleUsePrompt = () => {
        if (prompt.id.startsWith('sample-')) {
            navigate('/create');
        } else {
            navigate(`/create?prompt=${prompt.id}`);
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
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {prompt.settings?.subject || t('discover.no_title')}
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
                                        {prompt.view_count > 0 && (
                                            <span className="flex items-center">
                                                <Eye size={12} className="mr-1" />
                                                {prompt.view_count}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {prompt.settings?.context && (
                                    <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        {prompt.settings.context}
                                    </p>
                                )}
                            </div>

                            {/* Card Attributes */}
                            {prompt.settings && (
                                <div className="pt-2">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{t('modal.card_combo')}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {prompt.settings.shot && (
                                            <div className="bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-blue-100">
                                                🎬 {prompt.settings.shot.label || prompt.settings.shot}
                                            </div>
                                        )}
                                        {prompt.settings.angle && (
                                            <div className="bg-green-50 text-green-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-green-100">
                                                📐 {prompt.settings.angle.label || prompt.settings.angle}
                                            </div>
                                        )}
                                        {prompt.settings.style && (
                                            <div className="bg-purple-50 text-purple-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-purple-100">
                                                🎨 {prompt.settings.style.label || prompt.settings.style}
                                            </div>
                                        )}
                                        {prompt.settings.composition && (
                                            <div className="bg-orange-50 text-orange-700 px-2.5 py-1.5 rounded-md text-xs font-medium border border-orange-100">
                                                📏 {prompt.settings.composition.label || prompt.settings.composition}
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
                                        {prompt.prompt_text}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* Fixed Bottom Action */}
                        <div className="p-6 bg-white border-t border-gray-200 space-y-3">
                            <button
                                onClick={handleUsePrompt}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center text-lg"
                            >
                                <Sparkles size={20} className="mr-2" />
                                {t('modal.use_this')}
                            </button>

                            {/* Delete Button (Only for uploaded prompts, not samples) */}
                            {!prompt.id.toString().startsWith('sample-') && (
                                <button
                                    onClick={async () => {
                                        const password = window.prompt("비밀번호를 입력하세요 (관리자 키: lazytiger_admin)");
                                        if (!password) return;

                                        try {
                                            // Call the RPC function
                                            const { data, error } = await import('../lib/supabaseClient').then(m => m.supabase.rpc('delete_prompt_verified', {
                                                p_id: prompt.id,
                                                p_password: password
                                            }));

                                            if (error) throw error;

                                            if (data === true) {
                                                alert("삭제되었습니다.");
                                                onClose();
                                                window.location.reload(); // Refresh to update list
                                            } else {
                                                alert("비밀번호가 일치하지 않습니다.");
                                            }
                                        } catch (err) {
                                            console.error("Delete failed:", err);
                                            alert("삭제 중 오류가 발생했습니다.");
                                        }
                                    }}
                                    className="w-full py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl hover:bg-gray-200 hover:text-red-500 transition-all flex items-center justify-center text-sm"
                                >
                                    게시물 삭제하기
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
