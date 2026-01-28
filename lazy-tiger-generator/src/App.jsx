import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas'; // Ensure this is installed
import { RefreshCw, Wand2, Check, Save, Download, Grid, Info, Camera, Sparkles, Pencil, Brush, Stamp, Trash2, Plus, Image as ImageIcon, Send, Palette, BoxSelect, X } from 'lucide-react';

// Imported Data & Components
import {
  STAMPS, FACING_DIRECTIONS, ANGLES, SHOT_TYPES, COMPOSITIONS, STYLES, RESOLUTIONS, LIGHTING,
  PALETTE_COLORS as INITIAL_PALETTE_COLORS, INITIAL_PALETTE, EXTRA_COLORS
} from './data/constants';

import PixelArtIcon from './components/PixelArtIcon';
import CompositionGuides from './components/CompositionGuides';
import SelectionSection from './components/SelectionSection';
import Toast from './components/Toast';
import { supabase } from './lib/supabaseClient'; // Import Supabase client
import Gallery from './components/Gallery'; // Import Gallery

// DnD Kit Imports
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import AssetDeck from './components/AssetDeck';
import Workspace from './components/Workspace';


// --- Main Component ---
export default function App() {
  const [selections, setSelections] = useState({
    shot: SHOT_TYPES[2],
    angle: ANGLES[0],
    facing: FACING_DIRECTIONS[0],
    composition: COMPOSITIONS[0],
    style: STYLES[0],
    resolution: RESOLUTIONS[0],
    lighting: LIGHTING[0],
  });

  const [subjectText, setSubjectText] = useState("");
  const [contextText, setContextText] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);

  const [paletteColors, setPaletteColors] = useState(INITIAL_PALETTE);
  const [selectedColor, setSelectedColor] = useState(INITIAL_PALETTE[0]);

  const [toolMode, setToolMode] = useState('brush');
  const [brushSize, setBrushSize] = useState(20);
  const [selectedStamp, setSelectedStamp] = useState(STAMPS[0].id); // Default to first stamp

  const [showGrid, setShowGrid] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("복사되었습니다!");

  const [showGallery, setShowGallery] = useState(false);

  // Deck Builder State
  const [workspaceItems, setWorkspaceItems] = useState([]);
  const [activeDragItem, setActiveDragItem] = useState(null);


  const [isDragging, setIsDragging] = useState(false);
  const [cursorPos, setCursorPos] = useState(null); // Track cursor position for preview


  // Dynamic Option Disabling Logic
  const getDisabledOptions = () => {
    const disabled = [];

    // Rule 1: Selfie -> No Back View (Physical Paradox)
    if (selections.shot.id === 'selfie') {
      disabled.push('facing_back', 'facing_back_3_4_left', 'facing_back_3_4_right');
    }

    // Rule 2: Bird's Eye -> No Close Ups (Scale Paradox)
    if (selections.angle.id === 'birds_eye') {
      disabled.push('extreme_close_up', 'close_up');
    }

    // Rule 3: Top Down -> No Front Facing (Flatness Paradox)
    if (selections.angle.id === 'top_down') {
      disabled.push('facing_front', 'facing_front_3_4_left', 'facing_front_3_4_right');
    }

    return disabled;
  };

  const disabledOptions = getDisabledOptions();

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require movement to start drag (prevents accidental clicks)
      },
    })
  );

  // Sync Workspace Items to Selections (Bridge to legacy logic)
  useEffect(() => {
    const newSelections = { ...selections };

    // Reset to defaults first to handle removals
    newSelections.shot = SHOT_TYPES[2]; // Default Medium
    newSelections.angle = ANGLES[0]; // Default Eye Level
    newSelections.composition = COMPOSITIONS[0]; // Default None
    newSelections.style = STYLES[0]; // Default Standard
    newSelections.lighting = LIGHTING[0]; // Default None
    // Facing and Resolution might need defaults if we make them draggable too

    // Apply items from workspace (Last item of each type wins, or combine logic)
    workspaceItems.forEach(item => {
      if (item.type === 'shot') newSelections.shot = SHOT_TYPES.find(s => s.id === item.id) || newSelections.shot;
      if (item.type === 'angle') newSelections.angle = ANGLES.find(a => a.id === item.id) || newSelections.angle;
      if (item.type === 'composition') newSelections.composition = COMPOSITIONS.find(c => c.id === item.id) || newSelections.composition;
      if (item.type === 'style') newSelections.style = STYLES.find(s => s.id === item.id) || newSelections.style;
      if (item.type === 'binding') newSelections.facing = FACING_DIRECTIONS.find(f => f.id === item.id) || newSelections.facing; // Typo fix 'facing' type check if needed
      if (item.type === 'facing') newSelections.facing = FACING_DIRECTIONS.find(f => f.id === item.id) || newSelections.facing;
      if (item.type === 'resolution') newSelections.resolution = RESOLUTIONS.find(r => r.id === item.id) || newSelections.resolution;
      if (item.type === 'lighting') newSelections.lighting = LIGHTING.find(l => l.id === item.id) || newSelections.lighting;
    });

    setSelections(newSelections);
  }, [workspaceItems]);

  // DnD Handlers
  const handleDragStart = (event) => {
    setActiveDragItem(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveDragItem(null);

    if (!over) return;

    // dropped in workspace
    if (over.id === 'workspace-droppable' || over.id.toString().startsWith('workspace-item-')) {
      // Check if it's a new item from deck
      if (active.data.current?.source === 'deck') {
        const newItem = {
          ...active.data.current.item,
          type: active.data.current.type,
          uid: `workspace-item-${Date.now()}-${Math.random()}`
        };
        setWorkspaceItems((items) => {
          // Check if item of this type already exists
          const existingIndex = items.findIndex(i => i.type === newItem.type);
          if (existingIndex !== -1) {
            // Replace existing
            const newItems = [...items];
            newItems[existingIndex] = newItem;
            return newItems;
          }
          return [...items, newItem];
        });
      } else {
        // Reordering logic
        if (active.id !== over.id) {
          setWorkspaceItems((items) => {
            const oldIndex = items.findIndex((i) => i.uid === active.id);
            const newIndex = items.findIndex((i) => i.uid === over.id);
            // If dropped on the container (no specific item), append? 
            // sortable handles index better if over.id matches an item.
            if (newIndex === -1) return items;
            return arrayMove(items, oldIndex, newIndex);
          });
        }
      }
    }
  };

  const handleRemoveItem = (uid) => {
    setWorkspaceItems(prev => prev.filter(i => i.uid !== uid));
  };

  // Ref to store last mouse position for drawing smooth lines
  const lastPos = useRef(null);

  const gridRef = useRef(null);
  const resultRef = useRef(null);
  const canvasRef = useRef(null);

  // Initialize Canvas Grid
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set internal resolution based on Aspect Ratio
    const baseWidth = 800;
    const aspect = selections.resolution.width / selections.resolution.height;
    const baseHeight = Math.round(baseWidth / aspect);

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  }, [selections.resolution]);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResult]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      lastPos.current = null; // Reset last position
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const updateSelection = (key, value) => {
    setSelections(prev => ({ ...prev, [key]: value }));
    if (showResult) setShowResult(false);
  };

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
    const stampSize = (60 + (brushSize - 20)) * 2; // 스탬프 크기 2배로 증가

    ctx.save();
    ctx.translate(x, y);

    const scale = stampSize / 256;
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

  const handleCanvasMouseDown = (e) => {
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

  const handleCanvasMouseMove = (e) => {
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

  const handleCanvasMouseLeave = () => {
    setIsDragging(false);
    lastPos.current = null;
    setCursorPos(null); // Hide preview
  };

  // --- UPDATED ANALYSIS LOGIC FOR CANVAS ---
  const getGridDescription = () => {
    const canvas = canvasRef.current;
    if (!canvas) return "";

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    // 1. 샘플링 설정 (모든 픽셀을 다 보면 느리므로 일정 간격으로 확인)
    const sampleStep = 10;
    const totalSamples = (width / sampleStep) * (height / sampleStep);

    // 색상별 통계 데이터 저장소
    // 구조: { [hexColor]: { 픽셀수, X좌표합, Y좌표합, 최소/최대 좌표(영역) } }
    let colorStats = {};

    const hexToRgb = (hex) => {
      if (!hex) return { r: 0, g: 0, b: 0 };
      const bigint = parseInt(hex.slice(1), 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    // 팔레트 색상 RGB 캐싱
    const paletteRgb = paletteColors
      .filter(p => p.color)
      .map(p => ({ ...p, rgb: hexToRgb(p.color) }));

    const pixelData = ctx.getImageData(0, 0, width, height).data;

    // 2. 픽셀 분석 루프
    for (let y = 0; y < height; y += sampleStep) {
      for (let x = 0; x < width; x += sampleStep) {
        const index = (y * width + x) * 4;
        const a = pixelData[index + 3]; // Alpha 값

        if (a > 50) { // 투명하지 않은 픽셀이라면 (색칠된 부분)
          const r = pixelData[index];
          const g = pixelData[index + 1];
          const b = pixelData[index + 2];

          let closestColor = null;
          let minDist = Infinity;

          // 현재 픽셀이 팔레트의 어떤 색과 가장 가까운지 판별 (유클리드 거리)
          paletteRgb.forEach(p => {
            const dist = Math.sqrt(
              Math.pow(r - p.rgb.r, 2) +
              Math.pow(g - p.rgb.g, 2) +
              Math.pow(b - p.rgb.b, 2)
            );
            if (dist < 50 && dist < minDist) { // 오차 범위 50
              minDist = dist;
              closestColor = p.color;
            }
          });

          // 해당 색상의 통계 데이터 누적
          if (closestColor) {
            if (!colorStats[closestColor]) {
              colorStats[closestColor] = {
                count: 0,
                sumX: 0, sumY: 0, // 무게중심 계산용
                minX: x, maxX: x, minY: y, maxY: y // 바운딩 박스용
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
          // 3. 여백(빈 공간) 추적 로직 (__empty__ 키 사용)
          if (!colorStats['__empty__']) {
            colorStats['__empty__'] = {
              count: 0,
              sumX: 0, sumY: 0,
              minX: x, maxX: x, minY: y, maxY: y
            };
          }
          const s = colorStats['__empty__'];
          s.count++;
          s.sumX += x;
          s.sumY += y;
        }
      }
    }

    // 4. 통계 데이터를 바탕으로 자연어 설명 생성 (Advanced Relational Logic)
    let objectDescriptions = [];
    let legendNotes = [];

    // Helper: Get label for a color item
    const getLabel = (item) => {
      if (item.id === 'subject') return subjectText.trim() ? subjectText.trim() : "Main Subject";
      if (item.promptName) return item.promptName;
      return item.label;
    };

    // Helper: Check overlap between two stats
    const getOverlapRatio = (stats1, stats2) => {
      const xOverlap = Math.max(0, Math.min(stats1.maxX, stats2.maxX) - Math.max(stats1.minX, stats2.minX));
      const yOverlap = Math.max(0, Math.min(stats1.maxY, stats2.maxY) - Math.max(stats1.minY, stats2.minY));
      const intersectionArea = xOverlap * yOverlap;
      const minArea = Math.min((stats1.maxX - stats1.minX) * (stats1.maxY - stats1.minY), (stats2.maxX - stats2.minX) * (stats2.maxY - stats2.minY));
      return minArea > 0 ? intersectionArea / minArea : 0;
    };

    // Identify active objects
    const activeObjects = paletteColors.filter(item => {
      if (item.id === 'erase') return false;
      const stats = colorStats[item.color];
      if (!stats) return false;
      // Background logic remains same (just legend)
      if (item.id === 'bg') {
        legendNotes.push(`(Blue areas define Background)`);
        return false;
      }
      return true;
    }).map(item => ({ ...item, stats: colorStats[item.color] }));

    // Find Main Subject (Priority: 'subject' id > First object)
    const mainSubject = activeObjects.find(obj => obj.id === 'subject') || activeObjects[0];

    if (activeObjects.length > 0) {
      // If only one object (or just Main Subject unrelated to others logic if we strictly follow pairs)
      // We still use the sophisticated position reasoning for single objects

      activeObjects.forEach(obj => {
        // Skip iteration if we handle relationships for everything relative to Main, 
        // but let's do a Pairwise check against Main Subject for all others.

        if (obj === mainSubject) return; // Will handle Main Subject last or implicitly

        // Relationship with Main Subject
        const overlap = getOverlapRatio(obj.stats, mainSubject.stats);
        const isOverlapping = overlap > 0.1; // 10% overlap threshold

        const label = getLabel(obj);
        const mainLabel = getLabel(mainSubject);

        let relationStr = "";

        if (isOverlapping) {
          // Depth Sort using Y-axis (maxY)
          // Lower maxY (higher on screen) = Behind
          // Higher maxY (lower on screen) = Front
          if (obj.stats.maxY < mainSubject.stats.maxY) {
            relationStr = `standing behind ${mainLabel}`;
          } else {
            relationStr = `in front of ${mainLabel}`;
          }
        } else {
          // No significant overlap -> Spatial relation
          const objCenterX = obj.stats.sumX / obj.stats.count;
          const mainCenterX = mainSubject.stats.sumX / mainSubject.stats.count;

          if (objCenterX < mainCenterX) relationStr = `to the left of ${mainLabel}`;
          else relationStr = `to the right of ${mainLabel}`;
        }

        objectDescriptions.push(`${label} ${relationStr}`);
      });

      // Add Main Subject description itself (Position on screen)
      const stats = mainSubject.stats;
      const centerX = stats.sumX / stats.count;
      const centerY = stats.sumY / stats.count;
      const normX = centerX / width;
      const normY = centerY / height;

      let vPos = "middle";
      if (normY < 0.33) vPos = "top";
      else if (normY > 0.66) vPos = "bottom";

      let hPos = "center";
      if (normX < 0.33) hPos = "left";
      else if (normX > 0.66) hPos = "right";

      let positionStr = "";
      if (vPos === "middle" && hPos === "center") positionStr = "in the center";
      else if (vPos === "middle") positionStr = `on the ${hPos}`;
      else if (hPos === "center") positionStr = `at the ${vPos}`;
      else positionStr = `at the ${vPos}-${hPos}`;

      // Add size descriptor
      const coverageRatio = stats.count / totalSamples;
      let sizeStr = "";
      if (coverageRatio > 0.5) sizeStr = "huge";
      else if (coverageRatio < 0.1) sizeStr = "small";

      // If there are other objects described relative to Main, simple Main desc is enough.
      // If Main is alone, describe it fully.
      if (activeObjects.length === 1) {
        objectDescriptions.push(`${sizeStr} ${getLabel(mainSubject)} positioned ${positionStr}`);
      } else {
        // E.g. "Main Subject in the center" (Visual anchor)
        objectDescriptions.push(`${getLabel(mainSubject)} positioned ${positionStr}`);
      }
    }

    // 5. 여백(Negative Space) 설명 생성
    const emptyStats = colorStats['__empty__'];
    if (emptyStats) {
      const coverageRatio = emptyStats.count / totalSamples;

      // 여백이 30% ~ 95% 사이일 때만 유효한 여백으로 인식
      if (coverageRatio > 0.3 && coverageRatio < 0.95) {
        const centerX = emptyStats.sumX / emptyStats.count;
        const centerY = emptyStats.sumY / emptyStats.count;
        const normX = centerX / width;
        const normY = centerY / height;

        let hPos = "center";
        if (normX < 0.4) hPos = "left";
        else if (normX > 0.6) hPos = "right";

        let vPos = "middle";
        if (normY < 0.4) vPos = "top";
        else if (normY > 0.6) vPos = "bottom";

        let positionStr = "";
        // 완전히 중앙에 빈 공간이 있는 경우가 아니라면 위치 설명 추가
        if (!(vPos === "middle" && hPos === "center")) {
          if (vPos === "middle") positionStr = `on the ${hPos}`;
          else if (hPos === "center") positionStr = `at the ${vPos}`;
          else positionStr = `at the ${vPos}-${hPos}`;

          objectDescriptions.push(`Negative space positioned ${positionStr}`);
        }
      }
    }

    // 결과 반환
    if (objectDescriptions.length === 0) return "subject placed in the scene naturally";

    const fullDescription = objectDescriptions.join(", ");
    const disclaimer = legendNotes.length > 0 || objectDescriptions.length > 0
      ? ` [Visual Layout Guide: The generated image should follow this layout - ${fullDescription}.]`
      : "";

    return `${fullDescription}${disclaimer}`;
  };

  const generatePrompt = () => {
    setIsGenerating(true);
    // Use async callback for await
    setTimeout(async () => {
      try {
        const baseGridDesc = getGridDescription();

        // Include Context Text
        const textParts = [];
        if (subjectText.trim()) textParts.push(subjectText.trim());
        if (contextText.trim()) textParts.push(contextText.trim());
        const fullSubject = textParts.join(", ") || "Subject";

        // 1. Camera/Viewpoint Prefix Construction
        // Strategy: Combine Angle and Shot into a single natural phrase
        const anglePrompt = selections.angle.id !== 'none' ? selections.angle.prompt.split(',')[0].trim() : "";
        const shotPrompt = selections.shot.id !== 'none' ? selections.shot.prompt.split(',')[0].trim() : "";

        // Clean "shot" or "view" from the parts to avoid "Low angle shot close-up shot"
        const cleanAngle = anglePrompt.replace(/ shot$/i, '').replace(/ view$/i, '').trim();
        const cleanShot = shotPrompt.replace(/ shot$/i, '').replace(/ view$/i, '').trim();

        let cameraPrefix = "";

        // Handling special cases like 'Selfie' which is a shot type but acts like a whole concept
        if (selections.shot.id === 'selfie') {
          cameraPrefix = "Selfie shot of";
        } else if (cleanAngle && cleanShot) {
          cameraPrefix = `${cleanAngle} ${cleanShot} shot of`;
        } else if (cleanAngle) {
          cameraPrefix = `${cleanAngle} view of`;
        } else if (cleanShot) {
          cameraPrefix = `${cleanShot} shot of`;
        }

        // 2. Facing Direction (Subject Modifier)
        // This usually describes the subject ("looking at camera", "side profile")
        const facingModifier = selections.facing.id !== 'none' ? selections.facing.prompt : "";

        // 3. Composition (Scene Modifier)
        const compModifier = selections.composition.id !== 'none' ? selections.composition.prompt : "";

        // 4. Construct Main Prompt Segment
        // If we have a camera prefix, it goes first: "Low angle close-up shot of [Subject]"
        // If not, just "[Subject]"
        let mainSegment = cameraPrefix ? `${cameraPrefix} ${fullSubject}` : fullSubject;

        // Auto-inject Dynamic Action Keywords if the composition/angle implies movement
        // Check if user selected dynamic options
        const isDynamicAngle = ['low_angle', 'high_angle', 'dutch_angle', 'birds_eye'].includes(selections.angle.id);
        const isDynamicComp = ['diagonal', 'leading_lines'].includes(selections.composition.id);

        // If dynamic settings are chosen, append action keywords to subject description (if not already present)
        if ((isDynamicAngle || isDynamicComp) && !mainSegment.toLowerCase().includes('dynamic') && !mainSegment.toLowerCase().includes('action')) {
          mainSegment += `, dynamic pose, action shot`;
        }

        // Append Facing modifier immediately after subject for coherence
        if (facingModifier) {
          mainSegment += `, ${facingModifier}`;
        }

        const parts = [
          mainSegment,
          compModifier,
          selections.lighting?.prompt, // Add lighting prompt
          selections.style.prompt,
          baseGridDesc,
          selections.resolution?.prompt,
          selections.style.neg
        ];

        // Filter empty strings and join
        const generatedText = parts.filter(p => p && p.trim() !== '').join(', ');

        setFinalPrompt(generatedText);

        // Capture Canvas for Preview
        if (gridRef.current) {
          const canvas = await html2canvas(gridRef.current, {
            scale: 1, backgroundColor: null, logging: false
          });
          setGeneratedImage(canvas.toDataURL());
        }

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

  const handleCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setToastMsg("복사되었습니다!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
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

    setToastMsg("이미지가 다운로드됩니다.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSaveToSupabase = async () => {
    if (!finalPrompt) return; // Use finalPrompt

    try {
      setToastMsg("갤러리에 저장 중...");
      setShowToast(true);

      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            prompt_text: finalPrompt, // Use finalPrompt
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

      setToastMsg("갤러리에 저장되었습니다!");
      setTimeout(() => setShowToast(false), 2000);

    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setToastMsg("저장에 실패했습니다.");
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

      const canvas = await html2canvas(gridRef.current, {
        scale: 2, backgroundColor: null, logging: false
      });

      // 1. Copy Text to Clipboard (Prioritize Text)
      await navigator.clipboard.writeText(finalPrompt);

      // 2. Download Image (Reliable Fallback)
      const link = document.createElement('a');
      link.download = 'lazytiger_prompt_map.png';
      link.href = canvas.toDataURL();
      link.click();

      // 3. Notify and Open
      setToastMsg("텍스트 복사 & 이미지 다운로드 완료!");
      setShowToast(true);

      // Delay slightly to let user see message
      setTimeout(() => {
        const win = window.open('https://gemini.google.com/app', '_blank');
        if (win) win.focus();
        alert("💡 사용 팁:\n1. 채팅창에 텍스트를 붙여넣기(Ctrl+V) 하세요.\n2. 방금 다운로드된 이미지를 채팅창으로 드래그하세요.");
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
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-200 pb-24 select-none">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight">Lazy <span className="text-orange-500">Image Generator</span></span>
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200 overflow-hidden">
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
              내 갤러리
            </button>
            <button
              onClick={() => window.location.reload()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="초기화"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>


      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col-reverse md:flex-row overflow-hidden h-[calc(100vh-64px)]">

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* Left Panel: Asset Deck */}
          <AssetDeck disabledIds={disabledOptions} />

          {/* Right Panel: Canvas & Workspace */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 relative">

            {/* Top Area: Inputs */}
            <div className="p-6 pb-4 shrink-0 border-b border-gray-200 bg-white z-20 shadow-sm">
              <div className="flex flex-col space-y-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={subjectText}
                    onChange={(e) => setSubjectText(e.target.value)}
                    placeholder="무엇을 그리실 건가요? (예: 귀여운 호랑이)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="배경이나 상황 (예: 카페에서)"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>
            </div>

            {/* Middle Area: Workspace (Scaled to ~80% visually via padding/flex) */}
            <div className="flex-1 overflow-hidden relative flex flex-col p-4">
              {/* Wrapper to control size if needed, but flex-1 with padding works well to isolate it */}
              <div className="flex-1 border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden bg-gray-100/50">
                <Workspace items={workspaceItems} onRemove={handleRemoveItem} />
              </div>
            </div>

            {/* Bottom Area: Visual Feedback */}
            <div className="p-4 pt-0 shrink-0 border-t border-gray-200 bg-white/50 backdrop-blur-sm flex flex-col items-center pb-6">

              {/* Toolbar */}
              <div className="w-full max-w-2xl flex items-center justify-between mb-4 bg-white p-2 rounded-2xl shadow-sm border border-orange-100">
                {/* Left: Tools */}
                <div className="flex items-center space-x-2">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setToolMode('brush')}
                      className={`p-2 rounded-md transition-all ${toolMode === 'brush' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="브러시"
                    >
                      <Brush size={16} />
                    </button>
                    <button
                      onClick={() => setToolMode('stamp')}
                      className={`p-2 rounded-md transition-all ${toolMode === 'stamp' ? 'bg-white shadow text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                      title="스탬프"
                    >
                      <Stamp size={16} />
                    </button>
                  </div>

                  {/* Stamp Selector (Visible only in Stamp Mode) */}
                  {toolMode === 'stamp' && (
                    <div className="flex items-center space-x-1 pl-2 border-l border-gray-200 ml-2">
                      {STAMPS.map(stamp => (
                        <button
                          key={stamp.id}
                          onClick={() => setSelectedStamp(stamp.id)}
                          className={`p-1.5 rounded-lg transition-all ${selectedStamp === stamp.id ? 'bg-orange-100 text-orange-600 ring-2 ring-orange-200' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                          title={stamp.label}
                        >
                          <stamp.icon size={18} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-px h-6 bg-gray-200 mx-2"></div>

                  {/* Size Slider */}
                  <div className="flex items-center px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 space-x-3">
                    <span className="text-xs font-bold text-gray-400">SIZE</span>
                    <input
                      type="range"
                      min="5"
                      max="100" // Expanded range
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-400 w-4 text-center">{brushSize}</span>
                  </div>

                  <button
                    onClick={clearCanvas}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                    title="모두 지우기"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Right: Palette */}
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                    {paletteColors.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedColor(p)}
                        className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all relative
                                ${selectedColor.id === p.id ? 'ring-2 ring-orange-400 scale-110 z-10' : 'hover:scale-105 opacity-80 hover:opacity-100'}
                              `}
                        style={{ backgroundColor: p.color || '#eee' }}
                        title={p.label}
                      >
                        {p.icon && <p.icon size={14} className="text-gray-500" />}
                        {selectedColor.id === p.id && !p.icon && <Check size={14} className="text-white drop-shadow-md" />}
                      </button>
                    ))}
                  </div>

                  {/* Add Object Button */}
                  {paletteColors.length - INITIAL_PALETTE.length < EXTRA_COLORS.length && (
                    <button
                      onClick={handleAddObject}
                      className="w-8 h-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-300 transition-colors bg-white"
                      title="새로운 개체 추가"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Visual Preview */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 flex flex-col items-center relative group-preview">

                {/* Grid Container */}
                <div
                  ref={gridRef}
                  className={`
                            relative rounded-xl overflow-hidden p-0 select-none
                            ${toolMode === 'brush' ? 'cursor-crosshair' : 'cursor-pointer'}
                        `}
                  style={{
                    aspectRatio: `${selections.resolution.width} / ${selections.resolution.height}`,
                    height: '240px',
                    width: 'auto',
                    backgroundColor: '#ffffff',
                    borderColor: '#e5e7eb',
                    borderWidth: '1px',
                    boxShadow: '0 0 0 4px #f3f4f6',
                    color: '#000000',
                  }}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
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
                  />

                  {/* Visual Cursor Overlay */}
                  {cursorPos && (
                    <div
                      className="pointer-events-none absolute border border-gray-400 rounded-full flex items-center justify-center transition-transform duration-75 z-50"
                      style={{
                        left: 0,
                        top: 0,
                        // Dimensions: Divide by scale to maintain correct visual size on screen
                        width: (toolMode === 'stamp' ? ((60 + (brushSize - 20)) * 2) : brushSize) / (cursorPos.scale || 1),
                        height: (toolMode === 'stamp' ? ((60 + (brushSize - 20)) * 2) : brushSize) / (cursorPos.scale || 1),
                        // Position: Use CSS pixel coordinates directly
                        // Center offset: Half of the DISPLAY size
                        transform: `translate(${cursorPos.x - ((toolMode === 'stamp' ? ((60 + (brushSize - 20)) * 2) : brushSize) / (cursorPos.scale || 1)) / 2}px, 
                                            ${cursorPos.y - ((toolMode === 'stamp' ? ((60 + (brushSize - 20)) * 2) : brushSize) / (cursorPos.scale || 1)) / 2}px)`,
                        backgroundColor: toolMode === 'brush' ? selectedColor.color : 'transparent',
                        borderColor: toolMode === 'brush' ? 'rgba(0,0,0,0.2)' : 'rgba(251, 146, 60, 0.5)',
                        opacity: 0.8
                      }}
                    >
                      {toolMode === 'stamp' && selectedStamp && (
                        <PixelArtIcon
                          type="stamp"
                          name={selectedStamp}
                          className="w-full h-full opacity-50"
                          style={{ fill: selectedColor.color }}
                        />
                      )}
                    </div>
                  )}

                  {/* 3. Composition Guides (Overlay) - z-20 puts it on top, pointer-events-none lets clicks pass to canvas */}
                  <div className="absolute inset-0 z-20 pointer-events-none">
                    <CompositionGuides type={selections.composition.id} />
                  </div>
                </div>

                {/* Generate Button (Floating) */}
                <button
                  onClick={generatePrompt}
                  disabled={isGenerating}
                  className={`
                          absolute -bottom-5 left-1/2 transform -translate-x-1/2 
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
                  {isGenerating ? '생성 중...' : '프롬프트 생성'}
                </button>
              </div>
            </div>



            {/* Result Overlay (If shown) */}
            {showResult && (
              <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-slide-up">
                  <div className="bg-gray-900 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold flex items-center"><Check className="mr-2 text-green-400" /> 생성 완료</h3>
                    <button onClick={() => setShowResult(false)} className="p-1 hover:bg-gray-800 rounded-full"><X size={20} /></button>
                  </div>

                  <div className="p-6">
                    {/* Generated Image Preview */}
                    {generatedImage && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex justify-center relative group">
                        <img src={generatedImage} alt="Generated Map" className="max-h-48 object-contain" />
                        <div className="absolute top-2 right-2 flex space-x-2">
                          <button onClick={handleCopyMapImage} className="p-2 bg-white/90 rounded-lg hover:text-blue-600 shadow-sm"><Brush size={14} /></button>
                          <button onClick={handleDownloadMapImage} className="p-2 bg-white/90 rounded-lg hover:text-green-600 shadow-sm"><Download size={14} /></button>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-100 p-4 rounded-xl text-sm font-mono text-gray-800 break-words mb-4">
                      {finalPrompt}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleOpenGemini} className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl flex items-center justify-center hover:opacity-90">
                        <Sparkles size={16} className="mr-2" /> AI로 보내기
                      </button>
                      <button onClick={handleSaveToSupabase} className="flex-1 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl flex items-center justify-center hover:bg-orange-200">
                        <Save size={16} className="mr-2" /> 저장
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Drag Overlay (Ghost) */}
          <DragOverlay dropAnimation={null}>
            {activeDragItem ? (
              <div className="w-24 h-24 bg-white rounded-xl shadow-2xl border-2 border-orange-500 flex flex-col items-center justify-center rotate-3 cursor-grabbing opacity-90 z-50 transition-transform">
                <div className="w-10 h-10 mb-1 rounded-lg bg-orange-50 flex items-center justify-center">
                  <PixelArtIcon type={activeDragItem.type} name={activeDragItem.item.id} className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-gray-800 truncate px-2">{activeDragItem.item.label}</span>
              </div>
            ) : null}
          </DragOverlay>

        </DndContext>
      </main>

      <Toast message={toastMsg} show={showToast} />

      {showGallery && (
        <Gallery
          onClose={() => setShowGallery(false)}
          onLoad={handleLoadPrompt}
        />
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
    </div>
  );
}
