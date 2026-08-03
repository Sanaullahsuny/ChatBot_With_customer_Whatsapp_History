import React, { useEffect, useState } from 'react';
import {
  View, FlatList, Text, StyleSheet,
  TouchableOpacity, Alert, Platform, ActivityIndicator
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

const SERVER_AUDIO_BASE = 'http://192.168.206.1:5001/modelAnswer/';
const SERVER_AUDIO_QUERY = 'http://192.168.206.1:5001/userQueries/';

// const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
// const SERVER_AUDIO_QUERY = `${global.apiBaseUrl}/userQueries/`;


const COLORS = {
  primary: "#075E54",
  accent: "#25D366",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#212529",
  lightText: "#6C757D",
  border: "#DEE2E6",
  white: "#FFFFFF",
  error: "#DC3545",
  success: "#28A745"
};

const ShowChatCategory = ({ navigation, route }) => {
  const { sessionId, categoryId, categoryTitle } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState([]);
  const [dislikedMessages, setDislikedMessages] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

  useEffect(() => {
    if (!sessionId || !categoryId) {
      Alert.alert("Missing data", "Session ID or Category ID not found.");
      return;
    }
    fetchChatCategoryData();
  }, []);

  const fetchChatCategoryData = async () => {
    try {
       //const res = await fetch(`http://10.0.2.2:5001/chat/getChatCategorySession/${sessionId}`, {

      const res = await fetch(`${global.apiBaseUrl}/chat/getChatCategorySession/${sessionId}`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: categoryId }),
      });

      const data = await res.json();

      const isAudio = str => str?.endsWith('.aac');

      const formatted = data.flatMap((msg, i) => {
        const user = {
          id: i * 2,
          type: msg.type,
          cid: msg.id,
          time: msg.time,
          sender: isAudio(msg.question) ? "user-voice" : "user",
          fileName: isAudio(msg.question) ? msg.question : null,
          text: isAudio(msg.question) ? null : msg.question,
          isfav:msg.isfav
        };

        const bot = {
          id: i * 2 + 1,
          type: msg.type,
          cid: msg.id,
          time: msg.time,
          sender: isAudio(msg.answer) ? "bot-voice" : "bot",
          fileName: isAudio(msg.answer) ? msg.answer : null,
          text: isAudio(msg.answer) ? null : msg.answer,
           isfav:msg.isfav
        };

        return [user, bot];
      });

      setMessages(formatted);
      setLikedMessages(data.filter(m => m.isfav === 0).map(m => m.id));
      setDislikedMessages(data.filter(m => m.isfav === 1).map(m => m.id));
    } catch (err) {
      console.error("Fetch error:", err);
      Alert.alert("Error", "Failed to fetch chat data.");
    } finally {
      setLoading(false);
    }
  };

  const togglePlayback = (fileName, sender) => {
    const fullPath = sender === "user-voice"
      ? SERVER_AUDIO_QUERY + fileName
      : SERVER_AUDIO_BASE + fileName;

    if (currentlyPlaying) {
      currentlyPlaying.stop(() => {
        currentlyPlaying.release();
        setCurrentlyPlaying(null);
        playSound(fullPath);
      });
    } else {
      playSound(fullPath);
    }
  };

  const playSound = (url) => {
    const sound = new Sound(url, null, (error) => {
      if (error) {
        console.error("Sound error:", error);
        Alert.alert("Playback Error", "Unable to play audio.");
        return;
      }

      setCurrentlyPlaying(sound);

      sound.play((success) => {
        if (!success) Alert.alert("Playback Failed");
        sound.release();
        setCurrentlyPlaying(null);
      });
    });
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[
        styles.message,
        item.sender.includes("user") ? styles.userMessage : styles.botMessage
      ]}>
        {item.fileName ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => togglePlayback(item.fileName, item.sender)}>
              <Ionicons
                name="play-circle"
                size={28}
                color={item.sender.includes("user") ? COLORS.primary : "#444"}
              />
            </TouchableOpacity>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        ) : (
          <>
            {item.text && <Text style={styles.messageText}>{item.text}</Text>}
            <Text style={styles.time}>{item.time}</Text>
          </>
        )}

        {(item.sender === "bot" || item.sender === "bot-voice") && (
          <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 6 }}>
            {/* <Ionicons
              name="thumbs-up"
              size={18}
              color={likedMessages.includes(item.cid) ? COLORS.success : COLORS.lightText}
              style={{ marginRight: 12 }}
            />
            <Ionicons
              name="thumbs-down"
              size={18}
              color={dislikedMessages.includes(item.cid) ? COLORS.error : COLORS.lightText}
            /> */}
            <Text style={{backgroundColor:'yellow'}}> Rate is {item.isfav}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>{categoryTitle}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
        />
      )}
    </View>
  );
};

export default ShowChatCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    padding: 15,
    paddingTop: Platform.OS === "ios" ? 50 : 15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    marginLeft: 10,
  },
  message: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 5,
    maxWidth: "80%",
    minWidth: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.accent + "30",
    borderTopRightRadius: 0,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageText: {
    color: COLORS.text,
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    color: COLORS.lightText,
    alignSelf: "flex-end",
    marginTop: 4,
    marginLeft: 8
  },
});
