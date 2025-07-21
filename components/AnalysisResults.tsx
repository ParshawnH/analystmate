'use client'

import { useState } from 'react'
import { Download, FileText, ChevronDown, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalysisSection {
  title: string
  content: string[]
}

interface AnalysisResultsProps {
  results: string
  fileName: string
}

export default function AnalysisResults({ results, fileName }: AnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'structured' | 'raw'>('structured')

  // Parse the results into structured sections
  const parseResults = (results: string): AnalysisSection[] => {
    const sections: AnalysisSection[] = []
    const lines = results.split('\n')
    let currentSection: AnalysisSection | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('Section:') || trimmedLine.startsWith('**')) {
        if (currentSection) {
          sections.push(currentSection)
        }
        const title = trimmedLine.replace(/^Section:\s*|\*\*/g, '').replace(/\*\*$/, '')
        currentSection = { title, content: [] }
      } else if (trimmedLine.startsWith('-') && currentSection) {
        currentSection.content.push(trimmedLine.substring(1).trim())
      } else if (trimmedLine && currentSection && !trimmedLine.startsWith('===')) {
        // Add non-empty lines that aren't section headers or bullet points
        if (!trimmedLine.includes('AnalystMateAI') && !trimmedLine.includes('SEC Filing Summary Report')) {
          currentSection.content.push(trimmedLine)
        }
      }
    }

    if (currentSection) {
      sections.push(currentSection)
    }

    return sections.filter(section => section.content.length > 0)
  }

  const sections = parseResults(results)

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle)
    } else {
      newExpanded.add(sectionTitle)
    }
    setExpandedSections(newExpanded)
  }

  const downloadResults = async (format: 'json' | 'pdf') => {
    try {
      if (format === 'json') {
        const jsonData = {
          fileName,
          analysisDate: new Date().toISOString(),
          sections: sections.map(section => ({
            title: section.title,
            content: section.content
          }))
        }
        
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName.replace('.pdf', '')}_analysis.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('JSON file downloaded successfully')
      } else {
        // For PDF, we'll create a simple PDF download
        // Since the backend returns PDF directly, we'll create a text-based PDF
        const pdfContent = `AnalystMateAI Analysis Report\n\nFile: ${fileName}\nDate: ${new Date().toLocaleDateString()}\n\n${results}`
        
        const blob = new Blob([pdfContent], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName.replace('.pdf', '')}_analysis.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast.success('Analysis report downloaded successfully')
      }
    } catch (error) {
      toast.error(`Failed to download ${format.toUpperCase()} file`)
      console.error('Download error:', error)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
          <p className="text-gray-400">Analysis of {fileName}</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => downloadResults('json')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => downloadResults('pdf')}
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors duration-200"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('structured')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'structured'
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Structured View
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            activeTab === 'raw'
              ? 'bg-primary-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Raw Output
        </button>
      </div>

      {/* Content */}
      {activeTab === 'structured' ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-dark-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-dark-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                {expandedSections.has(section.title) ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {expandedSections.has(section.title) && (
                <div className="px-6 pb-4 space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark-800 rounded-lg p-6">
          <pre className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {results}
          </pre>
        </div>
      )}
    </div>
  )
} 