from fastapi import  UploadFile
from fastapi.responses import StreamingResponse
import PyPDF2
from api.config.client import groq_client

client = groq_client()

def summarize(file: UploadFile):
    text = PyPDF2.PdfReader(file.file).pages[0].extract_text()
    response = client.chat.completions.create(
        model="qwen-2.5-32b",
        messages=[{"role": "user", "content": f"Summarize: {text}"}],
        temperature=2,
        max_completion_tokens=7900,
        top_p=1,
        stream=True,
        stop=None,
    )

    async def generate():
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content

    return StreamingResponse(generate(), media_type="text/plain")