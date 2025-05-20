import type { ReactNode } from 'react';

import PurchaseConfirmDialog from './PurchaseConfirmDialog';
import { usePurchaseConfirmDialog } from './hooks/usePurchaseConfirmDialog';

type PurchaseConfirmDialogProviderProps = {
  children: ReactNode;
};

export default function PurchaseConfirmDialogProvider({
  children,
}: PurchaseConfirmDialogProviderProps) {
  const { isOpen, close, onContinueCallback } = usePurchaseConfirmDialog();

  const handleContinue = () => {
    if (onContinueCallback) {
      onContinueCallback();
    }
    close();
  };

  return (
    <>
      {children}
      <PurchaseConfirmDialog open={isOpen} onClose={close} onContinue={handleContinue} />
    </>
  );
}
