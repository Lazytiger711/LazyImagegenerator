/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';

// Import Constants
import {
    STAMPS, FACING_DIRECTIONS, ANGLES, SHOT_TYPES, COMPOSITIONS, STYLES, RESOLUTIONS, LIGHTING,
    INITIAL_PALETTE, EXTRA_COLORS, CONFLICTS
} from '../data/constants';
import CHAOS_DESCRIPTORS from '../data/chaos_descriptors.json';

export const usePromptGenerator = ({
    selections,
    setSelections,
    canvasRef,
    gridRef,
    paletteColors,
    t, // i18n
    setToastMsg,
    setShowToast,
    trackEvent,
    canvasTrigger // Trigger for re-analysis
}) => {
    // --- State ---
    const [subjectText, setSubjectText] = useState("");
    const [subjectType, setSubjectType] = useState('character');
    const [contextText, setContextText] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const [chaosTrigger, setChaosTrigger] = useState(0); // Internal trigger for auto-gen
    const [finalPrompt, setFinalPrompt] = useState("");
    const [isPublic, setIsPublic] = useState(false);

    // AI Vision
    const [aiVisionText, setAiVisionText] = useState("");

    // --- 1. Canvas Analysis Logic (AI Vision) ---
    const getGridDescription = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return "";

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const { width, height } = canvas;

        // Safety check for 0 dimensions
        if (width === 0 || height === 0) return "Visual map empty.";

        // Sampling
        const sampleStep = 10;
        const totalSamples = (width / sampleStep) * (height / sampleStep);
        let colorStats = {};

        const rgbToHsl = (r, g, b) => {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max === min) { h = s = 0; } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return { h: h * 360, s: s * 100, l: l * 100 };
        };

        const hexToHsl = (hex) => {
            if (!hex) return { h: 0, s: 0, l: 0 };
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return rgbToHsl(r, g, b);
        };

        const paletteHsl = paletteColors
            .filter(p => p.color)
            .map(p => ({ ...p, hsl: hexToHsl(p.color) }));

        const pixelData = ctx.getImageData(0, 0, width, height).data;

        for (let y = 0; y < height; y += sampleStep) {
            for (let x = 0; x < width; x += sampleStep) {
                const index = (y * width + x) * 4;
                const a = pixelData[index + 3];

                if (a > 50) {
                    const r = pixelData[index];
                    const g = pixelData[index + 1];
                    const b = pixelData[index + 2];
                    const { h, s, l } = rgbToHsl(r, g, b);

                    let closestColor = null;
                    let minDist = Infinity;

                    paletteHsl.forEach(p => {
                        let dH = Math.abs(h - p.hsl.h);
                        if (dH > 180) dH = 360 - dH;

                        // Weighted Distance: Hue is critical
                        // But for Black/White, Saturation is low, making Hue irrelevant.
                        // Simple Euclidean typically works if weights are balanced.
                        const dist = Math.sqrt(
                            Math.pow(dH * 0.8, 2) +
                            Math.pow((s - p.hsl.s) * 0.5, 2) +
                            Math.pow((l - p.hsl.l), 2) // Lightness full weight for distinguish black/white
                        );

                        // Threshold: ~40-50 seems reasonable for HSL
                        if (dist < 60 && dist < minDist) {
                            minDist = dist;
                            closestColor = p.color;
                        }
                    });

                    if (closestColor) {
                        if (!colorStats[closestColor]) {
                            colorStats[closestColor] = {
                                count: 0, sumX: 0, sumY: 0,
                                minX: x, maxX: x, minY: y, maxY: y
                            };
                        }
                        const s = colorStats[closestColor];
                        s.count++;
                        s.sumX += x;
                        s.sumY += y;
                        s.minX = Math.min(s.minX, x);
                        s.maxX = Math.max(s.maxX, x);
                        s.minY = Math.min(s.minY, y);
                        s.maxY = Math.max(s.maxY, y);
                    }
                } else {
                    if (!colorStats['__empty__']) {
                        colorStats['__empty__'] = { count: 0, sumX: 0, sumY: 0, minX: x, maxX: x, minY: y, maxY: y };
                    }
                    const s = colorStats['__empty__'];
                    s.count++;
                    s.sumX += x;
                    s.sumY += y;
                }
            }
        }

        // Generate Descriptions
        let objectDescriptions = [];
        const getLabel = (item) => item.promptName || item.label;

        // Helper: Check overlap
        const getOverlapRatio = (stats1, stats2) => {
            const xOverlap = Math.max(0, Math.min(stats1.maxX, stats2.maxX) - Math.max(stats1.minX, stats2.minX));
            const yOverlap = Math.max(0, Math.min(stats1.maxY, stats2.maxY) - Math.max(stats1.minY, stats2.minY));
            const intersectionArea = xOverlap * yOverlap;
            const minArea = Math.min((stats1.maxX - stats1.minX) * (stats1.maxY - stats1.minY), (stats2.maxX - stats2.minX) * (stats2.maxY - stats2.minY));
            return minArea > 0 ? intersectionArea / minArea : 0;
        };

        const activeObjects = paletteColors.filter(item => {
            if (item.id === 'erase' || item.id === 'bg') return false;
            return !!colorStats[item.color];
        }).map(item => ({ ...item, stats: colorStats[item.color], layerPriority: paletteColors.findIndex(p => p.color === item.color) }));

        const mainSubject = activeObjects.find(obj => obj.id === 'subject') || activeObjects[0];

        // Describe Main Subject
        if (mainSubject) {
            const stats = mainSubject.stats;
            const centerX = stats.sumX / stats.count;
            const centerY = stats.sumY / stats.count;

            // Quadrant-based position (natural language for LLMs)
            const normX = centerX / width;
            const normY = centerY / height;

            // Horizontal zone
            let hZone;
            if (normX < 0.25) hZone = "far-left";
            else if (normX < 0.45) hZone = "left";
            else if (normX < 0.55) hZone = "center";
            else if (normX < 0.75) hZone = "right";
            else hZone = "far-right";

            // Vertical zone
            let vZone;
            if (normY < 0.25) vZone = "upper";
            else if (normY < 0.45) vZone = "upper-middle";
            else if (normY < 0.55) vZone = "middle";
            else if (normY < 0.75) vZone = "lower-middle";
            else vZone = "lower";

            // Natural language quadrant description
            let posDesc = "";
            if (vZone === "middle" && hZone === "center") {
                posDesc = "centered in the frame";
            } else if (hZone === "center") {
                posDesc = `in the ${vZone} portion of the frame`;
            } else if (vZone === "middle") {
                posDesc = `in the ${hZone} portion of the frame`;
            } else {
                posDesc = `in the ${vZone}-${hZone} area of the frame`;
            }

            // Size Dominance
            const coverageRatio = stats.count / totalSamples;
            const coveragePercent = Math.round(coverageRatio * 100);
            let sizeStr;
            if (coverageRatio > 0.6) sizeStr = "dominant (roughly 3/4 of the canvas)";
            else if (coverageRatio > 0.35) sizeStr = "large (roughly half the canvas)";
            else if (coverageRatio > 0.15) sizeStr = "medium-sized (roughly 1/4 of the canvas)";
            else sizeStr = "small";

            objectDescriptions.push(`Place the MAIN SUBJECT (${getLabel(mainSubject)}) ${posDesc} — ${sizeStr}, occupying about ${coveragePercent}% of the frame`);
        }

        // Describe Other Objects
        activeObjects.forEach(obj => {
            if (obj === mainSubject) return;

            const s = obj.stats;
            const centerX = s.sumX / s.count;
            const centerY = s.sumY / s.count;

            // Check Overlap
            const overlap = getOverlapRatio(obj.stats, mainSubject.stats);
            const isOverlapping = overlap > 0.1;

            let desc = "";
            if (isOverlapping) {
                if (obj.layerPriority < mainSubject.layerPriority) {
                    desc = `The ${getLabel(obj)} is in the foreground, partially obscuring the ${getLabel(mainSubject)}`;
                } else {
                    desc = `The ${getLabel(obj)} is in the background, behind the ${getLabel(mainSubject)}`;
                }
            } else {
                const normX2 = centerX / width;
                const normY2 = centerY / height;

                let hZone2;
                if (normX2 < 0.25) hZone2 = "far-left";
                else if (normX2 < 0.45) hZone2 = "left";
                else if (normX2 < 0.55) hZone2 = "center";
                else if (normX2 < 0.75) hZone2 = "right";
                else hZone2 = "far-right";

                let vZone2;
                if (normY2 < 0.25) vZone2 = "upper";
                else if (normY2 < 0.45) vZone2 = "upper-middle";
                else if (normY2 < 0.55) vZone2 = "middle";
                else if (normY2 < 0.75) vZone2 = "lower-middle";
                else vZone2 = "lower";

                let loc2;
                if (vZone2 === "middle" && hZone2 === "center") loc2 = "in the absolute center of the frame";
                else if (hZone2 === "center") loc2 = `in the ${vZone2} portion of the frame`;
                else if (vZone2 === "middle") loc2 = `in the ${hZone2} portion of the frame`;
                else loc2 = `in the ${vZone2}-${hZone2} area of the frame`;

                desc = `Place ${getLabel(obj)} ${loc2}`;
            }
            objectDescriptions.push(desc);
        });

        // Empty Space
        if (objectDescriptions.length > 0 && colorStats['__empty__']) {
            const emptyRatio = colorStats['__empty__'].count / totalSamples;
            if (emptyRatio > 0.75) {
                objectDescriptions.push("The composition features significant negative space");
            }
        }

        if (objectDescriptions.length === 0) return "";
        return objectDescriptions.join(". ") + ".";
    }, [paletteColors, canvasRef]); // Dependencies

    // Real-time Analysis Effect
    useEffect(() => {
        // Debounce analysis
        const timer = setTimeout(() => {
            const desc = getGridDescription();
            setAiVisionText(desc);
        }, 500);
        return () => clearTimeout(timer);
    }, [canvasTrigger, paletteColors, subjectText, getGridDescription]);


    // --- 2. Chaos Mode Logic ---
    const applyChaos = () => {
        // 1. Generate Random Context
        const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const adj = randomItem(CHAOS_DESCRIPTORS.adjectives);
        const mod = randomItem(CHAOS_DESCRIPTORS.modifiers);
        const loc = randomItem(CHAOS_DESCRIPTORS.locations);

        let chaosContext = "";
        const canInteract = CHAOS_DESCRIPTORS.second_subjects && CHAOS_DESCRIPTORS.interactions;
        const isInteraction = canInteract && Math.random() < 0.5;

        if (isInteraction) {
            const interaction = randomItem(CHAOS_DESCRIPTORS.interactions);
            const sub2 = randomItem(CHAOS_DESCRIPTORS.second_subjects);
            chaosContext = `${adj}, ${mod}, ${interaction} ${sub2} ${loc}`;
        } else {
            const act = randomItem(CHAOS_DESCRIPTORS.actions);
            chaosContext = `${adj}, ${mod}, ${act} ${loc}`;
        }

        setContextText(chaosContext);

        // 2. Randomize Settings
        const pickRandom = (list) => {
            if (!list || list.length === 0) return { id: 'none', label: 'common.none' };
            const validItems = list.filter(i => i.id !== 'none');
            if (validItems.length === 0) return list[0];
            return randomItem(validItems);
        };

        setSelections(prev => ({
            ...prev,
            shot: pickRandom(SHOT_TYPES),
            angle: pickRandom(ANGLES),
            composition: pickRandom(COMPOSITIONS),
            style: pickRandom(STYLES),
            lighting: pickRandom(LIGHTING),
            facing: pickRandom(FACING_DIRECTIONS),
            resolution: pickRandom(RESOLUTIONS),
            meme: { id: 'none', label: 'common.none' } // Reset meme
        }));

        if (setToastMsg && setShowToast) {
            setToastMsg(t('common.chaos_activated'));
            setShowToast(true);
        }
        if (trackEvent) trackEvent('chaos_mode_triggered');

        // Trigger auto-generation
        setChaosTrigger(c => c + 1);
    };

    // Effect to handle Auto-Generation for Chaos Mode
    useEffect(() => {
        if (chaosTrigger > 0) {
            generatePrompt(null, true);
        }
    }, [chaosTrigger]);


    // --- 3. Generate Prompt Function ---
    const generatePrompt = (e, isChaos = false) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsGenerating(true);

        setTimeout(async () => {
            try {
                const baseGridDesc = getGridDescription();

                // Include Context Text
                const textParts = [];
                if (subjectText.trim()) textParts.push(subjectText.trim());
                if (contextText.trim()) textParts.push(contextText.trim());
                const fullSubject = textParts.join(", ") || "Subject";

                // 1. Resolve Effective Settings (Meme Priority)
                const p = selections.meme.presets;
                const memeActive = selections.meme.id !== 'none' && p;

                const getPreset = (list, id) => list.find(item => item.id === id);

                const effectiveShot = (memeActive && p.shot)
                    ? (getPreset(SHOT_TYPES, p.shot) ? { ...getPreset(SHOT_TYPES, p.shot), variantId: null } : selections.shot)
                    : selections.shot;

                const effectiveAngle = (memeActive && p.angle)
                    ? (getPreset(ANGLES, p.angle) ? { ...getPreset(ANGLES, p.angle), variantId: null } : selections.angle)
                    : selections.angle;

                const effectiveFacing = (memeActive && p.facing)
                    ? (getPreset(FACING_DIRECTIONS, p.facing) ? { ...getPreset(FACING_DIRECTIONS, p.facing), variantId: null } : selections.facing)
                    : selections.facing;

                const effectiveComp = (memeActive && p.composition)
                    ? (getPreset(COMPOSITIONS, p.composition) ? { ...getPreset(COMPOSITIONS, p.composition), variantId: null } : selections.composition)
                    : selections.composition;

                let generatedText = "";
                let instructionPrefix = "";
                let cameraContent = "";

                const getPromptWithVariant = (item) => {
                    if (item.id === 'none') return "";
                    let base = item.prompt.split(',')[0].replace(/ shot$/i, '').replace(/ view$/i, '').trim();
                    if (item.variantId && item.variants) {
                        const v = item.variants.find(v => v.id === item.variantId);
                        if (v && v.prompt) {
                            if (item.variantId !== 'standard') {
                                return v.prompt.split(',')[0].replace(/ shot$/i, '').replace(/ view$/i, '').trim();
                            }
                        }
                    }
                    return base;
                };

                if (selections.meme.id !== 'none') {
                    // MEME MODE
                    const memePrompt = selections.meme.prompt;
                    const resolutionPrompt = selections.resolution?.prompt || "";
                    const subjectInsertion = fullSubject ? `, featuring ${fullSubject}` : "";
                    generatedText = `${memePrompt}${subjectInsertion}, high quality. ${resolutionPrompt}`;
                    instructionPrefix = `**System Instruction:**\nGenerate the image based on the specific Meme Template described below. You MUST strictly adhere to the visual composition, camera angle, and style of this meme. Insert the user's subject (${fullSubject}) into this scene naturally.\n\n`;
                    setFinalPrompt(instructionPrefix + generatedText);
                } else {
                    // STANDARD MODE
                    let styleContent = selections.style.id !== 'none' ? selections.style.prompt : "";

                    // Conflict Resolution
                    if (effectiveShot.id === 'full_shot' || effectiveShot.id === 'long_shot' || (effectiveShot.variants && effectiveShot.variantId && ['wide', 'long_shot'].includes(effectiveShot.variantId))) {
                        styleContent = styleContent.replace(/, macro lens detail/gi, "")
                            .replace(/, visible pores/gi, "")
                            .replace(/, close up/gi, "")
                            .replace(/, extreme close-up/gi, "");
                    }

                    if (effectiveShot.id === 'selfie') {
                        cameraContent = "Selfie shot, point of view (POV) from camera held by subject";
                    } else {
                        const angleStr = getPromptWithVariant(effectiveAngle);
                        const shotStr = getPromptWithVariant(effectiveShot);
                        cameraContent = [angleStr, shotStr].filter(Boolean).join(", ");
                    }

                    let subjectContent = fullSubject;
                    let facingModifier = "";
                    if (subjectType === 'character' && effectiveFacing.id !== 'none') {
                        if (effectiveFacing.variantId && effectiveFacing.variantId !== 'standard' && effectiveFacing.variants) {
                            const v = effectiveFacing.variants.find(v => v.id === effectiveFacing.variantId);
                            if (v && v.prompt) facingModifier = v.prompt;
                            else facingModifier = effectiveFacing.prompt;
                        } else {
                            facingModifier = effectiveFacing.prompt;
                        }
                    }
                    if (facingModifier) subjectContent += `, ${facingModifier}`;

                    const compositionContent = effectiveComp.id !== 'none' ? effectiveComp.prompt : "";
                    const lightingContent = selections.lighting?.id !== 'none' ? selections.lighting?.prompt : "";
                    const technicalContent = [
                        selections.resolution?.prompt,
                        selections.style.neg,
                        "high quality, detailed"
                    ].filter(Boolean).join(', ');
                    const layoutContent = baseGridDesc ? `(Layout Constraint) ${baseGridDesc}` : "";

                    const sections = [
                        { label: '1. VISUAL STYLE', content: styleContent },
                        { label: '2. CAMERA ANGLE', content: cameraContent },
                        { label: '3. MAIN SUBJECT', content: subjectContent },
                        { label: '4. COMPOSITION', content: compositionContent },
                        { label: '5. LIGHTING', content: lightingContent },
                        { label: '6. TECHNICAL', content: technicalContent },
                        { label: '7. LAYOUT GUIDE', content: layoutContent }
                    ];

                    generatedText = sections
                        .filter(s => s.content && s.content.trim() !== "")
                        .map(s => `**${s.label}**\n${s.content}`)
                        .join('\n\n');

                    instructionPrefix = `**System Instruction:**\nYou are generating an image description. Follow these sections in order of priority.\nCRITICAL: The 'LAYOUT GUIDE' section describes the exact position of objects — you MUST honor this placement strictly. All other elements (style, lighting, camera angle) should serve this composition, not override it.\n\n`;
                    setFinalPrompt(instructionPrefix + generatedText);
                }

                // Capture Canvas Logic
                if (gridRef.current) {
                    try {
                        const originalNode = gridRef.current;
                        const cloneNode = originalNode.cloneNode(true);
                        const originalCanvases = originalNode.querySelectorAll('canvas');
                        const clonedCanvases = cloneNode.querySelectorAll('canvas');

                        originalCanvases.forEach((orig, i) => {
                            const dest = clonedCanvases[i];
                            if (dest) {
                                const ctx = dest.getContext('2d');
                                ctx.drawImage(orig, 0, 0);
                            }
                        });

                        cloneNode.style.position = 'absolute';
                        cloneNode.style.left = '-9999px';
                        cloneNode.style.top = '0';
                        document.body.appendChild(cloneNode);

                        const canvas = await html2canvas(cloneNode, {
                            scale: 1,
                            backgroundColor: null,
                            logging: false,
                            useCORS: true
                        });

                        setGeneratedImage(canvas.toDataURL());
                        document.body.removeChild(cloneNode);
                    } catch (e) {
                        console.error("Capture failed:", e);
                    }
                }

                if (trackEvent) {
                    trackEvent('prompt_generate', {
                        has_subject: !!subjectText,
                        has_context: !!contextText,
                        has_canvas: !!generatedImage,
                        is_chaos_mode: isChaos
                    });
                }

                setShowResult(true);
            } catch (error) {
                console.error("Prompt generation failed:", error);
                if (setToastMsg && setShowToast) {
                    setToastMsg(t('common.error_occurred'));
                    setShowToast(true);
                }
            } finally {
                setIsGenerating(false);
            }
        }, 1000);
    };

    const handleCopyMapImage = async () => {
        if (!generatedImage) return;

        try {
            const response = await fetch(generatedImage);
            const blob = await response.blob();
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);

            if (setToastMsg && setShowToast) {
                setToastMsg(t('status.image_copied'));
                setShowToast(true);
            }
        } catch (err) {
            console.error("Image copy failed:", err);
            if (setToastMsg && setShowToast) {
                setToastMsg(t('common.error_occurred'));
                setShowToast(true);
            }
        }
    };

    const handleDownloadMapImage = () => {
        if (!generatedImage) return;

        const link = document.createElement('a');
        link.download = 'lazytiger_map.png';
        link.href = generatedImage;
        link.click();

        if (trackEvent) trackEvent('image_download');

        if (setToastMsg && setShowToast) {
            setToastMsg("이미지가 다운로드됩니다.");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }
    };

    return {
        subjectText, setSubjectText,
        subjectType, setSubjectType,
        contextText, setContextText,
        isGenerating,
        showResult, setShowResult,
        generatedImage, setGeneratedImage,
        finalPrompt, setFinalPrompt,
        isPublic, setIsPublic,
        aiVisionText, setAiVisionText,
        chaosTrigger, setChaosTrigger,
        generatePrompt,
        applyChaos,
        handleCopyMapImage,
        handleDownloadMapImage
    };
};
