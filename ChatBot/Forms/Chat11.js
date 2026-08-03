import React, { useState, useEffect, useRef } from "react";

import {
  View, FlatList, TextInput, TouchableOpacity, Text,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Modal, ScrollView 
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

const audioRecorderPlayer = new AudioRecorderPlayer();
const VOICE_DIR = `${RNFS.DocumentDirectoryPath}/voice_notes`;
const SERVER_UPLOAD_ENDPOINT = `http://192.168.206.1:5001/ask_by_voice`;
const SERVER_AUDIO_BASE = `http://192.168.206.1:5001/modelAnswer/`;
const SERVER_AUDIO_BASE_query = `http://192.168.206.1:5001/userQueries/`;

// const SERVER_UPLOAD_ENDPOINT = `${global.apiBaseUrl}/ask_by_voice`;
// const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
// const SERVER_AUDIO_BASE_query = `${global.apiBaseUrl}/userQueries/`;


const COLORS = {
  primary: "#075E54",
  secondary: "#128C7E",
  accent: "#25D366",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#212529",
  lightText: "#6C757D",
  border: "#DEE2E6",
  white: "#FFFFFF",
  error: "#DC3545",
  success: "#28A745",
};


const ChatScreenWithVoice = () => {


  const [chatvalue, setchatvalue] = useState(0);
   const [isuserreply, setisuerreply] = useState(1);

  const [hasSeenNotification, setHasSeenNotification] = useState(false);  // ✅ user has seen

const [notificationCount, setNotificationCount] = useState(0);
const [notificationValue, setNotificationValue] = useState(0);

const [datePickerVisible, setDatePickerVisible] = useState(false);
const [dateSections, setDateSections] = useState([]);
const flatListRef = useRef();
const [unreadCount, setUnreadCount] = useState(0);


const [shareModalVisible, setShareModalVisible] = useState(false);
const [receiverIdInput, setReceiverIdInput] = useState('');


const [dateModalVisible, setDateModalVisible] = useState(false);
const [selectedDate, setSelectedDate] = useState('All');

  const [messages, setMessages] = useState([]);

    const [chatid, setchatid] = useState(1);




    const handleuserreply = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const userMsg = { id: Date.now(), text: input, sender: "user", time };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${global.apiBaseUrl}/chat/save_user_reply/${chatid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_reply:input})
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

    setisuerreply(1)
   
    } catch (err) {
      console.error("Send message error:", err);
      Alert.alert("Error", "Could not send message");
    }
  };

//seach ka code 

const highlightText = (text, query) => {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <Text key={index} style={{ backgroundColor: 'yellow' }}>{part}</Text>
    ) : (
      <Text key={index}>{part}</Text>
    )
  );
};

useEffect(() => {
  if (!showSearch) {
    setSearchQuery("");  // search bar band hone pe search query bhi clear
  }
}, [showSearch]);


  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [likedMessages, setLikedMessages] = useState([]);
  const [dislikedMessages, setDislikedMessages] = useState([]);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = useNavigation();
  const route = useRoute();
 const { personId, phno } = route.params || {};

useEffect(() => {
  
    //fetchNotification();
    //const interval = setInterval(fetchNotification, 1000);
    //return () => clearInterval(interval);
  }
, [phno]); 

const prevNotificationCount = useRef(0);  // ⬅️ Yeh last count yaad rakhega

const fetchNotification = async () => {
  try {
    // const res = await fetch(`http://10.0.2.2:5001/notice/pending/${phno}`);
    const res = await fetch(`${global.apiBaseUrl}/notice/pending/${phno}`);

    if (res.ok) {
      const data = await res.json();
      const count = data.length;

      setNotificationCount(count);

      // ✅ Sirf tab badge update kro jab new notifications aaye hon
      if (count > prevNotificationCount.current) {
        setNotificationValue(count);  // badge dikhao
      }

      // 🔄 Update the previous count for next comparison
      prevNotificationCount.current = count;
    }
  } catch (err) {
    console.error("Notification fetch error:", err);
  }
};




//   useEffect(() => {
//     initVoiceDir();
//     if (personId) 
//         fetchChatHistory();
//   }, [personId]);

  const initVoiceDir = async () => {
    try {
      const exists = await RNFS.exists(VOICE_DIR);
      if (!exists) await RNFS.mkdir(VOICE_DIR);
    } catch (err) {
      console.error("Error creating voice directory:", err);
    }
  };
  useEffect(() => {
  const allDates = [...new Set(messages.map(m => m.date))];
  setDateSections(allDates);
}, [messages]);


  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${global.apiBaseUrl}/chat/person/${personId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formattedMessages = data.flatMap((msg, i) => {
  const isVoice = msg.type === true;

  const user = {
    id: i * 2,
    text: isVoice ? msg.TranscribedQuestion || "Voice question" : msg.question,
    audio: isVoice ? msg.question : null,  // ← this is file name
    sender: isVoice ? "user-voice" : "user",
    time: msg.time,
    type: msg.type,
    cid: msg.id,
    date: msg.date,
  };

  const bot = {
    id: i * 2 + 1,
    text: isVoice ? msg.TranscribedAnswer || "Voice answer" : msg.answer,
    audio: isVoice ? msg.answer : null,   // ← this is file name
    sender: isVoice ? "bot-voice" : "bot",
    time: msg.time,
    type: msg.type,
    cid: msg.id,
  };

  return [user, bot];
});
setMessages(formattedMessages);

      }
    } catch (err) {
      console.error("Chat history error:", err);
      Alert.alert("Error", "Could not load chat history");
    }
  };























  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    const userMsg = { id: Date.now(), text: input, sender: "user", time };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch(`${global.apiBaseUrl}/get_answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, uid: personId })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      const answer = data["Processed answer"] || "No response";
         const cid = data["cid"] || "No response";
         setchatid(cid)
      setisuerreply(2)
      //navigation.navigate("RateScreen",{answer:answer,cid:cid})
      const botMsg = {
        id: Date.now() + 1,
        text: answer,
        sender: "bot",
        time
      };



      setMessages(prev => [...prev, botMsg]);


        const botMsg1 = {
        id: Date.now() + 2,
        text: "was this response appropriate ?",
        sender: "bot",
        time
      };



      setMessages(prev => [...prev, botMsg1]);

       

      //fetchChatHistory();
    } catch (err) {
      console.error("Send message error:", err);
      Alert.alert("Error", "Could not send message");
    }
  };

  const startRecording = async () => {
    try {
      const path = `${VOICE_DIR}/voice_${Date.now()}.aac`;
      await audioRecorderPlayer.startRecorder(path);
      setRecording(true);
    } catch (err) {
      console.error("Start recording error:", err);
      Alert.alert("Error", "Could not start recording");
    }
  };

  const stopRecording = async () => {
    try {
      const path = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      const fileExists = await RNFS.exists(path);
      if (!fileExists) throw new Error("Recorded file does not exist");

      const now = new Date();
      const time = now.toTimeString().split(" ")[0];
      const fileName = path.split("/").pop();
      const fileUri = Platform.OS === 'android' ? path : `file://${path}`;
      const userVoiceMsg = { id: Date.now(), text: fileUri, sender: "user-voice", time, type: 1 };
      setMessages(prev => [...prev, userVoiceMsg]);

      const formData = new FormData();
      formData.append('file', { uri: fileUri, name: fileName, type: 'audio/aac' });
      formData.append('uid', personId);

      const res = await fetch(SERVER_UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!res.ok) throw new Error(`Server error: ${await res.text()}`);

  const data = await res.json();
      const answer = data["answer_audio"] || "No response";
         const cid = data["cid"] || "No response";


  //navigation.navigate("RateScreen",{answer:answer,cid:cid})
      fetchChatHistory();
    } catch (err) {
      console.error("Voice message error:", err);
      Alert.alert("Error", err.message);
      setRecording(false);
    }
  };

  // const togglePlayback = (url, sender) => {
  //   const fullUrl = sender === "user-voice" ? SERVER_AUDIO_BASE_query + url : SERVER_AUDIO_BASE + url;
  //   const isRemote = fullUrl.startsWith("http");
  //   const path = isRemote ? fullUrl : fullUrl.replace("file://", "");

  //   const sound = new Sound(path, isRemote ? Sound.MAIN_BUNDLE : Sound.DOCUMENT, (error) => {
  //     if (error) {
  //       Alert.alert("Playback Error", "Unable to play this audio.");
  //       return;
  //     }
  //     sound.play(success => !success && Alert.alert("Playback Failed"));
  //   });
  // };





const togglePlayback = (fileName, sender) => {
  if (!fileName || typeof fileName !== "string") return;

  const isUser = sender.includes("user");
  const fullUrl = isUser
    ? `${SERVER_AUDIO_BASE_query}${fileName}`
    : `${SERVER_AUDIO_BASE}${fileName}`;

  const isRemote = fullUrl.startsWith("http");

  const sound = new Sound(
    fullUrl,
    null, // no need to pass Sound.MAIN_BUNDLE or DOCUMENT for remote URL
    (error) => {
      if (error) {
        Alert.alert("Playback Error", "Unable to play this audio.");
        return;
      }
      sound.play((success) => {
        if (!success) Alert.alert("Playback Failed");
      });
    }
  );
};















  const handleFavourite = async (id, value) => {
    try {
      // const res = await fetch(`http://10.0.2.2:5001/chat/markFavourite/${id}`, {

      const res = await fetch(`${global.apiBaseUrl}/chat/markFavourite/${id}`, {

        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isfav: value })
      });

      if (res.ok) {
        if (value === 0) {
          setLikedMessages(prev => [...prev, id]);
          setDislikedMessages(prev => prev.filter(mid => mid !== id));
        } else if (value === 1) {
          setDislikedMessages(prev => [...prev, id]);
          setLikedMessages(prev => prev.filter(mid => mid !== id));
        }
      } else {
        console.error("Favourite update failed:", await res.text());
      }
    } catch (err) {
      console.error("Favourite error:", err);
    }
  };
const toggleSelectMessage = (id) => {
  if (!selectionMode) return;

  const msg = messages.find(m => m.id === id);
  if (!msg?.cid) return;

  const pair = messages.filter(m => m.cid === msg.cid);
  const pairIds = pair.map(m => m.id);

  const isAlreadySelected = pairIds.every(mid => selectedMessages.includes(mid));

  const updated = isAlreadySelected
    ? selectedMessages.filter(mid => !pairIds.includes(mid)) // deselect both
    : [...selectedMessages, ...pairIds];                      // select both

  setSelectedMessages(updated);

  // ✅ If none selected, exit selectionMode
  if (updated.length === 0) {
    setSelectionMode(false);
  }
};


  const handleLongPress = (itemId) => {
    setSelectionMode(true);
    setSelectedMessages([itemId]);
  };

  const deleteSelectedMessages = () => {
    Alert.alert("Delete Messages", `Delete ${selectedMessages.length} messages?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try {
            const deletePromises = selectedMessages.map(async (mid) => {
              const msg = messages.find(m => m.id === mid);
              if (msg?.cid) {
                await fetch(`${global.apiBaseUrl}/chat/${msg.cid}`, {
                  method: 'DELETE',
                });
              }
            });
            await Promise.all(deletePromises);
            fetchChatHistory();
            setSelectedMessages([]);
            setSelectionMode(false);
          } catch (err) {
            Alert.alert("Error", "Failed to delete messages from server");
            console.error("Delete error:", err);
          }
        }
      }
    ]);
  };

  const scrollToDate = (selectedDate) => {
  const grouped = groupMessagesByDate(filteredMessages);
  const index = grouped.findIndex(item => item.isDate && item.date === selectedDate);
  if (index !== -1 && flatListRef.current) {
    flatListRef.current.scrollToIndex({ index, animated: true });
  }
  setDatePickerVisible(false);
};

const handleShareMessages = async () => {
  if (!receiverIdInput.trim()) {
    Alert.alert("Error", "Receiver ID cannot be empty");
    return;
  }

  try {
    const selectedCids = Array.from(new Set(
      selectedMessages
        .map(mid => messages.find(m => m.id === mid))
        .filter(Boolean)
        .map(m => m.cid)
    ));

    const chats = selectedCids.map(cid => {
      const userMsg = messages.find(m => m.cid === cid && (m.sender === "user" || m.sender === "user-voice"));
      const botMsg = messages.find(m => m.cid === cid && (m.sender === "bot" || m.sender === "bot-voice"));

      if (!userMsg || !botMsg) return null;

      return {
        sender_id: phno,
        receiver_id: receiverIdInput.trim(),
        question: userMsg.text,
        answer: botMsg.text,
        status: false
      };
    }).filter(Boolean);

    if (!chats.length) {
      Alert.alert("Error", "No valid messages selected");
      return;
    }
     console.log(JSON.stringify({ chats }))
    // const res = await fetch('http://10.0.2.2:5001/shared-chats', {

    const res = await fetch(`${global.apiBaseUrl}/shared-chats`, {

      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chats })
    });
    
    if (res.ok) {
      Alert.alert("✅ Success", "Messages shared successfully");
      setShareModalVisible(false);
      setReceiverIdInput('');
      setSelectionMode(false);
      setSelectedMessages([]);
    } else {
      const text = await res.text();
      throw new Error(text);
    }
  } catch (err) {
    console.error("Share error:", err);
    Alert.alert("Error", "Failed to share messages");
  }
};

  const filteredMessages = searchQuery.trim()
    ? messages.filter((msg, index, arr) => {
        if (msg.sender === 'user' || msg.sender === 'user-voice') {
          const botMsg = arr[index + 1];
          const query = searchQuery.toLowerCase();
          const userMatch = msg.text?.toLowerCase().includes(query);
          const botMatch = botMsg?.text?.toLowerCase().includes(query);
          return userMatch || botMatch;
        }
        return false;
      }).flatMap(msg => {
        const botMsg = messages.find(m => m.id === msg.id + 1);
        return [msg, botMsg].filter(Boolean);
      })
    : messages;



const groupMessagesByDate = (msgs) => {
  const groups = {};
  for (let i = 0; i < msgs.length; i += 2) {
    const userMsg = msgs[i];
    const botMsg = msgs[i + 1];
    const date = userMsg.date || userMsg.time?.split(' ')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(userMsg);
    if (botMsg) groups[date].push(botMsg);
  }

  const result = [];
  Object.keys(groups).forEach((date, index) => {
    result.push({ id: `date-${index}`, date, isDate: true });
    result.push(...groups[date]);
  });

  return result;
};


return (
  <View style={styles.container}>

    <View style={styles.header}>
{showSearch && (
  <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
    <TextInput
      value={searchQuery}
      onChangeText={setSearchQuery}
      placeholder="Search messages..."
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        color: COLORS.text,
      }}
      placeholderTextColor="#999"
    />
    <TouchableOpacity onPress={() => setShowSearch(false)}>
      <Ionicons name="close" size={22} color="#444" style={{ marginLeft: 8 }} />
    </TouchableOpacity>
  </View>
)}



      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Ionicons name="arrow-back" size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Text style={styles.title}>Chat</Text>

      {selectionMode && (
        <>
          <TouchableOpacity onPress={() => setShareModalVisible(true)} style={{ marginLeft: 'auto', marginRight: 15 }}>
            <Ionicons name="share-social-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteSelectedMessages} style={{ marginRight: 15 }}>
            <Ionicons name="trash" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </>
      )}

      {!selectionMode && (
        <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
            <Ionicons name="search-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
         <TouchableOpacity
onPress={async () => {
    
    setNotificationValue(0)
    navigation.navigate("ShowMsg", { phno });
  
}}


  style={{ marginRight: 12 }}
>
  <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
  {notificationValue >0 &&(
    <View style={{
      position: 'absolute',
      right: -2,
      top: -2,
      backgroundColor: 'red',
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 4
    }}>
      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
        {notificationValue}
      </Text>
    </View>
  )}
</TouchableOpacity>

<TouchableOpacity onPress={() => setDateModalVisible(true)}>
  <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
</TouchableOpacity>

        </View>
      )}
    </View>

<FlatList
  ref={flatListRef}

  
  data={groupMessagesByDate(
    selectedDate === 'All'
      ? filteredMessages
      : filteredMessages.filter(m => {
          const pair = filteredMessages.filter(x => x.cid === m.cid);
          return pair.length && pair[0].date === selectedDate;
        })
  )}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    if (item.isDate) {
      return (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Text style={{ backgroundColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, color: '#555' }}>{item.date}</Text>
        </View>
      );
    }

    const isSelected = selectedMessages.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleSelectMessage(item.id)}
        onLongPress={() => handleLongPress(item.id)}
        style={{ backgroundColor: isSelected ? "#d0f0c0" : "transparent", borderRadius: 12 }}
      >
        <View
          style={[styles.message,
            item.sender.includes("user") ? styles.userMessage : styles.botMessage]}
        >



          
{item.type ? (
  <>
    {/* 🔊 Voice Message Bubble */}
    <View style={{
      backgroundColor: item.sender.includes("user") ? "#dcf8c6" : "#eeeeee",
      padding: 12,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
    }}>
      <TouchableOpacity onPress={() => togglePlayback(item.audio, item.sender)}>
        <Ionicons
          name="play-circle"
          size={28}
          color={item.sender.includes("user") ? COLORS.primary : "#444"}
        />
      </TouchableOpacity>
      <Text style={{ marginLeft: 10, fontSize: 14, color: "#666" }}>[Voice Message]</Text>
    </View>

    {/* 📝 Transcribed Text (if exists) */}
    {item.text ? (
      <View style={{
        marginTop: 6,
        backgroundColor: "#f1f1f1",
        padding: 10,
        borderRadius: 10,
      }}>
        <Text style={{ fontSize: 14, color: "#333" }}>
          {searchQuery.trim()
            ? highlightText(item.text, searchQuery)
            : item.text}
        </Text>
      </View>
    ) : null}
  </>
) : (
  item.text && (
    <Text style={styles.messageText}>
      {searchQuery.trim()
        ? highlightText(item.text, searchQuery)
        : item.text}
    </Text>
  )
)}



          <Text style={styles.time}>{item.time}</Text>
          {(item.sender === "bot" || item.sender === "bot-voice") && (
            <View style={styles.reactionRow}>
              {/* <TouchableOpacity onPress={() => handleFavourite(item.cid, 0)}>
                <Ionicons
                  name="thumbs-up"
                  size={18}
                  color={likedMessages.includes(item.cid) ? COLORS.success : COLORS.lightText}
                  style={styles.reactionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFavourite(item.cid, 1)}>
                <Ionicons
                  name="thumbs-down"
                  size={18}
                  color={dislikedMessages.includes(item.cid) ? COLORS.error : COLORS.lightText}
                />
              </TouchableOpacity> */}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }}
  contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
/>



<Modal visible={shareModalVisible} transparent animationType="slide">
  <View style={{
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  }}>
    <View style={{
      backgroundColor: COLORS.white, padding: 20, borderRadius: 16, width: '85%'
    }}>
      <Text style={{ fontSize: 16, marginBottom: 10, color: COLORS.text }}>Enter Receiver ID:</Text>
      <TextInput
        placeholder="Receiver ID"
        value={receiverIdInput}
        onChangeText={setReceiverIdInput}
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          color: COLORS.text,
          marginBottom: 15,
        }}
        placeholderTextColor={COLORS.lightText}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => setShareModalVisible(false)}
          style={{ marginRight: 15 }}
        >
          <Text style={{ color: COLORS.error }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShareMessages}>
          <Text style={{ color: COLORS.primary }}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

{/* Modal for filtering dates */}
{dateModalVisible && (
  <Modal
    visible={true}
    transparent={true}
    animationType="fade"
    onRequestClose={() => setDateModalVisible(false)}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxHeight: '70%' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16, textAlign: 'center' }}>📅 Filter by Date</Text>
        <ScrollView>

          {/* 📤 Share Chat */}
          <TouchableOpacity
            style={{ 
              paddingVertical: 12, 
              borderBottomWidth: 1, 
              borderColor: '#eee',
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
            onPress={() => {
              navigation.navigate("ShareChat",{phno:phno});
              setDateModalVisible(false);
            }}
          >
            <Text style={{ fontSize: 16, color: '#333' }}>📤 Share Chat</Text>
          </TouchableOpacity>

          {/* 📥 Receive Chat with badge */}
          <TouchableOpacity
            style={{ 
              paddingVertical: 12, 
              borderBottomWidth: 1, 
              borderColor: '#eee',
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}
            onPress={() => {
              setNotificationCount(0)
              navigation.navigate("ReceiveChat", { phno: phno });

              setDateModalVisible(false);
            }}
          >
            <Text style={{ fontSize: 16, color: '#333' }}>📥 Receive Chat</Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 6,
                paddingVertical: 2,
                minWidth: 20,
                alignItems: 'center',
                marginLeft: 10
              }}>
                <Text style={{ color: 'white', fontSize: 12 }}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 🔁 All */}
          <TouchableOpacity
            style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}
            onPress={() => { setSelectedDate('All'); setDateModalVisible(false); }}
          >
            <Text style={{ fontSize: 16, color: '#128C7E' }}>🔁 All</Text>
          </TouchableOpacity>

          {/* 📌 Dates */}
          {Array.from(new Set(filteredMessages.map(m => m.date))).map(date => (
            <TouchableOpacity
              key={date}
              style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}
              onPress={() => { setSelectedDate(date); setDateModalVisible(false); }}
            >
              <Text style={{ fontSize: 16, color: '#333' }}>{`📌 ${date}`}</Text>
            </TouchableOpacity>
          ))}

        </ScrollView>

        {/* ✖ Cancel */}
        <TouchableOpacity
          onPress={() => setDateModalVisible(false)}
          style={{ alignSelf: 'center', marginTop: 16 }}
        >
          <Text style={{ color: '#888', fontSize: 15 }}>✖ Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}


      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.lightText}
          multiline
        />
        <TouchableOpacity
          onPress={isuserreply==2?handleuserreply: sendMessage}
          style={styles.icon}
          disabled={!input.trim()}
        >
          <Ionicons
            name="send"
            size={26}
            color={input.trim() ? COLORS.accent : "#ccc"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.icon}
          disabled={!!input.trim()}
        >
          <Ionicons
            name={recording ? "stop-circle" : "mic"}
            size={28}
            color={recording ? COLORS.error : COLORS.text}
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({


  
  container: {
    flex: 1,
    backgroundColor: COLORS.background
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
    fontWeight: "700",
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
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  reactionIcon: {
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    backgroundColor: COLORS.background,
    fontSize: 16,
    color: COLORS.text,
    maxHeight: 100,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    paddingHorizontal: 6,
  },
});

export default ChatScreenWithVoice;
