import { UNDO_DELAY_MS } from '../data/constants'
import { useTaskContext } from '../hooks/useTaskContext'
import Toast from './Toast'
import './ToastHost.scss'

const TOAST_DURATION_MS = 3500

// Контейнер у куті екрана: не блокує решту інтерфейсу (pointer-events: none)
function ToastHost() {
  const { toast, dismissToast, pendingDelete, undoDelete } = useTaskContext()
  const pendingCount = pendingDelete?.ids.length ?? 0

  return (
    <div className="toast-host" aria-live="polite">
      {/* Undoable Delete: смужка прогресу показує, скільки часу лишилось до остаточного видалення */}
      {pendingDelete && (
        <Toast
          key={`undo-${pendingDelete.requestId}`}
          message={
            pendingCount === 1 ? 'Завдання буде видалено.' : `Буде видалено завдань: ${pendingCount}.`
          }
          variant="info"
          durationMs={UNDO_DELAY_MS}
          showProgress
          actionLabel="Скасувати"
          onAction={undoDelete}
        />
      )}
      {toast && (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          durationMs={TOAST_DURATION_MS}
          onClose={dismissToast}
        />
      )}
    </div>
  )
}

export default ToastHost
