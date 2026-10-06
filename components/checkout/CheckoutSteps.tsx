import React from 'react';
import { Check } from 'lucide-react';

export type CheckoutStep = 1 | 2 | 3;

export interface CheckoutStepsProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  currentStep,
  onStepClick,
}) => {
  const steps = [
    { number: 1 as CheckoutStep, label: 'SHIPPING' },
    { number: 2 as CheckoutStep, label: 'PAYMENT' },
    { number: 3 as CheckoutStep, label: 'REVIEW' },
  ];

  return (
    <div className="w-full bg-white border-3 border-black rounded-lg p-4 shadow-neo mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!isCompleted && !isCurrent}
                  onClick={() => onStepClick && isCompleted && onStepClick(step.number)}
                  className={`
                    w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center font-black text-sm transition-all
                    ${
                      isCompleted
                        ? 'bg-neo-green text-white shadow-neo-sm cursor-pointer'
                        : isCurrent
                        ? 'bg-neo-yellow text-black shadow-neo-sm scale-110'
                        : 'bg-cream text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    step.number
                  )}
                </button>
                <span
                  className={`
                    text-xs font-black uppercase tracking-tight hidden sm:inline
                    ${
                      isCurrent
                        ? 'text-black underline decoration-neo-yellow decoration-4 underline-offset-4'
                        : isCompleted
                        ? 'text-black'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2 sm:mx-4 border-t-2 border-dashed
                    ${currentStep > step.number ? 'border-black' : 'border-gray-300'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
