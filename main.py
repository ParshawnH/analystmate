from dotenv import load_dotenv
load_dotenv()  # Loads .env from the current directory by default

import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from openai_client import ask_openai
from documents_utils import extract_text_from_pdf, chunk_text, summaries_to_pdf
from prompts import SUMMARY_PROMPT
from io import BytesIO

app = FastAPI()

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    file_content = await file.read()
    pdf_stream = BytesIO(file_content)

    print("Extracting and chunking PDF text...")
    chunks = chunk_text(extract_text_from_pdf(pdf_stream))
    print(f"Total chunks to process: {len(chunks)}")

    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    print(f"Using model: {model}")

    results = []
    for i, chunk in enumerate(chunks):
        print(f"\nSending chunk {i + 1}/{len(chunks)} to OpenAI...")
        response = ask_openai(SUMMARY_PROMPT.replace("{text}", chunk), model=model)
        results.append(response)
        print(f"Received response for chunk {i + 1}.")

    print("All chunks processed.")
    pdf_bytes = summaries_to_pdf(results)
    return StreamingResponse(pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=analysis_summary.pdf"})