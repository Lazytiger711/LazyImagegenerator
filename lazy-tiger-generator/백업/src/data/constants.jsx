import { Ban, Eye, MoveVertical, Camera, Film, Box, Paintbrush, Pencil, Zap, Monitor, Instagram, Smartphone, Eraser, Grid, User, Home } from 'lucide-react';

export const STAMPS = [
    {
        id: 'face',
        label: '얼굴',
        path: "M128 36 C80 36 48 80 48 128 C48 180 80 220 128 220 C176 220 208 180 208 128 C208 80 176 36 128 36 Z", // Simplified head
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><circle cx="12" cy="12" r="8" /></svg>
    },
    {
        id: 'bust',
        label: '어깨라인',
        path: "M80 220 C80 180 176 180 176 220 L176 256 L80 256 Z M128 60 C100 60 80 90 80 130 C80 170 100 190 128 190 C156 190 176 170 176 130 C176 90 156 60 128 60",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M4 20c0-4 4-7 8-7s8 3 8 7v1H4v-1z" /><circle cx="12" cy="8" r="4" /></svg>
    },
    {
        id: 'upper_body',
        label: '상체',
        path: "M128 40 C105 40 85 65 85 95 C85 125 105 140 128 140 C151 140 171 125 171 95 C171 65 151 40 128 40 Z M70 145 C70 145 186 145 186 145 C186 145 180 256 180 256 L76 256 C76 256 70 145 70 145 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
    },
    {
        id: 'full_body',
        label: '전신',
        path: "M128 20 C115 20 105 32 105 48 C105 64 115 76 128 76 C141 76 151 64 151 48 C151 32 141 20 128 20 Z M100 80 L156 80 L150 150 L160 250 L135 250 L128 160 L121 250 L96 250 L106 150 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><circle cx="12" cy="4" r="2" /><path d="M12 7c-2.7 0-5.8 1.3-6 2.2l-1 5.8h2l1-5h8l1 5h2l-1-5.8c-.2-.9-3.3-2.2-6-2.2z" /><path d="M11 14h2v8h-2z" /></svg>
    },
    {
        id: 'tree',
        label: '나무',
        path: "M128 20 C100 20 80 40 80 70 C60 70 40 90 40 120 C40 150 60 170 90 170 L110 170 L110 250 L146 250 L146 170 L166 170 C196 170 216 150 216 120 C216 90 196 70 176 70 C176 40 156 20 128 20 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M12 2L2 12h3v8h14v-8h3L12 2z" /></svg>
    },
    {
        id: 'car',
        label: '자동차',
        path: "M40 120 L70 80 L180 80 L220 120 L240 120 L240 180 L220 180 C220 200 200 200 200 180 L80 180 C80 200 60 200 60 180 L20 180 L20 120 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
    },
    {
        id: 'person_full_simple',
        label: '사람(전신)',
        // Simple standing silhouette: Circle head + Rounded Rect body + Legs
        path: "M128 30 C111 30 98 43 98 60 C98 77 111 90 128 90 C145 90 158 77 158 60 C158 43 145 30 128 30 Z M90 100 C80 100 70 110 70 120 L70 180 C70 190 80 190 80 180 L80 120 L110 120 L110 240 C110 250 120 250 120 240 L120 160 L136 160 L136 240 C136 250 146 250 146 240 L146 120 L176 120 L176 180 C176 190 186 190 186 180 L186 120 C186 110 176 100 166 100 Z",
        icon: User
    },
    {
        id: 'person_half_simple',
        label: '사람(반신)',
        // Simple upper body: Circle Head + Rounded Bust
        path: "M128 40 C106 40 88 58 88 80 C88 102 106 120 128 120 C150 120 168 102 168 80 C168 58 150 40 128 40 Z M60 140 C50 140 40 150 40 170 L40 250 L216 250 L216 170 C216 150 206 140 196 140 Z",
        icon: (props) => <User {...props} className="w-5 h-5 fill-current" />
    },
    {
        id: 'house_simple',
        label: '집',
        // Simple House: Triangle Roof + Box Body
        path: "M128 20 L20 100 L40 100 L40 240 L216 240 L216 100 L236 100 Z",
        icon: Home
    }
];

export const FACING_DIRECTIONS = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '시선/방향을 설정하지 않습니다', prompt: '', icon: Ban },
    { id: 'facing_front', label: '정면', sub: 'Front', description: '카메라를 정면으로 응시', prompt: 'looking at camera, facing viewer, eye contact, front view', icon: Eye },
    { id: 'facing_front_3_4_left', label: '정면 반측면 (좌)', sub: 'Front 3/4 L', description: '살짝 왼쪽을 보는 각도', prompt: 'three-quarter view facing left, looking slightly left, partial side profile', icon: Eye },
    { id: 'facing_front_3_4_right', label: '정면 반측면 (우)', sub: 'Front 3/4 R', description: '살짝 오른쪽을 보는 각도', prompt: 'three-quarter view facing right, looking slightly right, partial side profile', icon: Eye },
    { id: 'facing_left', label: '측면 (좌)', sub: 'Profile L', description: '완전히 왼쪽을 보는 옆모습', prompt: 'side profile facing left, profile view, side angle', icon: Eye },
    { id: 'facing_right', label: '측면 (우)', sub: 'Profile R', description: '완전히 오른쪽을 보는 옆모습', prompt: 'side profile facing right, profile view, side angle', icon: Eye },
    { id: 'facing_back_3_4_left', label: '후면 반측면 (좌)', sub: 'Back 3/4 L', description: '등을 지고 왼쪽으로 고개 돌림', prompt: 'view from behind, head turned left, over the shoulder glance, back 3/4 view', icon: Eye },
    { id: 'facing_back_3_4_right', label: '후면 반측면 (우)', sub: 'Back 3/4 R', description: '등을 지고 오른쪽으로 고개 돌림', prompt: 'view from behind, head turned right, over the shoulder glance, back 3/4 view', icon: Eye },
    { id: 'facing_back', label: '뒷모습', sub: 'Back', description: '완전히 등을 돌린 모습', prompt: 'view from behind, back turned to camera, back view, from rear', icon: Eye },
];

export const ANGLES = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '앵글을 설정하지 않습니다', prompt: '', icon: Ban },
    { id: 'eye_level', label: '아이 레벨', sub: 'Eye Level', description: '가장 자연스러운 눈높이', prompt: 'eye level shot, straight-on view, neutral perspective, face to face interaction, standard camera height', icon: MoveVertical },
    { id: 'low_angle', label: '로우 앵글', sub: 'Low Angle', description: '아래에서 위로, 웅장함', prompt: 'low angle shot, looking up from below, worm\'s eye view, imposing presence, dramatic perspective, majestic, powerful stance', icon: MoveVertical },
    { id: 'high_angle', label: '하이 앵글', sub: 'High Angle', description: '위에서 아래로, 귀여움/왜소함', prompt: 'high angle shot, looking down from above, diminishing perspective, subject appears smaller, cute animation angle', icon: MoveVertical },
    { id: 'top_down', label: '탑다운 뷰', sub: 'Top Down', description: '90도 수직, 제품/음식 (Flat Lay)', prompt: 'top-down view, 90 degree angle, flat lay, map view, satellite view, directly from above, graphic composition', icon: MoveVertical },
    { id: 'birds_eye', label: '버드 아이', sub: 'Bird\'s Eye', description: '하늘에서 본 광활한 시점 (Aerial)', prompt: 'bird\'s eye view, aerial photography, drone shot, wide overview from sky, vast scale, map-like perspective, city looking down', icon: MoveVertical },
    { id: 'dutch_angle', label: '더치 앵글', sub: 'Dutch Angle', description: '기울어진 화면, 긴박감/불안', prompt: 'dutch angle, tilted camera, canted angle, diagonal horizon, dynamic energy, cinematic tension, dramatic tilt', icon: MoveVertical },
];

export const SHOT_TYPES = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '샷 종류를 설정하지 않습니다', prompt: '', icon: Ban },
    { id: 'extreme_close_up', label: '익스트림 클로즈업', sub: 'Extreme CU', description: '눈, 입술 등 초근접', prompt: 'extreme close-up shot, macro photography, highly detailed texture, focus on specific details, intense focus', icon: Camera },
    { id: 'close_up', label: '클로즈업', sub: 'Close Up', description: '얼굴이나 사물 집중', prompt: 'close-up shot, focus on face, detailed eyes, intense expression, portrait photography, clear facial features', icon: Camera },
    { id: 'bust_shot', label: '바스트 샷', sub: 'Bust Shot', description: '가슴 윗부분, 인물 표준', prompt: 'bust shot, portrait, focus on upper body, character portrait, head and shoulders', icon: Camera },
    { id: 'medium_shot', label: '미디엄 샷', sub: 'Medium Shot', description: '상반신과 동작', prompt: 'medium shot, waist up, upper body and gestures, mid-shot, standard portrait', icon: Camera },
    { id: 'full_shot', label: '풀 샷', sub: 'Full Shot', description: '전신과 배경 약간', prompt: 'full body shot, wide shot, viewing entire character, head to toe, standing pose, visible shoes', icon: Camera },
    { id: 'long_shot', label: '롱 샷', sub: 'Long Shot', description: '배경 속 작은 피사체', prompt: 'wide angle long shot, full body visible, small figure in distance, vast background, environmental shot', icon: Camera },
    { id: 'selfie', label: '셀피', sub: 'Selfie', description: '직접 찍은 듯한 구도', prompt: 'selfie angle, point of view (POV), holding camera, phone camera effect, fisheye lens, candid, close to camera', icon: Camera },
    { id: 'over_the_shoulder', label: '오버 더 숄더', sub: 'OTS', description: '어깨 너머 시점', prompt: 'over-the-shoulder shot, view from behind subject, cinematic dialogue angle, foreground shoulder blurred', icon: Camera },
];

export const COMPOSITIONS = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '구도를 설정하지 않습니다', prompt: '', icon: Ban },
    { id: 'rule_of_thirds', label: '3분할 법칙', sub: 'Rule of Thirds', description: '안정적인 기본 구도', prompt: 'rule of thirds, cinematic composition, balanced framing, subject placed at intersection points, professional photography', icon: Grid },
    { id: 'center', label: '중앙 구도', sub: 'Center', description: '피사체에 강력한 집중', prompt: 'perfectly centered, symmetrical composition, central framing, focused impact, accidental wes anderson style', icon: Grid },
    { id: 'diagonal', label: '대각선 구도', sub: 'Diagonal', description: '역동적인 움직임', prompt: 'diagonal composition, dynamic lines, movement, energy flow, diagonal leading lines', icon: Grid },
    { id: 'golden_ratio', label: '황금비', sub: 'Golden Ratio', description: '가장 아름다운 비율', prompt: 'golden ratio composition, fibonacci spiral, aesthetically pleasing balance, artistic layout, perfect proportions', icon: Grid },
    { id: 'framing', label: '프레이밍', sub: 'Framing', description: '배경 요소를 활용한 액자식 구성', prompt: 'frame within a frame, depth of field, looking through foreground objects (window, door, trees), layered composition', icon: Grid },
    { id: 'leading_lines', label: '리딩 라인', sub: 'Leading Lines', description: '시선을 피사체로 유도하는 선', prompt: 'strong leading lines, depth perspective, vanishing point, eyes drawn to subject, road or corridor perspective', icon: Grid },
    { id: 'negative_space', label: '여백의 미', sub: 'Negative Space', description: '여백을 강조한 감성적 구도', prompt: 'negative space, minimalism, vast background, isolation, artistic void, clean composition, simple background', icon: Grid },
];

export const STYLES = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '스타일을 설정하지 않습니다', prompt: '', neg: '', icon: Ban },
    { id: 'realistic', label: '실사/사진', sub: 'Photorealistic', prompt: 'photorealistic, raw photo, 8k uhd, dslr, soft lighting, high quality, fujifilm, grainy texture, masterpiece', neg: '--no pixel art, illustration, cartoon, drawing, painting', icon: Camera },
    { id: 'anime', label: '애니메이션', sub: 'Anime', prompt: 'anime style, key visual, vibrant colors, studio ghibli inspired, high definition, detailed line art, 2d animation', neg: '--no photorealistic, 3d render, live action', icon: Film },
    { id: '3d_render', label: '3D 렌더링', sub: '3D 렌더링', prompt: '3d render, octane render, unreal engine 5, ray tracing, clay material, soft shading, high fidelity, 8k, blender style', neg: '--no 2d, sketch, flat, cartoon, low poly', icon: Box },
    { id: 'oil_painting', label: '유화', sub: 'Oil Painting', prompt: 'oil painting, impasto, textured canvas, palette knife strokes, classical art style, van gogh style, thick paint', neg: '--no photo, digital art, pixel art, smooth', icon: Paintbrush },
    { id: 'concept_art', label: '컨셉 아트', sub: 'Concept Art', description: '디지털 페인팅, 게임/영화 컨셉', prompt: 'digital concept art, speed painting, fantasy atmosphere, cinematic lighting, matte painting, highly detailed, sharp focus', neg: '--no photo, low quality, sketch', icon: Pencil },
    { id: 'cyberpunk', label: '사이버펑크', sub: 'Cyberpunk', description: '네온, 미래지향적, 하이테크', prompt: 'cyberpunk style, neon lights, futuristic city, chromatic aberration, synthwave aesthetic, night time, glowing details', neg: '--no vintage, rustic, natural', icon: Zap },
];

export const LIGHTING = [
    { id: 'none', label: '선택 안 함', sub: 'None', description: '조명을 설정하지 않습니다', prompt: '', icon: Ban },
    { id: 'natural', label: '자연광', sub: 'Natural', description: '부드러운 햇살', prompt: 'natural lighting, sunlight, soft shadows, golden hour, warm tone, outdoor lighting', icon: Zap },
    { id: 'studio', label: '스튜디오', sub: 'Studio', description: '전문적인 조명', prompt: 'studio lighting, softbox, rim light, professional lighting, clean background, sharp details', icon: Zap },
    { id: 'neon', label: '네온', sub: 'Neon', description: '화려한 네온 사인', prompt: 'neon lighting, cyberpunk lighting, vibrant colors, glowing lights, night atmosphere, synthwave', icon: Zap },
    { id: 'dramatic', label: '드라마틱', sub: 'Dramatic', description: '강한 명암 대비', prompt: 'dramatic lighting, chiaroscuro, high contrast, heavy shadows, cinematic lighting, moody atmosphere', icon: Zap },
    { id: 'cinematic', label: '시네마틱', sub: 'Cinematic', description: '영화 같은 분위기', prompt: 'cinematic lighting, teal and orange, anamorphic lens flares, atmospheric, volumatric lighting, movie scene', icon: Zap },
    { id: 'rembrandt', label: '렘브란트', sub: 'Rembrandt', description: '고전적인 인물 조명', prompt: 'rembrandt lighting, triangle of light on cheek, classical portrait lighting, artistic shadows', icon: Zap },
];

export const RESOLUTIONS = [
    {
        id: '16:9', label: '유튜브/가로', sub: '16:9', width: 16, height: 9,
        prompt: '--ar 16:9', icon: Monitor,
        grids: { cols: 16, rows: 9 } // Simple grid config
    },
    {
        id: '1:1', label: '인스타/프로필', sub: '1:1', width: 1, height: 1,
        prompt: '--ar 1:1', icon: Instagram,
        grids: { cols: 12, rows: 12 }
    },
    {
        id: '9:16', label: '쇼츠/릴스', sub: '9:16', width: 9, height: 16,
        prompt: '--ar 9:16', icon: Smartphone,
        grids: { cols: 9, rows: 16 }
    },
];

export const PALETTE_COLORS = [
    { id: 'subject', color: '#f97316', label: '주 피사체', sub: 'Main' }, // Orange
    { id: 'subject_2', color: '#3b82f6', label: '피사체 2', sub: 'Sub 2' }, // Blue (Changed from BG)
    { id: 'sub_subject', color: '#9333ea', label: '보조 피사체', sub: 'Sub' }, // Purple
    { id: 'prop', color: '#22c55e', label: '소품', sub: 'Prop' }, // Green
    { id: 'erase', color: null, label: '지우개', sub: 'Erase', icon: Eraser },
];

export const INITIAL_PALETTE = [
    { id: 'subject', color: '#f97316', label: '주 피사체', sub: 'Main', promptName: 'Main Subject' },
    { id: 'subject_2', color: '#3b82f6', label: '피사체 2', sub: 'Sub 2', promptName: 'Secondary Subject' },
    { id: 'erase', color: null, label: '지우개', sub: 'Erase', icon: Eraser },
];

export const EXTRA_COLORS = [
    { color: '#9333ea', label: '개체 A', sub: 'Obj A', promptName: 'Object A' }, // Purple
    { color: '#22c55e', label: '개체 B', sub: 'Obj B', promptName: 'Object B' }, // Green
    { color: '#ef4444', label: '개체 C', sub: 'Obj C', promptName: 'Object C' }, // Red
    { color: '#eab308', label: '개체 D', sub: 'Obj D', promptName: 'Object D' }, // Yellow
    { color: '#06b6d4', label: '개체 E', sub: 'Obj E', promptName: 'Object E' }, // Cyan
    { color: '#ec4899', label: '개체 F', sub: 'Obj F', promptName: 'Object F' }, // Pink
];
