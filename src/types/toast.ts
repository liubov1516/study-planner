export type ToastVariant = 'success' | 'error' | 'info'

export interface ToastMessage {
  // Унікальний номер: новий Toast замінює попередній і запускає власний таймер
  id: number
  variant: ToastVariant
  message: string
}
