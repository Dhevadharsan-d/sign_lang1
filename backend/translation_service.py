import os
import io
from googletrans import Translator
from gtts import gTTS


class TranslatorService:
    def __init__(self):
        self.translator = Translator()
        # Map frontend language keys to googletrans codes
        self.languages = {
            'Tamil': 'ta',
            'Malayalam': 'ml',
            'Telugu': 'te',
            'Kannada': 'kn',
            'Hindi': 'hi'
        }

    def translate(self, text: str, target_lang_name: str) -> str:
        """Translates text to the target language code."""
        # Default to Hindi if language not found
        lang_code = self.languages.get(target_lang_name, 'hi')

        try:
            translated = self.translator.translate(text, dest=lang_code)
            return translated.text
        except Exception as e:
            print(f"Translation Error: {e}")
            return text  # Fallback: return original text

    def text_to_speech(self, text: str, target_lang_name: str):
        """Generates audio MP3 stream from text."""
        lang_code = self.languages.get(target_lang_name, 'hi')

        try:
            tts = gTTS(text=text, lang=lang_code, slow=False)

            # Save to an in-memory byte buffer instead of a file on disk
            audio_fp = io.BytesIO()
            tts.write_to_fp(audio_fp)
            audio_fp.seek(0)  # Reset pointer to start of file
            return audio_fp

        except Exception as e:
            print(f"TTS Error: {e}")
            return None


# Create a singleton instance to import in main.py
translator_service = TranslatorService()