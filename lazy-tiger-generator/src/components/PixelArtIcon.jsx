import React from 'react';

const C = {
    ORANGE: "#FF9F43", ORANGE_D: "#E67E22", WHITE: "#FFFFFF", BLACK: "#2D3436",
    HOODIE: "#9CA3AF", HOODIE_D: "#6B7280", HOODIE_L: "#BDC3C7", PINK: "#FDA4AF",
    BG_SKY: "#BAE6FD", BG_GRASS: "#BBF7D0", GUIDE: "#94A3B8" // Fixed GUIDE color logic
};

// Updated Mascot Header based on Reference
const TigerHead = ({ x = 128, y = 128, scale = 1, rotate = 0, look = 'center' }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`}>
        {/* Ears */}
        <circle cx="-45" cy="-55" r="18" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" />
        <circle cx="-45" cy="-55" r="8" fill={C.PINK} />
        <circle cx="45" cy="-55" r="18" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" />
        <circle cx="45" cy="-55" r="8" fill={C.PINK} />

        {/* Face Shape (Rounder) */}
        <path d="M-65 -30 Q-75 10 -65 50 Q-50 80 0 80 Q50 80 65 50 Q75 10 65 -30 Q50 -70 0 -70 Q-50 -70 -65 -30" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" />

        {/* Forehead Stripes (3 Distinct) */}
        <path d="M0 -70 L0 -40" stroke={C.BLACK} strokeWidth="5" strokeLinecap="round" />
        <path d="M-20 -65 L-15 -45" stroke={C.BLACK} strokeWidth="4" strokeLinecap="round" />
        <path d="M20 -65 L15 -45" stroke={C.BLACK} strokeWidth="4" strokeLinecap="round" />

        {/* Cheek Stripes */}
        <path d="M-68 0 L-45 5" stroke={C.BLACK} strokeWidth="3" strokeLinecap="round" />
        <path d="M-66 20 L-48 22" stroke={C.BLACK} strokeWidth="3" strokeLinecap="round" />
        <path d="M68 0 L45 5" stroke={C.BLACK} strokeWidth="3" strokeLinecap="round" />
        <path d="M66 20 L48 22" stroke={C.BLACK} strokeWidth="3" strokeLinecap="round" />

        {/* White Muzzle Area - Wide and Cute */}
        <path d="M-55 35 Q-30 65 0 65 Q30 65 55 35 Q60 20 40 20 Q20 20 0 35 Q-20 20 -40 20 Q-60 20 -55 35" fill={C.WHITE} />

        {/* Nose */}
        <path d="M-10 40 L10 40 L0 50 Z" fill={C.PINK} stroke={C.BLACK} strokeWidth="2" strokeLinejoin="round" />

        {/* Mouth */}
        <path d="M0 50 L0 60" stroke={C.BLACK} strokeWidth="2" />
        <path d="M0 60 Q-10 68 -20 60" stroke={C.BLACK} strokeWidth="2" fill="none" />
        <path d="M0 60 Q10 68 20 60" stroke={C.BLACK} strokeWidth="2" fill="none" />

        {/* Eyes (Expressive) */}
        <g transform={`translate(${look === 'left' ? -8 : look === 'right' ? 8 : 0}, 0)`}>
            {/* Eye Background */}
            <ellipse cx="-25" cy="0" rx="14" ry="16" fill={C.WHITE} stroke={C.BLACK} strokeWidth="2" />
            <ellipse cx="25" cy="0" rx="14" ry="16" fill={C.WHITE} stroke={C.BLACK} strokeWidth="2" />

            {/* Pupils */}
            <circle cx="-22" cy="0" r="7" fill={C.BLACK} />
            <circle cx="22" cy="0" r="7" fill={C.BLACK} />

            {/* Highlights */}
            <circle cx="-18" cy="-3" r="3" fill="white" />
            <circle cx="26" cy="-3" r="3" fill="white" />

            {/* Eyebrows (Thick) */}
            <path d="M-40 -25 Q-25 -35 -10 -25" stroke={C.BLACK} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M10 -25 Q25 -35 40 -25" stroke={C.BLACK} strokeWidth="4" strokeLinecap="round" fill="none" />
        </g>
    </g>
);

// Updated Hoodie Body
const HoodieBody = ({ x = 128, y = 180, scale = 1 }) => (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* Hood Background (Behind Head) */}
        <path d="M-65 -50 Q0 -70 65 -50" fill="none" stroke={C.HOODIE_D} strokeWidth="12" strokeLinecap="round" />

        {/* Main Body Block */}
        <path d="M-55 -40 L-60 80 L60 80 L55 -40 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" />

        {/* Kangaroo Pocket */}
        <path d="M-35 40 L35 40 L30 75 L-30 75 Z" fill={C.HOODIE_D} stroke={C.BLACK} strokeWidth="2" />

        {/* Drawstrings */}
        <path d="M-20 -30 Q-20 0 -15 30" stroke={C.WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M20 -30 Q20 0 15 30" stroke={C.WHITE} strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Arms (Resting) */}
        <path d="M-55 -30 Q-80 0 -60 50" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" />
        <path d="M55 -30 Q80 0 60 50" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" />

        {/* Paws */}
        <circle cx="-60" cy="55" r="12" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" />
        <circle cx="60" cy="55" r="12" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" />
    </g>
);

const PixelArtIcon = ({ type, name, className, ...props }) => {
    const key = name || type;
    const svgProps = { viewBox: "0 0 256 256", shapeRendering: "auto", className: className || "w-full h-full", ...props };

    switch (key) {
        case 'none': return (<svg {...svgProps}><rect x="4" y="4" width="248" height="248" fill="#F3F4F6" rx="16" /><line x1="64" y1="64" x2="192" y2="192" stroke="#D1D5DB" strokeWidth="16" strokeLinecap="round" /><line x1="192" y1="64" x2="64" y2="192" stroke="#D1D5DB" strokeWidth="16" strokeLinecap="round" /></svg>);
        case 'logo': return (<svg {...svgProps}><TigerHead x={128} y={140} scale={1.3} /></svg>);
        case 'extreme_close_up': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill={C.ORANGE} /><g transform="translate(128, 128) scale(2.5)"><ellipse cx="-25" cy="0" rx="12" ry="14" fill={C.WHITE} stroke={C.BLACK} strokeWidth="1" /><circle cx="-25" cy="0" r="5" fill={C.BLACK} /><circle cx="-22" cy="-3" r="2" fill="white" /><ellipse cx="25" cy="0" rx="12" ry="14" fill={C.WHITE} stroke={C.BLACK} strokeWidth="1" /><circle cx="25" cy="0" r="5" fill={C.BLACK} /><circle cx="28" cy="-3" r="2" fill="white" /><path d="M-12 25 L12 25 L0 35 Z" fill={C.PINK} stroke={C.BLACK} strokeWidth="1" /><path d="M-20 -40 L20 -40" stroke={C.BLACK} strokeWidth="3" /><path d="M-30 -25 L30 -25" stroke={C.BLACK} strokeWidth="3" /></g></svg>);
        case 'close_up': return (<svg {...svgProps}><defs><linearGradient id="gradCU" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#EFF6FF" /><stop offset="100%" stopColor="#DBEAFE" /></linearGradient></defs><rect x="0" y="0" width="256" height="256" fill="url(#gradCU)" /><TigerHead x={128} y={110} scale={1.1} /><path d="M40 200 Q128 240 216 200 L216 256 L40 256 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><line x1="110" y1="200" x2="110" y2="240" stroke={C.WHITE} strokeWidth="4" /><line x1="146" y1="200" x2="146" y2="240" stroke={C.WHITE} strokeWidth="4" /></svg>);
        case 'bust_shot': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F0FDFA" /><TigerHead x={128} y={80} scale={0.9} /><HoodieBody x={128} y={170} scale={0.9} /></svg>);
        case 'medium_shot': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FDF4FF" /><TigerHead x={128} y={60} scale={0.75} /><HoodieBody x={128} y={130} scale={0.8} /><rect x="100" y="190" width="20" height="66" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><rect x="136" y="190" width="20" height="66" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /></svg>);
        case 'full_shot': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FFF7ED" /><g transform="translate(128, 110) scale(0.6)"><TigerHead x={0} y={-100} /><HoodieBody x={0} y={20} /><rect x="-30" y="80" width="25" height="70" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" rx="5" /><rect x="5" y="80" width="25" height="70" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" rx="5" /><path d="M-30 100 L-10 100" stroke={C.BLACK} strokeWidth="3" /><path d="M-30 120 L-10 120" stroke={C.BLACK} strokeWidth="3" /><path d="M5 100 L25 100" stroke={C.BLACK} strokeWidth="3" /><path d="M5 120 L25 120" stroke={C.BLACK} strokeWidth="3" /><path d="M-35 150 L-5 150 L-5 165 Q-20 170 -35 165 Z" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><path d="M5 150 L35 150 L35 165 Q20 170 5 165 Z" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><path d="M30 80 Q60 80 60 50" stroke={C.ORANGE} strokeWidth="10" strokeLinecap="round" fill="none" /><path d="M30 80 Q60 80 60 50" stroke="black" strokeWidth="10" strokeLinecap="round" fill="none" strokeDasharray="10 10" /></g></svg>);
        case 'long_shot': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill={C.BG_SKY} /><path d="M0 200 Q64 150 128 200 T256 200 V256 H0 Z" fill={C.BG_GRASS} /><path d="M40 200 L60 140 L80 200 Z" fill="#4ADE80" stroke="#166534" strokeWidth="2" /><path d="M180 220 L200 160 L220 220 Z" fill="#4ADE80" stroke="#166534" strokeWidth="2" /><g transform="translate(128, 190) scale(0.3)"><TigerHead x={0} y={-80} /><HoodieBody x={0} y={0} /><rect x="-20" y="60" width="15" height="40" fill={C.ORANGE} /><rect x="5" y="60" width="15" height="40" fill={C.ORANGE} /></g></svg>);
        case 'selfie': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill={C.BG_SKY} /><g transform="translate(100, 100) rotate(-10)"><TigerHead x={0} y={0} scale={1.1} /><path d="M-80 100 L40 120 L80 100" stroke={C.HOODIE} strokeWidth="40" strokeLinecap="round" /></g><rect x="160" y="100" width="80" height="30" fill={C.HOODIE} transform="rotate(-40 160 100)" rx="10" stroke={C.BLACK} strokeWidth="3" /><rect x="190" y="50" width="40" height="70" fill="#333" transform="rotate(-20 190 50)" rx="5" /><circle cx="210" cy="70" r="5" fill="#666" transform="rotate(-20 190 50)" /></svg>);
        case 'over_the_shoulder': return (<svg {...svgProps}><g transform="translate(180, 100) scale(0.6)" opacity="0.6"><TigerHead x={0} y={0} /><HoodieBody x={0} y={100} /></g><g transform="translate(0, 100)"><path d="M-20 160 L100 160 L100 60 Q40 40 -20 60 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><ellipse cx="40" cy="40" rx="40" ry="35" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><path d="M40 10 L40 70" stroke={C.BLACK} strokeWidth="4" /><path d="M20 20 L20 60" stroke={C.BLACK} strokeWidth="4" /><path d="M60 20 L60 60" stroke={C.BLACK} strokeWidth="4" /><circle cx="10" cy="20" r="10" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /></g></svg>);

        // Facing
        case 'facing_front': return (<svg {...svgProps}><TigerHead x={128} y={100} scale={1.1} /><HoodieBody x={128} y={190} scale={1.2} /></svg>);
        case 'facing_front_3_4_left': return (<svg {...svgProps}><g transform="translate(110, 100) scale(1.1)"><TigerHead x={0} y={0} look="left" /><ellipse cx="-5" cy="50" rx="15" ry="10" fill="none" stroke={C.BLACK} strokeWidth="1" strokeDasharray="2 2" opacity="0.2" /></g><HoodieBody x={128} y={190} scale={1.2} /></svg>);
        case 'facing_front_3_4_right': return (<svg {...svgProps}><g transform="translate(146, 100) scale(1.1)"><TigerHead x={0} y={0} look="right" /></g><HoodieBody x={128} y={190} scale={1.2} /></svg>);
        case 'facing_left': return (<svg {...svgProps}><g transform="translate(128, 100) scale(1.1)"><path d="M20 -60 Q-40 -60 -50 0 Q-40 60 20 60" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="10" cy="-50" r="15" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><path d="M-50 0 L-65 10 L-50 20" fill={C.WHITE} stroke={C.BLACK} strokeWidth="2" /><circle cx="-65" cy="5" r="5" fill={C.PINK} /><circle cx="-30" cy="-10" r="5" fill={C.BLACK} /><rect x="0" y="-30" width="5" height="20" fill={C.BLACK} /><rect x="0" y="10" width="5" height="20" fill={C.BLACK} /></g><HoodieBody x={138} y={190} scale={1.2} /></svg>);
        case 'facing_right': return (<svg {...svgProps}><g transform="translate(128, 100) scale(1.1) scale(-1, 1)"><path d="M20 -60 Q-40 -60 -50 0 Q-40 60 20 60" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="10" cy="-50" r="15" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><path d="M-50 0 L-65 10 L-50 20" fill={C.WHITE} stroke={C.BLACK} strokeWidth="2" /><circle cx="-65" cy="5" r="5" fill={C.PINK} /><circle cx="-30" cy="-10" r="5" fill={C.BLACK} /><rect x="0" y="-30" width="5" height="20" fill={C.BLACK} /><rect x="0" y="10" width="5" height="20" fill={C.BLACK} /></g><HoodieBody x={118} y={190} scale={1.2} /></svg>);
        case 'facing_back': return (<svg {...svgProps}><g transform="translate(128, 100) scale(1.1)"><rect x="-40" y="-50" width="80" height="70" rx="30" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="-35" cy="-50" r="15" fill={C.ORANGE_D} stroke={C.BLACK} strokeWidth="3" /><circle cx="35" cy="-50" r="15" fill={C.ORANGE_D} stroke={C.BLACK} strokeWidth="3" /><path d="M0 -40 L0 10" stroke={C.BLACK} strokeWidth="6" strokeLinecap="round" /><path d="M-20 -30 L-20 0" stroke={C.BLACK} strokeWidth="5" strokeLinecap="round" /><path d="M20 -30 L20 0" stroke={C.BLACK} strokeWidth="5" strokeLinecap="round" /></g><g transform="translate(128, 190) scale(1.2)"><path d="M-40 -40 L40 -40 L45 50 L-45 50 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><path d="M-30 -30 Q0 0 30 -30" fill="none" stroke={C.HOODIE_D} strokeWidth="3" /></g></svg>);
        case 'facing_back_3_4_left': return (<svg {...svgProps}><g transform="translate(110, 100) scale(1.1)"><rect x="-35" y="-50" width="70" height="70" rx="25" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="-40" cy="-40" r="12" fill={C.ORANGE_D} stroke={C.BLACK} strokeWidth="3" /><path d="M-35 0 Q-38 10 -35 20" stroke="none" fill={C.WHITE} /></g><HoodieBody x={128} y={190} scale={1.2} /></svg>);
        case 'facing_back_3_4_right': return (<svg {...svgProps}><g transform="translate(146, 100) scale(1.1)"><rect x="-35" y="-50" width="70" height="70" rx="25" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="40" cy="-40" r="12" fill={C.ORANGE_D} stroke={C.BLACK} strokeWidth="3" /></g><HoodieBody x={128} y={190} scale={1.2} /></svg>);

        // Angles
        case 'eye_level': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F8FAFC" /><line x1="0" y1="128" x2="256" y2="128" stroke={C.GUIDE} strokeWidth="2" strokeDasharray="8 8" /><TigerHead x={128} y={100} /><HoodieBody x={128} y={190} /></svg>);
        case 'low_angle': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F0F9FF" /><rect x="60" y="160" width="40" height="60" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" rx="10" /><rect x="156" y="160" width="40" height="60" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" rx="10" /><path d="M80 160 L176 160 L160 80 L96 80 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><TigerHead x={128} y={50} scale={0.6} /></svg>);
        case 'high_angle': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FFF7ED" /><TigerHead x={128} y={100} scale={1.4} /><path d="M100 160 L156 160 L146 220 L110 220 Z" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><circle cx="115" cy="230" r="10" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /><circle cx="141" cy="230" r="10" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /></svg>);
        case 'overhead': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F1F5F9" /><circle cx="128" cy="128" r="100" fill="rgba(0,0,0,0.1)" /><ellipse cx="128" cy="128" rx="70" ry="50" fill={C.HOODIE} stroke={C.BLACK} strokeWidth="3" /><circle cx="128" cy="120" r="40" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="3" /><circle cx="95" cy="100" r="12" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /><circle cx="161" cy="100" r="12" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /><path d="M110 110 L146 110" stroke={C.BLACK} strokeWidth="4" /><path d="M115 130 L141 130" stroke={C.BLACK} strokeWidth="4" /></svg>);
        case 'dutch_angle': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FEF2F2" /><g transform="rotate(20 128 128)"><TigerHead x={128} y={100} /><HoodieBody x={128} y={190} /><line x1="0" y1="60" x2="256" y2="60" stroke={C.GUIDE} strokeWidth="2" /><line x1="0" y1="196" x2="256" y2="196" stroke={C.GUIDE} strokeWidth="2" /></g></svg>);
        case 'top_down': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#E5E7EB" /><rect x="30" y="30" width="196" height="196" fill="white" rx="8" stroke="#D1D5DB" strokeWidth="4" /><rect x="60" y="60" width="60" height="80" fill={C.HOODIE} rx="4" stroke={C.BLACK} strokeWidth="2" /><circle cx="180" cy="100" r="30" fill={C.ORANGE} stroke={C.BLACK} strokeWidth="2" /><rect x="150" y="160" width="60" height="40" fill="#3B82F6" rx="4" stroke={C.BLACK} strokeWidth="2" /><rect x="60" y="160" width="40" height="40" fill={C.BLACK} rx="4" /></svg>);
        case 'birds_eye': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#A7F3D0" /><path d="M0 60 Q 128 150 256 60" stroke="#60A5FA" strokeWidth="30" fill="none" /><circle cx="128" cy="128" r="10" fill={C.ORANGE} stroke={C.WHITE} strokeWidth="2" /><path d="M40 80 Q 80 40 120 80" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.6" fill="none" /><path d="M180 200 Q 220 160 250 200" stroke="white" strokeWidth="15" strokeLinecap="round" opacity="0.6" fill="none" /></svg>);

        // Abstract icons
        case 'rule_of_thirds': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="none" stroke={C.GUIDE} strokeWidth="4" /><line x1="88" y1="10" x2="88" y2="246" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><line x1="168" y1="10" x2="168" y2="246" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><line x1="10" y1="88" x2="246" y2="88" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><line x1="10" y1="168" x2="246" y2="168" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><circle cx="88" cy="88" r="10" fill={C.ORANGE} /><circle cx="168" cy="88" r="10" fill={C.ORANGE} /><circle cx="88" cy="168" r="10" fill={C.ORANGE} /><circle cx="168" cy="168" r="10" fill={C.ORANGE} /></svg>);
        case 'center': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="none" stroke={C.GUIDE} strokeWidth="4" /><line x1="128" y1="10" x2="128" y2="246" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><line x1="10" y1="128" x2="246" y2="128" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><circle cx="128" cy="128" r="50" fill={C.ORANGE} opacity="0.8" /><rect x="108" y="108" width="40" height="40" fill={C.WHITE} /></svg>);
        case 'diagonal': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="none" stroke={C.GUIDE} strokeWidth="4" /><line x1="10" y1="246" x2="246" y2="10" stroke={C.GUIDE} strokeWidth="4" strokeDasharray="10 10" /><circle cx="60" cy="196" r="20" fill={C.ORANGE} /><circle cx="128" cy="128" r="20" fill={C.ORANGE} /><circle cx="196" cy="60" r="20" fill={C.ORANGE} /></svg>);
        case 'golden_ratio': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="none" stroke={C.GUIDE} strokeWidth="4" /><line x1="100" y1="10" x2="100" y2="246" stroke={C.GUIDE} strokeWidth="4" /><line x1="156" y1="10" x2="156" y2="246" stroke={C.GUIDE} strokeWidth="4" /><line x1="10" y1="100" x2="246" y2="100" stroke={C.GUIDE} strokeWidth="4" /><line x1="10" y1="156" x2="246" y2="156" stroke={C.GUIDE} strokeWidth="4" /><rect x="105" y="105" width="20" height="20" fill={C.ORANGE} /></svg>);
        case 'framing': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="#E5E7EB" /><circle cx="128" cy="128" r="40" fill={C.ORANGE} /><path d="M10 10 H246 V246 H10 V10 Z M60 60 V196 H196 V60 H60 Z" fill={C.GREY_D} fillRule="evenodd" /></svg>);
        case 'leading_lines': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="#E5E7EB" /><path d="M110 110 L10 246 H246 L146 110 Z" fill={C.GREY} /><rect x="110" y="90" width="30" height="30" fill={C.ORANGE} /><line x1="10" y1="110" x2="246" y2="110" stroke={C.GREY_D} strokeWidth="4" /></svg>);
        case 'negative_space': return (<svg {...svgProps}><rect x="10" y="10" width="236" height="236" fill="#F3F4F6" /><circle cx="200" cy="200" r="30" fill={C.ORANGE} /><text x="40" y="100" fontSize="40" fill={C.GREY_D} fontFamily="monospace">SPACE</text></svg>);

        // Resolutions
        case '16:9': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F3F4F6" /><rect x="28" y="71" width="200" height="113" fill="white" stroke={C.BLACK} strokeWidth="3" rx="4" /><g transform="translate(128, 128) scale(0.4)"><TigerHead y={-20} /><HoodieBody y={80} /></g><text x="128" y="215" fontSize="16" textAnchor="middle" fill={C.GREY_D} fontWeight="bold">16:9</text></svg>);
        case '1:1': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F3F4F6" /><rect x="64" y="64" width="128" height="128" fill="white" stroke={C.BLACK} strokeWidth="3" rx="4" /><g transform="translate(128, 128) scale(0.45)"><TigerHead y={-20} /><HoodieBody y={80} /></g><text x="128" y="215" fontSize="16" textAnchor="middle" fill={C.GREY_D} fontWeight="bold">1:1</text></svg>);
        case '9:16': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#F3F4F6" /><rect x="71" y="28" width="113" height="200" fill="white" stroke={C.BLACK} strokeWidth="3" rx="4" /><g transform="translate(128, 128) scale(0.4)"><TigerHead y={-20} /><HoodieBody y={80} /></g><text x="128" y="245" fontSize="16" textAnchor="middle" fill={C.GREY_D} fontWeight="bold">9:16</text></svg>);

        // Styles
        case 'realistic': return (<svg {...svgProps}><defs><filter id="photo"><feGaussianBlur in="SourceGraphic" stdDeviation="0.5" /></filter></defs><rect x="0" y="0" width="256" height="256" fill="#333" /><g filter="url(#photo)"><TigerHead x={128} y={128} scale={1.2} /></g><rect x="10" y="10" width="236" height="236" fill="none" stroke="white" strokeWidth="8" opacity="0.5" /><circle cx="220" cy="30" r="10" fill="red" opacity="0.8" /></svg>);
        case 'anime': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FFF0F5" /><g transform="translate(128, 128) scale(1.1)"><circle cx="0" cy="0" r="90" fill="white" stroke={C.PINK} strokeWidth="5" strokeDasharray="10 5" /><TigerHead x={0} y={0} /></g><path d="M200 40 L230 20 L240 60 Z" fill={C.PINK} /><path d="M30 200 L50 230 L20 240 Z" fill={C.PINK} /><circle cx="40" cy="40" r="10" fill={C.ORANGE} opacity="0.5" /></svg>);
        case '3d_render': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#1e1e1e" /><g transform="translate(128, 140) scale(1)"><path d="M-60 -60 L60 -60 L60 60 L-60 60 Z" fill="none" stroke="#00ff00" strokeWidth="2" /><path d="M-40 -40 L40 -40 L40 40 L-40 40 Z" fill="none" stroke="#00ff00" strokeWidth="1" /><path d="M-60 -60 L-40 -40" stroke="#00ff00" strokeWidth="1" /><path d="M60 -60 L40 -40" stroke="#00ff00" strokeWidth="1" /><path d="M60 60 L40 40" stroke="#00ff00" strokeWidth="1" /><path d="M-60 60 L-40 40" stroke="#00ff00" strokeWidth="1" /><TigerHead y={-20} scale={0.8} /></g></svg>);
        case 'oil_painting': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#FEF3C7" /><g transform="translate(128, 128) scale(1.1)"><path d="M-70 -30 Q-50 -80 0 -70 Q50 -80 70 -30 Q60 50 0 80 Q-60 50 -70 -30" fill={C.ORANGE} stroke="none" /><path d="M-60 -20 Q-40 -60 0 -50 Q40 -60 60 -20" fill="none" stroke={C.ORANGE_D} strokeWidth="10" strokeLinecap="round" /><TigerHead x={0} y={0} /></g><circle cx="60" cy="200" r="20" fill="#F87171" opacity="0.8" /><circle cx="100" cy="220" r="20" fill="#60A5FA" opacity="0.8" /><circle cx="140" cy="200" r="20" fill="#FBBF24" opacity="0.8" /></svg>);
        case 'concept_art': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#E7E5E4" /><g transform="translate(128, 128) scale(1.1)" opacity="0.7"><TigerHead x={0} y={0} /></g><path d="M80 80 L180 80" stroke="black" strokeWidth="2" strokeDasharray="5 5" /><path d="M80 180 L180 180" stroke="black" strokeWidth="2" strokeDasharray="5 5" /><rect x="64" y="64" width="128" height="128" fill="none" stroke="black" strokeWidth="4" /><text x="180" y="230" fontSize="14" fill="#666">CONCEPT</text></svg>);
        case 'cyberpunk': return (<svg {...svgProps}><rect x="0" y="0" width="256" height="256" fill="#111827" /><g transform="translate(132, 128) scale(1.1)"><TigerHead x={0} y={0} /></g><g transform="translate(124, 128) scale(1.1)" opacity="0.5"><TigerHead x={0} y={0} /></g><path d="M0 0 L256 256" stroke="#EC4899" strokeWidth="2" opacity="0.5" /><path d="M256 0 L0 256" stroke="#06B6D4" strokeWidth="2" opacity="0.5" /><text x="128" y="240" fontSize="20" textAnchor="middle" fill="#00FF00" fontFamily="monospace">GLITCH</text></svg>);

        // Resolution Icons


        default: return null;
    }
};

export default PixelArtIcon;
