import { useContext } from 'react'
import { ToastContext } from '../context/ToastContext'
import type { ToastContextValue } from '../context/ToastContext'

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast має використовуватися всередині <ToastProvider>.')
  }
  return context
}
