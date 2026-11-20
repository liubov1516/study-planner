import { useEffect } from 'react'
import './ConfirmDialog.scss'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  // Поки виконується запит, кнопки вимкнені
  isBusy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

// Підтвердження небезпечної дії (замість window.confirm / alert)
function ConfirmDialog({
  title,
  message,
  confirmLabel,
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Закриття клавішею Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isBusy) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isBusy, onCancel])

  return (
    <div className="confirm-dialog">
      <div
        className="confirm-dialog__box"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p id="confirm-dialog-message" className="confirm-dialog__message">
          {message}
        </p>
        <div className="confirm-dialog__actions">
          <button
            className="confirm-dialog__button"
            type="button"
            autoFocus
            disabled={isBusy}
            onClick={onCancel}
          >
            Скасувати
          </button>
          <button
            className="confirm-dialog__button confirm-dialog__button--danger"
            type="button"
            disabled={isBusy}
            onClick={onConfirm}
          >
            {isBusy ? 'Видалення...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
