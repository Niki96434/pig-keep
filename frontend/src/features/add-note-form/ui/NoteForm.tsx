import { Button, Textarea } from '@/shared/ui'
import { Controller } from 'react-hook-form'
import { useNoteFormLogic } from './../model/useNoteFormLogic'

function NoteForm() {
  const { formRef, isOpenForm, openForm, handleSubmit, onSubmit, control } = useNoteFormLogic()

  return (
    <div ref={formRef} className="w-full max-w-150 mx-auto my-8 text-left">
      {isOpenForm === false && (
        <div className="rounded-2xl border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow p-1 cursor-pointer">
          <Textarea
            placeholder="Заметка..."
            onClick={openForm}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-medium px-4 py-2.5 cursor-pointer placeholder:text-muted-foreground/70"
          />
        </div>
      )}
      {isOpenForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col rounded-2xl border border-border/80 bg-card shadow-lg p-3 gap-1 transition-all"
        >
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Название"
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-semibold px-3 py-2 placeholder:text-muted-foreground/60"
              />
            )}
          />
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <Textarea
                {...field}
                autoFocus
                placeholder="Заметка..."
                className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm px-3 py-2 placeholder:text-muted-foreground/60"
              />
            )}
          />
          <div className="flex justify-end pt-2">
            <Button size="lg" variant="ghost" type="submit">
              Закрыть
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export { NoteForm }
