import { useState } from 'react'
import { useTagsModalStore } from '@/stores/manage-tags/tagsModalStore'
import {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} from '@/entities/tag'
import type { Tag } from '@shared/tags/types'

export function useManageTagsModal() {
  const { isOpen, close } = useTagsModalStore()
  const { data } = useGetTagsQuery()
  const createTagMutation = useCreateTagMutation()
  const updateTagMutation = useUpdateTagMutation()
  const deleteTagMutation = useDeleteTagMutation()

  const [tagName, setTagName] = useState('')
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editingTagName, setEditingTagName] = useState('')

  const handleCreate = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    const trimmed = tagName.trim()
    if (!trimmed) return

    createTagMutation.mutate(
      { name: trimmed },
      {
        onSuccess: () => setTagName(''),
      }
    )
  }

  const handleDone = () => {
    if (editingTagId) {
      handleSaveEdit(editingTagId)
    }
    const trimmed = tagName.trim()
    if (trimmed) {
      createTagMutation.mutate(
        { name: trimmed },
        {
          onSuccess: () => {
            setTagName('')
            handleCancelEdit()
            close()
          },
        }
      )
    } else {
      handleCancelEdit()
      close()
    }
  }

  const handleStartEdit = (tag: Tag) => {
    setEditingTagId(tag.id)
    setEditingTagName(tag.name)
  }

  const handleCancelEdit = () => {
    setEditingTagId(null)
    setEditingTagName('')
  }

  const handleSaveEdit = (tagId: string) => {
    const trimmed = editingTagName.trim()
    if (!trimmed) return

    const currentTag = data?.tags.find((t) => t.id === tagId)
    if (currentTag && currentTag.name === trimmed) {
      handleCancelEdit()
      return
    }

    updateTagMutation.mutate(
      { id: tagId, data: { name: trimmed } },
      {
        onSuccess: () => {
          handleCancelEdit()
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (editingTagId === id) {
      handleCancelEdit()
    }
    deleteTagMutation.mutate(id)
  }

  return {
    isOpen,
    close,
    tags: data?.tags ?? [],
    tagName,
    setTagName,
    editingTagId,
    editingTagName,
    setEditingTagName,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleCreate,
    handleDone,
    handleDelete,
    isCreating: createTagMutation.isPending,
    isUpdating: updateTagMutation.isPending,
  }
}

