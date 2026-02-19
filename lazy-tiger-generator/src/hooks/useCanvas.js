import { useRef, useEffect, useCallback, useState } from 'react';
import { STAMPS } from '../data/constants';

// Helper to track internal paths if needed (optional)
// import { getStroke } from 'perfect-freehand'; 

export function useCanvas({
    canvasRef: providedCanvasRef, // Optional external ref
    selections,
    toolMode,
    selectedColor,
    brushSize,
    selectedStamp,
    isGenerating,
    onDraw,
    trackEvent
}) {
    const internalCanvasRef = useRef(null);
    const canvasRef = providedCanvasRef || internalCanvasRef; // Use external if provided
    const cursorRef = useRef(null);
    const canvasLayoutRef = useRef({ left: 0, top: 0, width: 0, height: 0, scaleX: 1, scaleY: 1 });

    // Internal state for drawing
    const lastPos = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    // Track blur for ghost clicks
    const lastBlurTime = useRef(0);

    // --- Helper: Update Layout Cache ---
    const updateCanvasLayout = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        canvasLayoutRef.current = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            scaleX: canvas.width / rect.width,
            scaleY: canvas.height / rect.height
        };
    }, []);

    // --- 1. Initialize & Resize Logic ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let baseWidth = 800;
        // Safety check
        if (!selections?.resolution?.width) {
            baseWidth = 800;
        }

        const resW = selections?.resolution?.width || 1;
        const resH = selections?.resolution?.height || 1;
        const aspect = resW / resH;
        const baseHeight = Math.round(baseWidth / aspect);

        // Resize Canvas (Warning: This clears the canvas!)
        // In a real app, you might want to save content to temporary image and restore it.
        // For now, we follow existing behavior (reset on resolution change).
        canvas.width = Math.max(1, baseWidth);
        canvas.height = Math.max(1, baseHeight);

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Explicit clear

        updateCanvasLayout();

    }, [selections.resolution, updateCanvasLayout]);

    // Global Listeners for Resize/Scroll
    useEffect(() => {
        window.addEventListener('resize', updateCanvasLayout);
        window.addEventListener('scroll', updateCanvasLayout, true);
        setTimeout(updateCanvasLayout, 100);

        const handleGlobalPointerUp = () => {
            setIsDragging(false);
            lastPos.current = null;
            if (onDraw) onDraw(); // Notify parent that drawing finished
        };
        window.addEventListener('pointerup', handleGlobalPointerUp);
        window.addEventListener('touchend', handleGlobalPointerUp);

        return () => {
            window.removeEventListener('resize', updateCanvasLayout);
            window.removeEventListener('scroll', updateCanvasLayout, true);
            window.removeEventListener('pointerup', handleGlobalPointerUp);
            window.removeEventListener('touchend', handleGlobalPointerUp);
        };
    }, [updateCanvasLayout, onDraw]);


    // --- 2. Drawing Helpers ---
    const getPointerPos = (e) => {
        const layout = canvasLayoutRef.current;
        if (layout.width === 0) updateCanvasLayout();

        return {
            x: (e.clientX - layout.left) * layout.scaleX,
            y: (e.clientY - layout.top) * layout.scaleY
        };
    };

    const drawOnCanvas = (startx, starty, endx, endy, isEraser) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        ctx.beginPath();
        ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : selectedColor.color;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isEraser) ctx.globalCompositeOperation = 'destination-out';
        else ctx.globalCompositeOperation = 'source-over';

        ctx.moveTo(startx, starty);
        ctx.lineTo(endx, endy);
        ctx.stroke();

        ctx.globalCompositeOperation = 'source-over';
    };

    const placeStampOnCanvas = (x, y) => {
        const canvas = canvasRef.current;
        if (!canvas || !selectedStamp) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const stamp = STAMPS.find(s => s.id === selectedStamp);
        if (!stamp) return;

        const p = new Path2D(stamp.path);
        const stampSize = (brushSize * 4) + 50;
        const scale = stampSize / 256;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.translate(-128, -128); // Center (assuming 256x256 path base)

        ctx.fillStyle = selectedColor.color;
        const isEraser = selectedColor.id === 'erase';

        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fill(p);
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.fill(p);
        }
        ctx.restore();
    };


    // --- 3. Event Handlers ---
    const handleCanvasPointerDown = (e) => {
        if (isGenerating) return;
        if (e.target.closest('button')) return;

        // One-time session tracking
        if (!sessionStorage.getItem('canvas_drawn') && trackEvent) {
            trackEvent('canvas_draw');
            sessionStorage.setItem('canvas_drawn', 'true');
        }

        // Ghost Click Protection
        // Note: We need parent to pass `lastBlurTime` or manage it here if it's purely for canvas.
        // Assuming parent passes a ref or we just use local ref for canvas-specific protection.
        if (Date.now() - lastBlurTime.current < 500) return;

        e.preventDefault();
        e.target.setPointerCapture(e.pointerId);

        setIsDragging(true);
        const { x, y } = getPointerPos(e);
        lastPos.current = { x, y };

        if (toolMode === 'stamp') {
            placeStampOnCanvas(x, y);
            if (onDraw) onDraw(); // Trigger immediately for stamp
        } else {
            // Dot for brush click
            const isEraser = selectedColor.id === 'erase';
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
            if (isEraser) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            } else {
                ctx.fillStyle = selectedColor.color;
                ctx.fill();
            }
        }
    };

    const handleCanvasPointerMove = (e) => {
        if (isGenerating) return;

        const layout = canvasLayoutRef.current;
        const cssX = e.clientX - layout.left;
        const cssY = e.clientY - layout.top;

        // Visual Cursor Update
        if (cursorRef.current) {
            const visualSize = (toolMode === 'stamp' ? ((brushSize * 4) + 50) : brushSize) / (layout.scaleX || 1);
            cursorRef.current.style.transform = `translate(${cssX}px, ${cssY}px) translate(-50%, -50%)`;
            cursorRef.current.style.width = `${visualSize}px`;
            cursorRef.current.style.height = `${visualSize}px`;
            cursorRef.current.style.opacity = '1';
            cursorRef.current.style.display = 'flex';
        }

        // Drawing
        if (isDragging && toolMode === 'brush') {
            const x = cssX * layout.scaleX;
            const y = cssY * layout.scaleY;
            const isEraser = selectedColor.id === 'erase';

            if (lastPos.current) {
                drawOnCanvas(lastPos.current.x, lastPos.current.y, x, y, isEraser);
            }
            lastPos.current = { x, y };
        }
    };

    // Public method to record blur (for ghost click protection)
    const recordBlur = useCallback(() => {
        lastBlurTime.current = Date.now();
    }, []);

    return {
        canvasRef,
        cursorRef,
        handleCanvasPointerDown,
        handleCanvasPointerMove,
        updateCanvasLayout,
        recordBlur
    };
}
