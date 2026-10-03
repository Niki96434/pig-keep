import { useEditNoteStore } from '@/stores/edit-note/editNoteStore'
import { useGetTagsQuery } from '@/entities/tag'
import { useDeleteNoteMutation } from '../api/useDeleteNoteMutation'
import { usePatchNoteMutation } from '../api/usePatchNoteMutation'
import {
  useGetNoteTagsQuery,
  useAddTagToNoteMutation,
  useRemoveTagFromNoteMutation,
} from '../api/useNoteTags'

interface UseNoteLogicProps {
  id: string
  isArchive?: boolean | null
  isDeleted?: boolean | null
}

export function useNoteLogic({ id, isArchive, isDeleted }: UseNoteLogicProps) {
  const actions = useEditNoteStore((state) => state.actions)

  const delMutation = useDeleteNoteMutation()
  const patchMutation = usePatchNoteMutation()
  const { data: noteTagsData } = useGetNoteTagsQuery(id)
  const { data: allTagsData } = useGetTagsQuery()
  const addTagMutation = useAddTagToNoteMutation()
  const removeTagMutation = useRemoveTagFromNoteMutation()

  const noteTags = noteTagsData?.tags ?? []
  const allTags = allTagsData?.tags ?? []

  const handleCardClick = () => {
    if (isArchive || isDeleted) return
    actions.setOpenEditForm()
    actions.setId(id)
  }

  const handleToggleTag = (tagId: string, isAttached: boolean) => {
    if (isAttached) {
      removeTagMutation.mutate({ noteId: id, tagId })
    } else {
      addTagMutation.mutate({ noteId: id, tagId })
    }
  }

  const handleRemoveTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeTagMutation.mutate({ noteId: id, tagId })
  }

  const handleToggleArchive = (e: React.MouseEvent) => {
    e.stopPropagation()
    patchMutation.mutate({
      id,
      data: { isArchive: !isArchive },
    })
  }

  const handleDeleteNote = () => {
    patchMutation.mutate({
      id,
      data: { isDeleted: true },
    })
  }

  const handleRestoreNote = (e: React.MouseEvent) => {
    e.stopPropagation()
    patchMutation.mutate({
      id,
      data: { isDeleted: false },
    })
  }

  const handlePermanentDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    delMutation.mutate(id)
  }

  return {
    noteTags,
    allTags,
    isDeleting: delMutation.isPending,
    isPatching: patchMutation.isPending,
    handleCardClick,
    handleRemoveTag,
    handleToggleTag,
    handleToggleArchive,
    handleDeleteNote,
    handleRestoreNote,
    handlePermanentDelete,
  }
}
