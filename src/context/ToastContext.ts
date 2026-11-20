import { createContext } from 'react'
import type { ToastMessage, ToastVariant } from '../types/toast'

export interface ToastContextValue {
  toast: ToastMessage | null
  showToast: (variant: ToastVariant, message: string) => void
  dismissToast: () => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
