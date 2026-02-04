import React from 'react';
import { X, Sparkles, Eye, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromptDetailModal({ prompt, onClose }) {
    const navigate = useNavigate();

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
                    <h2 className="text-xl font-bold text-gray-800">프롬프트 상세</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - 2 Tier Layout */}
                <div className="flex flex-col">
                    {/* Top Section: Image + Info */}
                    <div className="grid md:grid-cols-2 gap-6 p-6 border-b border-gray-200">
                        {/* Left: Image */}
                        <div className="space-y-4">
                            {prompt.image_url ? (
                                <div className="rounded-2xl overflow-hidden shadow-lg">
                                    <img
                                        src={prompt.image_url}
                                        alt={prompt.settings?.subject || 'Generated image'}
                                        className="w-full h-auto"
                                    />
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl aspect-square flex items-center justify-center">
                                    <span className="text-gray-400 text-lg">이미지 없음</span>
                                </div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="space-y-4">
                            {/* Title & User */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {prompt.settings?.subject || '제목 없음'}
                                </h3>
                                <p className="text-gray-600 flex items-center mb-3">
                                    <User size={16} className="mr-2" />
                                    by {prompt.username || prompt.user_id || 'Anonymous'}
                                </p>
                                {prompt.settings?.context && (
                                    <p className="text-gray-600 text-sm mb-4">
                                        {prompt.settings.context}
                                    </p>
                                )}
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                    <Calendar size={14} className="mr-1" />
                                    {new Date(prompt.created_at).toLocaleDateString()}
                                </span>
                                {prompt.view_count > 0 && (
                                    <span className="flex items-center">
                                        <Eye size={14} className="mr-1" />
                                        {prompt.view_count} views
                                    </span>
                                )}
                            </div>

                            {/* Card Composition Tags */}
                            {prompt.settings && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3">사용된 카드 조합</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {prompt.settings.shot && (
                                            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                                                🎬 {prompt.settings.shot.label || prompt.settings.shot}
                                            </div>
                                        )}
                                        {prompt.settings.angle && (
                                            <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium">
                                                📐 {prompt.settings.angle.label || prompt.settings.angle}
                                            </div>
                                        )}
                                        {prompt.settings.style && (
                                            <div className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium">
                                                🎨 {prompt.settings.style.label || prompt.settings.style}
                                            </div>
                                        )}
                                        {prompt.settings.composition && (
                                            <div className="bg-orange-50 text-orange-700 px-3 py-2 rounded-lg text-sm font-medium">
                                                📏 {prompt.settings.composition.label || prompt.settings.composition}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* CTA Button */}
                            <button
                                onClick={handleUsePrompt}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center"
                            >
                                <Sparkles size={20} className="mr-2" />
                                이 설정으로 시작하기
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section: Full Prompt */}
                    <div className="p-6 bg-gray-50">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">생성된 프롬프트</h4>
                        <div className="bg-gray-900 rounded-xl overflow-hidden">
                            <div className="p-4 max-h-60 overflow-y-auto">
                                <pre className="text-orange-400 text-sm font-mono leading-relaxed whitespace-pre-wrap">
                                    {prompt.prompt_text}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
