import type { TaskWithTags, ViewType } from '../types/database'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: TaskWithTags[]
  view: ViewType
  loading: boolean
  error: string | null
  onComplete: (id: string) => Promise<void>
  onUncomplete: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onRestore: (id: string) => Promise<void>
  onPermanentDelete: (id: string) => Promise<void>
}

export function TaskList({
  tasks,
  view,
  loading,
  error,
  onComplete,
  onUncomplete,
  onDelete,
  onRestore,
  onPermanentDelete,
}: TaskListProps) {
  if (loading) {
    return <div className="loading">Загрузка...</div>
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>
  }

  if (tasks.length === 0) {
    const emptyMessages: Record<ViewType, string> = {
      inbox: 'Нет задач с датой выполнения',
      today: 'На сегодня задач нет',
      trash: 'Корзина пуста',
      unplaced: 'Нет задач без даты',
      archived: 'Нет завершённых задач',
    }

    return <div className="empty">{emptyMessages[view]}</div>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          view={view}
          onComplete={onComplete}
          onUncomplete={onUncomplete}
          onDelete={onDelete}
          onRestore={onRestore}
          onPermanentDelete={onPermanentDelete}
        />
      ))}
    </div>
  )
}
