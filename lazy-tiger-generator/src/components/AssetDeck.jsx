import React, { useState, useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ChevronDown, ChevronRight, ChevronLeft, Grid, Layout, Camera, Video, Palette, User, Monitor, Zap } from 'lucide-react';
import PixelArtIcon from './PixelArtIcon';
import {
    SHOT_TYPES,
    ANGLES,
    STYLES,
    COMPOSITIONS,
    FACING_DIRECTIONS,
    RESOLUTIONS,
    LIGHTING
} from '../data/constants';

// Draggable Icon Card (Updated for Dial/Card Look)
const DraggableAsset = ({ item, type, disabled, onClick }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `asset-${type}-${item.id}`,
        data: { item, type, source: 'deck' },
        disabled: disabled // Disable drag if disabled
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={{
                ...style,
                aspectRatio: '8.6 / 5.4'
            }}
            {...listeners}
            {...attributes}
            onClick={() => !disabled && onClick && onClick(item, type)} // Add Click Handler
            // Increased size to w-60 (240px) to show ~1 card at a time
            className={`flex-shrink-0 w-60 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all select-none relative overflow-hidden
                ${disabled
                    ? 'opacity-40 grayscale cursor-not-allowed border-gray-100'
                    : 'hover:shadow-md cursor-grab active:cursor-grabbing hover:border-orange-300 group snap-center active:scale-95'
                }`}
        >
            <div className="w-16 h-16 mb-2 rounded-md flex items-center justify-center transition-colors z-10">
                <PixelArtIcon
                    type={type}
                    name={item.id}
                    className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                />
            </div>
            <span className="text-sm font-bold text-gray-700 text-center leading-tight line-clamp-1 z-10 w-full px-1">
                {item.label}
            </span>

            {/* Background decoration for 'Card' feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 -z-0"></div>
        </div>
    );
};

const CategorySection = ({ title, icon: Icon, items, type, isOpen, onToggle, description, disabledIds, onItemClick }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 252; // Card width (240) + Gap (12)
            current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
            >
                <div className="flex flex-col items-start overflow-hidden">
                    <div className="flex items-center text-gray-700 font-bold text-xs uppercase tracking-wider">
                        <Icon size={14} className="mr-2 text-orange-500" />
                        {title}
                    </div>
                    {/* Brief Description */}
                    <span className="text-[10px] text-gray-400 font-medium ml-6 mt-0.5 truncate max-w-[200px] group-hover:text-gray-500 transition-colors">
                        {/* If description is passed, use it. Otherwise rely on a mapping or default */}
                        {description}
                    </span>
                </div>
                {isOpen ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
            </button>

            {isOpen && (
                <div className="relative group/section">
                    {/* Left Scroll Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); scroll('left'); }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-800/80 text-white flex items-center justify-center rounded-r-lg opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0"
                        title="Scroll Left"
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {/* Horizontal Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-3 p-3 pt-0 pb-2 no-scrollbar snap-x snap-mandatory mask-linear-fade scroll-smooth"
                    >
                        {/* Padding spacer for start */}
                        <div className="w-1 shrink-0"></div>
                        {items.map((item) => (
                            <DraggableAsset
                                key={item.id}
                                item={item}
                                type={type}
                                disabled={disabledIds?.includes(item.id)}
                                onClick={onItemClick}
                            />
                        ))}
                        {/* Padding spacer for end */}
                        <div className="w-1 shrink-0"></div>
                    </div>

                    {/* Right Scroll Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); scroll('right'); }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 bg-gray-800/80 text-white flex items-center justify-center rounded-l-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                        title="Scroll Right"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AssetDeck({ disabledIds = [], onItemClick }) {
    const [openSections, setOpenSections] = useState({
        shot: true,
        angle: true,
        composition: false,
        style: false,
        facing: false,
        resolution: false,
        lighting: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="w-full md:w-80 h-[35vh] md:h-full bg-white md:border-r border-t md:border-t-0 border-gray-200 flex flex-col shadow-lg z-10 selection-section order-first md:order-none">
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
            <div className="p-4 border-b border-gray-200 bg-orange-50/50">
                <h2 className="font-black text-lg text-gray-800 flex items-center">
                    <Grid size={20} className="mr-2 text-orange-600" />
                    Asset Deck
                </h2>
                <p className="text-xs text-gray-500 mt-1">Drag items to the workspace</p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                <CategorySection
                    title="Resolution"
                    icon={Monitor}
                    items={RESOLUTIONS.filter(i => i.id !== 'none')}
                    type="resolution"
                    isOpen={openSections.resolution}
                    onToggle={() => toggleSection('resolution')}
                    description="이미지 크기와 비율 설정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Facing Direction"
                    icon={User}
                    items={FACING_DIRECTIONS.filter(i => i.id !== 'none')}
                    type="facing"
                    isOpen={openSections.facing}
                    onToggle={() => toggleSection('facing')}
                    description="인물이 바라보는 방향 결정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Art Style"
                    icon={Palette}
                    items={STYLES.filter(i => i.id !== 'none')}
                    type="style"
                    isOpen={openSections.style}
                    onToggle={() => toggleSection('style')}
                    description="전체적인 화풍과 톤 결정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Lighting"
                    icon={Zap}
                    items={LIGHTING.filter(i => i.id !== 'none')}
                    type="lighting"
                    isOpen={openSections.lighting}
                    onToggle={() => toggleSection('lighting')}
                    description="빛의 종류와 분위기 설정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Shot Type"
                    icon={Camera}
                    items={SHOT_TYPES.filter(i => i.id !== 'none')}
                    type="shot"
                    isOpen={openSections.shot}
                    onToggle={() => toggleSection('shot')}
                    description="피사체와의 거리 설정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Angle"
                    icon={Video}
                    items={ANGLES.filter(i => i.id !== 'none')}
                    type="angle"
                    isOpen={openSections.angle}
                    onToggle={() => toggleSection('angle')}
                    description="카메라의 높낮이와 각도 설정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
                <CategorySection
                    title="Composition"
                    icon={Layout}
                    items={COMPOSITIONS.filter(i => i.id !== 'none')}
                    type="composition"
                    isOpen={openSections.composition}
                    onToggle={() => toggleSection('composition')}
                    description="화면 내 피사체의 배치 결정"
                    disabledIds={disabledIds}
                    onItemClick={onItemClick}
                />
            </div>
        </div>
    );
}
