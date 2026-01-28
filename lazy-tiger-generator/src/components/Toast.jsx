import React from 'react';
import { Check } from 'lucide-react';

const Toast = ({ message, show }) => {
    if (!show) return null;
    return (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center animate-fade-in-up">
            <Check size={18} className="text-green-400 mr-2" />
            <span className="font-bold text-sm">{message}</span>
        </div>
    );
};

export default Toast;
