
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from translation_service import translator_service
import uvicorn
import random
import io

app = FastAPI(title="Sign Language API")

# -----------------------------
# CORS Configuration
# -----------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
"https://10.155.136.214:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Mock Sign Data
# -----------------------------
ISL_SIGNS = [
    "Hello", "Thank You", "Please", "Yes", "No",
    "Help", "Good Morning", "Goodbye", "Sorry", "Welcome"
]

# -----------------------------
# Request Models
# -----------------------------
class SpeakRequest(BaseModel):
    text: str
    language: str = "en"   # ✅ default added


# -----------------------------
# Health Check
# -----------------------------
@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Sign Language Backend is running"
    }

# -----------------------------
# Predict Endpoint
# -----------------------------
@app.post("/predict")
async def predict_sign(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    return {
        "sign": random.choice(ISL_SIGNS),
        "confidence": round(random.uniform(0.7, 0.99), 2)
    }

# -----------------------------
# Speak Endpoint (FIXED)
# -----------------------------
@app.post("/speak")
async def speak_text(request: SpeakRequest):
    try:
        print(f"[SPEAK] Text: {request.text}, Lang: {request.language}")

        # 1. Translate
        translated_text = translator_service.translate(
            request.text,
            request.language
        )

        if not translated_text:
            raise HTTPException(status_code=500, detail="Translation failed")

        # 2. Generate audio (must return BytesIO or bytes)
        audio_stream = translator_service.text_to_speech(
            translated_text,
            request.language
        )

        if not audio_stream:
            raise HTTPException(status_code=500, detail="Audio generation failed")

        return StreamingResponse(
            audio_stream,
            media_type="audio/mpeg",
            headers={
                "X-Translated-Text": translated_text
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# Server Entry
# -----------------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
