# import whisper
# #tiny, base, small, medium,large
# # Load the model (this will download the model if not already present)
# model = whisper.load_model("tiny")  # "tiny" is the smallest, fastest model
#
# # Provide the path to your .opus file
# file_path = "query8.opus"
#
# # Perform transcription
# result = model.transcribe(file_path)
#
# # Get the transcribed text
# transcribed_text = result["text"]
# print("Transcription:", transcribed_text)







#
# from datetime import datetime
#
# import os
# import subprocess
# from datetime import datetime
# from werkzeug.utils import secure_filename
#
# UPLOAD_QUERIES_FOLDER = r"C:\Users\hp\FYP Python Work\ChatBot Api\Uploads\UserQueries"
#
#
# def save_user_query(file):
#     print("Saving user .opus file...")
#
#     try:
#         # Create a unique timestamp for the file
#         timestamp = datetime.now().strftime("%d%m%H%M%S%f")
#         print(f"Generated timestamp: {timestamp}")
#         filename = secure_filename(f"{timestamp}.opus")
#         print(f"Secure filename: {filename}")
#
#         # Ensure the folder exists
#         if not os.path.exists(UPLOAD_QUERIES_FOLDER):
#             os.makedirs(UPLOAD_QUERIES_FOLDER)
#             print(f"Created missing directory: {UPLOAD_QUERIES_FOLDER}")
#
#         save_path = os.path.join(UPLOAD_QUERIES_FOLDER, filename)
#         print(f"Full save path: {repr(save_path)}")
#
#         # Save the file
#         file.save(save_path)
#         print("File saved successfully.")
#         return save_path, timestamp
#     except Exception as e:
#         print(f"Exception while saving file: {e}")
#         raise
#
#
# def convert_opus_to_wav(opus_path, wav_path):
#     print("🔄 Starting .opus to .wav conversion using ffmpeg...")
#     print(f"📥 Input: {opus_path}")
#     print(f"📤 Output: {wav_path}")
#
#     # Check if file exists
#     if not os.path.isfile(opus_path):
#         print("❌ Error: Opus file does not exist.")
#         return
#
#     try:
#         result = subprocess.run(
#             ["ffmpeg", "-y", "-i", opus_path, wav_path],
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             text=True
#         )
#         if result.returncode != 0:
#             print("❌ FFmpeg conversion failed:")
#             print(result.stderr)
#         else:
#             print("✅ Conversion completed successfully!")
#     except Exception as e:
#         print(f"🔥 Exception during conversion: {e}")
#
#
#
#
# from vosk import Model, KaldiRecognizer
# from pydub import AudioSegment
# import wave
# import json
# import io
# import os
#
# def transcribe_opus_to_text(opus_file_path, model_path):
#     """
#     Transcribes a .opus audio file to text using Vosk.
#     Falls back to partial transcription if final result is empty.
#     """
#     try:
#         print(f"🔄 Converting {opus_file_path} to WAV format...")
#         audio = AudioSegment.from_file(opus_file_path, format="opus")
#         audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)
#
#         buffer = io.BytesIO()
#         audio.export(buffer, format="wav")
#         buffer.seek(0)
#
#         wf = wave.open(buffer, "rb")
#     except Exception as e:
#         print(f"❌ Error during conversion: {e}")
#         return None
#
#     try:
#         print("🔊 Starting transcription with Vosk...")
#         model = Model(model_path)
#         rec = KaldiRecognizer(model, 16000)
#
#         partial_text = ""
#         while True:
#             data = wf.readframes(4000)
#             if len(data) == 0:
#                 break
#             if rec.AcceptWaveform(data):
#                 result = json.loads(rec.Result())
#                 print("📝 Partial Transcript:", result["text"])
#                 partial_text += result["text"] + " "
#
#         final_result = json.loads(rec.FinalResult())["text"]
#         print("✅ Final Transcript:", final_result)
#
#         # Return final if available, otherwise return partial
#         return final_result if final_result.strip() else partial_text.strip()
#
#
#
#     except Exception as e:
#         print(f"❌ Error during transcription: {e}")
#         return None
#
#
#
# def get_answer_from_query(query):
#     print(f"Getting best match for: {query}")
#     query_embedding = model.encode([query], convert_to_numpy=True)
#     _, indices = index.search(query_embedding, k=1)
#     best_index = indices[0][0]
#     best_question = question_texts[best_index]
#
#     answer_row = df[df['Question'] == best_question]
#     if answer_row.empty:
#         return "No answer found in the dataset.", "No label"
#
#     return answer_row['Answer'].values[0], label_texts[best_index]
#
#
# def process_tags(answer):
#     print("Replacing tags in the answer...")
#     tag_dict = {
#         entry.key: entry.value
#         for entry in KnowledgeBase.query.filter_by(isDeleted=False).all()
#     }
#     return re.sub(r"<(.*?)>", lambda m: tag_dict.get(m.group(1), m.group(0)), answer)
#
#
# def generate_tts_and_convert_to_opus(text, timestamp):
#     print("Generating TTS and converting to .opus...")
#     text = text.replace("%", " percent ")
#     text = re.sub(r"[{}<>]", "", text)
#     text = html.unescape(text)
#
#     engine = pyttsx3.init()
#     engine.setProperty("rate", 150)
#     engine.setProperty("volume", 1.0)
#     for voice in engine.getProperty("voices"):
#         if "female" in voice.name.lower() or "zira" in voice.name.lower():
#             engine.setProperty("voice", voice.id)
#             break
#
#     wav_path = os.path.join(UPLOAD_ANSWERS_FOLDER, f"{timestamp}.wav")
#     opus_path = os.path.join(UPLOAD_ANSWERS_FOLDER, f"{timestamp}.opus")
#
#     try:
#         engine.save_to_file(text, wav_path)
#         engine.runAndWait()
#         print("TTS complete. Saved .wav")
#
#         subprocess.run(["ffmpeg", "-y", "-i", wav_path, opus_path],
#                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
#         print("Converted to .opus")
#
#         os.remove(wav_path)
#         return opus_path
#     except Exception as e:
#         print("TTS error:", e)
#         raise
#
#
# @bertAnswer_bp.route("/ask_by_voice", methods=["POST"])
# def ask_by_voice():
#     try:
#         # Get the file from the request
#         file = request.files.get("file")
#
#         # Check if the file is valid (must be .opus)
#         if not file or not file.filename.endswith(".opus"):
#             return jsonify({"error": "Invalid or missing .opus file"}), 400
#
#         # Save the .opus file
#         opus_path, timestamp = save_user_query(file)
#
#         # Generate dynamic path for .wav file
#         wav_path = os.path.join(UPLOAD_QUERIES_FOLDER, f"{timestamp}.wav")
#
#         # Convert the .opus file to .wav format
#         convert_opus_to_wav(opus_path, wav_path)
#
#         # Specify the path to your Vosk model
#         model_path = r"C:\Users\hp\Downloads\vosk-model-en-us-0.22\vosk-model-en-us-0.22"
#
#         # Transcribe the audio from the .wav file, passing the model_path
#         query = transcribe_opus_to_text(wav_path, model_path)
#
#         # If transcription is empty, return an error
#         if not query.strip():
#             return jsonify({"error": "Empty transcription"}), 400
#
#         # Get the answer from the query
#         answer, label = get_answer_from_query(query)
#         processed_answer = process_tags(answer)
#
#         # Generate the TTS (text-to-speech) audio and convert it to .opus format
#         answer_audio_path = generate_tts_and_convert_to_opus(processed_answer, timestamp)
#
#         # Return the response with the label and the path to the generated audio
#         return jsonify({
#             "label": label,
#             "answer_audio": f"/uploads/ModelAnswers/{os.path.basename(answer_audio_path)}"
#         })
#
#     except Exception as e:
#         # Log the exception and return a generic error message
#         print("Exception occurred:", e)
#         return jsonify({"error": str(e)}), 500
#



