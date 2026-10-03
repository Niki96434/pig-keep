import { useGetNotesQuery } from '@/entities/note'
import { Note } from '@/entities/note'
import { useSearchStore } from '@/stores/fulltext-search/searchStore'
import { useDebounce } from '@/shared/hooks'
import styles from './NoteList.module.css'

export function NoteList() {
  const searchValue = useSearchStore((state) => state.value)
  const { search } = useDebounce(searchValue ?? undefined)

  const { data, status } = useGetNotesQuery({ searchValue: search })

  if (status === 'error' || !data) {
    return <p>Ошибка загрузки</p>
  }

  return (
    <div className={styles.container}>
      {data.notes.map((note) => {
        return <Note key={note.id} id={note.id} title={note.title} content={note.content} />
      })}
    </div>
  )
}
