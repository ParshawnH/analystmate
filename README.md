# 📘 Project: AnalystMateAI – LLM-Powered SEC Compliance Assistant

## 🔍 Overview
AnalystMateAI is an AI-powered financial risk analysis tool that uses OpenAI's Large Language Model (LLM) to analyze SEC 10-K filings. The app extracts and classifies material risk disclosures, legal issues, ESG concerns, and financial red flags into a structured JSON summary. It's designed for analysts, auditors, legal teams, and ESG professionals.

## 🧩 Key Features
- 📄 Upload 10-K PDF filings for analysis
- 🤖 Uses OpenAI LLM (e.g. GPT-3.5-turbo or GPT-4)
- 📊 Outputs structured JSON with categorized risks:
  - legal
  - financial
  - regulatory
  - operational
  - esg
  - other
- 🔐 Secure and private (API key required)
- 📁 Exportable summaries (JSON-ready)
- 🖥️ Sleek black-themed frontend (to be built separately by collaborator)

---

## 🚀 How It Works
1. User uploads a 10-K filing PDF.
2. The FastAPI backend extracts text using PyPDF2.
3. Text is chunked into LLM-friendly segments.
4. Each chunk is passed through a financial compliance prompt.
5. OpenAI returns structured JSON summaries per chunk.
6. All chunks are merged into a single categorized response.

---

## 🛠️ Tech Stack
| Layer       | Technology                  |
|-------------|-----------------------------|
| Backend     | Python, FastAPI             |
| PDF Parsing | PyPDF2                      |
| LLM Engine  | OpenAI (gpt-3.5-turbo/4)    |
| Frontend    | React/Vue (built separately)|
| Deployment  | Local (localhost:8000)      |

---

## 🧱 Project Structure
```
analystmateai/
├── main.py              # FastAPI app
├── openai_client.py     # Send prompts to OpenAI
├── document_utils.py    # PDF text extraction and chunking
├── prompts.py           # Prompt used for LLM
├── requirements.txt     # Python dependencies
├── lovable_ui/          # Frontend placeholder (handled externally)
```

---

## 📥 Setup Instructions
### 1. Clone the Repo
```
git clone https://github.com/yourusername/analystmateai.git
cd analystmateai
```

### 2. Create Virtual Environment
```
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
```

### 3. Install Dependencies
```
pip install -r requirements.txt
```

### 4. Set Up OpenAI API Key
Obtain your OpenAI API key from https://platform.openai.com/account/api-keys and set it as an environment variable:
```
export OPENAI_API_KEY=sk-...
```
(You can add this line to your `.env` or shell profile for convenience.)

### 5. Start the Backend Server
```
uvicorn main:app --reload
```
Visit [http://localhost:8000/docs](http://localhost:8000/docs) to test via Swagger UI.

---

## 🧪 Test with a PDF
Use Swagger UI or curl:
```bash
curl -X POST "http://localhost:8000/analyze/" \
  -H  "accept: application/json" \
  -F "file=@your_file.pdf"
```

Expected Output:
```json
{
  "structured_summary": {
    "legal": ["Pending litigation with supplier X..."],
    "financial": ["Revenue declined 12% YoY due to inflation..."],
    ...
  }
}
```

---

## 💬 Prompt Engineering
Stored in `prompts.py`. This prompt instructs the LLM to:
- Extract and categorize risk into 6 areas
- Output valid JSON
- Keep statements short and insightful (3–4 sentences)
- Focus on material and novel risks

---

## 🧠 Potential Add-Ons
- Compare two filings year-over-year
- Chat with the filing (chatbot UI)
- PDF source clause tracing
- Export reports as downloadable PDFs
- In-app risk dashboard with visualizations

---

## 👤 Author
**Parshawn Haynes**  
Backend: Python, FastAPI, OpenAI Integration  
Frontend: Handled by collaborator (React/Vue)

---

## 📜 License
[MIT License](LICENSE)

---

## 📌 Contact
For collaboration, feedback or demo requests:
📧 parshawnhaynes@gmail.com

---

**AnalystMateAI** is built to bridge the gap between regulatory documents and actionable insight — now powered by OpenAI LLMs.
