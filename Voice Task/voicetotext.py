import ssl
ssl._create_default_https_context = ssl._create_unverified_context

import whisper

#tiny, base, small, medium,large
# Load the model (this will download the model if not already present)
model = whisper.load_model("tiny")  # "tiny" is the smallest, fastest model

# Provide the path to your .opus file
file_path = "query7.wav"

# Perform transcription
result = model.transcribe(file_path)

# Get the transcribed text
transcribed_text = result["text"]
print("Transcription:", transcribed_text)


