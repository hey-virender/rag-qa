import { useRef, useState } from 'react'
import { uploadPdf } from '../api'

interface UploadPanelProps {
  onUploadSuccess: (chunksCreated: number) => void
}

type UploadStatus = 'idle' | 'uploading' | 'error'

export function UploadPanel({ onUploadSuccess }: UploadPanelProps) {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setError(null)
    setStatus('uploading')

    try {
      const result = await uploadPdf(file)
      onUploadSuccess(result.chunks_created)
    } catch {
      setError('Upload failed. Please check that the backend is running and try again.')
      setStatus('error')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">RAG PDF Q&amp;A</h1>
      <p className="text-sm text-gray-500 mb-6">
        Upload a PDF to start asking questions about it.
      </p>

      <label
        htmlFor="pdf-upload"
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-6 py-10 text-center cursor-pointer transition-colors ${
          status === 'uploading'
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
        }`}
      >
        <span className="text-sm font-medium text-gray-700">
          {status === 'uploading' ? 'Uploading…' : 'Click to choose a PDF'}
        </span>
        {fileName && status !== 'uploading' && (
          <span className="text-xs text-gray-400">{fileName}</span>
        )}
        <input
          id="pdf-upload"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={status === 'uploading'}
          onChange={handleFileChange}
        />
      </label>

      {status === 'uploading' && (
        <div className="mt-4 flex items-center gap-2 text-sm text-indigo-600">
          <span className="h-4 w-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          Indexing your document…
        </div>
      )}

      {status === 'error' && error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
