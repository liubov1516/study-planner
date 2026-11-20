import './Pagination.scss'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, total, onPageChange }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Сторінки списку">
      <span className="pagination__info">
        Сторінка <span className="pagination__current">{page}</span> з {totalPages}
        {' · '}Усього завдань: {total}
      </span>
      <div className="pagination__controls">
        <button
          className="pagination__button"
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Назад
        </button>
        <button
          className="pagination__button"
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Далі
        </button>
      </div>
    </nav>
  )
}

export default Pagination
