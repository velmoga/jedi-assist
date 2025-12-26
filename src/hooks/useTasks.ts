import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Task, Tag, TaskWithTags, ViewType } from '../types/database'

export function useTasks(view: ViewType) {
  const [tasks, setTasks] = useState<TaskWithTags[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          task_tags (
            tags (*)
          )
        `)

      const today = new Date().toISOString().split('T')[0]

      switch (view) {
        case 'inbox':
          query = query
            .is('deleted_at', null)
            .is('completed_at', null)
            .not('due_date', 'is', null)
          break
        case 'today':
          query = query
            .is('deleted_at', null)
            .is('completed_at', null)
            .eq('due_date', today)
          break
        case 'trash':
          query = query.not('deleted_at', 'is', null)
          break
        case 'unplaced':
          query = query
            .is('deleted_at', null)
            .is('completed_at', null)
            .is('due_date', null)
          break
        case 'archived':
          query = query
            .is('deleted_at', null)
            .not('completed_at', 'is', null)
          break
      }

      const { data, error: queryError } = await query.order('created_at', { ascending: false })

      if (queryError) throw queryError

      const tasksWithTags: TaskWithTags[] = (data || []).map((task: any) => ({
        ...task,
        tags: task.task_tags?.map((tt: any) => tt.tags).filter(Boolean) || [],
      }))

      setTasks(tasksWithTags)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [view])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (description: string, dueDate?: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        description,
        due_date: dueDate || null,
        completed_at: null,
        deleted_at: null,
      })
      .select()
      .single()

    if (error) throw error
    await fetchTasks()
    return data
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    await fetchTasks()
  }

  const completeTask = async (id: string) => {
    await updateTask(id, { completed_at: new Date().toISOString() })
  }

  const uncompleteTask = async (id: string) => {
    await updateTask(id, { completed_at: null })
  }

  const deleteTask = async (id: string) => {
    await updateTask(id, { deleted_at: new Date().toISOString() })
  }

  const restoreTask = async (id: string) => {
    await updateTask(id, { deleted_at: null })
  }

  const permanentlyDeleteTask = async (id: string) => {
    await supabase.from('task_tags').delete().eq('task_id', id)
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) throw error
    await fetchTasks()
  }

  const addTagToTask = async (taskId: string, tagId: string) => {
    const { error } = await supabase
      .from('task_tags')
      .insert({ task_id: taskId, tag_id: tagId })

    if (error) throw error
    await fetchTasks()
  }

  const removeTagFromTask = async (taskId: string, tagId: string) => {
    const { error } = await supabase
      .from('task_tags')
      .delete()
      .eq('task_id', taskId)
      .eq('tag_id', tagId)

    if (error) throw error
    await fetchTasks()
  }

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
    createTask,
    updateTask,
    completeTask,
    uncompleteTask,
    deleteTask,
    restoreTask,
    permanentlyDeleteTask,
    addTagToTask,
    removeTagFromTask,
  }
}
