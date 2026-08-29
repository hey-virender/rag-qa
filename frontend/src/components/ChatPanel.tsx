import { useState } from 'react'
import { askQuestion } from '../api'

interface QAPair {
  id: number
  question: string
  answer: string | null
  error: string | null
}

interface ChatPanelProps {
  chunksCreated: number
}

export function ChatPanel({ chunksCreated }: ChatPanelProps) {
  const [question, setQuestion] = useState('')
  const [pairs, setPairs] = useState<QAPair[]>([])
  const [isAsking, setIsAsking] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const trimmed = question.trim()
    if (!trimmed || isAsking) return

    const id = Date.now()
    setPairs((prev) => [...prev, { id, question: trimmed, answer: null, error: null }])
    setQuestion('')
    setIsAsking(true)

    try {
      const result = await askQuestion(trimmed)
      setPairs((prev) =>
        prev.map((pair) => (pair.id === id ? { ...pair, answer: result.answer } : pair)),
      )
    } catch {
      setPairs((prev) =>
        prev.map((pair) =>
          pair.id === id
            ? { ...pair, error: 'Failed to get an answer. Please try again.' }
            : pair,
        ),
      )
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col h-[80vh] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">RAG PDF Q&amp;A</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Uploaded — {chunksCreated} chunk{chunksCreated === 1 ? '' : 's'} indexed
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {pairs.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">
            Ask a question about your document to get started.
          </p>
        )}

        {pairs.map((pair) => (
          <div key={pair.id} className="space-y-2">
            <div className="flex justify-end">
              <div className="max-w-[80%] bg-indigo-600 text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm">
                {pair.question}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl rounded-bl-sm px-4 py-2 text-sm">
                {pair.answer !== null ? (
                  pair.answer
                ) : pair.error ? (
                  <span className="text-red-600">{pair.error}</span>
                ) : (
                  <span className="flex items-center gap-2 text-gray-400">
                    <span className="h-3.5 w-3.5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                    Thinking…
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 px-4 py-3 border-t border-gray-200">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about the document…"
          disabled={isAsking}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={isAsking || !question.trim()}
          className="rounded-lg bg-indigo-600 text-white text-sm font-medium px-4 py-2 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
        >
          Ask
        </button>
      </form>
    </div>
  )
}
