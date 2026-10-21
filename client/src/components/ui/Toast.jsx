import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { clearToast } from '../../store/uiSlice';

export default function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      dispatch(clearToast());
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-[#9A7955]" />,
    error: <AlertCircle size={18} className="text-red-600" />,
    info: <Info size={18} className="text-[#1C1C1A]" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#1C1C1A] text-[#F8F5EF] shadow-2xl border border-[#333330] p-4 flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          {icons[toast.type] || icons.info}
          <p className="text-xs tracking-wide leading-relaxed">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(clearToast())}
          className="text-[#A59A8A] hover:text-white p-1"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
