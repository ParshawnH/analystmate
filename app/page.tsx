'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import FileUpload from '@/components/FileUpload'
import FeaturesSection from '@/components/FeaturesSection'
import AnalysisResults from '@/components/AnalysisResults'
import { analyzeFile } from '@/lib/api'
import toast from 'react-hot-toast'

export default function Home() {
  const [isUploading, setIsUploading] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string>('')

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    setFileName(file.name)
    
    try {
      const response = await analyzeFile(file)
      
      if (response.success && response.data) {
        setAnalysisResults(response.data)
        toast.success('Analysis completed successfully!')
      } else {
        toast.error(response.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('An unexpected error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const handleNewAnalysis = () => {
    setAnalysisResults(null)
    setFileName('')
  }

  return (
    <main className="min-h-screen bg-dark-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!analysisResults ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Intelligent SEC 10-K{' '}
                <span className="text-primary-500">Risk Analysis</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
                Upload your SEC 10-K filing and let our AI extract structured risk disclosures 
                across legal, financial, regulatory, and operational categories.
              </p>
              
              <FileUpload 
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
              />
            </section>

            {/* Features Section */}
            <FeaturesSection />
          </>
        ) : (
          <div className="space-y-8">
            {/* Back Button */}
            <div className="flex justify-start">
              <button
                onClick={handleNewAnalysis}
                className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>New Analysis</span>
              </button>
            </div>

            {/* Results */}
            <AnalysisResults 
              results={analysisResults}
              fileName={fileName}
            />
          </div>
        )}
      </div>
    </main>
  )
} 