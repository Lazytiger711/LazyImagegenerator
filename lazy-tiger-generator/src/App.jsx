import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from 'lucide-react';

// Imported Components
import { useAppSelections } from './hooks/useAppSelections';
import { usePromptGenerator } from './hooks/usePromptGenerator';
import { useCanvas } from './hooks/useCanvas';
import { useAnalytics } from './hooks/useAnalytics';
import { useSupabaseActions } from './hooks/useSupabaseActions';

import SelectionSection from './components/SelectionSection';
import Toast from './components/Toast';
import Gallery from './components/Gallery';
import AssetDeck from './components/AssetDeck';
import Workspace from './components/Workspace';
import FeedbackModal from './components/FeedbackModal';
import StepIndicator from './components/StepIndicator';
import BottomNav from './components/BottomNav';
import CreatePostModal from './components/CreatePostModal';

// Extracted UI Components
import { SortableColorButton } from './components/SortableColorButton'; // Check if needed
import Header from './components/Header';
import MontageInputs from './components/MontageInputs';
import CanvasToolbar from './components/CanvasToolbar';
import ResultOverlay from './components/ResultOverlay';
import DrawingArea from './components/DrawingArea';

import { sessionStorage } from './utils/storage';

// Removed import.meta.glob to load icons via external URL and prevent Figma inline bloat
const getAppIcon = (path) => {
  if (typeof path === 'string' && path.startsWith('/icons/')) {
    return `https://raw.githubusercontent.com/Lazytiger711/LazyImagegenerator/main/public/assets${path}`;
  }
  return path;
};


// --- Main Component ---
export default function App() {
  const { t, i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ko' : 'en');
  };

  // Google Analytics Event Tracking Helper
  const { trackEvent } = useAnalytics();

  const {
    selections, setSelections,
    toolMode, setToolMode,
    brushSize, setBrushSize,
    selectedStamp, setSelectedStamp,
    showGrid, setShowGrid,
    paletteColors, setPaletteColors,
    selectedColor, setSelectedColor,
    handleAssetClick,
    handleRemoveItem,
    handleClearAll,
    handlePaletteDragEnd,
    handleAddObject,
    getNoneItem,
    workspaceItems,
    disabledOptions,
    lockedCategories
  } = useAppSelections({ trackEvent });

  const [canvasTrigger, setCanvasTrigger] = useState(0); // Trigger for re-analysis

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("복사되었습니다!");

  const [showGallery, setShowGallery] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false); // New Post Modal State
  // Public share toggle
  const [showFeedback, setShowFeedback] = useState(false); // Feedback modal state


  // Refs
  const canvasRef = useRef(null);
  const gridRef = useRef(null);
  const resultRef = useRef(null);

  // Hook: Prompt Generation & AI Logic (Must be before useCanvas to provide isGenerating)
  const {
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
  } = usePromptGenerator({
    selections,
    setSelections,
    canvasRef,
    gridRef,
    paletteColors,
    setPaletteColors,
    setSelectedColor,
    t,
    setToastMsg,
    setShowToast,
    trackEvent,
    canvasTrigger,
    resultRef // Pass resultRef if needed by hook, or remove if not
  });

  // Hook: Canvas Management
  const {
    cursorRef,
    handleCanvasPointerDown,
    handleCanvasPointerMove,
    updateCanvasLayout,
    recordBlur
  } = useCanvas({
    canvasRef, // Pass the ref we created
    selections,
    toolMode,
    selectedColor,
    brushSize,
    selectedStamp,
    isGenerating,
    onDraw: useCallback(() => setCanvasTrigger(c => c + 1), []),
    trackEvent
  });


  // Step Indicator Configuration
  const STEPS = [
    { id: 'type', label: 'common.step_type', icon: getAppIcon('/icons/type-icon.png') },
    { id: 'pick', label: 'common.step_pick', icon: getAppIcon('/icons/pick-icon.png') },
    { id: 'draw', label: 'common.step_draw', icon: getAppIcon('/icons/draw-icon.png') },
    { id: 'generate', label: 'common.step_generate', icon: getAppIcon('/icons/generate-icon.png') },
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
  }, []);

  // Calculate current step based on user progress
  const getCurrentStep = () => {
    if (showResult) return 3; // Step 4: generate (completed)

    // Check if canvas has any drawings
    // Optmized: Use canvasTrigger as proxy for drawing activity instead of scanning pixels every render
    // const canvas = canvasRef.current;
    // if (canvas) {
    //   const ctx = canvas.getContext('2d', { willReadFrequently: true });
    //   // ... (expensive check removed)
    // }
    if (sessionStorage.getItem('canvas_drawn') === 'true') return 2; // Step 3: draw

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




  // const cursorRef = useRef(null); // REMOVED: Managed by useCanvas


  // DnD Sensors

  // Meme presets logic removed as feature is disabled and caused circular dependency.


  // No sensors needed for click-only interaction









  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResult]);











  // --- CANVAS DRAWING LOGIC ---

  // 마우스/터치 좌표를 캔버스 내부 해상도 좌표로 변환








  // Prevent auto-scroll on first interaction
  useEffect(() => {
    // Fix: Reset scroll position on mount to prevent browser auto-scroll
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }, []); // Run once on mount

  // Hook: Supabase Actions (Save, Share, Load)
  const {
    handleSaveToSupabase,
    handleShare,
    handleOpenGemini,
    handleLoadPrompt // if needed for manual load, though hook handles URL load
  } = useSupabaseActions({
    selections, setSelections,
    subjectText, setSubjectText,
    contextText, setContextText,
    finalPrompt,
    generatedImage,
    isPublic, setIsPublic,
    setToastMsg, setShowToast,
    setShowGallery,
    trackEvent
  });

  // Clear Canvas Logic
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setCanvasTrigger(c => c + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-200 pb-24 select-none">

      {/* Header */}
      <Header
        setShowGallery={setShowGallery}
        setShowFeedback={setShowFeedback}
        toggleLanguage={toggleLanguage}
        i18n={i18n}
      />

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
          {/* Top Area: Montage Inputs */}
          <MontageInputs
            subjectType={subjectType}
            setSubjectType={setSubjectType}
            subjectText={subjectText}
            setSubjectText={setSubjectText}
            recordBlur={recordBlur}
            contextText={contextText}
            setContextText={setContextText}
            applyChaos={applyChaos}
          />

          {/* Middle Area: Workspace (Restored to Middle) */}
          <div className="shrink-0 relative flex flex-col p-4 pt-2">
            <p className="text-xs text-center text-gray-400 mb-2 font-black uppercase">
              {t('workspace.hint')}
            </p>
            {/* Wrapper to control size if needed, but flex-1 with padding works well to isolate it */}
            <div className="border-4 border-black border-dashed rounded-xl bg-[#FFB233] shadow-[4px_4px_0_0_rgba(0,0,0,1)] min-h-[120px]">
              <Workspace items={workspaceItems} onRemove={handleRemoveItem} onClearAll={handleClearAll} />
            </div>
          </div>

          {/* Bottom Area: Visual Mapping (Moved Down) */}
          <div className="p-4 pt-0 shrink-0 bg-white flex flex-col items-center pb-32 md:pb-6">

            {/* Visual Mapping Header */}
            <div className="w-full max-w-5xl mb-3 flex items-center">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-black flex items-center justify-center mr-2 border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <Grid size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 leading-none">{t('sections.ai_vision')}</h3>
                <p className="text-[10px] text-gray-400 font-medium">{t('sections.ai_vision_desc')}</p>
              </div>
            </div>



            {/* Toolbar */}
            <CanvasToolbar
              toolMode={toolMode}
              setToolMode={setToolMode}
              brushSize={brushSize}
              setBrushSize={setBrushSize}
              clearCanvas={clearCanvas}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              paletteColors={paletteColors}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              handlePaletteDragEnd={handlePaletteDragEnd}
              handleAddObject={handleAddObject}
              selectedStamp={selectedStamp}
              setSelectedStamp={setSelectedStamp}
            />

            {/* Grid Visual Preview */}
            <DrawingArea
              gridRef={gridRef}
              canvasRef={canvasRef}
              cursorRef={cursorRef}
              selections={selections}
              toolMode={toolMode}
              selectedColor={selectedColor}
              selectedStamp={selectedStamp}
              showGrid={showGrid}
              aiVisionText={aiVisionText}
              isGenerating={isGenerating}
              generatePrompt={generatePrompt}
              handleCanvasPointerDown={handleCanvasPointerDown}
              handleCanvasPointerMove={handleCanvasPointerMove}
              handlePointerLeave={() => {
                if (cursorRef.current) {
                  cursorRef.current.style.opacity = '0';
                  cursorRef.current.style.display = 'none';
                }
              }}
              paletteColors={paletteColors}
              setSelectedColor={setSelectedColor}
              handlePaletteDragEnd={handlePaletteDragEnd}
              handleAddObject={handleAddObject}
            />
          </div>


          {/* Result Overlay (If shown) - Rendered via Portal to avoid DOM conflicts */}
          <ResultOverlay
            showResult={showResult}
            setShowResult={setShowResult}
            generatedImage={generatedImage}
            finalPrompt={finalPrompt}
            handleCopyMapImage={handleCopyMapImage}
            handleDownloadMapImage={handleDownloadMapImage}
            handleShare={handleShare}
            handleOpenGemini={handleOpenGemini}
            handleSaveToSupabase={handleSaveToSupabase}
            selections={selections}
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            resultRef={resultRef}
          />


        </div >


      </main >

      <Toast message={toastMsg} show={showToast} />

      {
        showGallery && (
          <Gallery
            onClose={() => setShowGallery(false)}
            onLoad={handleLoadPrompt}
          />
        )
      }

      {
        showFeedback && (
          <FeedbackModal onClose={() => setShowFeedback(false)} />
        )
      }

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
      <div className="md:hidden">
        <AssetDeck
          disabledIds={disabledOptions}
          lockedCategories={lockedCategories}
          onAssetClick={handleAssetClick}
          currentSelections={selections}
          className="!fixed !bottom-[80px] !left-0 !right-0 !mx-auto !w-[calc(100vw-24px)] !max-w-md !z-[100] !rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-4 border-black bg-white overflow-hidden"
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNav onNewPost={() => setShowCreatePost(true)} />

      {/* Create Post Modal */}
      {
        showCreatePost && (
          <CreatePostModal
            onClose={() => setShowCreatePost(false)}
            onPostCreated={() => {
              // Optional: Refresh gallery or notify
              setToastMsg("게시물이 등록되었습니다!");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
          />
        )
      }
    </div >
  );
};