import { useState } from 'react'
import { useTagsModalStore } from '@/stores/manage-tags/tagsModalStore'
import { useGetTagsQuery, useCreateTagMutation, useDeleteTagMutation } from '@/entities/tag'

export function useManageTagsModal() {
  const { isOpen, close } = useTagsModalStore()
  const { data } = useGetTagsQuery()
  const createTagMutation = useCreateTagMutation()
  const deleteTagMutation = useDeleteTagMutation()
  const [tagName, setTagName] = useState('')

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
    const trimmed = tagName.trim()
    if (trimmed) {
      createTagMutation.mutate(
        { name: trimmed },
        {
          onSuccess: () => {
            setTagName('')
            close()
          },
        }
      )
    } else {
      close()
    }
  }

  const handleDelete = (id: string) => {
    deleteTagMutation.mutate(id)
  }

  return {
    isOpen,
    close,
    tags: data?.tags ?? [],
    tagName,
    setTagName,
    handleCreate,
    handleDone,
    handleDelete,
    isCreating: createTagMutation.isPending,
  }
}
