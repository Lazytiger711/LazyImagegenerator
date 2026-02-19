import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { arrayMove } from '@dnd-kit/sortable';
import {
    INITIAL_PALETTE,
    RESOLUTIONS,
    STAMPS,
    EXTRA_COLORS,
    CONFLICTS
} from '../data/constants';

export function useAppSelections({ trackEvent }) {
    const { t } = useTranslation();

    // --- 1. Selection State ---
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

    // --- 2. Tool & Canvas State ---
    const [toolMode, setToolMode] = useState('brush');
    const [brushSize, setBrushSize] = useState(20);
    const [selectedStamp, setSelectedStamp] = useState(STAMPS[0].id);
    const [showGrid, setShowGrid] = useState(true);

    // --- 3. Palette State ---
    const [paletteColors, setPaletteColors] = useState(INITIAL_PALETTE);
    const [selectedColor, setSelectedColor] = useState(INITIAL_PALETTE[0]);

    // --- 4. Helpers ---

    // Helper to get 'None' item for a type
    const getNoneItem = useCallback((type) => {
        switch (type) {
            case 'shot': return { id: 'none', label: 'common.none', variantId: null };
            case 'angle': return { id: 'none', label: 'common.none', variantId: null };
            case 'composition': return { id: 'none', label: 'common.none', variantId: null };
            case 'lighting': return { id: 'none', label: 'common.none', variantId: null };
            case 'style': return { id: 'none', label: 'common.none', variantId: null };
            case 'facing': return { id: 'none', label: 'common.none', variantId: null };
            case 'meme': return { id: 'none', label: 'common.none' };
            default: return { id: 'none', label: 'common.none' }; // safe fallback instead of null
        }
    }, []);

    // Compute Disabled Options based on Conflicts
    const { disabledOptions, lockedCategories } = useMemo(() => {
        const disabled = new Set();
        const locked = new Set();

        Object.values(selections).forEach(sel => {
            if (!sel || !sel.id) return;

            // Check for conflict mappings
            const conflicts = CONFLICTS[sel.id];
            if (conflicts) {
                conflicts.forEach(conflictId => {
                    disabled.add(conflictId);
                    // Assuming conflictId might represent a category lock, but constant structure is just ID array.
                    // If we want to lock categories, we need a map of ID -> Category.
                    // For now, let's stick to disabling specific IDs.
                });
            }
        });

        return {
            disabledOptions: Array.from(disabled),
            lockedCategories: Array.from(locked) // Placeholder if we implement category locking later
        };
    }, [selections]);

    // Handle Click Selection (Alternative to Drag & Drop) with Toggle
    const handleAssetClick = useCallback((item, type, variantId = null) => {
        // Check if disabled
        if (disabledOptions.includes(item.id)) {
            console.warn("Item is disabled due to conflict");
            return;
        }

        // Track asset selection
        if (trackEvent) {
            trackEvent('asset_selected', {
                asset_type: type,
                asset_id: item.id,
                variant_id: variantId || 'none'
            });
        }

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
    }, [trackEvent, getNoneItem, disabledOptions]);


    // Computed Workspace Items from Selections for Display
    const workspaceItems = [
        { ...selections.shot, type: 'shot', uid: 'shot-item' },
        { ...selections.angle, type: 'angle', uid: 'angle-item' },
        { ...selections.composition, type: 'composition', uid: 'composition-item' },
        { ...selections.style, type: 'style', uid: 'style-item' },
        { ...selections.lighting, type: 'lighting', uid: 'lighting-item' },
        { ...selections.facing, type: 'facing', uid: 'facing-item' },
        { ...selections.resolution, type: 'resolution', uid: 'resolution-item' },
    ].filter(item => item && (item.id !== 'none'));

    // Handle removal of an item from workspace — use type directly from workspaceItems snapshot
    const handleRemoveItem = useCallback((uid) => {
        // Find the type of the item to remove
        const itemToRemove = workspaceItems.find(i => i.uid === uid || i.id === uid);
        if (!itemToRemove || !itemToRemove.type) return; // guard: type must exist

        // Reset that specific selection to None
        const type = itemToRemove.type;
        const noneItem = getNoneItem(type);
        setSelections(prev => ({
            ...prev,
            [type]: noneItem
        }));
    }, [workspaceItems, getNoneItem]);

    // Clear all selections at once
    const handleClearAll = useCallback(() => {
        setSelections(prev => ({
            ...prev,
            shot: { id: 'none', label: 'common.none', variantId: null },
            angle: { id: 'none', label: 'common.none', variantId: null },
            facing: { id: 'none', label: 'common.none', variantId: null },
            composition: { id: 'none', label: 'common.none', variantId: null },
            style: { id: 'none', label: 'common.none', variantId: null },
            lighting: { id: 'none', label: 'common.none', variantId: null },
            meme: { id: 'none', label: 'common.none' },
        }));
    }, []);

    // Handle palette color reordering via drag-and-drop
    const handlePaletteDragEnd = useCallback((event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPaletteColors((colors) => {
                const oldIndex = colors.findIndex((c) => c.id === active.id);
                const newIndex = colors.findIndex((c) => c.id === over.id);
                return arrayMove(colors, oldIndex, newIndex);
            });
        }
    }, []);

    const handleAddObject = useCallback(() => {
        const currentExtraCount = paletteColors.length - INITIAL_PALETTE.length;
        if (currentExtraCount < EXTRA_COLORS.length) {
            const nextColor = EXTRA_COLORS[currentExtraCount];
            const newPalette = [...paletteColors];
            newPalette.splice(newPalette.length - 1, 0, { ...nextColor, id: `obj_${currentExtraCount}` });
            setPaletteColors(newPalette);
            setSelectedColor(newPalette[newPalette.length - 2]);
        }
    }, [paletteColors]);

    return {
        selections,
        setSelections,
        toolMode,
        setToolMode,
        brushSize,
        setBrushSize,
        selectedStamp,
        setSelectedStamp,
        showGrid,
        setShowGrid,
        paletteColors,
        setPaletteColors,
        selectedColor,
        setSelectedColor,
        handleAssetClick,
        handleRemoveItem,
        handleClearAll,
        handlePaletteDragEnd,
        handleAddObject,
        getNoneItem,
        workspaceItems,
        disabledOptions,
        lockedCategories
    };
}

