import sounddevice as sd
import queue
import json
from vosk import Model, KaldiRecognizer
import threading

# Load your Vosk model directory
model_path = r"C:\Users\hp\Downloads\vosk-model-en-us-0.22\vosk-model-en-us-0.22"
model = Model(model_path)

# Audio input settings
samplerate = 16000  # 16 kHz sample rate
q = queue.Queue()

# Initialize recognizer
rec = KaldiRecognizer(model, samplerate)

# Flag to control recording loop
recording = False

def record_audio():
    global recording
    with sd.RawInputStream(samplerate=samplerate, blocksize=8000, dtype='int16',
                           channels=1, callback=callback):
        print("🎙️ Recording... Press 2 to stop.")
        while recording:
            data = q.get()
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                print("📝", result.get("text", ""))
            else:
                partial = json.loads(rec.PartialResult())
                print("...", partial.get("partial", ""), end='\r')

def callback(indata, frames, time, status):
    if status:
        print(status)
    q.put(bytes(indata))

def main():
    global recording

    while True:
        user_input = input("Press 1 to start recording, 2 to stop and transcribe, 0 to exit: ")

        if user_input == '1':
            if not recording:
                recording = True
                threading.Thread(target=record_audio).start()
            else:
                print("🔴 Already recording!")

        elif user_input == '2':
            if recording:
                recording = False
                print("\n🛑 Stopped recording.")
                print("✅ Final Result:", json.loads(rec.FinalResult()).get("text", ""))
            else:
                print("⚠️ Not recording right now.")

        elif user_input == '0':
            print("👋 Exiting...")
            break

        else:
            print("❌ Invalid input! Please press 1, 2, or 0.")

if __name__ == "__main__":
    main()
