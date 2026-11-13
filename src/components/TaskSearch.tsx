import { useTaskContext } from '../hooks/useTaskContext'
import './TaskSearch.scss'

function TaskSearch() {
  const { query, setQuery } = useTaskContext()

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
        onChange={(event) => setQuery(event.target.value)}
      />
    </div>
  )
}

export default TaskSearch
