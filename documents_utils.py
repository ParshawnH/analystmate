import PyPDF2

def extract_text_from_pdf(file_bytes):
        reader = PyPDF2.PdfReader(file_bytes)
        return "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])

def chunk_text(text, max_words=300):
        words = text.split()
        return [" ".join(words[i:i + max_words]) for i in range(0, len(words), max_words)]
