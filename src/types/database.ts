export interface Task {
  id: string
  description: string
  due_date: string | null
  completed_at: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  name: string
  created_at: string
}

export interface TaskTag {
  task_id: string
  tag_id: string
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id' | 'created_at'>
        Update: Partial<Omit<Tag, 'id'>>
      }
      task_tags: {
        Row: TaskTag
        Insert: TaskTag
        Update: Partial<TaskTag>
      }
    }
  }
}

export type TaskWithTags = Task & { tags: Tag[] }

export type ViewType = 'inbox' | 'today' | 'trash' | 'unplaced' | 'archived'
