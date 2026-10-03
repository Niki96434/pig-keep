import { HomePage } from '@/pages'
import { BrowserRouter, Routes, Route } from 'react-router'
import { NoteList } from '@/widgets/notelist'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route index element={<NoteList isArchive={false} isDeleted={false} />} />
          <Route path="archive" element={<NoteList isArchive={true} isDeleted={false} />} />
          <Route path="tags/:tagId" element={<NoteList isArchive={false} isDeleted={false} />} />
          <Route path="deleted" element={<NoteList isDeleted={true} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { App }
