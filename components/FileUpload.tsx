'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isUploading: boolean
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      
      // Validate file type
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      
      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size must be less than 50MB')
        return
      }
      
      onFileUpload(file)
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isUploading
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          dropzone relative p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive ? 'drag-active' : ''}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          ) : (
            <Upload className="w-12 h-12 text-primary-500" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">
              {isUploading ? 'Processing your 10-K filing...' : 'Drop your 10-K filing here'}
            </h3>
            <p className="text-gray-400">
              {isUploading ? 'This may take a few minutes' : 'or click to browse your files'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>Supports PDF files up to 50MB</span>
          </div>
          
          {isUploading && (
            <div className="flex items-center space-x-2 text-sm text-primary-500">
              <AlertCircle className="w-4 h-4" />
              <span>AI is analyzing your document...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 