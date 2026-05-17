import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Centred modal dialog.
//
// - `open` toggles visibility; `onClose` is called for both backdrop
//   clicks and Escape-key dismissal.
// - Children render inside the card — compose header / body / actions
//   directly in the call site so the modal stays generic.
// - The card maxes at `max-w-sm`; pass `className` to override or add.
//
// Animation: backdrop fades; the card fades + scales (0.96 → 1) and
// slides up 10px on enter, mirrored on exit.

const Modal = ({ open, onClose, children, className = "" }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={
              "relative w-full max-w-sm rounded-macos border border-hairline bg-elevated p-6 shadow-sheet " +
              className
            }
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
