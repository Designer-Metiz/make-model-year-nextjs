import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
}

export const useConfirmation = () => {
  const [dialog, setDialog] = useState<{
    open: boolean;
    options: ConfirmationOptions | null;
  }>({
    open: false,
    options: null,
  });

  const [loading, setLoading] = useState(false);

  const confirm = (options: ConfirmationOptions) => {
    setDialog({
      open: true,
      options,
    });
  };

  const close = () => {
    setDialog({
      open: false,
      options: null,
    });
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!dialog.options) return;
    
    try {
      setLoading(true);
      await dialog.options.onConfirm();
      close();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      setLoading(false);
    }
  };

  return {
    dialog,
    loading,
    confirm,
    close,
    handleConfirm,
  };
};
