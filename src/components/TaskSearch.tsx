import './TaskSearch.scss'

interface TaskSearchProps {
  query: string
  onQueryChange: (query: string) => void
}

function TaskSearch({ query, onQueryChange }: TaskSearchProps) {
  return (
    <div className="task-search">
      <label className="visually-hidden" htmlFor="task-search">
        Пошук за назвою
      </label>
      <input
        id="task-search"
        className="task-search__input"
        type="search"
        value={query}
        placeholder="Пошук за назвою"
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </div>
  )
}

export default TaskSearch
