'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore, ToastItem } from '@/store/useToastStore';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

const toastStyleMap = {
  success: {
    bg: 'bg-neo-green text-white',
    icon: <CheckCircle className="w-5 h-5 text-white shrink-0" strokeWidth={2.5} />,
  },
  error: {
    bg: 'bg-neo-red text-white',
    icon: <AlertOctagon className="w-5 h-5 text-white shrink-0" strokeWidth={2.5} />,
  },
  warning: {
    bg: 'bg-neo-yellow text-black',
    icon: <AlertTriangle className="w-5 h-5 text-black shrink-0" strokeWidth={2.5} />,
  },
  info: {
    bg: 'bg-neo-blue text-white',
    icon: <Info className="w-5 h-5 text-white shrink-0" strokeWidth={2.5} />,
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 md:px-0"
    >
      <AnimatePresence>
        {toasts.map((toast: ToastItem) => {
          const style = toastStyleMap[toast.type] || toastStyleMap.info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`
                pointer-events-auto
                flex items-start gap-3 p-4
                border-3 border-black rounded-lg
                shadow-neo-lg
                ${style.bg}
              `}
            >
              <div className="mt-0.5">{style.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm uppercase tracking-wide leading-tight">
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs font-semibold mt-1 opacity-90 leading-snug">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/10 rounded border-2 border-black bg-white text-black shadow-neo-sm shrink-0 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
