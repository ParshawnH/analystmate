from fastapi import FastAPI,UploadFile,File
from ollama_client import *
from documents_utils import extract_text_from_pdf, chunk_text
app = FastAPI()
@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    file_content = await file.read()
    extract_text_from_pdf(file_content)
    chunks = chunk_text(extract_text_from_pdf(file_content))
    results = [ask_ollama(chunks) for chunk in chunks]
    return {"Summary": results}


