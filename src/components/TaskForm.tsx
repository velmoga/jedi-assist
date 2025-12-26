import { useState } from 'react'
import { Plus } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (description: string, dueDate?: string) => Promise<void>
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit(description.trim(), dueDate || undefined)
      setDescription('')
      setDueDate('')
    } catch (err) {
      console.error('Failed to create task:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-row">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Добавить задачу..."
          className="task-input"
          disabled={isSubmitting}
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="date-input"
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting || !description.trim()} className="add-btn">
          <Plus size={20} />
        </button>
      </div>
    </form>
  )
}
