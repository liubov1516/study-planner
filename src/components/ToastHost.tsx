import { useToast } from '../hooks/useToast'
import Toast from './Toast'
import './ToastHost.scss'

const TOAST_DURATION_MS = 3500

// Контейнер у куті екрана: не блокує решту інтерфейсу (pointer-events: none)
function ToastHost() {
  const { toast, dismissToast } = useToast()

  return (
    <div className="toast-host" aria-live="polite">
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
