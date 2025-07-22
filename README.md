# AnalystMateAI - SEC 10-K Risk Analysis Platform

A comprehensive AI-powered platform for analyzing SEC 10-K filings and extracting structured risk disclosures across legal, financial, regulatory, and operational categories using OpenAI's GPT models.

## Features

- **Intelligent Analysis**: AI-powered extraction of risk disclosures from SEC 10-K filings using OpenAI GPT models
- **Parallel Processing**: Optimized chunk processing for faster analysis of large documents
- **Structured Output**: Results organized across key categories with comprehensive summaries
- **Natural Language**: Comprehensive summaries in plain English
- **Export Ready**: Download results as JSON or PDF reports
- **Modern UI**: Beautiful, responsive interface with drag-and-drop file upload
- **Production Ready**: Deployed on Render (backend) and Netlify (frontend)

## Tech Stack

### Backend
- **FastAPI**: Python web framework for the API
- **OpenAI**: GPT-3.5-turbo and GPT-4 models for intelligent analysis
- **PyMuPDF**: Advanced PDF text extraction
- **FPDF**: PDF report generation
- **Uvicorn**: ASGI server for production deployment
- **Python-multipart**: File upload handling

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Dropzone**: Drag-and-drop file upload
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications
- **Axios**: HTTP client for API communication

## Project Structure

```
analystmate/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Header.tsx         # Header with logo
│   ├── FileUpload.tsx     # File upload component
│   ├── FeaturesSection.tsx # Features showcase
│   ├── AnalysisResults.tsx # Results display
│   └── FeatureCard.tsx    # Reusable feature card
├── lib/                   # Utility libraries
│   └── api.ts            # API client functions
├── main.py               # FastAPI backend with parallel processing
├── openai_client.py      # OpenAI API integration
├── documents_utils.py    # PDF processing utilities with PyMuPDF
├── prompts.py           # AI prompts for analysis
├── requirements.txt      # Python dependencies
└── fonts/               # Font files for PDF generation
```

## Setup Instructions

### 1. Backend Setup

1. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

3. **Start the FastAPI backend**:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Frontend Setup

1. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## Deployment

### Backend (Render)
- Deployed on Render.com
- Uses `uvicorn main:app --host 0.0.0.0 --port 10000`
- Environment variables configured in Render dashboard
- CORS configured for frontend domain

### Frontend (Netlify)
- Deployed on Netlify
- Environment variables: `NEXT_PUBLIC_API_URL=https://analystmate.onrender.com`
- Automatic deployment from GitHub

## Usage

1. **Upload a 10-K filing**: Drag and drop a PDF file or click to browse
2. **Wait for analysis**: The AI will process your document using parallel chunk processing
3. **Review results**: View structured analysis across different risk categories
4. **Export results**: Download as JSON or PDF format

## API Endpoints

- `GET /`: Health check endpoint
- `POST /analyze`: Upload and analyze a PDF file
  - Accepts: `multipart/form-data` with PDF file
  - Returns: Analysis results as JSON
- `POST /analyze/pdf`: Upload and analyze a PDF file
  - Accepts: `multipart/form-data` with PDF file
  - Returns: Analysis results as PDF download

## Performance Optimizations

- **Parallel Processing**: Chunks are processed concurrently using asyncio
- **Intelligent Chunking**: Text is split based on token limits for optimal API usage
- **Timeout Handling**: 5-minute timeout for large file processing
- **Error Handling**: Comprehensive error handling for network and API issues

## Analysis Process

1. **PDF Extraction**: Uses PyMuPDF for reliable text extraction from complex PDFs
2. **Text Chunking**: Splits large documents into manageable chunks based on token limits
3. **Parallel Analysis**: Processes chunks concurrently using OpenAI API
4. **Summary Generation**: Combines chunk results and generates final comprehensive analysis
5. **Result Delivery**: Returns structured analysis to frontend

## Analysis Categories

The AI analyzes SEC 10-K filings across these key areas:

1. **Legal Disclosures**: Litigation, legal proceedings, SEC comments, audit opinions
2. **Financial Health**: Revenue trends, margins, debt levels, cash flow issues
3. **Regulatory Compliance**: New laws, compliance obligations, audit control issues
4. **Operational Risks**: Supply chain problems, business risk changes
5. **ESG Considerations**: Climate risk, GHG emissions, social practices, governance
6. **Other Notable Disclosures**: Executive compensation, customer concentration risks

## Development

### Backend Development
- The FastAPI server runs on `http://localhost:8000`
- API documentation available at `http://localhost:8000/docs`
- Uses hot reload for development
- Parallel processing enabled for production-like performance

### Frontend Development
- Next.js development server runs on `http://localhost:3000`
- TypeScript for type safety
- Tailwind CSS for styling
- Real-time error handling and user feedback

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
