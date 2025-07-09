import fitz  # PyMuPDF
import tiktoken
from fpdf import FPDF
from io import BytesIO
import os


def extract_text_from_pdf(file_bytes):
    """
    Extract text from a PDF file using PyMuPDF.
    This method is more reliable than PyPDF2 for complex PDFs like 10-Ks.
    """
    text = ""
    with fitz.open(stream=file_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text


def chunk_text(text, max_tokens=2000, model="gpt-4-turbo"):
    """
    Chunk the extracted text based on token count for accurate API batching.
    """
    encoding = tiktoken.encoding_for_model(model)
    words = text.split()
    chunks = []
    current_chunk = []

    for word in words:
        current_chunk.append(word)
        tokenized = encoding.encode(" ".join(current_chunk))
        if len(tokenized) > max_tokens:
            chunks.append(" ".join(current_chunk[:-1]))
            current_chunk = [word]

    if current_chunk:
        chunks.append(" ".join(current_chunk))

    return chunks


def summaries_to_pdf(summaries, title="Analysis Summary"):
    """
    Generate a PDF from a list of summary strings. Returns a BytesIO object containing the PDF.
    Uses DejaVuSans.ttf for Unicode support.
    """
    pdf = FPDF()
    pdf.add_page()
    # Add a Unicode font (DejaVuSans.ttf must be in the fonts folder)
    font_path = os.path.join(os.path.dirname(__file__), "fonts", "DejaVuSans.ttf")
    pdf.add_font("DejaVu", "", font_path, uni=True)
    pdf.set_font("DejaVu", size=12)
    pdf.cell(200, 10, txt=title, ln=True, align='C')
    pdf.ln(10)
    for i, summary in enumerate(summaries, 1):
        pdf.multi_cell(0, 10, txt=f"Chunk {i} Summary:\n{summary}\n", align='L')
        pdf.ln(2)
    pdf_output = BytesIO(pdf.output(dest='S').encode('latin1'))
    pdf_output.seek(0)
    return pdf_output