import Header from './components/Header'
import ToastHost from './components/ToastHost'
import TasksPage from './pages/TasksPage'
import './App.scss'

function App() {
  return (
    <div className="app">
      <Header />
      <TasksPage />
      <ToastHost />
    </div>
  )
}

export default App
