import React from 'react';

const CompositionGuides = ({ type }) => {
    const guideStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicks to pass through
        zIndex: 10,
    };

    const lineStyle = {
        stroke: 'rgba(0,0,0,0.2)', // Subtle guide lines
        strokeWidth: '1.5px',
        fill: 'none',
        vectorEffect: 'non-scaling-stroke'
    };

    const highlightStyle = {
        stroke: 'rgba(255, 87, 34, 0.4)', // Orange highlight
        strokeWidth: '2px',
        fill: 'none',
        vectorEffect: 'non-scaling-stroke'
    };

    const renderGuide = () => {
        switch (type) {
            case 'rule_of_thirds':
                return (
                    <>
                        <line x1="33.3%" y1="0" x2="33.3%" y2="100%" style={lineStyle} />
                        <line x1="66.6%" y1="0" x2="66.6%" y2="100%" style={lineStyle} />
                        <line x1="0" y1="33.3%" x2="100%" y2="33.3%" style={lineStyle} />
                        <line x1="0" y1="66.6%" x2="100%" y2="66.6%" style={lineStyle} />
                        {/* Intersection Points */}
                        <circle cx="33.3%" cy="33.3%" r="3" style={{ fill: 'rgba(0,0,0,0.3)' }} />
                        <circle cx="66.6%" cy="33.3%" r="3" style={{ fill: 'rgba(0,0,0,0.3)' }} />
                        <circle cx="33.3%" cy="66.6%" r="3" style={{ fill: 'rgba(0,0,0,0.3)' }} />
                        <circle cx="66.6%" cy="66.6%" r="3" style={{ fill: 'rgba(0,0,0,0.3)' }} />
                    </>
                );
            case 'center':
                return (
                    <>
                        <line x1="50%" y1="0" x2="50%" y2="100%" style={highlightStyle} />
                        <line x1="0" y1="50%" x2="100%" y2="50%" style={highlightStyle} />
                        <circle cx="50%" cy="50%" r="20%" style={lineStyle} />
                    </>
                );
            case 'diagonal':
                return (
                    <>
                        <line x1="0" y1="100%" x2="100%" y2="0" style={highlightStyle} />
                        <line x1="0" y1="0" x2="100%" y2="100%" style={lineStyle} />
                    </>
                );
            case 'golden_ratio': // Phi Grid (1 : 0.618 : 1) -> approx 38% / 62%
                return (
                    <>
                        <line x1="38.2%" y1="0" x2="38.2%" y2="100%" style={highlightStyle} />
                        <line x1="61.8%" y1="0" x2="61.8%" y2="100%" style={highlightStyle} />
                        <line x1="0" y1="38.2%" x2="100%" y2="38.2%" style={highlightStyle} />
                        <line x1="0" y1="61.8%" x2="100%" y2="61.8%" style={highlightStyle} />
                    </>
                );
            case 'framing':
                return (
                    <>
                        <rect x="15%" y="15%" width="70%" height="70%" style={highlightStyle} />
                        {/* Corner brackets hint */}
                        <line x1="5%" y1="5%" x2="15%" y2="5%" style={lineStyle} />
                        <line x1="5%" y1="5%" x2="5%" y2="15%" style={lineStyle} />
                        <line x1="95%" y1="5%" x2="85%" y2="5%" style={lineStyle} />
                        <line x1="95%" y1="5%" x2="95%" y2="15%" style={lineStyle} />
                        <line x1="5%" y1="95%" x2="15%" y2="95%" style={lineStyle} />
                        <line x1="5%" y1="95%" x2="5%" y2="85%" style={lineStyle} />
                        <line x1="95%" y1="95%" x2="85%" y2="95%" style={lineStyle} />
                        <line x1="95%" y1="95%" x2="95%" y2="85%" style={lineStyle} />
                    </>
                );
            case 'leading_lines':
                return (
                    <>
                        <line x1="0" y1="100%" x2="45%" y2="50%" style={highlightStyle} />
                        <line x1="100%" y1="100%" x2="55%" y2="50%" style={highlightStyle} />
                        <circle cx="50%" cy="50%" r="5" style={{ fill: 'rgba(255, 87, 34, 0.2)' }} />
                    </>
                );
            case 'negative_space':
                return (
                    <>
                        {/* Highlight one side/corner */}
                        <rect x="66%" y="0" width="34%" height="100%" style={{ fill: 'rgba(255, 87, 34, 0.1)' }} />
                        <line x1="66%" y1="0" x2="66%" y2="100%" style={highlightStyle} />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <svg style={guideStyle}>
            {renderGuide()}
        </svg>
    );
};

export default CompositionGuides;
