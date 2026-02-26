import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Grid, Camera, Video, Palette, User, Monitor, Zap, Smile } from 'lucide-react';
import CategorySection from './CategorySection';

import {
    SHOT_TYPES,
    ANGLES,
    STYLES,
    COMPOSITIONS,
    FACING_DIRECTIONS,
    RESOLUTIONS,
    LIGHTING,
    MEME_TEMPLATES
} from '../data/constants';

export default function AssetDeck({ disabledIds = [], onAssetClick, lockedCategories = [], currentSelections = {}, className = "" }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false); // Default collapsed on mobile

    const [openSections, setOpenSections] = useState({
        shot: true,
        angle: true,
        composition: false,
        style: false,
        facing: false,
        resolution: false,
        lighting: false,
        meme: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => {
            // Close all others, toggle current (Accordion)
            const newState = {
                shot: false, angle: false, composition: false,
                style: false, facing: false, resolution: false, lighting: false, meme: false
            };
            if (!prev[section]) {
                newState[section] = true;
            }
            return newState;
        });
    };

    const handleAssetClickWrapper = (item, type, variantId) => {
        if (onAssetClick) onAssetClick(item, type, variantId);
    };

    // ... (skip down to return) ...

    return (
        <>
            {/* Mobile Overlay Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <div
                className={`
                    fixed bottom-[60px] left-0 right-0 z-[60] 
                    md:relative md:top-auto md:left-auto md:right-auto md:bottom-auto md:z-10 md:order-none
                    w-full md:w-80 bg-white md:border-r border-t md:border-t-0 border-gray-200 
                    shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-lg selection-section 
                    md:transform-none flex flex-col
                    md:h-full
                    ${isMobileOpen ? 'h-[60vh]' : 'h-14'}
                    ${className}
                `}
            >
                <style>{`
                    .mask-linear-fade {
                        mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                        -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                    }
                    /* Hide Scrollbar */
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;  /* Firefox */
                    }
                `}</style>

                {/* Header (Always Visible) */}
                <div
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-4 border-b-4 border-black bg-[#FF6B00] flex items-center justify-between cursor-pointer md:cursor-default h-14 shrink-0"
                >
                    <div className="flex items-center">
                        <div>
                            <h2 className="font-black text-lg text-black flex items-center">
                                <Grid size={20} className="mr-2 text-black" />
                                소품 상자
                            </h2>
                            <p className={`text-xs text-gray-500 mt-1 ${!isMobileOpen ? 'hidden md:block' : ''}`}>
                                스튜디오로 아이템을 드래그하세요
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">


                        <div className="md:hidden bg-white p-1 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                            {isMobileOpen ? <ChevronDown size={20} className="text-black" /> : <ChevronUp size={20} className="text-black" />}
                        </div>
                    </div>
                </div>

                {/* Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-white">



                    <CategorySection
                        title="sections.resolution"
                        icon={Monitor}
                        items={RESOLUTIONS}
                        type="resolution"
                        description="sections.resolution_desc"
                        isOpen={openSections.resolution}
                        onToggle={() => toggleSection('resolution')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('resolution')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.style"
                        icon={Palette}
                        items={STYLES}
                        type="style"
                        description="sections.style_desc"
                        isOpen={openSections.style}
                        onToggle={() => toggleSection('style')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('style')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.shot"
                        icon={Camera}
                        items={SHOT_TYPES}
                        type="shot"
                        description="sections.shot_desc"
                        isOpen={openSections.shot}
                        onToggle={() => toggleSection('shot')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('shot')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.angle"
                        icon={Video}
                        items={ANGLES}
                        type="angle"
                        description="sections.angle_desc"
                        isOpen={openSections.angle}
                        onToggle={() => toggleSection('angle')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('angle')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.facing"
                        icon={User}
                        items={FACING_DIRECTIONS}
                        type="facing"
                        description="sections.facing_desc"
                        isOpen={openSections.facing}
                        onToggle={() => toggleSection('facing')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('facing')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.composition"
                        icon={Grid}
                        items={COMPOSITIONS}
                        type="composition"
                        description="sections.composition_desc"
                        isOpen={openSections.composition}
                        onToggle={() => toggleSection('composition')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('composition')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.lighting"
                        icon={Zap}
                        items={LIGHTING}
                        type="lighting"
                        description="sections.lighting_desc"
                        isOpen={openSections.lighting}
                        onToggle={() => toggleSection('lighting')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('lighting')}
                        currentSelections={currentSelections}
                    />

                    <CategorySection
                        title="sections.meme"
                        icon={Smile}
                        items={MEME_TEMPLATES}
                        type="meme"
                        description="sections.meme_desc"
                        isOpen={openSections.meme}
                        onToggle={() => toggleSection('meme')}
                        disabledIds={disabledIds}
                        onAssetClick={handleAssetClickWrapper}
                        locked={lockedCategories.includes('meme')}
                        currentSelections={currentSelections}
                    />

                    {/* Padding at bottom for safe area */}
                    <div className="h-20 md:h-10"></div>
                </div>
            </div>
        </>
    );
}
