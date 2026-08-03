import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();
const VOICE_DIR = `${RNFS.DocumentDirectoryPath}/voice_notes`;

const VoiceNoteScreen = () => {
  const [recording, setRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]); // no <string[]> here in JS
  const [playingPath, setPlayingPath] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const exists = await RNFS.exists(VOICE_DIR);
    if (!exists) {
      await RNFS.mkdir(VOICE_DIR);
    }
    await loadVoiceNotes();
  };

  const loadVoiceNotes = async () => {
    try {
      const files = await RNFS.readDir(VOICE_DIR);
      const audioFiles = files
        .filter(file =>
          (file.name.endsWith('.mp4') || file.name.endsWith('.m4a')) &&
          file.path
        )
        .sort((a, b) => {
          const timeA = a.mtime ? a.mtime.getTime() : 0;
          const timeB = b.mtime ? b.mtime.getTime() : 0;
          return timeB - timeA;
        })
        .map(file => file.path); // no `as string` here

      setVoiceNotes(audioFiles);
    } catch (err) {
      console.error('Error loading voice notes:', err);
    }
  };

 

  const startRecording = async () => {
    
   

    const filename = `${Date.now()}_voice_note.mp4`;
    const path = `${VOICE_DIR}/${filename}`;

    await audioRecorderPlayer.startRecorder(path);
    setRecording(true);
  };

  const stopRecording = async () => {
    await audioRecorderPlayer.stopRecorder();
    setRecording(false);
    await loadVoiceNotes();
  };

  const togglePlayback = async (path) => { // no ': string' type here
    try {
      if (!path) {
        console.warn('Invalid path for playback');
        return;
      }

      const exists = await RNFS.exists(path);
      if (!exists) {
        Alert.alert('File not found', 'This voice note file does not exist.');
        return;
      }

      if (playingPath === path) {
        await audioRecorderPlayer.stopPlayer();
        setPlayingPath(null);
      } else {
        await audioRecorderPlayer.startPlayer(path);
        setPlayingPath(path);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#F9F9F9' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Voice Notes</Text>

      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        color={recording ? 'red' : 'green'}
        onPress={recording ? stopRecording : startRecording}
      />

      <FlatList
        data={voiceNotes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 15,
              borderRadius: 10,
              backgroundColor: '#fff',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            <Text style={{ marginBottom: 10 }}>
              Voice Note #{voiceNotes.length - index}
            </Text>
            <TouchableOpacity
              onPress={() => togglePlayback(item)}
              style={{
                backgroundColor: playingPath === item ? '#FF5C5C' : '#4CAF50',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff' }}>
                {playingPath === item ? 'Stop' : 'Play'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default VoiceNoteScreen;
