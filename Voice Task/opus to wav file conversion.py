import subprocess

def convert_opus_to_wav(opus_path, wav_path):
    subprocess.run([
        "ffmpeg", "-y", "-i", opus_path, wav_path
    ])

convert_opus_to_wav("query8.opus", "output1.wav")
