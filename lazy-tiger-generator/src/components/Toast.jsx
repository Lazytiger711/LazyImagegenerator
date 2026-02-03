import React from 'react';
import { Check } from 'lucide-react';

const Toast = ({ message, show }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-950 text-white px-6 py-3 rounded-full shadow-2xl z-[10000] flex items-center border border-orange-500/30 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="bg-orange-500 rounded-full p-1 mr-3 text-black">
                <Check size={14} strokeWidth={3} />
            </div>
            <span className="font-bold text-sm text-orange-50">{message}</span>
        </div>
    );
};

export default Toast;
