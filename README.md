# AnalystMateAI - SEC 10-K Risk Analysis Platform

A comprehensive AI-powered platform for analyzing SEC 10-K filings and extracting structured risk disclosures across legal, financial, regulatory, and operational categories.

## Features

- **Intelligent Analysis**: AI-powered extraction of risk disclosures from SEC 10-K filings
- **Structured Output**: Results organized across 8 key categories with JSON formatting
- **Natural Language**: Comprehensive summaries in plain English
- **Export Ready**: Download results as JSON or PDF reports
- **Modern UI**: Beautiful, responsive interface with drag-and-drop file upload

## Tech Stack

### Backend
- **FastAPI**: Python web framework for the API
- **OpenAI**: GPT models for intelligent analysis
- **PyPDF2**: PDF text extraction
- **ReportLab**: PDF report generation

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Dropzone**: Drag-and-drop file upload
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications

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
├── main.py               # FastAPI backend
├── openai_client.py      # OpenAI integration
├── documents_utils.py    # PDF processing utilities
├── prompts.py           # AI prompts
└── requirements.txt      # Python dependencies
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

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## Usage

1. **Upload a 10-K filing**: Drag and drop a PDF file or click to browse
2. **Wait for analysis**: The AI will process your document (may take a few minutes)
3. **Review results**: View structured analysis across different risk categories
4. **Export results**: Download as JSON or PDF format

## API Endpoints

- `POST /analyze`: Upload and analyze a PDF file
  - Accepts: `multipart/form-data` with PDF file
  - Returns: Analysis results as text or PDF

## Development

### Backend Development
- The FastAPI server runs on `http://localhost:8000`
- API documentation available at `http://localhost:8000/docs`
- Uses hot reload for development

### Frontend Development
- Next.js development server runs on `http://localhost:3000`
- API calls are proxied to the backend via Next.js rewrites
- TypeScript for type safety
- Tailwind CSS for styling

## Analysis Categories

The AI analyzes SEC 10-K filings across these key areas:

1. **Legal Disclosures**: Litigation, legal proceedings, SEC comments, audit opinions
2. **Financial Health**: Revenue trends, margins, debt levels, cash flow issues
3. **Regulatory Compliance**: New laws, compliance obligations, audit control issues
4. **Operational Risks**: Supply chain problems, business risk changes
5. **ESG Considerations**: Climate risk, GHG emissions, social practices, governance
6. **Other Notable Disclosures**: Executive compensation, customer concentration risks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
