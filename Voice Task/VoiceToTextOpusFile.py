from vosk import Model, KaldiRecognizer
from pydub import AudioSegment
import wave
import json
import io

# STEP 1: Convert WhatsApp .opus file to WAV using pydub
# Make sure ffmpeg is installed and available in PATH

# Load your .opus WhatsApp file
input_opus = "query4.opus"  # replace with your file name
audio = AudioSegment.from_file(input_opus, format="opus")

# STEP 2: Resample to 16kHz, Mono, 16-bit (Vosk requirement)
audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)

# Export to in-memory buffer
buffer = io.BytesIO()
audio.export(buffer, format="wav")
buffer.seek(0)

# Load buffer with wave module
wf = wave.open(buffer, "rb")

# STEP 3: Transcription with Vosk
model_path = r"C:\Users\hp\Downloads\vosk-model-en-us-0.22\vosk-model-en-us-0.22"
model = Model(model_path)
rec = KaldiRecognizer(model, 16000)

# Transcribe
print("🔊 Transcribing WhatsApp voice message...")
while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        print("📝", json.loads(rec.Result())["text"])

# Final output
final = json.loads(rec.FinalResult())["text"]
print("✅ Final Transcript:", final)
