import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { X, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CreatePostModal({ onClose, onPostCreated }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [password, setPassword] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

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
                className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10">
                    <h2 className="text-lg font-bold text-gray-800">새 게시물 만들기</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Image Upload Area */}
                    <div
                        className="mb-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative aspect-video flex flex-col items-center justify-center group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Upload size={28} />
                                </div>
                                <p className="text-sm font-bold text-gray-500">이미지를 선택하거나 드래그하세요</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
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
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">제목 <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="멋진 제목을 지어주세요"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">설명 (선택)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="작품에 대한 설명을 적어주세요..."
                                rows={3}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">비밀번호 <span className="text-red-500">*</span> <span className="text-xs font-normal text-gray-400">(수정/삭제 시 필요)</span></label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호를 입력하세요"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-end sticky bottom-0 bg-white/95 backdrop-blur z-10">
                    <button
                        onClick={handleSubmit}
                        disabled={!imageFile || !title || !password || isSubmitting}
                        className={`
                            px-6 py-2.5 rounded-xl font-bold text-white flex items-center transition-all
                            ${!imageFile || !title || !password || isSubmitting
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-red-500 shadow-lg hover:shadow-xl hover:scale-105'
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
