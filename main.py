from dotenv import load_dotenv
load_dotenv()  # Loads .env from the current directory by default

import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from openai_client import ask_openai
from documents_utils import extract_text_from_pdf, chunk_text, summaries_to_pdf
from prompts import SUMMARY_PROMPT
from io import BytesIO
import asyncio

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "https://analystmate.onrender.com"  # Added deployed Netlify frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    print("Received /analyze request")
    file_content = await file.read()
    pdf_stream = BytesIO(file_content)

    print("Extracting PDF text...")
    full_text = extract_text_from_pdf(pdf_stream)
    print(f"Total text length: {len(full_text)} characters")

    model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    print(f"Using model: {model}")

    if len(full_text) > 100000:
        print("Text is very large, using chunked processing...")
        chunks = chunk_text(full_text)
        print(f"Split into {len(chunks)} chunks")

        async def process_chunk(i, chunk):
            print(f"\nProcessing chunk {i + 1}/{len(chunks)}...")
            chunk_prompt = f"""
            Analyze this section of an SEC 10-K filing and extract key risk information.
            Focus on material disclosures, risks, and important findings.
            Provide concise bullet points of the most important information.
            
            Text: {chunk}
            """
            return await asyncio.to_thread(ask_openai, chunk_prompt, model)

        chunk_results = await asyncio.gather(*[process_chunk(i, chunk) for i, chunk in enumerate(chunks)])

        combined_chunk_results = "\n\n".join(chunk_results)
        print("Processing combined results with full analysis...")
        final_response = await asyncio.to_thread(ask_openai, SUMMARY_PROMPT.replace("{text}", combined_chunk_results), model)

        return JSONResponse(content={
            "success": True,
            "data": final_response,
            "message": "Analysis completed successfully"
        })
    else:
        print("Processing entire document...")
        response = await asyncio.to_thread(ask_openai, SUMMARY_PROMPT.replace("{text}", full_text), model)
        return JSONResponse(content={
            "success": True,
            "data": response,
            "message": "Analysis completed successfully"
        })

@app.post("/analyze/pdf")
async def analyze_file_pdf(file: UploadFile = File(...)):
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