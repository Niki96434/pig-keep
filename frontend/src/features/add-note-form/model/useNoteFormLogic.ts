import { useCallback, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { useOnClickOutside } from '../model/useOnClickOutside'
import { NoteCreateInSchema } from '@shared/notes/validationSchemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useCreateNoteMutation } from '../api/useCreateNoteMutation'

export function useNoteFormLogic() {
  const [isOpenForm, setOpenForm] = useState<boolean>(false)
  const formRef = useRef<HTMLDivElement | null>(null)
  const { tagId } = useParams<{ tagId?: string }>()

  const { handleSubmit, control, getValues, reset } = useForm<z.infer<typeof NoteCreateInSchema>>({
    resolver: zodResolver(NoteCreateInSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const closeForm = () => {
    setOpenForm(false)
  }

  const openForm = () => {
    setOpenForm(true)
  }

  const mutation = useCreateNoteMutation()

  const onSubmit = useCallback(() => {
    const data = getValues()
    if (data.title?.trim() !== '' || data.content?.trim() !== '') {
      mutation.mutate(
        { title: data?.title || '', content: data?.content || '', tagId },
        {
          onSuccess: () => reset(),
        }
      )
    }

    closeForm()
  }, [getValues, mutation, reset, tagId])

  useOnClickOutside({ formRef, onSubmit, isOpenForm })

  return {
    formRef,
    isOpenForm,
    openForm,
    handleSubmit,
    onSubmit,
    control,
  }
}

