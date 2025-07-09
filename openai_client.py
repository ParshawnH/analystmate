from openai import OpenAI
import os

def ask_openai(prompt, model=None, timeout=90):
    """
    Call the OpenAI API using the provided prompt and model.
    Uses environment variable OPENAI_MODEL if not explicitly set.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")

    if model is None:
        model = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")

    client = OpenAI(api_key=api_key)

    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        timeout=timeout
    )

    return response.choices[0].message.content.strip()