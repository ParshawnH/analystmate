import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for large file processing
})

export interface AnalysisResponse {
  success: boolean
  data?: string
  error?: string
}

export const analyzeFile = async (file: File): Promise<AnalysisResponse> => {
  try {
    console.log('Starting file analysis...')
    console.log('API Base URL:', API_BASE_URL)
    
    const formData = new FormData()
    formData.append('file', file)
    console.log('File size:', file.size, 'bytes')

    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Response received:', response.status)
    console.log('Response data:', response.data)

    // Handle JSON response
    const responseData = response.data
    
    if (responseData.success && responseData.data) {
      console.log('Analysis successful')
      return {
        success: true,
        data: responseData.data,
      }
    } else {
      console.log('Analysis failed:', responseData.message)
      return {
        success: false,
        error: responseData.message || 'Analysis failed',
      }
    }
  } catch (error: any) {
    console.error('Analysis error:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code
    })
    
    let errorMessage = 'An error occurred during analysis'
    
    if (error.response) {
      if (error.response.status === 413) {
        errorMessage = 'File size too large. Please upload a file smaller than 50MB.'
      } else if (error.response.status === 400) {
        errorMessage = 'Invalid file format. Please upload a PDF file.'
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error.response.status === 404) {
        errorMessage = 'API endpoint not found. Please check server configuration.'
      }
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out. Please try again with a smaller file.'
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Network error. Please check if the backend server is running.'
    } else if (error.message) {
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
    }
  }
} 