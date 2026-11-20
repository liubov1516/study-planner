import './StatusMessage.scss'

interface StatusMessageProps {
  variant: 'loading' | 'error' | 'empty'
  title: string
  message?: string
  // Якщо передано, показується кнопка повторного запиту
  onRetry?: () => void
}

// Окремі візуальні стани асинхронного запиту: loading, error, empty
function StatusMessage({ variant, title, message, onRetry }: StatusMessageProps) {
  return (
    <div
      className={`status-message status-message--${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {variant === 'loading' && <span className="status-message__spinner" aria-hidden="true" />}
      <p className="status-message__title">{title}</p>
      {message && <p className="status-message__text">{message}</p>}
      {onRetry && (
        <button className="status-message__retry" type="button" onClick={onRetry}>
          Спробувати ще
        </button>
      )}
    </div>
  )
}

export default StatusMessage
