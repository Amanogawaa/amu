from fastapi import FastAPI, UploadFile
from groq import Groq
import PyPDF2

app = FastAPI()
client = Groq(api_key="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")

@app.post("/summarize")
async def summarize(file: UploadFile):
    text = PyPDF2.PdfReader(file.file).pages[0].extract_text()
    response = client.chat.completions.create(
        model="mixtral-8x7b-32768",
        messages=[{"role": "user", "content": f"Summarize: {text}"}]
    )
    return {"summary": response.choices[0].message.content}