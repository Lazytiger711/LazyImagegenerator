import { Ban, Eye, MoveVertical, Camera, Film, Box, Paintbrush, Pencil, Zap, Monitor, Instagram, Smartphone, Eraser, Grid, User, Home, Smile, Star } from 'lucide-react';

export const STAMPS = [
    {
        id: 'face',
        label: 'stamps.face.label',
        path: "M128 36 C80 36 48 80 48 128 C48 180 80 220 128 220 C176 220 208 180 208 128 C208 80 176 36 128 36 Z", // Simplified head
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><circle cx="12" cy="12" r="8" /></svg>
    },
    {
        id: 'bust',
        label: 'stamps.bust.label',
        path: "M80 220 C80 180 176 180 176 220 L176 256 L80 256 Z M128 60 C100 60 80 90 80 130 C80 170 100 190 128 190 C156 190 176 170 176 130 C176 90 156 60 128 60",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M4 20c0-4 4-7 8-7s8 3 8 7v1H4v-1z" /><circle cx="12" cy="8" r="4" /></svg>
    },
    {
        id: 'upper_body',
        label: 'stamps.upper_body.label',
        path: "M128 40 C105 40 85 65 85 95 C85 125 105 140 128 140 C151 140 171 125 171 95 C171 65 151 40 128 40 Z M70 145 C70 145 186 145 186 145 C186 145 180 256 180 256 L76 256 C76 256 70 145 70 145 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
    },
    {
        id: 'full_body',
        label: 'stamps.full_body.label',
        path: "M128 20 C115 20 105 32 105 48 C105 64 115 76 128 76 C141 76 151 64 151 48 C151 32 141 20 128 20 Z M100 80 L156 80 L150 150 L160 250 L135 250 L128 160 L121 250 L96 250 L106 150 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><circle cx="12" cy="4" r="2" /><path d="M12 7c-2.7 0-5.8 1.3-6 2.2l-1 5.8h2l1-5h8l1 5h2l-1-5.8c-.2-.9-3.3-2.2-6-2.2z" /><path d="M11 14h2v8h-2z" /></svg>
    },
    {
        id: 'tree',
        label: 'stamps.tree.label',
        path: "M128 20 C100 20 80 40 80 70 C60 70 40 90 40 120 C40 150 60 170 90 170 L110 170 L110 250 L146 250 L146 170 L166 170 C196 170 216 150 216 120 C216 90 196 70 176 70 C176 40 156 20 128 20 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M12 2L2 12h3v8h14v-8h3L12 2z" /></svg>
    },
    {
        id: 'car',
        label: 'stamps.car.label',
        path: "M40 120 L70 80 L180 80 L220 120 L240 120 L240 180 L220 180 C220 200 200 200 200 180 L80 180 C80 200 60 200 60 180 L20 180 L20 120 Z",
        icon: (props) => <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" /></svg>
    },
    {
        id: 'person_full_simple',
        label: 'stamps.person_full_simple.label',
        // Simple standing silhouette: Circle head + Rounded Rect body + Legs
        path: "M128 30 C111 30 98 43 98 60 C98 77 111 90 128 90 C145 90 158 77 158 60 C158 43 145 30 128 30 Z M90 100 C80 100 70 110 70 120 L70 180 C70 190 80 190 80 180 L80 120 L110 120 L110 240 C110 250 120 250 120 240 L120 160 L136 160 L136 240 C136 250 146 250 146 240 L146 120 L176 120 L176 180 C176 190 186 190 186 180 L186 120 C186 110 176 100 166 100 Z",
        icon: User
    },
    {
        id: 'person_half_simple',
        label: 'stamps.person_half_simple.label',
        // Simple upper body: Circle Head + Rounded Bust
        path: "M128 40 C106 40 88 58 88 80 C88 102 106 120 128 120 C150 120 168 102 168 80 C168 58 150 40 128 40 Z M60 140 C50 140 40 150 40 170 L40 250 L216 250 L216 170 C216 150 206 140 196 140 Z",
        icon: (props) => <User {...props} className="w-5 h-5 fill-current" />
    },
    {
        id: 'house_simple',
        label: 'stamps.house_simple.label',
        // Simple House: Triangle Roof + Box Body
        path: "M128 20 L20 100 L40 100 L40 240 L216 240 L216 100 L236 100 Z",
        icon: Home
    }
];

export const FACING_DIRECTIONS = [

    {
        id: 'facing_front',
        label: 'facing.facing_front.label',
        sub: 'Front',
        description: 'facing.facing_front.desc',
        prompt: 'body facing camera straight on, head facing forward directly at viewer, frontal full-body stance, symmetrical shoulders squared to camera, direct eye contact, centered composition, forward-facing posture',
        icon: '/icons/facing/front.png'
    },
    {
        id: 'facing_front_3_4_left',
        label: 'facing.facing_front_3_4_left.label',
        sub: 'Front 3/4 L',
        description: 'facing.facing_front_3_4_left.desc',
        prompt: 'body angled 45 degrees left, head and face turned slightly towards left, three-quarter frontal view, left shoulder slightly forward, partial left side visible, gazing left of camera, subtle left rotation',
        icon: '/icons/facing/front-3-4-left.png'
    },
    {
        id: 'facing_front_3_4_right',
        label: 'facing.facing_front_3_4_right.label',
        sub: 'Front 3/4 R',
        description: 'facing.facing_front_3_4_right.desc',
        prompt: 'body angled 45 degrees right, head and face turned slightly towards right, three-quarter frontal view, right shoulder slightly forward, partial right side visible, gazing right of camera, subtle right rotation',
        icon: '/icons/facing/front-3-4-right.png'
    },
    {
        id: 'facing_left',
        label: 'facing.facing_left.label',
        sub: 'Profile L',
        description: 'facing.facing_left.desc',
        prompt: 'full body profile facing left, head turned 90 degrees left showing left side of face only, complete side view, left shoulder forward, right side of body hidden, pure profile stance, perpendicular to camera, side silhouette',
        icon: '/icons/facing/profile-left.png'
    },
    {
        id: 'facing_right',
        label: 'facing.facing_right.label',
        sub: 'Profile R',
        description: 'facing.facing_right.desc',
        prompt: 'full body profile facing right, head turned 90 degrees right showing right side of face only, complete side view, right shoulder forward, left side of body hidden, pure profile stance, perpendicular to camera, side silhouette',
        icon: '/icons/facing/profile-right.png'
    },
    {
        id: 'facing_back_3_4_left',
        label: 'facing.facing_back_3_4_left.label',
        sub: 'Back 3/4 L',
        description: 'facing.facing_back_3_4_left.desc',
        prompt: 'body facing away from camera, back visible, head turned left looking over left shoulder, three-quarter rear view, left side of face partially visible, glancing back towards left, back shoulder stance, rear angle with left head turn',
        icon: '/icons/facing/back-3-4-left.png'
    },
    {
        id: 'facing_back_3_4_right',
        label: 'facing.facing_back_3_4_right.label',
        sub: 'Back 3/4 R',
        description: 'facing.facing_back_3_4_right.desc',
        prompt: 'body facing away from camera, back visible, head turned right looking over right shoulder, three-quarter rear view, right side of face partially visible, glancing back towards right, back shoulder stance, rear angle with right head turn',
        icon: '/icons/facing/back-3-4-right.png'
    },
    {
        id: 'facing_back',
        label: 'facing.facing_back.label',
        sub: 'Back',
        description: 'facing.facing_back.desc',
        prompt: 'full body facing away from camera completely, back of head and body visible, no face visible, rear view, looking away, back turned to viewer, posterior stance, complete rear angle, from behind',
        icon: '/icons/facing/back.png'
    },
];

export const ANGLES = [


    {
        id: 'eye_level', label: 'angles.eye_level.label', sub: 'Eye Level', description: 'angles.eye_level.desc', prompt: 'eye level shot, straight-on view, neutral perspective, face to face interaction, standard camera height', icon: MoveVertical
    },
    {
        id: 'low_angle', label: 'angles.low_angle.label', sub: 'Low Angle', description: 'angles.low_angle.desc', prompt: 'low angle shot, looking up from below, imposing presence, dramatic perspective, majestic, powerful stance', icon: MoveVertical,
        variants: [
            { id: 'standard', label: 'variants.standard', prompt: '' },
            { id: 'extreme_low', label: 'variants.extreme_low', prompt: 'extreme low angle, worm\'s eye view, ground level shot' },
            { id: 'slight_low', label: 'variants.slight_low', prompt: 'slightly low angle, subtle upward tilt' }
        ]
    },
    {
        id: 'high_angle', label: 'angles.high_angle.label', sub: 'High Angle', description: 'angles.high_angle.desc', prompt: 'high angle shot, looking down from above, diminishing perspective, subject appears smaller, cute animation angle', icon: MoveVertical,
        variants: [
            { id: 'standard', label: 'variants.standard', prompt: '' },
            { id: 'birds_eye', label: 'variants.birds_eye', prompt: 'bird\'s eye view, aerial photography, drone shot, wide overview from sky, vast scale' },
            { id: 'extreme_high', label: 'variants.extreme_high', prompt: 'extreme high angle, directly looking down, 90 degree angle' }
        ]
    },
    {
        id: 'top_down', label: 'angles.top_down.label', sub: 'Top Down', description: 'angles.top_down.desc', prompt: 'top-down view, 90 degree angle, flat lay, map view, satellite view, directly from above, graphic composition', icon: MoveVertical
    },
    {
        id: 'isometric', label: 'angles.isometric.label', sub: 'Isometric', description: 'angles.isometric.desc', prompt: 'isometric view, 45 degree angle, axonometric perspective, game art style, technical illustration, no perspective distortion, even proportions', icon: MoveVertical
    },
    {
        id: 'dutch_angle', label: 'angles.dutch_angle.label', sub: 'Dutch Angle', description: 'angles.dutch_angle.desc', prompt: 'dutch angle, tilted camera, canted angle, diagonal horizon, dynamic energy, cinematic tension, dramatic tilt', icon: MoveVertical
    }
];

export const SHOT_TYPES = [

    {
        id: 'close_up', label: 'shots.close_up.label', sub: 'Close Up', description: 'shots.close_up.desc', prompt: 'close-up shot, focus on face, detailed eyes, intense expression, portrait photography, clear facial features', icon: Camera,
        variants: [
            { id: 'standard', label: 'variants.standard', prompt: '' },
            { id: 'extreme_cu', label: 'variants.extreme_cu', prompt: 'extreme close-up shot, macro photography, highly detailed texture, focus on specific details' },
            { id: 'tight_cu', label: 'variants.tight_cu', prompt: 'tight close-up, face filling the frame' }
        ]
    },
    {
        id: 'bust_shot', label: 'shots.bust_shot.label', sub: 'Bust Shot', description: 'shots.bust_shot.desc', prompt: 'bust shot, portrait, focus on upper body, character portrait, head and shoulders', icon: Camera
    },
    {
        id: 'medium_shot', label: 'shots.medium_shot.label', sub: 'Medium Shot', description: 'shots.medium_shot.desc', prompt: 'medium shot, waist up, upper body and gestures, mid-shot, standard portrait', icon: Camera
    },
    {
        id: 'full_shot', label: 'shots.full_shot.label', sub: 'Full Shot', description: 'shots.full_shot.desc', prompt: 'full body shot, wide shot, viewing entire character, head to toe, standing pose, visible shoes', icon: Camera,
        variants: [
            { id: 'standard', label: 'variants.standard', prompt: '' },
            { id: 'wide', label: 'variants.wide', prompt: 'wide angle full shot, broad view, environmental context' },
            { id: 'long_shot', label: 'variants.long_shot', prompt: 'long shot, subject small in frame, vast background, distance' }
        ]
    },
    {
        id: 'selfie', label: 'shots.selfie.label', sub: 'Selfie', description: 'shots.selfie.desc', prompt: 'selfie angle, point of view (POV), holding camera, phone camera effect, fisheye lens, candid, close to camera', icon: Camera
    },
    {
        id: 'over_the_shoulder', label: 'shots.over_the_shoulder.label', sub: 'OTS', description: 'shots.over_the_shoulder.desc', prompt: 'over-the-shoulder shot, view from behind subject, cinematic dialogue angle, foreground shoulder blurred', icon: Camera
    },
    {
        id: 'first_person', label: 'shots.first_person.label', sub: 'POV', description: 'shots.first_person.desc', prompt: 'first-person view, POV, seeing through eyes, immersive perspective, hands visible in frame', icon: Eye
    },
];

export const COMPOSITIONS = [

    { id: 'rule_of_thirds', label: 'compositions.rule_of_thirds.label', sub: 'Rule of Thirds', description: 'compositions.rule_of_thirds.desc', prompt: 'rule of thirds, cinematic composition, balanced framing, subject placed at intersection points, professional photography', icon: Grid },
    { id: 'center', label: 'compositions.center.label', sub: 'Center', description: 'compositions.center.desc', prompt: 'perfectly centered, symmetrical composition, central framing, focused impact, accidental wes anderson style', icon: Grid },
    { id: 'diagonal', label: 'compositions.diagonal.label', sub: 'Diagonal', description: 'compositions.diagonal.desc', prompt: 'diagonal composition, dynamic lines, movement, energy flow, diagonal leading lines', icon: Grid },
    { id: 'golden_ratio', label: 'compositions.golden_ratio.label', sub: 'Golden Ratio', description: 'compositions.golden_ratio.desc', prompt: 'golden ratio composition, fibonacci spiral, aesthetically pleasing balance, artistic layout, perfect proportions', icon: Grid },
    { id: 'framing', label: 'compositions.framing.label', sub: 'Framing', description: 'compositions.framing.desc', prompt: 'frame within a frame, depth of field, looking through foreground objects (window, door, trees), layered composition', icon: Grid },
    { id: 'leading_lines', label: 'compositions.leading_lines.label', sub: 'Leading Lines', description: 'compositions.leading_lines.desc', prompt: 'strong leading lines, depth perspective, vanishing point, eyes drawn to subject, road or corridor perspective', icon: Grid },
    { id: 'negative_space', label: 'compositions.negative_space.label', sub: 'Negative Space', description: 'compositions.negative_space.desc', prompt: 'negative space, minimalism, vast background, isolation, artistic void, clean composition, simple background', icon: Grid },
];

export const STYLES = [


    { id: 'realistic', label: 'styles.realistic.label', sub: 'Photorealistic', prompt: 'photorealistic, raw photo, 8k uhd, dslr, high quality, fujifilm, grainy texture, masterpiece', neg: '--no pixel art, illustration, cartoon, drawing, painting', icon: Camera },
    { id: 'anime', label: 'styles.anime.label', sub: 'Anime', prompt: 'anime style, key visual, vibrant colors, studio ghibli inspired, high definition, detailed line art, 2d animation', neg: '--no photorealistic, 3d render, live action', icon: Film },
    { id: '3d_render', label: 'styles.3d_render.label', sub: '3D 렌더링', prompt: '3d render, octane render, unreal engine 5, ray tracing, clay material, high fidelity, 8k, blender style', neg: '--no 2d, sketch, flat, cartoon, low poly', icon: Box },
    { id: 'oil_painting', label: 'styles.oil_painting.label', sub: 'Van Gogh', prompt: 'vincent van gogh style, post-impressionist, swirling brushstrokes, impasto texture, vibrant colors, starry night inspired, thick oil paint, emotional expression', neg: '--no photo, digital art, pixel art, smooth', icon: Paintbrush },
    { id: 'concept_art', label: 'styles.concept_art.label', sub: 'Concept Art', description: 'styles.concept_art.desc', prompt: 'digital concept art, speed painting, fantasy atmosphere, matte painting, highly detailed, sharp focus', neg: '--no photo, low quality, sketch', icon: Pencil },
    { id: 'cyberpunk', label: 'styles.cyberpunk.label', sub: 'Cyberpunk', description: 'styles.cyberpunk.desc', prompt: 'cyberpunk style, futuristic city, chromatic aberration, synthwave aesthetic, night time, glowing details', neg: '--no vintage, rustic, natural', icon: Zap },
    { id: 'pixel_8bit', label: 'styles.pixel_8bit.label', sub: '8-bit', prompt: '8-bit pixel art, NES style, retro game asset, low resolution, limited palette, chunky pixels, arcade aesthetic', neg: '--no smooth, high resolution, anti-aliasing, vector, modern', icon: Grid },
    { id: 'pixel_16bit', label: 'styles.pixel_16bit.label', sub: '16-bit', prompt: '16-bit pixel art, SNES style, retro RPG aesthetic, detailed pixel art, vibrant colors, dithering, game sprite', neg: '--no 3d, vector, smooth, blurry', icon: Grid },
    { id: 'chalk_art', label: 'styles.chalk_art.label', sub: 'Chalk', prompt: 'chalk art style, blackboard drawing, rough texture, dusty look, pastel colors on dark background, blackboard menu style, hand drawn', neg: '--no digital, glossy, sharp, photo', icon: Pencil },
    { id: 'monet', label: 'styles.monet.label', sub: 'Monet', prompt: 'claude monet style, impressionism, dappled light, loose brushstrokes, plein air, atmospheric, pastel color palette, oil painting', neg: '--no sharp lines, digital, cartoon, dark', icon: Paintbrush },
    { id: 'american_comic', label: 'styles.american_comic.label', sub: 'Comic', prompt: 'american comic book style, marvel/dc style, bold outlines, halftones, dynamic action, speech bubbles vibe, ben-day dots, ink and color', neg: '--no manga, anime, photorealistic, 3d', icon: Pencil },
    { id: 'pop_art', label: 'styles.pop_art.label', sub: 'Pop Art', prompt: 'pop art style, andy warhol inspired, roy lichtenstein dots, bold solid colors, high contrast, repetitive patterns, commercial art aesthetic, silkscreen print', neg: '--no realistic, painterly, soft, muted', icon: Star },
    { id: 'watercolor', label: 'styles.watercolor.label', sub: 'Watercolor', prompt: 'watercolor painting, wet on wet, paper texture, soft edges, bleeding colors, artistic, dreamy, transparent layers', neg: '--no oil painting, acrylic, thick paint, digital, sharp', icon: Paintbrush },
    { id: 'oriental_painting', label: 'styles.oriental_painting.label', sub: 'Eastern', prompt: 'traditional eastern painting, ink wash painting, sumi-e style, rice paper texture, brush calligraphy strokes, minimal color, negative space, nature focus', neg: '--no western art, oil painting, heavy saturation, digital', icon: Paintbrush },
    { id: 'claymation', label: 'styles.claymation.label', sub: 'Clay', prompt: 'clay animation style, aardman style, plasticine texture, stop motion look, handmade, fingerprint details, soft lighting, miniature world', neg: '--no cgi, 2d, drawing, sharp', icon: Box },
];

export const LIGHTING = [

    { id: 'natural', label: 'lighting.natural.label', sub: 'Natural', description: 'lighting.natural.desc', prompt: 'natural lighting, sunlight, soft shadows, golden hour, warm tone, outdoor lighting', icon: Zap },
    { id: 'studio', label: 'lighting.studio.label', sub: 'Studio', description: 'lighting.studio.desc', prompt: 'studio lighting, softbox, rim light, professional lighting, clean background, sharp details', icon: Zap },
    { id: 'neon', label: 'lighting.neon.label', sub: 'Neon', description: 'lighting.neon.desc', prompt: 'neon lighting, cyberpunk lighting, vibrant colors, glowing lights, night atmosphere, synthwave', icon: Zap },
    { id: 'dramatic', label: 'lighting.dramatic.label', sub: 'Dramatic', description: 'lighting.dramatic.desc', prompt: 'dramatic lighting, chiaroscuro, high contrast, heavy shadows, cinematic lighting, moody atmosphere', icon: Zap },
    { id: 'cinematic', label: 'lighting.cinematic.label', sub: 'Cinematic', description: 'lighting.cinematic.desc', prompt: 'cinematic lighting, teal and orange, anamorphic lens flares, atmospheric, volumatric lighting, movie scene', icon: Zap },
    { id: 'rembrandt', label: 'lighting.rembrandt.label', sub: 'Rembrandt', description: 'lighting.rembrandt.desc', prompt: 'rembrandt lighting, triangle of light on cheek, classical portrait lighting, artistic shadows', icon: Zap },
];

export const RESOLUTIONS = [
    {
        id: '16:9', label: 'resolutions.16:9.label', sub: '16:9', width: 16, height: 9,
        prompt: '--ar 16:9', icon: Monitor,
        grids: { cols: 16, rows: 9 } // Simple grid config
    },
    {
        id: '1:1', label: 'resolutions.1:1.label', sub: '1:1', width: 1, height: 1,
        prompt: '--ar 1:1', icon: Instagram,
        grids: { cols: 12, rows: 12 }
    },
    {
        id: '9:16', label: 'resolutions.9:16.label', sub: '9:16', width: 9, height: 16,
        prompt: '--ar 9:16', icon: Smartphone,
        grids: { cols: 9, rows: 16 }
    },
];

export const PALETTE_COLORS = [
    { id: 'subject', color: '#f97316', label: 'palette.subject', sub: 'Main' }, // Orange
    { id: 'subject_2', color: '#3b82f6', label: 'palette.subject_2', sub: 'Sub 2' }, // Blue (Changed from BG)
    { id: 'sub_subject', color: '#9333ea', label: 'palette.sub_subject', sub: 'Sub' }, // Purple
    { id: 'prop', color: '#22c55e', label: 'palette.prop', sub: 'Prop' }, // Green
    { id: 'erase', color: null, label: 'palette.erase', sub: 'Erase', icon: Eraser },
];

export const INITIAL_PALETTE = [
    { id: 'subject', color: '#f97316', label: 'palette.subject', sub: 'Main', promptName: 'Main Subject' },
    { id: 'subject_2', color: '#3b82f6', label: 'palette.subject_2', sub: 'Sub 2', promptName: 'Secondary Subject' },
    { id: 'erase', color: null, label: 'palette.erase', sub: 'Erase', icon: Eraser },
];

export const EXTRA_COLORS = [
    { color: '#9333ea', label: 'palette.obj_a', sub: 'Obj A', promptName: 'Object A' }, // Purple
    { color: '#22c55e', label: 'palette.obj_b', sub: 'Obj B', promptName: 'Object B' }, // Green
    { color: '#ef4444', label: 'palette.obj_c', sub: 'Obj C', promptName: 'Object C' }, // Red
    { color: '#eab308', label: 'palette.obj_d', sub: 'Obj D', promptName: 'Object D' }, // Yellow
    { color: '#06b6d4', label: 'palette.obj_e', sub: 'Obj E', promptName: 'Object E' }, // Cyan
    { color: '#ec4899', label: 'palette.obj_f', sub: 'Obj F', promptName: 'Object F' }, // Pink
];

export const MEME_TEMPLATES = [

    {
        id: 'distracted_boyfriend', label: 'memes.distracted_boyfriend.label', sub: 'Distracted BF', description: 'memes.distracted_boyfriend.desc', prompt: 'distracted boyfriend meme, stock photo aesthetic, man walking with girlfriend looking back at another woman in red dress, girlfriend looking at him with disgusted expression, 3 people scene, high quality, realistic photography', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'woman_yelling_cat', label: 'memes.woman_yelling_cat.label', sub: 'Yelling Woman', description: 'memes.woman_yelling_cat.desc', prompt: 'woman yelling at cat meme, split screen composition, left side: crying woman pointing finger being held back by friend, right side: confused white cat sitting at dinner table with salad, realistic TV show screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'disaster_girl', label: 'memes.disaster_girl.label', sub: 'Disaster Girl', description: 'memes.disaster_girl.desc', prompt: 'disaster girl meme, little girl with devilish smile looking at camera in foreground, house fire with firefighters blurred in background, high contrast, focus on girl\'s face, chaotic background, realistic photography', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front' }
    },
    {
        id: 'this_is_fine', label: 'memes.this_is_fine.label', sub: 'This is Fine', description: 'memes.this_is_fine.desc', prompt: 'this is fine meme, 2 panel comic strip style, cartoon dog in hat sitting at table with coffee mug, room engulfed in flames, "this is fine" text bubble vibe, flat illustration style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'success_kid', label: 'memes.success_kid.label', sub: 'Success Kid', description: 'memes.success_kid.desc', prompt: 'success kid meme, toddler boy in green and white shirt clenching fist with determined expression, sandy beach background, victory pose, high quality photo, famous internet baby', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'drake_hotline', label: 'memes.drake_hotline.label', sub: 'Drake', description: 'memes.drake_hotline.desc', prompt: 'drake hotline bling meme, 2 panel split screen, top panel: drake looking disgusted and turning away with hand up, bottom panel: drake smiling and pointing finger, orange background, music video screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'two_buttons', label: 'memes.two_buttons.label', sub: 'Two Buttons', description: 'memes.two_buttons.desc', prompt: 'daily struggle meme, two buttons meme, nervous spaceman/superhero sweating heavily looking at two red buttons, difficult choice dilemma, comic book style illustration, close up on face and buttons', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'high_angle', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'change_my_mind', label: 'memes.change_my_mind.label', sub: 'Change My Mind', description: 'memes.change_my_mind.desc', prompt: 'change my mind meme, man sitting at folding table in outdoor park, white sign with text space, holding coffee mug, "change my mind" banner style, sunlight, realistic photography', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_right' }
    },
    {
        id: 'grumpy_cat', label: 'memes.grumpy_cat.label', sub: 'Grumpy Cat', description: 'memes.grumpy_cat.desc', prompt: 'grumpy cat meme, snowshoe cat with extremely annoyed facial expression, close up portrait, cynical vibe, realistic photography, internet famous cat', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'doge', label: 'memes.doge.label', sub: 'Doge', description: 'memes.doge.desc', prompt: 'doge meme, shiba inu dog looking at camera with side eye and raised eyebrows, funny dog face, soft lighting, photography style, famous internet dog', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'roll_safe', label: 'memes.roll_safe.label', sub: 'Roll Safe', description: 'memes.roll_safe.desc', prompt: 'roll safe meme, man in leather jacket tapping his temple with index finger, knowing smile, smart idea gesture, dark blue background, documentary screencap style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'mocking_spongebob', label: 'memes.mocking_spongebob.label', sub: 'Mocking Sponge', description: 'memes.mocking_spongebob.desc', prompt: 'mocking spongebob meme, spongebob squarepants acting like a chicken, distorted pose, mocking gesture, rainbow background blur, cartoon screenshot', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'futurama_fry', label: 'memes.futurama_fry.label', sub: 'Suspicious Fry', description: 'memes.futurama_fry.desc', prompt: 'futurama fry meme, fry character squinting eyes in suspicion, close up face, "not sure if" expression, cartoon style, flat colors', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'one_does_not_simply', label: 'memes.one_does_not_simply.label', sub: 'Boromir', description: 'memes.one_does_not_simply.desc', prompt: 'one does not simply walk into mordor meme, boromir from lord of the rings making zero gesture with hand, serious lecture expression, fantasy movie screencap', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'ancient_aliens', label: 'memes.ancient_aliens.label', sub: 'Aliens Guy', description: 'memes.ancient_aliens.desc', prompt: 'ancient aliens guy meme, giorgio tsoukalos with messy hair holding hands up explaining, history channel interview style, blue background', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'batman_slapping', label: 'memes.batman_slapping.label', sub: 'Batman Slaps', description: 'memes.batman_slapping.desc', prompt: 'batman slapping robin meme, comic book panel style, batman slapping robin in the face, speech bubble space, action lines, "SLAP" sound effect visual, retro comic style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_right' }
    },
    {
        id: 'hide_the_pain', label: 'memes.hide_the_pain.label', sub: 'Harold', description: 'memes.hide_the_pain.desc', prompt: 'hide the pain harold meme, gray haired old man smiling while looking in pain, holding coffee cup, laptop in front, bright office lighting, stock photo style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'is_this_a_pigeon', label: 'memes.is_this_a_pigeon.label', sub: 'Is This Pigeon', description: 'memes.is_this_a_pigeon.desc', prompt: 'is this a pigeon meme, anime character pointing at a yellow butterfly, holding open book, meadow background, 90s anime style screencap', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_right' }
    },
    {
        id: 'surprised_pikachu', label: 'memes.surprised_pikachu.label', sub: 'Surprised Pika', description: 'memes.surprised_pikachu.desc', prompt: 'surprised pikachu meme, pikachu with open mouth jaw drop, pixelated or blurred background, shocked expression, pokemon anime screencap', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_left' }
    },
    {
        id: 'spider_man_pointing', label: 'memes.spider_man_pointing.label', sub: 'Spideys Pointing', description: 'memes.spider_man_pointing.desc', prompt: 'spider-man pointing at spider-man meme, two spidermen pointing fingers at each other, standoff, identical costumes, police truck in background, 60s cartoon style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'tuxedo_pooh', label: 'memes.tuxedo_pooh.label', sub: 'Fancy Pooh', description: 'memes.tuxedo_pooh.desc', prompt: 'tuxedo winnie the pooh meme, bear wearing fancy tuxedo and monocle, looking sophisticated, "a man of culture" expression, cartoon style', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'galaxy_brain', label: 'memes.galaxy_brain.label', sub: 'Galaxy Brain', description: 'memes.galaxy_brain.desc', prompt: 'galaxy brain meme, human head silhouette with glowing galaxy inside, enlightenment, cosmic awareness, digital art style, blue and purple glow', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'waiting_skeleton', label: 'memes.waiting_skeleton.label', sub: 'Waiting Skeleton', description: 'memes.waiting_skeleton.desc', prompt: 'waiting skeleton meme, skeleton sitting on park bench, waiting for a long time, overgrown grass, cobwebs, funny sad vibe, realistic photography style', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'rule_of_thirds', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'sad_keanu', label: 'memes.sad_keanu.label', sub: 'Sad Keanu', description: 'memes.sad_keanu.desc', prompt: 'sad keanu reeves meme, keanu reeves sitting alone on park bench eating sandwich, looking down, depressed vibe, pigeon nearby, paparazzi photo style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'high_angle', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'confused_math_lady', label: 'memes.confused_math_lady.label', sub: 'Math Lady', description: 'memes.confused_math_lady.desc', prompt: 'confused math lady meme, blonde woman looking confused with geometry formulas and numbers overlay, calculating faces, complex thinking, brazilian soap opera screencap', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'pepe_frog', label: 'memes.pepe_frog.label', sub: 'Sad Frog', description: 'memes.pepe_frog.desc', prompt: 'sad frog pepe meme, green anthropomorphic frog with sad expression, looking down, feels bad man vibe, rough drawing style, internet meme', icon: Smile,
        presets: { shot: 'close_up', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'leonardo_toast', label: 'memes.leonardo_toast.label', sub: 'Leo Toast', description: 'memes.leonardo_toast.desc', prompt: 'leonardo dicaprio laughing meme, great gatsby movie scene, man in tuxedo holding wine glass, smug smiling face, fireworks in background, party atmosphere', icon: Smile,
        presets: { shot: 'bust_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front' }
    },
    {
        id: 'bernie_mittens', label: 'memes.bernie_mittens.label', sub: 'Bernie Mittens', description: 'memes.bernie_mittens.desc', prompt: 'bernie sanders mittens meme, old man wearing parka and patterned mittens sitting on folding chair, crossed arms and legs, face mask, inauguration day vibe, press photo style', icon: Smile,
        presets: { shot: 'full_shot', angle: 'eye_level', composition: 'center', facing: 'facing_front_3_4_right' }
    },
    {
        id: 'spongebob_imma_head_out', label: 'memes.spongebob_imma_head_out.label', sub: 'Imma Head Out', description: 'memes.spongebob_imma_head_out.desc', prompt: 'spongebob imma head out meme, spongebob getting up from red armchair, holding remote, tired expression, motion blur, cartoon screencap', icon: Smile,
        presets: { shot: 'medium_shot', angle: 'eye_level', composition: 'center', facing: 'facing_left' }
    },
    {
        id: 'gta_wasted', label: 'memes.gta_wasted.label', sub: 'Wasted', description: 'memes.gta_wasted.desc', prompt: 'gta wasted screen meme, grayscale overlay, "WASTED" text in center style, camera on ground perspective, game over vibe, fisheye lens slant', icon: Smile,
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
