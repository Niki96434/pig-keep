import type { SubmitEventHandler } from 'react'
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form'
import { Button, Textarea } from '@/shared/ui'
import { cn } from '@/shared/utils/utils'

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
        'flex flex-col rounded-2xl border border-border/80 bg-card shadow-lg p-3 gap-1 transition-all bg-white',
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
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-base font-semibold px-3 py-2 placeholder:text-muted-foreground/60"
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
            className="border-none bg-transparent shadow-none focus-visible:ring-0 text-sm px-3 py-2 placeholder:text-muted-foreground/60"
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
