import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Tag } from '../types/database'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTags = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data, error: queryError } = await supabase
        .from('tags')
        .select('*')
        .order('name')

      if (queryError) throw queryError
      setTags(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const createTag = async (name: string) => {
    const { data, error } = await supabase
      .from('tags')
      .insert({ name })
      .select()
      .single()

    if (error) throw error
    await fetchTags()
    return data
  }

  const deleteTag = async (id: string) => {
    await supabase.from('task_tags').delete().eq('tag_id', id)
    const { error } = await supabase.from('tags').delete().eq('id', id)
    if (error) throw error
    await fetchTags()
  }

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
    createTag,
    deleteTag,
  }
}
