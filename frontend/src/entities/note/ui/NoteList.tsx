import { useGetNotesQuery } from '../api/useGetNotes'
import { Note } from './Note'
import styles from './NoteList.module.css'
import { useSearchStore } from '@/stores/fulltext-search/searchStore'

export function NoteList() {
  const searchValue = useSearchStore((state) => state.value)
  const { data, status } = useGetNotesQuery(searchValue ?? undefined)
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
