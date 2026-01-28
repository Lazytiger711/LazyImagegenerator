import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function FeedbackModal({ onClose }) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);
        try {
            const { error } = await supabase
                .from('feedbacks')
                .insert([{ message: message }]);

            if (error) throw error;

            setSent(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error sending feedback:', error);
            alert('피드백 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in text-gray-900">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-slide-up">

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
                    <h3 className="font-bold flex items-center text-gray-800">
                        <MessageSquare size={18} className="mr-2 text-orange-500" />
                        개발자에게 한마디
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {sent ? (
                        <div className="text-center py-8 animate-fade-in-up">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={32} />
                            </div>
                            <h4 className="text-xl font-bold text-gray-800 mb-2">소중한 의견 감사합니다!</h4>
                            <p className="text-gray-500 text-sm">보내주신 내용은 꼼꼼히 읽어보겠습니다.<br />더 좋은 서비스를 만들겠습니다.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p className="text-sm text-gray-500 mb-4">
                                버그 제보, 기능 추가 요청, 혹은 응원의 한마디!<br />
                                무엇이든 자유롭게 남겨주세요. (익명으로 전송됩니다)
                            </p>

                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="여기에 내용을 입력해주세요..."
                                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none mb-4 text-sm transition-all"
                                required
                            />

                            <button
                                type="submit"
                                disabled={isSending || !message.trim()}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all
                                    ${isSending || !message.trim()
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-lg transform active:scale-95'
                                    }`}
                            >
                                {isSending ? (
                                    '전송 중...'
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" />
                                        보내기
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
                @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
}
