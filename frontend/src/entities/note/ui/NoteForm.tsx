import type { SubmitEventHandler } from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Button, Textarea } from '@/shared/ui'
import { cn } from '@/shared/utils'

export interface NoteFormValues {
  title?: string
  content?: string
}

export interface NoteFormProps<T extends FieldValues = NoteFormValues> {
  control: Control<T>
  onSubmit: SubmitEventHandler<HTMLFormElement>
  className?: string
  submitButtonText?: string
}

export function NoteForm<T extends FieldValues = NoteFormValues>({
  control,
  onSubmit,
  className,
  submitButtonText = 'Закрыть',
}: NoteFormProps<T>) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'flex flex-col rounded-md border border-transparent bg-white shadow-sm p-3 gap-1 transition-all focus-within:border-transparent focus-within:ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
        className
      )}
    >
      <Controller
        control={control}
        name={'title' as Path<T>}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Название"
            className="border-none bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus-visible:ring-transparent text-base font-semibold px-3 py-2 placeholder:text-muted-foreground/60"
          />
        )}
      />
      <Controller
        control={control}
        name={'content' as Path<T>}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Заметка..."
            className="border-none bg-transparent shadow-none outline-none focus:outline-none focus-visible:outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:border-transparent focus-visible:border-transparent focus-visible:ring-transparent text-sm px-3 py-2 placeholder:text-muted-foreground/60"
          />
        )}
      />
      <div className="flex justify-end pt-2">
        <Button size="lg" variant="ghost" type="submit">
          {submitButtonText}
        </Button>
      </div>
    </form>
  )
}
