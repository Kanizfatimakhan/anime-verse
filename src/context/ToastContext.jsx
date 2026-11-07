import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: () => {} };
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { id, message, type }]); // Keep max 4 toasts

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notification Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[250] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
        <AnimatePresence>
          {toasts.map(toast => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl glass border backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] text-xs sm:text-sm font-semibold text-white ${
                  isSuccess
                    ? 'border-emerald-500/30 bg-emerald-950/70 shadow-emerald-900/20'
                    : isError
                    ? 'border-rose-500/30 bg-rose-950/70 shadow-rose-900/20'
                    : 'border-primary/30 bg-zinc-950/85'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                ) : (
                  <Info className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className="flex-1 leading-snug">{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-white/50 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
