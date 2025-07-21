'use client'

import { useState } from 'react'

export default function TestPage() {
  const [message, setMessage] = useState('Frontend is working!')

  const testBackend = async () => {
    try {
      const response = await fetch('http://localhost:8000/docs')
      if (response.ok) {
        setMessage('Backend is accessible! ✅')
      } else {
        setMessage('Backend returned error: ' + response.status)
      }
    } catch (error) {
      setMessage('Backend connection failed: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">{message}</h1>
        <button 
          onClick={testBackend}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Test Backend Connection
        </button>
        <div className="text-gray-400">
          <p>Frontend: http://localhost:3000</p>
          <p>Backend: http://localhost:8000</p>
        </div>
      </div>
    </div>
  )
} 