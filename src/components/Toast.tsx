import { useEffect, useEffectEvent } from 'react'
import type { CSSProperties } from 'react'
import type { ToastVariant } from '../types/toast'
import './Toast.scss'

interface ToastProps {
  message: string
  variant: ToastVariant
  // Через скільки мілісекунд Toast викликає onClose
  durationMs: number
  // Показати смужку прогресу, яка зменшується за durationMs
  showProgress?: boolean
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
}

function Toast({
  message,
  variant,
  durationMs,
  showProgress = false,
  actionLabel,
  onAction,
  onClose,
}: ToastProps) {
  // useEffectEvent: Effect лише запускає таймер, а актуальний onClose читається в момент спрацювання.
  // Тому нова функція onClose від батька (при кожному рендері) не перезапускає таймер.
  const handleTimeout = useEffectEvent(() => {
    onClose?.()
  })

  useEffect(() => {
    const timerId = setTimeout(() => handleTimeout(), durationMs)
    // cleanup: якщо Toast зник раніше (Undo, новий Toast), таймер скасовується
    return () => clearTimeout(timerId)
  }, [durationMs])

  const style = { '--toast-duration': `${durationMs}ms` } as CSSProperties

  return (
    <div
      className={`toast toast--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      style={style}
    >
      <div className="toast__body">
        <p className="toast__message">{message}</p>
        {actionLabel && onAction && (
          <button className="toast__action" type="button" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
      {showProgress && <div className="toast__progress" />}
    </div>
  )
}

export default Toast
