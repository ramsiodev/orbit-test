import { create } from 'zustand';

// Definir el tipo para el store
type PurchaseConfirmDialogState = {
  isOpen: boolean;
  onContinueCallback: (() => void) | null;
  open: (onContinue?: () => void) => void;
  close: () => void;
};

// Crear el store con Zustand
export const usePurchaseConfirmDialog = create<PurchaseConfirmDialogState>((set) => ({
  isOpen: false,
  onContinueCallback: null,
  open: (onContinue) => set({ isOpen: true, onContinueCallback: onContinue || null }),
  close: () => set({ isOpen: false, onContinueCallback: null }),
}));
