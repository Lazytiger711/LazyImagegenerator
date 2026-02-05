import { Ban, Eye, MoveVertical, Camera, Film, Box, Paintbrush, Pencil, Zap, Monitor, Instagram, Smartphone, Eraser, Grid, User, Home, Smile } from 'lucide-react';

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

    {
        id: 'facing_front',
        label: '정면',
        sub: 'Front',
        description: '카메라를 정면으로 응시',
        prompt: 'body facing camera straight on, head facing forward directly at viewer, frontal full-body stance, symmetrical shoulders squared to camera, direct eye contact, centered composition, forward-facing posture',
        icon: '/icons/facing/front.png'
    },
    {
        id: 'facing_front_3_4_left',
        label: '정면 반측면 (좌)',
        sub: 'Front 3/4 L',
        description: '살짝 왼쪽을 보는 각도',
        prompt: 'body angled 45 degrees left, head and face turned slightly towards left, three-quarter frontal view, left shoulder slightly forward, partial left side visible, gazing left of camera, subtle left rotation',
        icon: '/icons/facing/front-3-4-left.png'
    },
    {
        id: 'facing_front_3_4_right',
        label: '정면 반측면 (우)',
        sub: 'Front 3/4 R',
        description: '살짝 오른쪽을 보는 각도',
        prompt: 'body angled 45 degrees right, head and face turned slightly towards right, three-quarter frontal view, right shoulder slightly forward, partial right side visible, gazing right of camera, subtle right rotation',
        icon: '/icons/facing/front-3-4-right.png'
    },
    {
        id: 'facing_left',
        label: '측면 (좌)',
        sub: 'Profile L',
        description: '완전히 왼쪽을 보는 옆모습',
        prompt: 'full body profile facing left, head turned 90 degrees left showing left side of face only, complete side view, left shoulder forward, right side of body hidden, pure profile stance, perpendicular to camera, side silhouette',
        icon: '/icons/facing/profile-left.png'
    },
    {
        id: 'facing_right',
        label: '측면 (우)',
        sub: 'Profile R',
        description: '완전히 오른쪽을 보는 옆모습',
        prompt: 'full body profile facing right, head turned 90 degrees right showing right side of face only, complete side view, right shoulder forward, left side of body hidden, pure profile stance, perpendicular to camera, side silhouette',
        icon: '/icons/facing/profile-right.png'
    },
    {
        id: 'facing_back_3_4_left',
        label: '후면 반측면 (좌)',
        sub: 'Back 3/4 L',
        description: '등을 지고 왼쪽으로 고개 돌림',
        prompt: 'body facing away from camera, back visible, head turned left looking over left shoulder, three-quarter rear view, left side of face partially visible, glancing back towards left, back shoulder stance, rear angle with left head turn',
        icon: '/icons/facing/back-3-4-left.png'
    },
    {
        id: 'facing_back_3_4_right',
        label: '후면 반측면 (우)',
        sub: 'Back 3/4 R',
        description: '등을 지고 오른쪽으로 고개 돌림',
        prompt: 'body facing away from camera, back visible, head turned right looking over right shoulder, three-quarter rear view, right side of face partially visible, glancing back towards right, back shoulder stance, rear angle with right head turn',
        icon: '/icons/facing/back-3-4-right.png'
    },
    {
        id: 'facing_back',
        label: '뒷모습',
        sub: 'Back',
        description: '완전히 등을 돌린 모습',
        prompt: 'full body facing away from camera completely, back of head and body visible, no face visible, rear view, looking away, back turned to viewer, posterior stance, complete rear angle, from behind',
        icon: '/icons/facing/back.png'
    },
];

export const ANGLES = [


    {
        id: 'eye_level', label: '아이 레벨', sub: 'Eye Level', description: '가장 자연스러운 눈높이', prompt: 'eye level shot, straight-on view, neutral perspective, face to face interaction, standard camera height', icon: MoveVertical
    },
    {
        id: 'low_angle', label: '로우 앵글', sub: 'Low Angle', description: '아래에서 위로, 웅장함', prompt: 'low angle shot, looking up from below, imposing presence, dramatic perspective, majestic, powerful stance', icon: MoveVertical,
        variants: [
            { id: 'standard', label: '기본 (Standard)', prompt: '' },
            { id: 'extreme_low', label: '극단적 (Extreme)', prompt: 'extreme low angle, worm\'s eye view, ground level shot' },
            { id: 'slight_low', label: '약간 (Slight)', prompt: 'slightly low angle, subtle upward tilt' }
        ]
    },
    {
        id: 'high_angle', label: '하이 앵글', sub: 'High Angle', description: '위에서 아래로, 귀여움/왜소함', prompt: 'high angle shot, looking down from above, diminishing perspective, subject appears smaller, cute animation angle', icon: MoveVertical,
        variants: [
            { id: 'standard', label: '기본 (Standard)', prompt: '' },
            { id: 'birds_eye', label: '버드 아이 (Bird\'s Eye)', prompt: 'bird\'s eye view, aerial photography, drone shot, wide overview from sky, vast scale' },
            { id: 'extreme_high', label: '극단적 (Extreme)', prompt: 'extreme high angle, directly looking down, 90 degree angle' }
        ]
    },
    {
        id: 'top_down', label: '탑다운 뷰', sub: 'Top Down', description: '90도 수직, 제품/음식 (Flat Lay)', prompt: 'top-down view, 90 degree angle, flat lay, map view, satellite view, directly from above, graphic composition', icon: MoveVertical
    },
    {
        id: 'isometric', label: '아이소메트릭', sub: 'Isometric', description: '게임/인포그래픽 스타일 (45도)', prompt: 'isometric view, 45 degree angle, axonometric perspective, game art style, technical illustration, no perspective distortion, even proportions', icon: MoveVertical
    },
    {
        id: 'dutch_angle', label: '더치 앵글', sub: 'Dutch Angle', description: '기울어진 화면, 긴박감/불안', prompt: 'dutch angle, tilted camera, canted angle, diagonal horizon, dynamic energy, cinematic tension, dramatic tilt', icon: MoveVertical
    }
];

export const SHOT_TYPES = [

    {
        id: 'close_up', label: '클로즈업', sub: 'Close Up', description: '얼굴이나 사물 집중', prompt: 'close-up shot, focus on face, detailed eyes, intense expression, portrait photography, clear facial features', icon: Camera,
        variants: [
            { id: 'standard', label: '기본 (Standard)', prompt: '' },
            { id: 'extreme_cu', label: '익스트림 (Extreme CU)', prompt: 'extreme close-up shot, macro photography, highly detailed texture, focus on specific details' },
            { id: 'tight_cu', label: '타이트 (Tight)', prompt: 'tight close-up, face filling the frame' }
        ]
    },
    {
        id: 'bust_shot', label: '바스트 샷', sub: 'Bust Shot', description: '가슴 윗부분, 인물 표준', prompt: 'bust shot, portrait, focus on upper body, character portrait, head and shoulders', icon: Camera
    },
    {
        id: 'medium_shot', label: '미디엄 샷', sub: 'Medium Shot', description: '상반신과 동작', prompt: 'medium shot, waist up, upper body and gestures, mid-shot, standard portrait', icon: Camera
    },
    {
        id: 'full_shot', label: '풀 샷', sub: 'Full Shot', description: '전신과 배경 약간', prompt: 'full body shot, wide shot, viewing entire character, head to toe, standing pose, visible shoes', icon: Camera,
        variants: [
            { id: 'standard', label: '기본 (Standard)', prompt: '' },
            { id: 'wide', label: '와이드 (Wide)', prompt: 'wide angle full shot, broad view, environmental context' },
            { id: 'long_shot', label: '롱 샷 (Long Shot)', prompt: 'long shot, subject small in frame, vast background, distance' }
        ]
    },
    {
        id: 'selfie', label: '셀피', sub: 'Selfie', description: '직접 찍은 듯한 구도', prompt: 'selfie angle, point of view (POV), holding camera, phone camera effect, fisheye lens, candid, close to camera', icon: Camera
    },
    {
        id: 'over_the_shoulder', label: '오버 더 숄더', sub: 'OTS', description: '어깨 너머 시점', prompt: 'over-the-shoulder shot, view from behind subject, cinematic dialogue angle, foreground shoulder blurred', icon: Camera
    },
    {
        id: 'first_person', label: '1인칭 시점', sub: 'POV', description: '주인공의 눈으로 본 세상', prompt: 'first-person view, POV, seeing through eyes, immersive perspective, hands visible in frame', icon: Eye
    },
];

export const COMPOSITIONS = [

    { id: 'rule_of_thirds', label: '3분할 법칙', sub: 'Rule of Thirds', description: '안정적인 기본 구도', prompt: 'rule of thirds, cinematic composition, balanced framing, subject placed at intersection points, professional photography', icon: Grid },
    { id: 'center', label: '중앙 구도', sub: 'Center', description: '피사체에 강력한 집중', prompt: 'perfectly centered, symmetrical composition, central framing, focused impact, accidental wes anderson style', icon: Grid },
    { id: 'diagonal', label: '대각선 구도', sub: 'Diagonal', description: '역동적인 움직임', prompt: 'diagonal composition, dynamic lines, movement, energy flow, diagonal leading lines', icon: Grid },
    { id: 'golden_ratio', label: '황금비', sub: 'Golden Ratio', description: '가장 아름다운 비율', prompt: 'golden ratio composition, fibonacci spiral, aesthetically pleasing balance, artistic layout, perfect proportions', icon: Grid },
    { id: 'framing', label: '프레이밍', sub: 'Framing', description: '배경 요소를 활용한 액자식 구성', prompt: 'frame within a frame, depth of field, looking through foreground objects (window, door, trees), layered composition', icon: Grid },
    { id: 'leading_lines', label: '리딩 라인', sub: 'Leading Lines', description: '시선을 피사체로 유도하는 선', prompt: 'strong leading lines, depth perspective, vanishing point, eyes drawn to subject, road or corridor perspective', icon: Grid },
    { id: 'negative_space', label: '여백의 미', sub: 'Negative Space', description: '여백을 강조한 감성적 구도', prompt: 'negative space, minimalism, vast background, isolation, artistic void, clean composition, simple background', icon: Grid },
];

export const STYLES = [


    { id: 'realistic', label: '실사/사진', sub: 'Photorealistic', prompt: 'photorealistic, raw photo, 8k uhd, dslr, high quality, fujifilm, grainy texture, masterpiece', neg: '--no pixel art, illustration, cartoon, drawing, painting', icon: Camera },
    { id: 'anime', label: '애니메이션', sub: 'Anime', prompt: 'anime style, key visual, vibrant colors, studio ghibli inspired, high definition, detailed line art, 2d animation', neg: '--no photorealistic, 3d render, live action', icon: Film },
    { id: '3d_render', label: '3D 렌더링', sub: '3D 렌더링', prompt: '3d render, octane render, unreal engine 5, ray tracing, clay material, high fidelity, 8k, blender style', neg: '--no 2d, sketch, flat, cartoon, low poly', icon: Box },
    { id: 'oil_painting', label: '반 고흐', sub: 'Van Gogh', prompt: 'vincent van gogh style, post-impressionist, swirling brushstrokes, impasto texture, vibrant colors, starry night inspired, thick oil paint, emotional expression', neg: '--no photo, digital art, pixel art, smooth', icon: Paintbrush },
    { id: 'concept_art', label: '컨셉 아트', sub: 'Concept Art', description: '디지털 페인팅, 게임/영화 컨셉', prompt: 'digital concept art, speed painting, fantasy atmosphere, matte painting, highly detailed, sharp focus', neg: '--no photo, low quality, sketch', icon: Pencil },
    { id: 'cyberpunk', label: '사이버펑크', sub: 'Cyberpunk', description: '네온, 미래지향적, 하이테크', prompt: 'cyberpunk style, futuristic city, chromatic aberration, synthwave aesthetic, night time, glowing details', neg: '--no vintage, rustic, natural', icon: Zap },
];

export const LIGHTING = [

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

export const MEME_TEMPLATES = [

    {
        id: 'distracted_boyfriend', label: '딴청 피우는 남친', sub: 'Distracted BF', description: '지나가던 여자 보는 남자와 화난 여친', prompt: 'distracted boyfriend meme, stock photo aesthetic, man walking with girlfriend looking back at another woman in red dress, girlfriend looking at him with disgusted expression, 3 people scene, high quality, realistic photography', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'woman_yelling_cat', label: '고양이에게 소리치는 여자', sub: 'Yelling Woman', description: '우는 여자와 식탁 위 고양이', prompt: 'woman yelling at cat meme, split screen composition, left side: crying woman pointing finger being held back by friend, right side: confused white cat sitting at dinner table with salad, realistic TV show screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'disaster_girl', label: '재앙의 소녀', sub: 'Disaster Girl', description: '불타는 집 앞에서 미소 짓는 소녀', prompt: 'disaster girl meme, little girl with devilish smile looking at camera in foreground, house fire with firefighters blurred in background, high contrast, focus on girl\'s face, chaotic background, realistic photography', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front' }
    },
    {
        id: 'this_is_fine', label: '이건 괜찮아 (강아지)', sub: 'This is Fine', description: '불타는 방 안에 앉은 강아지', prompt: 'this is fine meme, 2 panel comic strip style, cartoon dog in hat sitting at table with coffee mug, room engulfed in flames, "this is fine" text bubble vibe, flat illustration style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'success_kid', label: '성공한 아기', sub: 'Success Kid', description: '주먹을 꽉 쥔 결의에 찬 아기', prompt: 'success kid meme, toddler boy in green and white shirt clenching fist with determined expression, sandy beach background, victory pose, high quality photo, famous internet baby', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'drake_hotline', label: '드레이크 (좋아/싫어)', sub: 'Drake', description: '거절하는 모습과 좋아하는 모습', prompt: 'drake hotline bling meme, 2 panel split screen, top panel: drake looking disgusted and turning away with hand up, bottom panel: drake smiling and pointing finger, orange background, music video screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'two_buttons', label: '두 개의 버튼', sub: 'Two Buttons', description: '땀 흘리며 고민하는 우주비행사/사람', prompt: 'daily struggle meme, two buttons meme, nervous spaceman/superhero sweating heavily looking at two red buttons, difficult choice dilemma, comic book style illustration, close up on face and buttons', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'high_angle', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'change_my_mind', label: '내 마음을 바꿔봐', sub: 'Change My Mind', description: '테이블에 앉아 커피 마시는 남자', prompt: 'change my mind meme, man sitting at folding table in outdoor park, white sign with text space, holding coffee mug, "change my mind" banner style, sunlight, realistic photography', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_right' }
    },
    {
        id: 'grumpy_cat', label: '심술난 고양이', sub: 'Grumpy Cat', description: '언짢은 표정의 고양이', prompt: 'grumpy cat meme, snowshoe cat with extremely annoyed facial expression, close up portrait, cynical vibe, realistic photography, internet famous cat', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'doge', label: '도지 (시바견)', sub: 'Doge', description: '곁눈질하는 시바견', prompt: 'doge meme, shiba inu dog looking at camera with side eye and raised eyebrows, funny dog face, soft lighting, photography style, famous internet dog', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'roll_safe', label: '머리를 쓰는 흑인', sub: 'Roll Safe', description: '관자놀이를 검지로 가리키는 남자', prompt: 'roll safe meme, man in leather jacket tapping his temple with index finger, knowing smile, smart idea gesture, dark blue background, documentary screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'mocking_spongebob', label: '놀리는 스폰지밥', sub: 'Mocking Sponge', description: '이상한 자세의 스폰지밥', prompt: 'mocking spongebob meme, spongebob squarepants acting like a chicken, distorted pose, mocking gesture, rainbow background blur, cartoon screenshot', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'futurama_fry', label: '의심하는 프라이', sub: 'Suspicious Fry', description: '눈을 가늘게 뜨고 의심하는 표정', prompt: 'futurama fry meme, fry character squinting eyes in suspicion, close up face, "not sure if" expression, cartoon style, flat colors', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'one_does_not_simply', label: '그렇게 쉽게 되는 게 아냐', sub: 'Boromir', description: '손가락으로 원을 만드는 보로미르', prompt: 'one does not simply walk into mordor meme, boromir from lord of the rings making zero gesture with hand, serious lecture expression, fantasy movie screencap', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'ancient_aliens', label: '외계인 전문가', sub: 'Aliens Guy', description: '양손을 벌리고 열변을 토하는 남자', prompt: 'ancient aliens guy meme, giorgio tsoukalos with messy hair holding hands up explaining, history channel interview style, blue background', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'batman_slapping', label: '배트맨 따귀', sub: 'Batman Slaps', description: '로빈의 뺨을 때리는 배트맨', prompt: 'batman slapping robin meme, comic book panel style, batman slapping robin in the face, speech bubble space, action lines, "SLAP" sound effect visual, retro comic style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_right' }
    },
    {
        id: 'hide_the_pain', label: '고통을 숨기는 해롤드', sub: 'Harold', description: '억지 미소를 짓는 할아버지', prompt: 'hide the pain harold meme, gray haired old man smiling while looking in pain, holding coffee cup, laptop in front, bright office lighting, stock photo style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'is_this_a_pigeon', label: '이게 비둘기인가?', sub: 'Is This Pigeon', description: '나비를 가리키는 남자', prompt: 'is this a pigeon meme, anime character pointing at a yellow butterfly, holding open book, meadow background, 90s anime style screencap', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_right' }
    },
    {
        id: 'surprised_pikachu', label: '놀란 피카츄', sub: 'Surprised Pika', description: '입을 벌리고 멍하니 있는 피카츄', prompt: 'surprised pikachu meme, pikachu with open mouth jaw drop, pixelated or blurred background, shocked expression, pokemon anime screencap', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'spider_man_pointing', label: '서로 가리키는 스파이더맨', sub: 'Spideys Pointing', description: '서로를 가리키는 스파이더맨들', prompt: 'spider-man pointing at spider-man meme, two spidermen pointing fingers at each other, standoff, identical costumes, police truck in background, 60s cartoon style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'tuxedo_pooh', label: '턱시도 푸', sub: 'Fancy Pooh', description: '격식 있는 곰돌이 푸', prompt: 'tuxedo winnie the pooh meme, bear wearing fancy tuxedo and monocle, looking sophisticated, "a man of culture" expression, cartoon style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'galaxy_brain', label: '우주 뇌', sub: 'Galaxy Brain', description: '빛나는 우주 뇌', prompt: 'galaxy brain meme, human head silhouette with glowing galaxy inside, enlightenment, cosmic awareness, digital art style, blue and purple glow', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'waiting_skeleton', label: '기다리는 해골', sub: 'Waiting Skeleton', description: '벤치에 앉아 기다리다 해골이 됨', prompt: 'waiting skeleton meme, skeleton sitting on park bench, waiting for a long time, overgrown grass, cobwebs, funny sad vibe, realistic photography style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'sad_keanu', label: '슬픈 키아누', sub: 'Sad Keanu', description: '벤치에 혼자 앉아 샌드위치 먹는 남자', prompt: 'sad keanu reeves meme, keanu reeves sitting alone on park bench eating sandwich, looking down, depressed vibe, pigeon nearby, paparazzi photo style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'high_angle', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'confused_math_lady', label: '혼란스러운 수학 여자', sub: 'Math Lady', description: '수학 공식이 떠다니며 고민하는 여자', prompt: 'confused math lady meme, blonde woman looking confused with geometry formulas and numbers overlay, calculating faces, complex thinking, brazilian soap opera screencap', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'pepe_frog', label: '슬픈 개구리 (페페)', sub: 'Sad Frog', description: '슬픈 표정의 개구리', prompt: 'sad frog pepe meme, green anthropomorphic frog with sad expression, looking down, feels bad man vibe, rough drawing style, internet meme', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'leonardo_toast', label: '레오의 건배', sub: 'Leo Toast', description: '잔을 들어올리며 웃는 디카프리오', prompt: 'leonardo dicaprio laughing meme, great gatsby movie scene, man in tuxedo holding wine glass, smug smiling face, fireworks in background, party atmosphere', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'bernie_mittens', label: '버니의 장갑', sub: 'Bernie Mittens', description: '패딩 입고 의자에 앉은 버니 샌더스', prompt: 'bernie sanders mittens meme, old man wearing parka and patterned mittens sitting on folding chair, crossed arms and legs, face mask, inauguration day vibe, press photo style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'spongebob_imma_head_out', label: '전 나갈게요 (스폰지밥)', sub: 'Imma Head Out', description: '의자에서 일어나는 스폰지밥', prompt: 'spongebob imma head out meme, spongebob getting up from red armchair, holding remote, tired expression, motion blur, cartoon screencap', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'gta_wasted', label: 'WASTED (GTA)', sub: 'Wasted', description: '흑백 화면에 WASTED 자막', prompt: 'gta wasted screen meme, grayscale overlay, "WASTED" text in center style, camera on ground perspective, game over vibe, fisheye lens slant', icon: Smile,
        presets: { shot: 'none', angle: 'top_down', composition: 'center', facing: 'facing_front' } // Removed birds_eye shot, as it's now an angle variant or just top_down angle is enough
    },
];



// Define incompatible options to prevent prompt wars
// Key: The selected option ID
// Value: Array of option IDs that should be disabled when Key is selected
export const CONFLICTS = {
    // Shot Selection Conflicts
    // Shot Selection Conflicts
    'close_up': ['long_shot'], // Simplify: Close up conflicts with Long Shot
    'selfie': ['back_view', 'facing_back', 'facing_back_3_4_left', 'facing_back_3_4_right'],

    // Angle Selection Conflicts
    // High Angle (includes birds_eye) conflicts with Close Up generally? Maybe not.
    // Let's keep it simple.
    'top_down': ['extreme_close_up', 'close_up', 'bust_shot', 'selfie'],

    // Composition Conflicts
    'negative_space': ['extreme_close_up'],

    // Facing Conflicts
    'facing_back': ['selfie'],
    'facing_back_3_4_left': ['selfie'],
    'facing_back_3_4_right': ['selfie']
};
