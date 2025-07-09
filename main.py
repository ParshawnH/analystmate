from fastapi import FastAPI,UploadFile,File
from ollama_client import *
from documents_utils import extract_text_from_pdf, chunk_text
from prompts import SUMMARY_PROMPT
from io import BytesIO
app = FastAPI()
@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    file_content = await file.read()
    pdf_stream = BytesIO(file_content)
    chunks = chunk_text(extract_text_from_pdf(pdf_stream))
    print("Sending request to Ollama...")
    results = [ask_ollama(SUMMARY_PROMPT.replace("{text}", chunk)) for chunk in chunks]
    print("Received response from Ollama.")
    return {"Summary": results}


