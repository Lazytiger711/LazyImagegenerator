import React from 'react';

const SimplePolaroidIcon = ({ size = 24, strokeWidth = 2, className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <rect width="14" height="10" x="5" y="5" rx="0.5" />
            {/* Optional: Add a small circle or detail for realism if needed, but 'simple' usually means minimal */}
        </svg>
    );
};

export default SimplePolaroidIcon;
