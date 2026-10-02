import { Textarea } from '@/shared/ui'
import { NoteForm } from '@/entities/note'
import { useNoteFormLogic } from '../model/useNoteFormLogic'

function AddNoteForm() {
  const { formRef, isOpenForm, openForm, handleSubmit, onSubmit, control } = useNoteFormLogic()

  return (
    <div ref={formRef} className="w-full max-w-150 mx-auto my-8 text-left">
      {isOpenForm === false && (
        <div className="rounded-md border border-transparent bg-white shadow-sm hover:shadow-md transition-shadow p-1 cursor-pointer">
          <Textarea
            placeholder="Заметка..."
            onClick={openForm}
            className="border-none bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus-visible:ring-transparent text-base font-medium px-4 py-2.5 cursor-pointer placeholder:text-muted-foreground/70"
          />
        </div>
      )}
      {isOpenForm && <NoteForm control={control} onSubmit={handleSubmit(onSubmit)} />}
    </div>
  )
}

export { AddNoteForm }
