import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import type { ViewType } from './types/database'
import './App.css'

const viewTitles: Record<ViewType, string> = {
  inbox: 'Входящие',
  today: 'Сегодня',
  trash: 'Корзина',
  unplaced: 'Без даты',
  archived: 'Архив',
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('inbox')

  const {
    tasks,
    loading,
    error,
    createTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    restoreTask,
    permanentlyDeleteTask,
  } = useTasks(currentView)

  const showForm = currentView !== 'trash' && currentView !== 'archived'

  return (
    <div className="app">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="main">
        <header className="header">
          <h2>{viewTitles[currentView]}</h2>
          <span className="task-count">{tasks.length} задач</span>
        </header>

        {showForm && (
          <TaskForm onSubmit={createTask} />
        )}

        <TaskList
          tasks={tasks}
          view={currentView}
          loading={loading}
          error={error}
          onComplete={completeTask}
          onUncomplete={uncompleteTask}
          onDelete={deleteTask}
          onRestore={restoreTask}
          onPermanentDelete={permanentlyDeleteTask}
        />
      </main>
    </div>
  )
}

export default App
