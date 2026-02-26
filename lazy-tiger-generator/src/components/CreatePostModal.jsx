import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CreatePostModal({ onClose, onPostCreated }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const { trackEvent } = useAnalytics();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return null;

        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileName = `upload_${timestamp}_${randomString}.${imageFile.name.split('.').pop()}`;

        const { data, error } = await supabase.storage
            .from('images')
            .upload(fileName, imageFile, {
                contentType: imageFile.type,
                upsert: false
            });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(fileName);

        return publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageFile || !title || !password) return; // Password required

        try {
            setIsSubmitting(true);

            // 1. Upload Image
            const publicUrl = await handleImageUpload();
            if (!publicUrl) throw new Error("Image upload failed");

            // 2. Insert Post
            const { error } = await supabase
                .from('prompts')
                .insert([
                    {
                        title: title,
                        description: description,
                        password: password, // Store password
                        image_url: publicUrl,
                        is_public: true,
                        settings: {}, // Empty settings for manual uploads
                        prompt_text: description || "Uploaded Image" // Use description as prompt text, fallback to placeholder
                    }
                ]);

            if (error) throw error;

            // Trigger celebration!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff4500', '#ffa500', '#ff6347']
            });

            trackEvent('post_create', { has_description: !!description });

            if (onPostCreated) onPostCreated();
            onClose();

        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b-4 border-black sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-black text-black">새 게시물 만들기</h2>
                    <button onClick={onClose} className="p-2 bg-white border-2 border-transparent hover:border-black rounded-xl hover:-translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all">
                        <X size={20} className="text-black" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Image Upload Area */}
                    <div
                        className="mb-6 border-4 border-black border-dashed rounded-xl bg-[#FFB233] hover:bg-[#FFA500] shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:relative hover:-top-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer relative aspect-video flex flex-col items-center justify-center group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-white text-black border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={28} />
                                </div>
                                <p className="text-sm font-black text-black">이미지를 선택하거나 드래그하세요</p>
                                <p className="text-xs font-bold text-gray-700 mt-1">JPG, PNG up to 5MB</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                    </div>

                    {/* Inputs */}
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="block text-xs font-black text-black mb-1 ml-1 uppercase">제목 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="멋진 제목을 지어주세요"
                                className="w-full bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl px-4 py-3 text-sm outline-none focus:-translate-y-0.5 focus:-translate-x-0.5 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all font-bold text-black"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-black mb-1 ml-1 uppercase">설명 (선택)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="작품에 대한 설명을 적어주세요..."
                                rows={3}
                                className="w-full bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl px-4 py-3 text-sm outline-none focus:-translate-y-0.5 focus:-translate-x-0.5 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all font-bold text-black resize-none"
                            />
                        </div>
                        <div className="relative">
                            <label className="block text-xs font-black text-black mb-1 ml-1 uppercase">비밀번호 <span className="text-red-500">*</span> <span className="text-xs font-bold text-gray-500">(수정/삭제 시 필요)</span></label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full bg-white border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] rounded-xl px-4 py-3 text-sm outline-none focus:-translate-y-0.5 focus:-translate-x-0.5 focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all font-bold text-black font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t-4 border-black flex justify-end sticky bottom-0 bg-white z-10">
                    <button
                        onClick={handleSubmit}
                        disabled={!imageFile || !title || !password || isSubmitting}
                        className={`
                            px-6 py-2.5 rounded-xl font-black flex items-center transition-all border-4 border-black uppercase text-sm
                            ${!imageFile || !title || !password || isSubmitting
                                ? 'bg-gray-200 text-gray-500 shadow-none'
                                : 'bg-[#FF6B00] text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-y-1 hover:relative hover:-top-1 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
                            }
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin mr-2" />
                                업로드 중...
                            </>
                        ) : (
                            '게시하기'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
