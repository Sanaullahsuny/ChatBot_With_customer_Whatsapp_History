from vosk import Model, KaldiRecognizer
from pydub import AudioSegment
import wave
import json
import io

# Load model
model_path = r"C:\Users\hp\Downloads\vosk-model-en-us-0.22\vosk-model-en-us-0.22"
model = Model(model_path)
rec = KaldiRecognizer(model, 16000)

print("reading file")

# Load and resample using pydub
audio = AudioSegment.from_wav("query5.wav")
audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)

# Export to in-memory WAV
buffer = io.BytesIO()
audio.export(buffer, format="wav")
buffer.seek(0)

# Use wave on buffer
wf = wave.open(buffer, "rb")


# Confirm it's the right format
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
    print("❌ WAV file must be Mono, 16-bit, 16000Hz")
    exit(1)

# Read and transcribe
while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        print(json.loads(rec.Result())["text"])

# Final result
print(json.loads(rec.FinalResult())["text"])
