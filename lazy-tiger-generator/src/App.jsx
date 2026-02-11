import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas'; // Ensure this is installed


import { RefreshCw, Wand2, Check, Save, Download, Grid, Info, Camera, Sparkles, Pencil, Brush, Stamp, Trash2, Plus, Image as ImageIcon, Send, Palette, BoxSelect, X, MessageSquare, User, Box, Zap, Copy, Share2, Compass } from 'lucide-react';

// Imported Data & Components
import {
  STAMPS, FACING_DIRECTIONS, ANGLES, SHOT_TYPES, COMPOSITIONS, STYLES, RESOLUTIONS, LIGHTING,
  PALETTE_COLORS as INITIAL_PALETTE_COLORS, INITIAL_PALETTE, EXTRA_COLORS, CONFLICTS, MEME_TEMPLATES
} from './data/constants';
import CHAOS_DESCRIPTORS from './data/chaos_descriptors.json';

import PixelArtIcon from './components/PixelArtIcon';
import CompositionGuides from './components/CompositionGuides';
import SelectionSection from './components/SelectionSection';
import Toast from './components/Toast';
import { supabase } from './lib/supabaseClient'; // Import Supabase client
import Gallery from './components/Gallery'; // Import Gallery

// DnD Kit Imports
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AssetDeck from './components/AssetDeck';
import Workspace from './components/Workspace';
import FeedbackModal from './components/FeedbackModal'; // Import Feedback Modal
import StepIndicator from './components/StepIndicator'; // Import Step Indicator
import BottomNav from './components/BottomNav'; // Import Bottom Navigation


// --- Sortable Color Button Component ---
function SortableColorButton({ colorItem, isSelected, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: colorItem.id,
    // Add activation constraint to prevent conflict with onClick
    // User must drag at least 5px to activate sorting
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: colorItem.color || '#eee',
  };

  // Handle click separately from drag
  const handleClick = (e) => {
    // Only trigger onClick if not dragging
    if (!isDragging) {
      onClick(e);
    }
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-all relative cursor-grab active:cursor-grabbing
        ${isSelected ? 'ring-2 ring-orange-400 scale-110 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'}
      `}
      title={colorItem.label}
    >
      {colorItem.icon && <colorItem.icon size={14} className="text-gray-500" />}
      {isSelected && !colorItem.icon && <Check size={14} className="text-white drop-shadow-md" />}
    </button>
  );
}

// --- Main Component ---
export default function App() {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ko' : 'en');
  };


  const [selections, setSelections] = useState({
    shot: { id: 'none', label: 'common.none' },
    angle: { id: 'none', label: 'common.none' },
    facing: { id: 'none', label: 'common.none' },
    composition: { id: 'none', label: 'common.none' },
    style: { id: 'none', label: 'common.none' },
    resolution: RESOLUTIONS[0], // Keep resolution default
    lighting: { id: 'none', label: 'common.none' },
    meme: { id: 'none', label: 'common.none' },
  });

  // Apply Meme Presets Effect


  const [subjectType, setSubjectType] = useState('character'); // 'character' or 'object'

  // Calculate Disabled Options and Locked Categories
  const { disabledOptions, lockedCategories } = React.useMemo(() => {
    const disabled = new Set();
    const locked = new Set();

    // 1. Conflict Logic
    Object.values(selections).forEach(selection => {
      const conflicts = CONFLICTS[selection.id];
      if (conflicts) {
        conflicts.forEach(c => disabled.add(c));
      }
    });

    // 2. Meme Template Locking Logic
    if (selections.meme.id !== 'none') {
      // Lock these 4 categories when a meme is active
      ['shot', 'angle', 'composition', 'facing'].forEach(cat => locked.add(cat));
    }

    return {
      disabledOptions: Array.from(disabled),
      lockedCategories: Array.from(locked)
    };
  }, [selections]);

  const [subjectText, setSubjectText] = useState("");
  const [contextText, setContextText] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [chaosTrigger, setChaosTrigger] = useState(0); // Trigger for chaos auto-gen
  const [finalPrompt, setFinalPrompt] = useState("");

  // AI Vision State
  const [aiVisionText, setAiVisionText] = useState("");
  const [canvasTrigger, setCanvasTrigger] = useState(0); // Trigger for re-analysis

  // Canvas Guide State
  const [showGrid, setShowGrid] = useState(false);



  const [paletteColors, setPaletteColors] = useState(INITIAL_PALETTE);
  const [selectedColor, setSelectedColor] = useState(INITIAL_PALETTE[0]);

  const [toolMode, setToolMode] = useState('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [selectedStamp, setSelectedStamp] = useState(STAMPS[0].id); // Default to first stamp

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("복사되었습니다!");

  const [showGallery, setShowGallery] = useState(false);
  const [isPublic, setIsPublic] = useState(false); // Public share toggle
  const [showFeedback, setShowFeedback] = useState(false); // Feedback modal state

  // Google Analytics Event Tracking Helper
  const trackEvent = (eventName, eventParams = {}) => {
    // 개발자 모드가 활성화되어 있으면 추적하지 않음
    const isDevMode = localStorage.getItem('dev_mode') === 'true';

    if (isDevMode) {
      console.log('🚫 개발자 모드: 이벤트 추적 안 함 ->', eventName, eventParams);
      return;
    }

    if (window.gtag) {
      window.gtag('event', eventName, eventParams);
      console.log('✅ GA 이벤트 전송:', eventName, eventParams);
    }
  };

  // Step Indicator Configuration
  const STEPS = [
    { id: 'type', label: 'common.step_type', icon: '/icons/type-icon.png' },
    { id: 'pick', label: 'common.step_pick', icon: '/icons/pick-icon.png' },
    { id: 'draw', label: 'common.step_draw', icon: '/icons/draw-icon.png' },
    { id: 'generate', label: 'common.step_generate', icon: '/icons/generate-icon.png' },
  ];

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

            // Increment view count
            await supabase
              .from('prompts')
              .update({ view_count: (data.view_count || 0) + 1 })
              .eq('id', promptId);
          }
        } catch (error) {
          console.error('Error loading prompt from URL:', error);
        }
      }
    };

    loadFromUrl();
  }, []);

  // Calculate current step based on user progress
  const getCurrentStep = () => {
    if (showResult) return 3; // Step 4: generate (completed)

    // Check if canvas has any drawings
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasDrawing = imageData.data.some((value, index) => index % 4 === 3 && value > 0);
      if (hasDrawing) return 2; // Step 3: draw
    }

    // Check if any cards are selected
    const hasSelections = Object.values(selections).some(
      sel => sel && sel.id && sel.id !== 'none'
    );
    if (hasSelections) return 1; // Step 2: pick

    // Check if text is typed
    if (subjectText.trim() || contextText.trim()) return 0; // Step 1: type

    return 0; // Default: Step 1
  };

  // Deck Builder State
  // Deck Builder State (Removed - Computed from Selections)
  // const [workspaceItems, setWorkspaceItems] = useState([]);


  // const [activeDragItem, setActiveDragItem] = useState(null);



  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState(null); // Track cursor position for preview


  // DnD Sensors

  // Meme presets logic removed as feature is disabled and caused circular dependency.


  // No sensors needed for click-only interaction

  // Computed Workspace Items from Selections for Display
  const workspaceItems = [
    { ...selections.shot, type: 'shot', uid: 'shot-item' },
    { ...selections.angle, type: 'angle', uid: 'angle-item' },
    { ...selections.composition, type: 'composition', uid: 'composition-item' },
    { ...selections.style, type: 'style', uid: 'style-item' },
    { ...selections.lighting, type: 'lighting', uid: 'lighting-item' },
    { ...selections.facing, type: 'facing', uid: 'facing-item' },
    // Resolution usually not shown in workspace as card, but let's include if it's not default
  ].filter(item => item && item.id !== 'none'); // Only show active items



  // Handle Click Selection (Alternative to Drag & Drop) with Toggle
  const handleAssetClick = (item, type, variantId = null) => {
    // Track asset selection
    trackEvent('asset_selected', {
      asset_type: type,
      asset_id: item.id,
      variant_id: variantId || 'none'
    });

    // If it's a resolution, update immediately
    if (type === 'resolution') {
      setSelections(prev => ({ ...prev, resolution: item }));
      return;
    }

    // Toggle logic: If clicking the same item (and same variant if applicable), deselect
    // Exception: If switching variants on the same item, update variant
    setSelections(prev => {
      const current = prev[type];
      const isSameItem = current.id === item.id;

      // If clicking active item with NO variant param (just card click) -> Deselect
      // If clicking active item WITH variant param -> Set Variant

      if (variantId) {
        // Variant select
        return {
          ...prev,
          [type]: { ...item, variantId: variantId } // Store simple object with variantId
        };
      } else {
        // Main card click
        // If already selected, turn off (set to None)
        if (isSameItem) {
          // If item has variants, maybe just reset variant to default? 
          // For now, toggle off behavior is standard
          const NoneItem = getNoneItem(type);
          return { ...prev, [type]: NoneItem };
        } else {
          // New item selected, default to 'standard' variant if exists
          return { ...prev, [type]: { ...item, variantId: 'standard' } };
        }
      }
    });

    // Check for conflict triggers (if any)
    const conflicts = CONFLICTS[item.id];
    if (conflicts) {
      console.warn("This selection conflicts with:", conflicts.join(", "));
    }
  };

  // Helper to get 'None' item for a type
  const getNoneItem = (type) => {
    switch (type) {
      case 'shot': return { id: 'none', label: 'common.none', variantId: null };
      case 'angle': return { id: 'none', label: 'common.none', variantId: null };
      case 'composition': return { id: 'none', label: 'common.none', variantId: null };
      case 'lighting': return { id: 'none', label: 'common.none', variantId: null };
      case 'style': return { id: 'none', label: 'common.none', variantId: null };
      case 'facing': return { id: 'none', label: 'common.none', variantId: null };
      case 'meme': return { id: 'none', label: 'common.none' };
      default: return null;
    }
  };

  const handleRemoveItem = (uid) => {
    // Find the type of the item to remove
    const itemToRemove = workspaceItems.find(i => i.uid === uid || i.id === uid);
    if (!itemToRemove) return;

    // Reset that specific selection to None
    const type = itemToRemove.type;
    setSelections(prev => ({
      ...prev,
      [type]: getNoneItem(type)
    }));
  };

  // Handle palette color reordering via drag-and-drop
  const handlePaletteDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPaletteColors((colors) => {
        const oldIndex = colors.findIndex((c) => c.id === active.id);
        const newIndex = colors.findIndex((c) => c.id === over.id);

        // Use arrayMove to reorder
        return arrayMove(colors, oldIndex, newIndex);
      });
    }
  };

  // Ref to store last mouse position for drawing smooth lines
  const lastPos = useRef(null);

  const gridRef = useRef(null);
  const resultRef = useRef(null);
  const canvasRef = useRef(null);

  // Track blur for mobile keyboard handling
  const lastBlurTime = useRef(0);

  // Initialize Canvas Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set internal resolution based on Aspect Ratio
    // Set internal resolution based on Aspect Ratio
    let baseWidth = 800;
    // Safety check: Ensure resolution exists
    if (!selections.resolution || !selections.resolution.width || !selections.resolution.height) {
      console.warn("Resolution invalid, using default");
      baseWidth = 800;
      // force aspect 1:1 if missing
    }

    const resW = selections.resolution?.width || 1;
    const resH = selections.resolution?.height || 1;
    const aspect = resW / resH;
    const baseHeight = Math.round(baseWidth / aspect);

    // Verify dimensions are valid positive integers
    canvas.width = Math.max(1, baseWidth);
    canvas.height = Math.max(1, baseHeight);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  }, [selections.resolution]);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResult]);

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      // if (setIsDragging) setIsDragging(false); // Removed redundant check
      setIsDragging(false);
      lastPos.current = null; // Reset last position
      setCanvasTrigger(c => c + 1);
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    // Add touch-end as backup if needed, but pointerup usually covers it. 
    // However, sometimes 'touchend' is safer for cancellation.
    window.addEventListener('touchend', handleGlobalPointerUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, []);

  // Effect to handle Auto-Generation for Chaos Mode (avoids stale state/closure)
  useEffect(() => {
    if (chaosTrigger > 0) {
      generatePrompt(null, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaosTrigger]);



  const handleAddObject = () => {
    const currentExtraCount = paletteColors.length - INITIAL_PALETTE.length;
    if (currentExtraCount < EXTRA_COLORS.length) {
      const nextColor = EXTRA_COLORS[currentExtraCount];
      const newPalette = [...paletteColors];
      newPalette.splice(newPalette.length - 1, 0, { ...nextColor, id: `obj_${currentExtraCount}` });
      setPaletteColors(newPalette);
      setSelectedColor(newPalette[newPalette.length - 2]);
    }
  };

  // --- CHAOS MODE LOGIC ---
  const applyChaos = () => {
    // 1. Generate Random Context
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const adj = randomItem(CHAOS_DESCRIPTORS.adjectives);
    const mod = randomItem(CHAOS_DESCRIPTORS.modifiers);
    const loc = randomItem(CHAOS_DESCRIPTORS.locations);

    let chaosContext = "";

    // 30% chance for Multi-Subject Interaction (if data exists)
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
    // Helper to pick valid non-none item if possible, or just random
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

    setToastMsg(t('common.chaos_activated'));
    setShowToast(true);
    trackEvent('chaos_mode_triggered');

    // Trigger auto-generation via state to ensure new values are used
    setChaosTrigger(c => c + 1);
  };

  // --- CANVAS DRAWING LOGIC ---

  // 마우스/터치 좌표를 캔버스 내부 해상도 좌표로 변환
  const getPointerPos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // 화면상 크기와 실제 캔버스 해상도 비율 계산
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  // 부드러운 선 그리기 (Brush Mode)
  const drawOnCanvas = (startx, starty, endx, endy, isEraser) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : selectedColor.color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 지우개 모드일 경우: destination-out 합성 모드 사용
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.stroke();

    // 합성 모드 초기화
    ctx.globalCompositeOperation = 'source-over';
  };

  // 스탬프 찍기 (Stamp Mode)
  const placeStampOnCanvas = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || !selectedStamp) return;
    const ctx = canvas.getContext('2d');
    const stamp = STAMPS.find(s => s.id === selectedStamp);
    if (!stamp) return;

    const p = new Path2D(stamp.path);
    // Increased stamp size range: Min ~54px, Max ~450px
    const stampSize = (brushSize * 4) + 50;

    ctx.save();
    ctx.translate(x, y);

    // Scale Logic: Icon paths are usually 24x24. We want to scale them to stampSize.
    // So scale = stampSize / 24.
    // Wait, the previous code used `stampSize / 256` and translated `-128`. This implies the source paths might be large (256x256)?
    // Inspecting STAMPS (I need to check how they are defined). 
    // Assuming they are Lucide icons (24x24) or similar standard paths. 
    // If previous code used 256, maybe I should stick to that ratio or check STAMPS definition. 
    // "placeStampOnCanvas" previously did `ctx.translate(-128, -128)`.
    // Let's assume standard normalization. I'll stick to a safer dynamic scale based on implied viewbox.
    // IF the previous code worked with `scale = stampSize / 256`, let's trust the path data is 0-256 range?
    // Actually, let's verify STAMPS data first. But if I can't, I'll assume 24x24 is standard for Lucide.
    // Wait, the previous code used `const scale = stampSize / 256`. Use this if paths are 256 based.
    // BUT the icons imported are from `lucide-react`. `STAMPS.find(s => s.id === selectedStamp)`. 
    // Does `STAMPS` have a `.path` property? 
    // I need to check `constants.jsx` or wherever STAMPS are defined.
    // If I just use standard Lucide icons, they don't have `.path` property by default unless I extracted it.
    // Let's assume the user has a custom STAMPS array with paths. 

    // I will KEEP the previous scale logic structure but update the SIZE calculation.
    // If the path assumes 0-256 canvas, then scale = stampSize / 256.

    // NEW LOGIC: Just update the `stampSize` var.
    const scale = stampSize / 256; // Paths are 256x256 based (center 128)
    // Wait, if line 421 was `ctx.translate(-128, -128)`, it strongly suggests 256x256 paths.
    // I will try to read STAMPS from constants.jsx first to be safe.
    // ACTUALLY, I'll start with just increasing `stampSize` and keeping `scale` logic compatible 
    // IF I verify the path size. 
    // I will do a quick peek at constants.jsx and then apply this edit.
    // Can I proceed? The prompt says "You can use this tool to edit...".
    // I already have `constants.jsx` content from earlier? No, I viewed it for conflicts.
    // Let's assume Lucide icons are used. Lucide icons are 24x24.
    // If existing code used `256`, maybe they were custom paths.
    // I'll update logic to assume 24x24 if they are Lucide, or 256 if custom.
    // Wait, I can't guess. 
    // Safest bet: Update `stampSize` calculation only, and keep the `scale = stampSize / 256` if that's what it was.
    // BUT if the paths are actually 24x24, `scale = stampSize / 256` (e.g. 400/256 = 1.5) makes it tiny (36px).
    // If previous max was 280, and it was "small", maybe the paths ARE 24x24 and the divisor 256 was the bug?
    // 280 / 256 ~= 1.1x scale. 24px * 1.1 = 26px. That IS tiny.
    // If paths are 24x24, divisor should be 24.
    // If paths are 256x256, divisor 256 is correct.

    // I will pause to check `constants.jsx` for STAMPS definition.
    ctx.scale(scale, scale);
    ctx.translate(-128, -128); // 중앙 정렬 (256/2)

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



  const handleCanvasPointerDown = (e) => {
    if (isGenerating) return;
    // Safety: Ignore if clicking a button inside (unlikely) or scrolling
    if (e.target.closest('button')) return;

    // Track canvas drawing (once per session to avoid spam)
    if (!sessionStorage.getItem('canvas_drawn')) {
      trackEvent('canvas_draw');
      sessionStorage.setItem('canvas_drawn', 'true');
    }

    // Ghost Click protection: If keyboard just closed (blur), ignore taps for 500ms
    if (Date.now() - lastBlurTime.current < 500) return;

    // Prevent default to stop scrolling on first click
    e.preventDefault();

    // Capture pointer to track outside canvas if needed (standard for drawing)
    e.target.setPointerCapture(e.pointerId);

    setIsDragging(true);
    const { x, y } = getPointerPos(e);
    lastPos.current = { x, y };

    if (toolMode === 'stamp') {
      placeStampOnCanvas(x, y);
    } else {
      const isEraser = selectedColor.id === 'erase';
      // Draw a single dot for click
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

  // ... (existing code)

  // In Render (Inputs):
  // You need to find Input elements and add onBlur.
  // I will assume I need to replace the Input section or rely on user knowing I need to inject it.
  // Wait, replace_file_content replaces a contiguous block. 
  // I can't update inputs AND handler in one go if they are far apart.
  // The inputs are around line 1300. The handler is around line 500.
  // I will perform this in TWO steps.
  // Step 1: Update Handler and add Ref (at top). Ref declaration is usually at top.
  // Current logic creates `lastBlurTime` inside the handler block which is wrong.
  // I must add `const lastBlurTime = useRef(0);` at top of Component options.
  // I'll assume lines 313 (refs) is a good place.

  // Actually, I can do a MultiReplace.


  const handleCanvasPointerMove = (e) => {
    if (isGenerating) return; // Prevent updates during generation to avoid DOM conflicts

    // Provide legacy event prevention just in case
    // e.preventDefault(); 

    // 1. Calculate CSS pixels for Visual Cursor (UI Overlay)
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const cssX = e.clientX - rect.left;
    const cssY = e.clientY - rect.top;

    // Calculate Scale: Internal Width / Displayed Width
    const scaleX = canvasRef.current.width / rect.width;

    setCursorPos({ x: cssX, y: cssY, scale: scaleX });

    // 2. Draw if dragging (Brush Mode) - Use Internal Coordinates
    if (isDragging && toolMode === 'brush') {
      const { x, y } = getPointerPos(e); // Helper already does scaling
      const isEraser = selectedColor.id === 'erase';

      if (lastPos.current) {
        drawOnCanvas(lastPos.current.x, lastPos.current.y, x, y, isEraser);
      }
      lastPos.current = { x, y };
    }
  };



  // --- UPDATED ANALYSIS LOGIC FOR CANVAS ---
  const getGridDescription = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // Safety check for 0 dimensions
    if (width === 0 || height === 0) return "Visual map empty.";

    // 1. Sampling (Consistent with previous logic)
    const sampleStep = 10;
    const totalSamples = (width / sampleStep) * (height / sampleStep);
    let colorStats = {};

    const hexToRgb = (hex) => {
      if (!hex) return { r: 0, g: 0, b: 0 };
      const bigint = parseInt(hex.slice(1), 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    const paletteRgb = paletteColors
      .filter(p => p.color)
      .map(p => ({ ...p, rgb: hexToRgb(p.color) }));

    const pixelData = ctx.getImageData(0, 0, width, height).data;

    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const index = (y * width + x) * 4;
        const a = pixelData[index + 3];

        if (a > 50) {
          const r = pixelData[index];
          const g = pixelData[index + 1];
          const b = pixelData[index + 2];

          let closestColor = null;
          let minDist = Infinity;

          paletteRgb.forEach(p => {
            const dist = Math.sqrt(
              Math.pow(r - p.rgb.r, 2) +
              Math.pow(g - p.rgb.g, 2) +
              Math.pow(b - p.rgb.b, 2)
            );
            if (dist < 50 && dist < minDist) {
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

    // 2. Generate Descriptions (Merged Unified Logic)
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

    // B. Describe Main Subject (Always first, clear absolute position)
    if (mainSubject) {
      const stats = mainSubject.stats;
      const centerX = stats.sumX / stats.count;
      const centerY = stats.sumY / stats.count;

      // Grid Position
      const col = Math.floor((centerX / width) * 3);
      const row = Math.floor((centerY / height) * 3);
      const hPos = ["left", "center", "right"][col];
      const vPos = ["top", "middle", "bottom"][row];

      // Size
      const coverageRatio = stats.count / totalSamples;
      const coveragePercent = Math.round(coverageRatio * 100);
      let sizeStr = "";
      if (coverageRatio > 0.6) sizeStr = "large";
      else if (coverageRatio > 0.35) sizeStr = "medium-sized";
      else if (coverageRatio > 0.15) sizeStr = "standard-sized";
      else sizeStr = "small";

      let posDesc = "";
      if (vPos === "middle" && hPos === "center") posDesc = "in the center of the frame";
      else posDesc = `grid-positioned at ${vPos}-${hPos}`;

      objectDescriptions.push(`The ${getLabel(mainSubject)} is a ${sizeStr} subject, positioned ${posDesc} (occupying ${coveragePercent}% of the view)`);
    }

    // C. Describe Other Objects (Relative to Main if suitable, otherwise Grid)
    activeObjects.forEach(obj => {
      if (obj === mainSubject) return;

      const s = obj.stats;
      const centerX = s.sumX / s.count;
      const centerY = s.sumY / s.count;

      // 1. Check Overlap (Depth)
      const overlap = getOverlapRatio(obj.stats, mainSubject.stats);
      const isOverlapping = overlap > 0.1;

      let desc = "";

      if (isOverlapping) {
        // Depth Relation
        if (obj.layerPriority < mainSubject.layerPriority) {
          desc = `The ${getLabel(obj)} is in the foreground, placed in front of the ${getLabel(mainSubject)}`;
        } else {
          desc = `The ${getLabel(obj)} is in the background, standing behind the ${getLabel(mainSubject)}`;
        }
      } else {
        // 2. Check Distance
        const mx = mainSubject.stats.sumX / mainSubject.stats.count;
        const my = mainSubject.stats.sumY / mainSubject.stats.count;
        const dist = Math.sqrt(Math.pow(centerX - mx, 2) + Math.pow(centerY - my, 2));
        const normDist = dist / width;

        if (normDist < 0.25) {
          // Close proximity
          if (centerX < mx) desc = `The ${getLabel(obj)} is standing immediately to the left of the ${getLabel(mainSubject)}`;
          else desc = `The ${getLabel(obj)} is standing immediately to the right of the ${getLabel(mainSubject)}`;
        } else {
          // 3. Fallback: Absolute Grid Position (Independent)
          const col = Math.floor((centerX / width) * 3);
          const row = Math.floor((centerY / height) * 3);
          const hPos = ["left", "center", "right"][col];
          const vPos = ["top", "middle", "bottom"][row];

          let loc = "";
          if (vPos === "middle" && hPos === "center") loc = "in the center";
          else loc = `in the ${vPos}-${hPos} quadrant`;

          desc = `The ${getLabel(obj)} is positioned ${loc}`;
        }
      }

      objectDescriptions.push(desc);
    });

    // D. Empty Space (Minimalist Check)
    // Only apply if we have identified objects, otherwise it's just an empty canvas we want to ignore
    if (objectDescriptions.length > 0 && colorStats['__empty__']) {
      const emptyRatio = colorStats['__empty__'].count / totalSamples;
      if (emptyRatio > 0.75) {
        objectDescriptions.push("The composition features significant negative space");
      }
    }

    if (objectDescriptions.length === 0) return "";
    return objectDescriptions.join(". ") + ".";
  };

  // Real-time Analysis Effect
  useEffect(() => {
    // Debounce slightly to avoid rapid updates
    const timer = setTimeout(() => {
      const desc = getGridDescription();
      setAiVisionText(desc);
    }, 500);
    return () => clearTimeout(timer);
  }, [canvasTrigger, workspaceItems, paletteColors, subjectText]);

  // Prevent auto-scroll on first interaction
  useEffect(() => {
    // Fix: Reset scroll position on mount to prevent browser auto-scroll
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, []); // Run once on mount


  const generatePrompt = (e, isChaos = false) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsGenerating(true);
    setCursorPos(null);

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

        // 2. Construct View/Camera String (The "Look")
        // Logic: [Angle] + [Shot] + "of" + [Subject]

        let cameraContent = "";

        // Helper to get full prompt including variant
        const getPromptWithVariant = (item) => {
          if (item.id === 'none') return "";
          let base = item.prompt.split(',')[0].replace(/ shot$/i, '').replace(/ view$/i, '').trim(); // Base keyword

          // If variant selected
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

        // EXCLUSIVE MEME MODE
        // If a meme is selected, bypass complex logic and output simple prompt
        let generatedText = "";
        let instructionPrefix = "";

        if (selections.meme.id !== 'none') {
          // --- MODE: MEME PRESET ---
          const memePrompt = selections.meme.prompt;
          const resolutionPrompt = selections.resolution?.prompt || "";

          // Construct clean prompt: MEME + USER SUBJECT
          const subjectInsertion = fullSubject ? `, featuring ${fullSubject}` : "";
          generatedText = `${memePrompt}${subjectInsertion}, high quality. ${resolutionPrompt}`;

          // Strict Meme Instruction
          instructionPrefix = `**System Instruction:**\nGenerate the image based on the specific Meme Template described below. You MUST strictly adhere to the visual composition, camera angle, and style of this meme. Insert the user's subject (${fullSubject}) into this scene naturally.\n\n`;
          setFinalPrompt(instructionPrefix + generatedText);
        } else {
          // --- MODE: STANDARD GENERATION ---

          // 1. VISUAL STYLE
          const styleContent = selections.style.id !== 'none' ? selections.style.prompt : "";

          // 2. CAMERA ANGLE (Strict Conflict Resolution)
          if (effectiveShot.id === 'selfie') {
            // Conflict Rule: 'Selfie' overrides all other angle settings implies a specific POV
            cameraContent = "Selfie shot, point of view (POV) from camera held by subject";
          } else {
            const angleStr = getPromptWithVariant(effectiveAngle);
            const shotStr = getPromptWithVariant(effectiveShot);
            cameraContent = [angleStr, shotStr].filter(Boolean).join(", ");
          }

          // 3. MAIN SUBJECT
          // Combine Subject + Context + Facing + Dynamic Modifiers
          let subjectContent = fullSubject;

          const facingModifier = (subjectType === 'character' && effectiveFacing.id !== 'none') ? effectiveFacing.prompt : "";
          if (facingModifier) subjectContent += `, ${facingModifier}`;

          // Dynamic Pose Injection for Characters
          const isDynamicAngle = ['low_angle', 'high_angle', 'dutch_angle', 'birds_eye'].includes(effectiveAngle.id);
          const isDynamicComp = ['diagonal', 'leading_lines'].includes(effectiveComp.id);
          if (subjectType === 'character' && (isDynamicAngle || isDynamicComp) && !subjectContent.toLowerCase().includes('dynamic') && !subjectContent.toLowerCase().includes('action')) {
            subjectContent += `, dynamic pose, action shot`;
          }

          // 4. COMPOSITION
          const compositionContent = effectiveComp.id !== 'none' ? effectiveComp.prompt : "";

          // 5. LIGHTING
          const lightingContent = selections.lighting?.id !== 'none' ? selections.lighting?.prompt : "";

          // 6. TECHNICAL
          const technicalContent = [
            selections.resolution?.prompt,
            selections.style.neg, // Negative Prompt implicitly handled as technical constraint
            "high quality, detailed"
          ].filter(Boolean).join(', ');

          // 7. LAYOUT GUIDE (Vision)
          const layoutContent = baseGridDesc ? `(Layout Constraint) ${baseGridDesc}` : "";


          // Build Final Structured String
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

          instructionPrefix = `**System Instruction:**\nCreate a detailed image prompt based on the following structured keywords. Prioritize visual style first, then strictly follow the camera angle/shot type.\n\n`;
          setFinalPrompt(instructionPrefix + generatedText);
        }

        // Capture Canvas for Preview
        // Capture Canvas for Preview (Robust Clone Strategy)
        if (gridRef.current) {
          try {
            // 1. Clone the node to detach from React's live DOM
            const originalNode = gridRef.current;
            const cloneNode = originalNode.cloneNode(true);

            // 2. Manually copy canvas content (cloneNode doesn't copy canvas pixels)
            const originalCanvases = originalNode.querySelectorAll('canvas');
            const clonedCanvases = cloneNode.querySelectorAll('canvas');

            originalCanvases.forEach((orig, i) => {
              const dest = clonedCanvases[i];
              if (dest) {
                const ctx = dest.getContext('2d');
                ctx.drawImage(orig, 0, 0);
              }
            });

            // 3. Mount clone off-screen (required for html2canvas to render)
            cloneNode.style.position = 'absolute';
            cloneNode.style.left = '-9999px';
            cloneNode.style.top = '0';
            document.body.appendChild(cloneNode);

            // 4. Capture
            const canvas = await html2canvas(cloneNode, {
              scale: 1,
              backgroundColor: null,
              logging: false,
              useCORS: true
            });

            setGeneratedImage(canvas.toDataURL());

            // 5. Cleanup
            document.body.removeChild(cloneNode);
          } catch (e) {
            console.error("Capture failed:", e);
            // Fallback: Continue without image
          }
        }

        // Track prompt generation
        trackEvent('prompt_generate', {
          has_subject: !!subjectText,
          has_context: !!contextText,
          has_canvas: !!generatedImage,
          is_chaos_mode: isChaos
        });

        setShowResult(true);
      } catch (error) {
        console.error("Prompt generation failed:", error);
        setToastMsg("생성 중 오류가 발생했습니다.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
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

      setToastMsg("이미지가 복사되었습니다!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Image copy failed:", err);
      setToastMsg("복사에 실패했습니다.");
      setShowToast(true);
    }
  };

  const handleDownloadMapImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.download = 'lazytiger_map.png';
    link.href = generatedImage;
    link.click();

    // Track image download
    trackEvent('image_download');

    setToastMsg("이미지가 다운로드됩니다.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSaveToSupabase = async () => {
    if (!finalPrompt) return; // Use finalPrompt

    try {
      setToastMsg("갤러리에 저장 중...");
      setShowToast(true);

      const { error } = await supabase
        .from('prompts')
        .insert([
          {
            prompt_text: finalPrompt, // Use finalPrompt
            is_public: isPublic, // Add public flag
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
      trackEvent('prompt_save', { is_public: isPublic });

      setToastMsg(isPublic ? "갤러리에 공개되었습니다!" : "갤러리에 저장되었습니다!");
      setTimeout(() => setShowToast(false), 2000);
      setIsPublic(false); // Reset toggle

    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setToastMsg("저장에 실패했습니다.");
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleShare = async () => {
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

      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);

      // Track prompt share
      trackEvent('prompt_share', { share_type: 'link' });

      setToastMsg("🔗 공유 링크가 복사되었습니다!");
      setTimeout(() => setShowToast(false), 3000);

    } catch (error) {
      console.error('Error sharing:', error);
      setToastMsg("공유 링크 생성에 실패했습니다.");
      setTimeout(() => setShowToast(false), 2000);
    }
  };



  const handleLoadPrompt = (settings) => {
    if (!settings) return;

    // Restore settings
    setSelections({
      shot: settings.shot || SHOT_TYPES[2],
      angle: settings.angle || ANGLES[0],
      style: settings.style || STYLES[0],
      composition: settings.composition || COMPOSITIONS[0],
      resolution: settings.resolution || RESOLUTIONS[0],
      facing: FACING_DIRECTIONS[0] // Default or add to settings if saved
    });

    setSubjectText(settings.subject || "");
    setContextText(settings.context || "");

    setShowGallery(false);
    setToastMsg("설정을 불러왔습니다!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleOpenGemini = async () => {
    if (!gridRef.current || !finalPrompt) {
      setToastMsg("먼저 프롬프트를 생성해주세요!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      return;
    }

    try {
      setToastMsg("처리 중...");
      setShowToast(true);

      // 1. Copy Text to Clipboard (Prioritize Text)
      await navigator.clipboard.writeText(finalPrompt);

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
  };



  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasTrigger(c => c + 1);
    }
  };





  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-200 pb-24 select-none">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight">Lazy <span className="text-orange-500">Image Generator</span></span>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-2 shadow-md overflow-hidden">
              <img src="/logo.png" alt="Tiger Logo" className="w-full h-full object-cover" />
            </div>
            {/* Supabase Connection Status Indicator (Simple) */}
            <div className={`w-2 h-2 rounded-full ${supabase ? 'bg-green-500' : 'bg-red-500'}`} title="Supabase Connected"></div>
          </div>
          <div className="flex items-center space-x-2">


            <button
              onClick={() => setShowGallery(true)}
              className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-bold transition-colors flex items-center"
            >
              <ImageIcon size={16} className="mr-1.5" />
              <span className="hidden sm:inline">{t('common.my_gallery')}</span>
            </button>

            <button
              onClick={() => setShowFeedback(true)}
              className="px-3 py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm"
              title={t('common.feedback')}
            >
              <MessageSquare size={16} className="mr-1.5" />
              <span className="hidden md:inline">{t('common.feedback')}</span>
            </button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-gray-500 hover:text-orange-600 font-bold transition-colors flex items-center text-sm uppercase"
            >
              {i18n.language === 'en' ? 'EN' : 'KO'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title={t('common.reset')}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <StepIndicator currentStep={getCurrentStep()} steps={STEPS} />


      {/* Modified Layout: flex-col ensures Deck is TOP on mobile, Row on Desktop */}
      {/* Modified Layout: flex-col ensures Deck is TOP on mobile, Row on Desktop */}
      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row overflow-visible md:overflow-hidden h-auto min-h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">

        {/* Left Panel: Asset Deck (Desktop Only) */}
        <div className="hidden md:flex flex-col h-full shrink-0">
          <AssetDeck
            disabledIds={disabledOptions}
            lockedCategories={lockedCategories}
            onAssetClick={handleAssetClick}
            currentSelections={selections}
          />
        </div>

        {/* Right Panel: Canvas & Workspace */}
        <div className="flex-1 flex flex-col h-auto md:h-full overflow-visible md:overflow-y-auto bg-gray-50 relative pb-32 md:pb-0">

          {/* Top Area: Montage Inputs */}
          <div className="p-6 pb-4 shrink-0 border-b border-gray-200 bg-white z-20 shadow-sm">
            <div className="mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center mr-2 shadow-md">
                <span className="font-black text-xs">S</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-none">{t('sections.scene')}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{t('sections.scene_desc')}</p>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className="block text-xs font-bold text-gray-500">
                    {subjectType === 'character' ? t('sections.main_character') : t('sections.main_subject')}
                  </label>

                  {/* Subject Type Toggle */}
                  <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setSubjectType('character')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center transition-all ${subjectType === 'character' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Character Mode"
                    >
                      <User size={12} className="mr-1" /> {t('common.character')}
                    </button>
                    <button
                      onClick={() => setSubjectType('object')}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center transition-all ${subjectType === 'object' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      title="Object Mode"
                    >
                      <Box size={12} className="mr-1" /> {t('common.object')}
                    </button>
                  </div>
                </div>

                <p className={`text-[10px] mb-2 ml-1 font-medium ${subjectType === 'character' ? 'text-orange-500' : 'text-blue-500'}`}>
                  {subjectType === 'character'
                    ? t('sections.character_hint')
                    : t('sections.object_hint')}
                </p>
                <input
                  type="text"
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  onBlur={() => lastBlurTime.current = Date.now()}
                  placeholder={subjectType === 'character' ? t('placeholders.character') : t('placeholders.object')}
                  className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 transition-all font-medium ${subjectType === 'character' ? 'focus:ring-orange-200 focus:border-orange-400' : 'focus:ring-blue-200 focus:border-blue-400'}`}
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">{t('sections.context')}</label>
                <input
                  type="text"
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                  onBlur={() => lastBlurTime.current = Date.now()}
                  placeholder={t('placeholders.context')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-all font-medium"
                />
              </div>

              {/* Chaos Button (New Location) */}
              <button
                onClick={applyChaos}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center group"
              >
                <Zap size={18} className="mr-2 fill-white group-hover:rotate-12 transition-transform" />
                <span>{t('common.chaos_mode')}</span>
                <span className="text-xs font-normal opacity-80 ml-2">({t('common.chaos_desc')})</span>
              </button>
            </div>
          </div>

          {/* Middle Area: Workspace (Restored to Middle) */}
          <div className="shrink-0 relative flex flex-col p-4 pt-2">
            <p className="text-xs text-center text-gray-400 mb-2 font-medium">
              {t('workspace.hint')}
            </p>
            {/* Wrapper to control size if needed, but flex-1 with padding works well to isolate it */}
            <div className="border-2 border-dashed border-gray-200 rounded-3xl bg-gray-100/50 min-h-[120px]">
              <Workspace items={workspaceItems} onRemove={handleRemoveItem} />
            </div>
          </div>

          {/* Bottom Area: Visual Mapping (Moved Down) */}
          <div className="p-4 pt-0 shrink-0 bg-white/50 backdrop-blur-sm flex flex-col items-center pb-32 md:pb-6">

            {/* Visual Mapping Header */}
            <div className="w-full max-w-5xl mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mr-2 shadow-sm border border-orange-200">
                <Grid size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-none">{t('sections.ai_vision')}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{t('sections.ai_vision_desc')}</p>
              </div>
            </div>



            {/* Toolbar */}
            <div className="w-full max-w-5xl mb-4 bg-white p-2 rounded-2xl shadow-sm border border-orange-100 flex flex-col">
              <div className="w-full flex items-center justify-between">
                {/* Left: Tools */}
                <div className="flex items-center space-x-2">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setToolMode('brush')}
                      className={`p-2 rounded-md transition-all ${toolMode === 'brush' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title={t('tools.brush')}
                    >
                      <Brush size={16} />
                    </button>
                    <button
                      onClick={() => setToolMode('stamp')}
                      className={`p-2 rounded-md transition-all ${toolMode === 'stamp' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title={t('tools.stamp')}
                    >
                      <Stamp size={16} />
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-200 mx-2"></div>

                  {/* Size Slider */}
                  <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 space-x-3">
                    <span className="text-xs font-bold text-gray-400">SIZE</span>
                    <input
                      type="range"
                      min="5"
                      max="200" // Increased to 200
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-400 w-6 text-center">{brushSize}</span>
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title={t('tools.clear')}
                  >
                    <Trash2 size={20} />
                  </button>

                  {/* Canvas Guide Toggle */}
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-lg transition-all ${showGrid ? 'bg-orange-100 text-orange-600 shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                    title={t('tools.guide_lines')}
                  >
                    <Grid size={20} />
                  </button>
                </div>

                {/* Right Side: Colors */}
                <div className="flex items-center space-x-2">
                  {/* Drag-and-Drop Sortable Palette */}
                  <DndContext
                    onDragEnd={handlePaletteDragEnd}
                    sensors={useSensors(
                      useSensor(PointerSensor, {
                        activationConstraint: {
                          distance: 5, // Require 5px movement to activate drag
                        },
                      })
                    )}
                  >
                    <SortableContext
                      items={paletteColors.map((p) => p.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      <div className="flex space-x-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        {paletteColors.map((p) => (
                          <SortableColorButton
                            key={p.id}
                            colorItem={p}
                            isSelected={selectedColor.id === p.id}
                            onClick={() => setSelectedColor(p)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* Add Object Button */}
                  {paletteColors.length - INITIAL_PALETTE.length < EXTRA_COLORS.length && (
                    <button
                      onClick={handleAddObject}
                      className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors bg-white"
                      title={t('tools.add_object')}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Stamp Selector (Visible only in Stamp Mode, Moved to bottom row) */}
              {toolMode === 'stamp' && (
                <div className="w-full mt-2 pt-2 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-hide">
                  <span className="text-[10px] font-bold text-gray-400 shrink-0">{t('tools.stamps_label')}</span>
                  {STAMPS.map(stamp => (
                    <button
                      key={stamp.id}
                      onClick={() => setSelectedStamp(stamp.id)}
                      className={`p-1.5 rounded-lg shrink-0 transition-all ${selectedStamp === stamp.id ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                      title={stamp.label}
                    >
                      <stamp.icon size={18} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Grid Visual Preview */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 flex flex-col items-center relative group-preview overflow-x-auto w-full">

              {/* Grid Container */}
              <div
                ref={gridRef}
                className={`
                            relative rounded-xl overflow-hidden p-0 select-none
                            ${toolMode === 'brush' ? 'cursor-crosshair' : 'cursor-pointer'}
                            ${['16:9', '1:1'].includes(selections.resolution.id) ? 'w-[90%]' : 'w-[75%]'} h-auto md:w-[var(--desktop-width)] md:h-[var(--desktop-height)]
                        `}
                style={{
                  '--desktop-width': selections.resolution.id === '16:9' ? '800px' :
                    selections.resolution.id === '1:1' ? '560px' :
                      selections.resolution.id === '9:16' ? '360px' : 'auto',
                  '--desktop-height': selections.resolution.id === '16:9' ? '450px' :
                    selections.resolution.id === '1:1' ? '560px' :
                      selections.resolution.id === '9:16' ? '640px' : '480px',
                  aspectRatio: `${selections.resolution.width} / ${selections.resolution.height}`,
                  backgroundColor: '#ffffff',
                  borderColor: '#e5e7eb',
                  borderWidth: '1px',
                  boxShadow: '0 0 0 4px #f3f4f6',
                  color: '#000000',
                  touchAction: 'none', // Crucial: Prevents scrolling while drawing
                }}
                onPointerDown={handleCanvasPointerDown}
                onPointerMove={handleCanvasPointerMove}
                onPointerLeave={() => {
                  // Do not stop dragging immediately on leave for better UX (can drag back in)
                  // But hide cursor preview
                  // setIsDragging(false); // Allow dragging outside if captured
                  lastPos.current = null;
                  setCursorPos(null);
                }}
                onPointerUp={(e) => {
                  // Ensure capture is released
                  e.target.releasePointerCapture(e.pointerId);
                }}
              >
                {/* 1. Background Grid (Reference for Position) */}
                <div
                  className="absolute inset-0 z-0 pointer-events-none opacity-50"
                  style={{
                    backgroundImage: `
                            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                        `,
                    backgroundSize: '20px 20px'
                  }}
                />

                {/* 2. Drawing Canvas (Interactive Layer) - z-10 puts it above z-0 background */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 z-10 w-full h-full cursor-none"
                  style={{ touchAction: 'none' }}
                />

                {/* Visual Cursor Overlay */}
                {cursorPos && (
                  <div
                    className="pointer-events-none absolute flex items-center justify-center transition-transform duration-75 z-50"
                    style={{
                      left: 0,
                      top: 0,
                      // Update size formula to match placeStampOnCanvas
                      width: (toolMode === 'stamp' ? ((brushSize * 4) + 50) : brushSize) / (cursorPos.scale || 1),
                      height: (toolMode === 'stamp' ? ((brushSize * 4) + 50) : brushSize) / (cursorPos.scale || 1),
                      // Position: Use CSS pixel coordinates directly
                      transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`,
                      // Only add background/border for BRUSH mode. Stamp uses SVG.
                      backgroundColor: toolMode === 'stamp' ? 'transparent' : (selectedColor.id === 'erase' ? 'rgba(0,0,0,0.1)' : selectedColor.color),
                      border: toolMode === 'stamp' ? 'none' : '1px solid rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      boxShadow: toolMode === 'stamp' ? 'none' : '0 0 2px rgba(0,0,0,0.5)'
                    }}
                  >
                    {/* Show Stamp Preview in Cursor */}
                    {toolMode === 'stamp' && selectedStamp && (() => {
                      const stamp = STAMPS.find(s => s.id === selectedStamp);
                      return stamp ? (
                        <div className="w-full h-full flex items-center justify-center opacity-50" style={{ color: selectedColor.id === 'erase' ? '#000000' : selectedColor.color }}>
                          {/* Render SVG directly or use Icon component if valid */}
                          <svg viewBox="0 0 256 256" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            <path d={stamp.path} fill="currentColor" />
                          </svg>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* 3. Composition Guides (Overlay) - z-20 puts it on top, pointer-events-none lets clicks pass to canvas */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <CompositionGuides type={selections.composition.id} />
                </div>
              </div>

              {/* AI Vision Text Display (Moved Here) */}
              <div className="w-full mt-4 mb-2 bg-black text-orange-400 p-4 rounded-xl font-mono text-sm leading-relaxed shadow-inner overflow-hidden border border-gray-800 relative group-vision text-shadow-sm">
                <div className="absolute top-2 right-2 opacity-50"><Zap size={14} className="text-orange-500" /></div>
                <p className="whitespace-pre-wrap">{aiVisionText || t('placeholders.ai_vision')}</p>
                {/* Scanning Effect Overlay - Orange Tint */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent bg-[length:100%_200%] animate-scan pointer-events-none"></div>
              </div>

              {/* Canvas Actions below */}
              <div className="mt-1 flex space-x-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    generatePrompt(e);
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onPointerUp={(e) => e.stopPropagation()}
                  disabled={isGenerating}
                  className={`
                          px-6 py-2 rounded-full font-black text-white shadow-lg 
                          flex items-center space-x-2 z-40 transition-all text-sm whitespace-nowrap
                          ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 hover:shadow-orange-200'}
                        `}
                >
                  {isGenerating ? (
                    <RefreshCw className="animate-spin w-4 h-4 mr-1" />
                  ) : (
                    <Wand2 className="w-4 h-4 mr-1" />
                  )}
                  {isGenerating ? t('status.generating') : t('status.generate_prompt')}
                </button>
              </div>
            </div>
          </div>


          {/* Result Overlay (If shown) - Rendered via Portal to avoid DOM conflicts */}
          {showResult && createPortal(
            <div
              className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4"
              onClick={() => setShowResult(false)} // Close on background click
            >
              <div
                className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
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

                  <div className="relative mb-4 group">
                    <div className="bg-gray-100 p-4 rounded-xl text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-y-auto max-h-40 pr-12 scrollbar-hide">
                      {finalPrompt}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(finalPrompt);
                        setToastMsg(t('status.copied'));
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-orange-600 bg-white border border-gray-200 shadow-sm rounded-lg transition-all"
                      title={t('tools.copy_text')}
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  {/* Public Toggle */}
                  <div className="mb-3 flex items-center justify-center">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                      />
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">{t('common.share_public')}</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={handleShare} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl flex items-center justify-center hover:opacity-90">
                      <Share2 size={16} className="mr-2" /> {t('common.share')}
                    </button>
                    <button onClick={handleOpenGemini} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center hover:opacity-90">
                      <Sparkles size={16} className="mr-2" /> {t('common.send_ai')}
                    </button>
                    <button onClick={handleSaveToSupabase} className="flex-1 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl flex items-center justify-center hover:bg-orange-200">
                      <Save size={16} className="mr-2" /> {t('common.save')}
                    </button>
                  </div>


                </div>
              </div>
            </div>,
            document.body
          )}

        </div>


      </main>

      <Toast message={toastMsg} show={showToast} />

      {
        showGallery && (
          <Gallery
            onClose={() => setShowGallery(false)}
            onLoad={handleLoadPrompt}
          />
        )
      }

      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} />
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translate(-50%, 20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>

      {/* Mobile Asset Deck (Floating w/ Explicit Override) */}
      {/* Mobile Asset Deck (Floating) */}
      <div className="md:hidden">
        <AssetDeck
          disabledIds={disabledOptions}
          lockedCategories={lockedCategories}
          onAssetClick={handleAssetClick}
          currentSelections={selections}
          className="!fixed !bottom-[70px] !left-2 !right-2 !z-[100] !rounded-xl shadow-2xl border border-gray-200"
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div >
  );
}