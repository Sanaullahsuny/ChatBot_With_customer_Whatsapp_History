import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Share, Alert, TextInput, Animated
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Sound from 'react-native-sound';

const SERVER_AUDIO_BASE = `http://10.0.2.2:5001/modelAnswer/`;
const SERVER_AUDIO_BASE_QUERY = `http://10.0.2.2:5001/userQueries/`;

const ShareChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phno = 'default' } = route.params || {};

  const [sharedChats, setSharedChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [animatedValues, setAnimatedValues] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [receiverInput, setReceiverInput] = useState('');

  useEffect(() => {
    fetchSharedChats();
  }, []);

  const fetchSharedChats = async () => {
    try {
      const res = await fetch(`http://10.0.2.2:5001/shared-chats/by-sender/${phno}`);
      const data = await res.json();
      const anims = {};

      const updated = data.map(chat => {
        const cid = chat.cid || chat.id || Math.random().toString();
        const isAnswerVoice = chat.answer?.toLowerCase().endsWith('.aac');
        const isQuestionVoice = chat.question?.toLowerCase().endsWith('.aac');

        const answer_voice_url = isAnswerVoice ? `${SERVER_AUDIO_BASE}${encodeURIComponent(chat.answer)}` : null;
        const question_voice_url = isQuestionVoice ? `${SERVER_AUDIO_BASE_QUERY}${encodeURIComponent(chat.question)}` : null;

        anims[cid] = new Animated.Value(0);

        return { ...chat, cid, answer_voice_url, question_voice_url };
      });

      setAnimatedValues(anims);
      setSharedChats(updated);
    } catch (err) {
      Alert.alert("Error", "Failed to fetch shared chats");
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (cid) => selectedChats.some(c => c.cid === cid);

  const toggleSelection = (msg) => {
    const already = isSelected(msg.cid);
    const anim = animatedValues[msg.cid];
    if (already) {
      const updated = selectedChats.filter(c => c.cid !== msg.cid);
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: false }).start(() => {
        setSelectedChats(updated);
        if (updated.length === 0) setSelectionMode(false);
      });
    } else {
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
      setSelectedChats([...selectedChats, msg]);
      setSelectionMode(true);
    }
  };

  const clearSelection = () => {
    Object.values(animatedValues).forEach(anim =>
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start()
    );
    setSelectedChats([]);
    setSelectionMode(false);
  };

  const handleShareSelected = () => {
    if (selectedChats.length === 0) {
      Alert.alert("No Selection", "Please select at least one message to share.");
      return;
    }
    setReceiverInput('');
    setShowModal(true);
  };

  const handleSubmitShare = async () => {
    const receiver_id = receiverInput.trim();
    if (!receiver_id) {
      Alert.alert("Error", "Please enter a receiver number.");
      return;
    }

    let successCount = 0;
    for (let chat of selectedChats) {
      const payload = {
        sender_id: phno,
        receiver_id: receiver_id,
        question: chat.question,
        answer: chat.answer,
        date: chat.date,
        time: chat.time,
        status: 'sent',
      };

      const res = await fetch('http://10.0.2.2:5001/shared-chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        successCount++;
      }
    }

    setShowModal(false);
    clearSelection();
    fetchSharedChats();

    if (successCount === selectedChats.length) {
      Alert.alert("✅ Success", "Messages sent successfully.");
    } else if (successCount > 0) {
      Alert.alert("⚠️ Partial Success", `${successCount} of ${selectedChats.length} messages sent.`);
    } else {
      Alert.alert("❌ Failed", "Failed to send any messages.");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (let chat of selectedChats) {
        await fetch(`http://10.0.2.2:5001/chat/${chat.cid}`, { method: 'DELETE' });
      }
      clearSelection();
      fetchSharedChats();
    } catch (err) {
      Alert.alert("Error", "Delete failed");
    }
  };

  const playVoice = (url) => {
    if (!url) return;
    Sound.setCategory('Playback');
    const sound = new Sound(url, undefined, (error) => {
      if (error) {
        Alert.alert("Playback Error", "Audio could not be played");
        return;
      }
      sound.play(success => {
        if (!success) Alert.alert("Playback Error", "Playback failed");
        sound.release();
      });
    });
  };

  const filteredMessages = sharedChats.filter(item =>
    item.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedByReceiver = filteredMessages.reduce((acc, msg) => {
    const id = msg.receiver_id ? msg.receiver_id.toString() : 'Unknown';
    if (!acc[id]) acc[id] = [];
    acc[id].push(msg);
    return acc;
  }, {});

  const renderCheckboxIcon = (msg) => (
    <Ionicons
      name={isSelected(msg.cid) ? 'checkmark-circle' : 'ellipse-outline'}
      size={22}
      color={isSelected(msg.cid) ? '#128C7E' : '#999'}
      style={{ marginLeft: 'auto' }}
    />
  );

  const renderMessage = (item) => {
    const backgroundColor = animatedValues[item.cid]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#cce5ff'],
    }) || 'transparent';

    return (
      <Animated.View key={item.cid} style={{ backgroundColor, borderRadius: 8, padding: 6, marginBottom: 12 }}>
        <TouchableOpacity
          activeOpacity={0.8}
          delayLongPress={300}
          onLongPress={() => toggleSelection(item)}
          onPress={() => selectionMode && toggleSelection(item)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.label}>🧑 Question</Text>
            {selectionMode && renderCheckboxIcon(item)}
          </View>
          <View style={styles.bubble}>
            {item.question_voice_url ? (
              <TouchableOpacity onPress={() => playVoice(item.question_voice_url)} style={{ marginTop: 4 }}>
                <Ionicons name="play-circle" size={32} color="#128C7E" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.message}>{item.question}</Text>
            )}
          </View>

          <Text style={styles.label}>🤖 Answer</Text>
          <View style={[styles.bubble, styles.answerBubble]}>
            {item.answer_voice_url ? (
              <TouchableOpacity onPress={() => playVoice(item.answer_voice_url)} style={{ marginTop: 4 }}>
                <Ionicons name="play-circle" size={32} color="#128C7E" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.message}>{item.answer}</Text>
            )}
          </View>

          <Text style={styles.timestamp}>{item.date} | {item.time}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <TouchableOpacity onPress={clearSelection}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>{selectedChats.length} Selected</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
              <TouchableOpacity onPress={handleShareSelected} style={{ marginRight: 16 }}>
                <Ionicons name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteSelected}>
                <Ionicons name="trash-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.title}>📤 Shared Chats</Text>
          </>
        )}
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search messages..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ flex: 1, fontSize: 15 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#128C7E" style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 12 }}>
          {Object.entries(groupedByReceiver).map(([receiverId, messages]) => (
            <View key={receiverId} style={styles.chatCard}>
              <Text style={styles.receiver}>👤 To: {receiverId}</Text>
              {messages.map(renderMessage)}
            </View>
          ))}
        </ScrollView>
      )}

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Enter Receiver Phone Number</Text>
            <TextInput
              value={receiverInput}
              onChangeText={setReceiverInput}
              placeholder="Enter number"
              style={styles.modalInput}
              keyboardType="number-pad"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalBtn}>
                <Text style={{ color: '#075E54' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmitShare} style={[styles.modalBtn, { backgroundColor: '#25D366' }]}>
                <Text style={{ color: '#fff' }}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ShareChat;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EDEDED' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#075E54', padding: 15, paddingTop: 50,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 10 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    borderWidth: 1, borderColor: '#ddd',
  },
  chatCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 14,
    borderLeftWidth: 5, borderLeftColor: '#25D366', shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08,
    shadowRadius: 4, elevation: 2,
  },
  receiver: { fontSize: 15, fontWeight: 'bold', color: '#128C7E', marginBottom: 12 },
  bubble: { backgroundColor: '#F1F1F1', borderRadius: 8, padding: 10, marginBottom: 6 },
  answerBubble: { backgroundColor: '#D9FDD3' },
  label: { fontSize: 13, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  message: { fontSize: 15, color: '#444', lineHeight: 20 },
  timestamp: { fontSize: 12, color: '#888', textAlign: 'right', marginTop: 2 },

  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%'
  },
  modalTitle: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 8, marginBottom: 16
  },
  modalButtons: {
    flexDirection: 'row', justifyContent: 'space-between'
  },
  modalBtn: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6
  }
});
