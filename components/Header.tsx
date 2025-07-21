'use client'

import { Brain } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary-500 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AnalystMateAI</h1>
          <p className="text-sm text-gray-400">SEC 10-K Risk Analysis Platform</p>
        </div>
      </div>
    </header>
  )
} 