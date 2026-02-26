import { useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SHOT_TYPES, ANGLES, STYLES, COMPOSITIONS, RESOLUTIONS, FACING_DIRECTIONS } from '../data/constants';

export function useSupabaseActions({
    selections, setSelections,
    subjectText, setSubjectText,
    contextText, setContextText,
    finalPrompt,
    generatedImage,
    isPublic, setIsPublic,
    setToastMsg, setShowToast,
    setShowGallery,
    trackEvent
}) {

    // --- Helper: Secure Clipboard Copy ---
    const copyToClipboard = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(text);
                return;
            } catch (err) {
                console.warn("Clipboard API failed, trying fallback...", err);
            }
        }

        // Fallback for insecure context (e.g. local HTTP) or iframe
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
        } catch (error) {
            console.error('Fallback copy failed', error);
        } finally {
            textArea.remove();
        }
    };

    // --- Helper: Upload Image to Supabase ---
    const uploadImageToSupabase = useCallback(async (imageDataUrl) => {
        try {
            // 1. Convert Data URL to Blob
            const response = await fetch(imageDataUrl);
            const blob = await response.blob();
            const file = new File([blob], "generated-image.png", { type: "image/png" });

            // 2. Upload to 'images' bucket (Note: Case-sensitive!)
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileName = `generated_${timestamp}_${randomString}.png`;

            const { error } = await supabase.storage
                .from('images') // Reverted to lowercase 'images'
                .upload(fileName, file, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (error) throw error;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('images') // Reverted to lowercase 'images'
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error("Image upload failed:", error);
            return null;
        }
    }, []);

    const handleSaveToSupabase = useCallback(async () => {
        if (!finalPrompt) return; // Use finalPrompt

        try {
            setToastMsg("이미지 업로드 및 저장 중...");
            setShowToast(true);

            // Upload Image if exists
            let publicImageUrl = null;
            if (generatedImage) {
                publicImageUrl = await uploadImageToSupabase(generatedImage);
            }

            const { error } = await supabase
                .from('prompts')
                .insert([
                    {
                        prompt_text: finalPrompt, // Use finalPrompt
                        is_public: isPublic, // Add public flag
                        image_url: publicImageUrl, // Save Image URL
                        settings: {
                            shot: selections.shot,
                            angle: selections.angle,
                            style: selections.style,
                            composition: selections.composition,
                            resolution: selections.resolution,
                            subject: subjectText,
                            context: contextText
                        }
                    }
                ]);

            if (error) throw error;

            // Track save to gallery
            if (trackEvent) {
                trackEvent('prompt_save', { is_public: isPublic, has_image: !!publicImageUrl });
            }

            setToastMsg(isPublic ? "갤러리에 공개되었습니다!" : "갤러리에 저장되었습니다!");
            setTimeout(() => setShowToast(false), 2000);
            setIsPublic(false); // Reset toggle

        } catch (error) {
            console.error('Error saving to Supabase:', error);
            setToastMsg("저장에 실패했습니다.");
            setTimeout(() => setShowToast(false), 2000);
        }
    }, [finalPrompt, generatedImage, isPublic, selections, subjectText, contextText, setIsPublic, setShowToast, setToastMsg, trackEvent, uploadImageToSupabase]);

    const handleShare = useCallback(async () => {
        if (!finalPrompt) return;

        try {
            setToastMsg("공유 링크 생성 중...");
            setShowToast(true);

            // Save with is_public = true
            const { data, error } = await supabase
                .from('prompts')
                .insert([
                    {
                        prompt_text: finalPrompt,
                        is_public: true,
                        settings: {
                            shot: selections.shot,
                            angle: selections.angle,
                            style: selections.style,
                            composition: selections.composition,
                            resolution: selections.resolution,
                            subject: subjectText,
                            context: contextText
                        }
                    }
                ])
                .select();

            if (error) throw error;

            // Generate shareable URL
            const shareUrl = `${window.location.origin}?prompt=${data[0].id}`;

            // Copy to clipboard with fallback
            await copyToClipboard(shareUrl);

            // Track prompt share
            if (trackEvent) {
                trackEvent('prompt_share', { share_type: 'link' });
            }

            setToastMsg("🔗 공유 링크가 복사되었습니다!");
            setTimeout(() => setShowToast(false), 3000);

        } catch (error) {
            console.error('Error sharing:', error);
            setToastMsg("공유 링크 생성에 실패했습니다.");
            setTimeout(() => setShowToast(false), 2000);
        }
    }, [finalPrompt, selections, subjectText, contextText, setShowToast, setToastMsg, trackEvent]);

    const handleLoadPrompt = useCallback((settings) => {
        if (!settings) return;

        // Restore settings
        setSelections({
            shot: settings.shot || SHOT_TYPES[2],
            angle: settings.angle || ANGLES[0],
            style: settings.style || STYLES[0],
            composition: settings.composition || COMPOSITIONS[0],
            resolution: settings.resolution || RESOLUTIONS[0],
            facing: FACING_DIRECTIONS[0], // Default or add to settings if saved
            lighting: settings.lighting || { id: 'none', label: 'common.none' },
            meme: settings.meme || { id: 'none', label: 'common.none' }
        });

        setSubjectText(settings.subject || "");
        setContextText(settings.context || "");

        setShowGallery(false);
        setToastMsg("설정을 불러왔습니다!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    }, [setSelections, setSubjectText, setContextText, setShowGallery, setShowToast, setToastMsg]);

    const handleOpenGemini = useCallback(async () => {
        if (!finalPrompt) {
            setToastMsg("먼저 프롬프트를 생성해주세요!");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
            return;
        }

        try {
            setToastMsg("처리 중...");
            setShowToast(true);

            // 1. Copy Text to Clipboard (Prioritize Text with fallback)
            await copyToClipboard(finalPrompt);

            // 2. Notify and Open
            setToastMsg("텍스트가 복사되었습니다! AI로 이동합니다.");
            setShowToast(true);

            // Delay slightly to let user see message
            setTimeout(() => {
                const win = window.open('https://gemini.google.com/app', '_blank');
                if (win) win.focus();
                // Close toast after opening window
                setTimeout(() => setShowToast(false), 3000);
            }, 1000);

        } catch (err) {
            console.error("Action failed:", err);
            setToastMsg("오류가 발생했습니다.");
            setShowToast(true);
        }
    }, [finalPrompt, setShowToast, setToastMsg]);


    // Load prompt from URL parameter (for sharing)
    useEffect(() => {
        const loadFromUrl = async () => {
            const params = new URLSearchParams(window.location.search);
            const promptId = params.get('prompt');

            if (promptId) {
                try {
                    const { data, error } = await supabase
                        .from('prompts')
                        .select('*')
                        .eq('id', promptId)
                        .single();

                    if (error) throw error;

                    if (data) {
                        // Load the prompt settings
                        handleLoadPrompt(data.settings);

                        // Increment view count (Securely via RPC)
                        const { error: viewError } = await supabase
                            .rpc('increment_view_count', { p_id: promptId });

                        if (viewError) console.error("View count update failed:", viewError);
                    }
                } catch (error) {
                    console.error('Error loading prompt from URL:', error);
                }
            }
        };

        loadFromUrl();
    }, [handleLoadPrompt]);

    return {
        handleSaveToSupabase,
        handleShare,
        handleLoadPrompt,
        handleOpenGemini,
        uploadImageToSupabase
    };
}
