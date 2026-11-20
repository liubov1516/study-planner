import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { ToastMessage, ToastVariant } from '../types/toast'
import { ToastContext } from './ToastContext'
import type { ToastContextValue } from './ToastContext'

interface ToastProviderProps {
  children: ReactNode
}

// Context лишився лише для того, що справді потрібне всім: сповіщень.
// Дані завдань (server state) у Context не потрапляють
export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const counter = useRef(0)

  const showToast = useCallback((variant: ToastVariant, message: string) => {
    counter.current += 1
    setToast({ id: counter.current, variant, message })
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ toast, showToast, dismissToast }),
    [toast, showToast, dismissToast],
  )

  return <ToastContext value={value}>{children}</ToastContext>
}
