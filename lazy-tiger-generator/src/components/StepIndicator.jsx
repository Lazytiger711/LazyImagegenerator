import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StepIndicator({ currentStep = 0, steps }) {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-white border-b border-gray-200 py-3 px-2 md:py-6 md:px-8">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-1 md:gap-6 relative">
                {/* Background Line Connector (Visible on all sizes now) */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-[calc(50%+10px)] md:-translate-y-[calc(50%+14px)] z-0" />

                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div
                            key={step.id}
                            className="flex flex-col items-center flex-1 relative z-10"
                        >
                            {/* Icon Container */}
                            <div
                                className={`
                  w-12 h-12 md:w-20 md:h-20 rounded-full flex items-center justify-center
                  transition-all duration-300 relative
                  ${isActive
                                        ? 'bg-orange-100 ring-4 ring-orange-200 scale-105 md:scale-110'
                                        : isCompleted
                                            ? 'bg-green-50'
                                            : 'bg-gray-50 border border-gray-200'
                                    }
                `}
                            >
                                <img
                                    src={step.icon}
                                    alt={t(step.label)}
                                    className={`
                    w-7 h-7 md:w-16 md:h-16 object-contain transition-all
                    ${isActive ? 'scale-110' : isCompleted ? 'opacity-70' : 'opacity-40 grayscale'}
                  `}
                                />

                                {/* Checkmark for completed steps */}
                                {isCompleted && (
                                    <div className="absolute -top-1 -right-1 md:-top-1 md:-right-1 bg-green-500 text-white rounded-full w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-[10px] md:text-sm shadow-sm ring-2 ring-white">
                                        ✓
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`
                  mt-1.5 md:mt-2 text-[10px] md:text-base font-bold transition-colors whitespace-nowrap
                  ${isActive
                                        ? 'text-orange-600'
                                        : isCompleted
                                            ? 'text-green-600'
                                            : 'text-gray-400'
                                    }
                `}
                            >
                                {t(step.label)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
