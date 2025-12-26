import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Check, Trash2, RotateCcw, X, Calendar } from 'lucide-react'
import type { TaskWithTags, ViewType } from '../types/database'

interface TaskItemProps {
  task: TaskWithTags
  view: ViewType
  onComplete: (id: string) => Promise<void>
  onUncomplete: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onRestore: (id: string) => Promise<void>
  onPermanentDelete: (id: string) => Promise<void>
}

export function TaskItem({
  task,
  view,
  onComplete,
  onUncomplete,
  onDelete,
  onRestore,
  onPermanentDelete,
}: TaskItemProps) {
  const isCompleted = !!task.completed_at
  const isDeleted = !!task.deleted_at

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''} ${isDeleted ? 'deleted' : ''}`}>
      <div className="task-content">
        {!isDeleted && (
          <button
            className={`check-btn ${isCompleted ? 'checked' : ''}`}
            onClick={() => (isCompleted ? onUncomplete(task.id) : onComplete(task.id))}
          >
            {isCompleted && <Check size={16} />}
          </button>
        )}

        <div className="task-details">
          <span className="task-description">{task.description}</span>

          <div className="task-meta">
            {task.due_date && (
              <span className="due-date">
                <Calendar size={12} />
                {format(new Date(task.due_date), 'd MMM', { locale: ru })}
              </span>
            )}

            {task.tags.length > 0 && (
              <div className="task-tags">
                {task.tags.map((tag) => (
                  <span key={tag.id} className="tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        {view === 'trash' ? (
          <>
            <button className="action-btn restore" onClick={() => onRestore(task.id)} title="Восстановить">
              <RotateCcw size={16} />
            </button>
            <button className="action-btn danger" onClick={() => onPermanentDelete(task.id)} title="Удалить навсегда">
              <X size={16} />
            </button>
          </>
        ) : view === 'archived' ? (
          <button className="action-btn" onClick={() => onUncomplete(task.id)} title="Вернуть в работу">
            <RotateCcw size={16} />
          </button>
        ) : (
          <button className="action-btn" onClick={() => onDelete(task.id)} title="В корзину">
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
