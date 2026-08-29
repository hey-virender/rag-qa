import { useState } from 'react'
import { ChatPanel } from './components/ChatPanel'
import { UploadPanel } from './components/UploadPanel'

function App() {
  const [chunksCreated, setChunksCreated] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {chunksCreated === null ? (
        <UploadPanel onUploadSuccess={setChunksCreated} />
      ) : (
        <ChatPanel chunksCreated={chunksCreated} />
      )}
    </div>
  )
}

export default App
