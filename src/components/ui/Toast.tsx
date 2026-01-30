import { useState, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { Toast as ToastType, ToastType as ToastVariant } from '../../types';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setIsVisible(true), 10);

    // Auto-dismiss
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, toast.duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast, onDismiss]);

  const getToastStyles = (type: ToastVariant): string => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={cn(
        'px-4 py-3 rounded-lg border shadow-lg',
        'transition-all duration-300 ease-out',
        'text-sm font-medium',
        getToastStyles(toast.type),
        isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-4'
      )}
    >
      {toast.message}
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

// Custom hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastVariant = 'info', duration = 2000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastType = {
        id,
        message,
        type,
        duration,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    ToastContainer: () => (
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    ),
  };
}

export default ToastContainer;
