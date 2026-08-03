import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  ActivityIndicator, TextInput, Alert, Share, Animated
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Sound from 'react-native-sound';

// const SERVER_AUDIO_BASE = `http://10.0.2.2:5001/modelAnswer/`;
// const SERVER_AUDIO_BASE_QUERY = `http://10.0.2.2:5001/userQueries/`;

const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
const SERVER_AUDIO_BASE_QUERY = `${global.apiBaseUrl}/userQueries/`;


const ReceiveChat = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { phno = 'default' } = route.params || {};

  const [groupedChats, setGroupedChats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      // const response = await fetch(`http://10.0.2.2:5001/shared-chats/by_receiver/${phno}`);

      const response = await fetch(`${global.apiBaseUrl}/shared-chats/by_receiver/${phno}`);

      const data = await response.json();
      const grouped = {};
      const anims = {};

      if (Array.isArray(data)) {
        data.forEach(chat => {
          if (!chat.cid) chat.cid = chat.id || Math.random();
          chat.type = chat.type === 1 || chat.type === '1' ? 1 : 0;

          // Generate voice URLs if audio
          if (chat.type === 1) {
            const isAnswerVoice = (chat.answer || '').endsWith('.aac');
            const isQuestionVoice = (chat.question || '').endsWith('.aac');

            if (isAnswerVoice) {
              chat.voice_url_answer = `${SERVER_AUDIO_BASE}${chat.answer}`;
            }

            if (isQuestionVoice) {
              chat.voice_url_question = `${SERVER_AUDIO_BASE_QUERY}${chat.question}`;
            }
          }

          if (!grouped[chat.sender_id]) grouped[chat.sender_id] = [];
          grouped[chat.sender_id].push(chat);
          anims[chat.cid] = new Animated.Value(0);
        });
      }

      setGroupedChats(grouped);
      setAnimatedValues(anims);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert("Error", "Failed to fetch chats");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (msg) => {
    if (!msg?.cid) return;
    const isSelected = selectedChats.some(c => c.cid === msg.cid);
    const anim = animatedValues[msg.cid];

    if (isSelected) {
      const updated = selectedChats.filter(c => c.cid !== msg.cid);
      Animated.timing(anim, { toValue: 0, duration: 300, useNativeDriver: false }).start(() => {
        setSelectedChats(updated);
        if (updated.length === 0) setSelectionMode(false);
      });
    } else {
      Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: false }).start();
      setSelectionMode(true);
      setSelectedChats([...selectedChats, msg]);
    }
  };

  const clearSelection = () => {
    Object.values(animatedValues).forEach(anim =>
      Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start()
    );
    setSelectedChats([]);
    setSelectionMode(false);
  };

  const handleDeleteSelected = async () => {
    try {
      for (let chat of selectedChats) {
        // await fetch(`http://10.0.2.2:5001/shared-chats/${chat.cid}`, {

        await fetch(`${global.apiBaseUrl}/shared-chats/${chat.cid}`, {

          method: 'DELETE'
        });
      }
      clearSelection();
      fetchChatHistory();
    } catch (err) {
      console.error("Delete error:", err);
      Alert.alert("Error", "Failed to delete messages");
    }
  };

  const handleShareSelected = async () => {
    try {
      const message = selectedChats.map(c => `🧑 ${c.question}\n🤖 ${c.answer}`).join('\n\n');
      await Share.share({ message });
      clearSelection();
    } catch (err) {
      Alert.alert("Error", "Could not share messages");
    }
  };

  const filteredFlatMessages = () => {
    const results = [];
    const lowerSearch = searchTerm.toLowerCase();

    Object.entries(groupedChats).forEach(([senderId, messages]) => {
      messages.forEach(msg => {
        if (
          senderId.toLowerCase().includes(lowerSearch) ||
          msg.question.toLowerCase().includes(lowerSearch) ||
          msg.answer.toLowerCase().includes(lowerSearch)
        ) {
          results.push({ ...msg, sender_id: senderId });
        }
      });
    });

    return results.filter(m => m.cid);
  };

  const togglePlayback = (url) => {
    if (!url) return;
    Sound.setCategory('Playback');
    const sound = new Sound(url, null, (error) => {
      if (error) {
        Alert.alert("Playback Error", "Unable to play audio");
        return;
      }
      sound.play(success => {
        if (!success) {
          Alert.alert("Playback Failed", "Failed to play audio");
        }
        sound.release();
      });
    });
  };

  const isSelected = (cid) => selectedChats.some(c => c.cid === cid);

  const renderCheckboxIcon = (msg) => (
    <Ionicons
      name={isSelected(msg.cid) ? 'checkmark-circle' : 'ellipse-outline'}
      size={22}
      color={isSelected(msg.cid) ? '#128C7E' : '#999'}
      style={{ marginLeft: 'auto' }}
    />
  );

  const renderMessage = ({ item }) => {
    if (!item?.cid) return null;
    const backgroundColor = animatedValues[item.cid]?.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#cce5ff'],
    }) || 'transparent';

    return (
      <Animated.View style={{ backgroundColor, borderRadius: 8, padding: 6, marginBottom: 12 }}>
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
            {item.type === 1 && item.voice_url_question ? (
              <TouchableOpacity onPress={() => togglePlayback(item.voice_url_question)}>
                <Ionicons name="play-circle" size={28} color="#128C7E" />
              </TouchableOpacity>
            ) : (
              <Text style={styles.message}>{item.question}</Text>
            )}
          </View>

          <View style={[styles.bubble, styles.answerBubble]}>
            <Text style={styles.label}>🤖 Answer</Text>
            {item.type === 1 && item.voice_url_answer ? (
              <TouchableOpacity onPress={() => togglePlayback(item.voice_url_answer)}>
                <Ionicons name="play-circle" size={28} color="#128C7E" />
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
            <Text style={styles.title}>📥 Received Chats</Text>
          </>
        )}
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search by sender or message..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{ flex: 1, fontSize: 15 }}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#128C7E" style={{ marginTop: 30 }} />
      ) : searchTerm ? (
        <FlatList
          data={filteredFlatMessages()}
          keyExtractor={(item, index) => item?.cid ? item.cid.toString() : index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 12 }}
        />
      ) : (
        <FlatList
          data={Object.entries(groupedChats)}
          keyExtractor={(item, index) => item?.[0] ?? index.toString()}
          renderItem={({ item }) => {
            const senderId = item[0];
            const messages = item[1];
            return (
              <View style={styles.chatCard}>
                <Text style={styles.sender}>👤 From: {senderId}</Text>
                <FlatList
                  data={messages}
                  keyExtractor={(msg, idx) => msg?.cid ? msg.cid.toString() : idx.toString()}
                  renderItem={renderMessage}
                  scrollEnabled={false}
                />
              </View>
            );
          }}
          contentContainerStyle={{ padding: 12 }}
        />
      )}
    </View>
  );
};

export default ReceiveChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEDED',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    padding: 15,
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 5,
    borderLeftColor: '#25D366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sender: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#128C7E',
    marginBottom: 12,
  },
  bubble: {
    backgroundColor: '#F1F1F1',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
  },
  answerBubble: {
    backgroundColor: '#D9FDD3',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 2,
  },
});
