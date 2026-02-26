import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Check, X, Copy, Download, Share2, Compass, MessageSquare } from 'lucide-react';

const ResultOverlay = React.memo(function ResultOverlay({
    showResult,
    setShowResult,
    generatedImage,
    finalPrompt,
    handleCopyMapImage,
    handleDownloadMapImage,
    handleShare,
    handleOpenGemini,
    handleSaveToSupabase,
    selections,
    isPublic,
    setIsPublic,
    resultRef
}) {
    const { t } = useTranslation();

    useEffect(() => {
        if (showResult && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showResult, resultRef]);

    if (!showResult) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
            onClick={() => setShowResult(false)} // Close on background click
        >
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
                ref={resultRef}
            >
                <div className="bg-gray-900 p-4 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-bold flex items-center"><Check className="mr-2 text-green-400" /> {t('status.complete')}</h3>
                    <button onClick={() => setShowResult(false)} className="p-1 hover:bg-gray-800 rounded-full"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {/* Generated Image Preview */}
                    {generatedImage && (
                        <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex justify-center relative group">
                            <img src={generatedImage} alt="Generated Map" className="max-h-48 object-contain" />
                            <div className="absolute top-2 right-2 flex flex-col space-y-2">
                                <button onClick={handleCopyMapImage} className="p-2 bg-white/90 rounded-lg hover:text-blue-600 shadow-sm"><Copy size={14} /></button>
                                <button onClick={handleDownloadMapImage} className="p-2 bg-white/90 rounded-lg hover:text-green-600 shadow-sm"><Download size={14} /></button>
                            </div>
                        </div>
                    )}

                    {/* Prompt Result */}
                    <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('status.final_prompt')}</h4>
                        <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 relative group">
                            <p className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-words overflow-hidden w-full leading-relaxed">
                                {finalPrompt}
                            </p>
                            <button
                                onClick={() => {
                                    // Default web clipboard
                                    if (navigator.clipboard && window.isSecureContext) {
                                        navigator.clipboard.writeText(finalPrompt);
                                    } else {
                                        // Fallback for Figma iframe (which lacks clipboard access often)
                                        const textArea = document.createElement("textarea");
                                        textArea.value = finalPrompt;
                                        textArea.style.position = "absolute";
                                        textArea.style.left = "-999999px";
                                        document.body.prepend(textArea);
                                        textArea.select();
                                        try {
                                            document.execCommand('copy');
                                        } catch (error) {
                                            console.error(error);
                                        } finally {
                                            textArea.remove();
                                        }
                                    }

                                    // Post message to Figma to insert text and show toast
                                    if (parent && parent.postMessage) {
                                        parent.postMessage({ pluginMessage: { type: 'insert-text', text: finalPrompt } }, '*');
                                    }
                                }}
                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-orange-600 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                title="Copy & Insert text"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleOpenGemini}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center group"
                        >
                            <span className="mr-2 text-xl">✨</span>
                            <span className="text-lg">{t('status.open_gemini')}</span>
                            <Compass className="ml-2 group-hover:rotate-45 transition-transform" />
                        </button>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleShare}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
                            >
                                <Share2 className="mr-2" size={18} />
                                {t('actions.share_link')}
                            </button>

                            <button
                                onClick={handleSaveToSupabase}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center relative overflow-hidden"
                            >
                                {/* Public Toggle inside Save Button */}
                                <div
                                    className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${isPublic ? 'bg-green-500' : 'bg-gray-300'}`}
                                    title={isPublic ? "Visible in Gallery" : "Private"}
                                ></div>
                                <MessageSquare className="mr-2" size={18} />
                                <span>{t('actions.save_gallery')}</span>

                                {/* Minimal Toggle Switch */}
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPublic(!isPublic);
                                    }}
                                    className={`ml-2 w-8 h-4 rounded-full p-0.5 flex items-center transition-colors cursor-pointer ${isPublic ? 'bg-green-500' : 'bg-gray-400'}`}
                                >
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${isPublic ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                </div>
                            </button>
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">
                            {isPublic ? "Anyone can see this in the Gallery." : "Only you can see this (features pending)."}
                        </p>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
});

export default ResultOverlay;
