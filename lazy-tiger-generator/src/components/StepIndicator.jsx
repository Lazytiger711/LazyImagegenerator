import React from 'react';
import { useTranslation } from 'react-i18next';

export default function StepIndicator({ currentStep = 0, steps }) {
    const { t } = useTranslation();

    return (
        <div className="w-full bg-white border-b border-gray-200 py-5 px-4 md:py-6 md:px-8">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-6">
                {steps.map((step, index) => {
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;

                    return (
                        <div
                            key={step.id}
                            className="flex flex-col items-center flex-1 relative"
                        >
                            {/* Icon Container */}
                            <div
                                className={`
                  w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                  transition-all duration-300 relative
                  ${isActive
                                        ? 'bg-orange-100 ring-4 ring-orange-200 scale-110'
                                        : isCompleted
                                            ? 'bg-green-50'
                                            : 'bg-gray-50'
                                    }
                `}
                            >
                                <img
                                    src={step.icon}
                                    alt={t(step.label)}
                                    className={`
                    w-12 h-12 md:w-16 md:h-16 object-contain transition-all
                    ${isActive ? 'scale-110' : isCompleted ? 'opacity-70' : 'opacity-40 grayscale'}
                  `}
                                />

                                {/* Checkmark for completed steps */}
                                {isCompleted && (
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                                        ✓
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <span
                                className={`
                  mt-2 text-sm md:text-base font-bold transition-colors
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

                            {/* Connector Line (except for last item) */}
                            {index < steps.length - 1 && (
                                <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-0.5 bg-gray-200">
                                    <div
                                        className={`h-full bg-orange-400 transition-all duration-500 ${isCompleted ? 'w-full' : 'w-0'
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
