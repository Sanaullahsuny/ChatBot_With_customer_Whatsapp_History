const SERVER_AUDIO_BASE = `http://192.168.206.1:5001/modelAnswer/`;
 const SERVER_AUDIO_BASE_query = `http://192.168.206.1:5001/userQueries/`;


// agr ik seach ho tu ya hai code 


// import React, { useState, useEffect } from "react";
// import {
//   View, FlatList, TouchableOpacity, Text,
//   StyleSheet, Platform, Alert,  TextInput, 
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import RNFS from 'react-native-fs';
// import Sound from 'react-native-sound';

// const audioRecorderPlayer = new AudioRecorderPlayer();
// const VOICE_DIR = `${RNFS.DocumentDirectoryPath}/voice_notes`;

// const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
// const SERVER_AUDIO_BASE_query = `${global.apiBaseUrl}/userQueries/`;

// const COLORS = {
//   primary: "#075E54",
//   accent: "#25D366",
//   background: "#F8F9FA",
//   surface: "#FFFFFF",
//   text: "#212529",
//   lightText: "#6C757D",
//   border: "#DEE2E6",
//   white: "#FFFFFF",
//   error: "#DC3545",
//   success: "#28A745"
// };

// const ChatScreenWithVoice = () => {

//   const [searchQuery, setSearchQuery] = useState("");
// const [showSearch, setShowSearch] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [likedMessages, setLikedMessages] = useState([]);
//   const [dislikedMessages, setDislikedMessages] = useState([]);

//   const navigation = useNavigation();
//   const route = useRoute();
//   const { personId } = route.params || {};

//   useEffect(() => {
//     initVoiceDir();
//     if (personId) fetchChatHistory();
//   }, [personId]);

//   const initVoiceDir = async () => {
//     try {
//       const exists = await RNFS.exists(VOICE_DIR);
//       if (!exists) await RNFS.mkdir(VOICE_DIR);
//     } catch (err) {
//       console.error("Error creating voice directory:", err);
//     }
//   };

//   const fetchChatHistory = async () => {
//     try {
//       const res = await fetch(`${global.apiBaseUrl}/chat/person/${personId}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         const formatted = data.flatMap((msg, i) => {
//           const isVoice = msg.type === 1;
//           const user = {
//             id: i * 2,
//             text: msg.question,
//             sender: msg.type ? "user-voice" : "user",
//             time: msg.time,
//             type: msg.type,
//             cid: msg.id,
//             transcribed: msg.TranscribedQuestion
//           };
//           const bot = {
//             id: i * 2 + 1,
//             text: isVoice ? SERVER_AUDIO_BASE + msg.answer : msg.answer,
//             sender: isVoice ? "bot-voice" : "bot",
//             time: msg.time,
//             type: msg.type,
//             cid: msg.id,
//             transcribed: msg.TranscribedAnswer
//           };
//           return [user, bot];
//         });

//         setMessages(formatted);
//         setLikedMessages(data.filter(msg => msg.isfav === 0).map(msg => msg.id));
//         setDislikedMessages(data.filter(msg => msg.isfav === 1).map(msg => msg.id));
//       }
//     } catch (err) {
//       console.error("Chat history error:", err);
//       Alert.alert("Error", "Could not load chat history");
//     }
//   };

//   const togglePlayback = (url, sender) => {
//     const furl = sender === "user-voice" ? SERVER_AUDIO_BASE_query + url : SERVER_AUDIO_BASE + url;
//     const isRemote = furl.startsWith("http");
//     const path = isRemote ? furl : furl.replace("file://", "");

//     const sound = new Sound(path, isRemote ? null : Sound.DOCUMENT, (error) => {
//       if (error) {
//         console.error("Playback error:", error);
//         Alert.alert("Playback Error", "Unable to play this audio.");
//         return;
//       }

//       sound.play((success) => {
//         if (!success) {
//           console.error("Playback failed.");
//           Alert.alert("Playback Failed", "Could not play the audio.");
//         }
//         sound.release();
//       });
//     });
//   };

//   return (
//     <View style={styles.container}>
//    <View style={styles.header}>
//   <TouchableOpacity onPress={() => navigation.goBack()}>
//     <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//   </TouchableOpacity>
//   <Text style={styles.title}>Chat History</Text>

//   <TouchableOpacity
//     onPress={() => setShowSearch(!showSearch)}
//     style={{ marginLeft: "auto" }}
//   >
//     <Ionicons name="search" size={22} color="#fff" />
//   </TouchableOpacity>
// </View>

// {showSearch && (
//   <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fff" }}>
//     <TextInput
//       placeholder="Search messages..."
//       style={{
//         backgroundColor: "#f0f0f0",
//         padding: 8,
//         borderRadius: 8,
//         fontSize: 14,
//       }}
//       value={searchQuery}
//       onChangeText={setSearchQuery}
//     />
//   </View>
// )}

//      <FlatList
//   data={messages.filter((msg) => {
//     if (!searchQuery) return true;
//     const lower = searchQuery.toLowerCase();
//     return (
//       (msg.text && msg.text.toLowerCase().includes(lower)) ||
//       (msg.transcribed && msg.transcribed.toLowerCase().includes(lower))
//     );
//   })}
//   keyExtractor={(item) => item.id.toString()}
//   renderItem={({ item }) => {
//     const lower = searchQuery.toLowerCase();
//     const isMatched =
//       searchQuery &&
//       (
//         (item.text && item.text.toLowerCase().includes(lower)) ||
//         (item.transcribed && item.transcribed.toLowerCase().includes(lower))
//       );

//     return (
//       <View
//         style={[
//           styles.message,
//           item.sender.includes("user") ? styles.userMessage : styles.botMessage,
//           isMatched && { backgroundColor: "#fff8b3" } // highlight yellow
//         ]}
//       >
//         {item.type ? (
//           <>
//             {/* 🔊 Voice Message */}
//             <View style={{
//               backgroundColor: item.sender.includes("user") ? "#dcf8c6" : "#eeeeee",
//               padding: 12,
//               borderRadius: 12,
//               flexDirection: "row",
//               alignItems: "center",
//             }}>
//               <TouchableOpacity onPress={() => togglePlayback(item.text, item.sender)}>
//                 <Ionicons
//                   name="play-circle"
//                   size={28}
//                   color={item.sender.includes('user') ? COLORS.primary : "#444"}
//                 />
//               </TouchableOpacity>
//               <Text style={{ marginLeft: 10, fontSize: 14, color: "#666" }}>[Voice Message]</Text>
//             </View>

//             {/* 📝 Transcribed Text */}
//             {item.transcribed && (
//               <View style={{
//                 marginTop: 8,
//                 backgroundColor: "#f1f1f1",
//                 padding: 10,
//                 borderRadius: 10,
//               }}>
//                 <Text style={{ fontSize: 14, color: "#333" }}>{item.transcribed}</Text>
//               </View>
//             )}
//           </>
//         ) : (
//           <Text style={styles.messageText}>{item.text}</Text>
//         )}

//         <Text style={styles.time}>{item.time}</Text>

//         {(item.sender === "bot" || item.sender === "bot-voice") && (
//           <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 6 }}>
//             <Ionicons
//               name="thumbs-up"
//               size={18}
//               color={
//                 likedMessages.includes(item.cid)
//                   ? COLORS.success
//                   : COLORS.lightText
//               }
//               style={{ marginRight: 12 }}
//             />
//             <Ionicons
//               name="thumbs-down"
//               size={18}
//               color={
//                 dislikedMessages.includes(item.cid)
//                   ? COLORS.error
//                   : COLORS.lightText
//               }
//             />
//           </View>
//         )}
//       </View>
//     );
//   }}
//   contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
// />

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     paddingTop: Platform.OS === "ios" ? 50 : 15,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.white,
//     marginLeft: 10,
//   },
//   message: {
//     padding: 12,
//     borderRadius: 16,
//     marginVertical: 5,
//     maxWidth: "80%",
//     minWidth: "30%",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: COLORS.accent + "30",
//     borderTopRightRadius: 0,
//   },
//   botMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.surface,
//     borderTopLeftRadius: 0,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   messageText: {
//     color: COLORS.text,
//     fontSize: 16,
//   },
//   time: {
//     fontSize: 10,
//     color: COLORS.lightText,
//     alignSelf: "flex-end",
//     marginTop: 4,
//   },
// });

// export default ChatScreenWithVoice;

// import React, { useState, useEffect } from "react";
// import {
//   View, FlatList, TouchableOpacity, Text,
//   StyleSheet, Platform, Alert, TextInput,
// } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
// import RNFS from 'react-native-fs';
// import Sound from 'react-native-sound';

// const audioRecorderPlayer = new AudioRecorderPlayer();
// const VOICE_DIR = `${RNFS.DocumentDirectoryPath}/voice_notes`;

// const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
// const SERVER_AUDIO_BASE_query = `${global.apiBaseUrl}/userQueries/`;

// const COLORS = {
//   primary: "#075E54",
//   accent: "#25D366",
//   background: "#F8F9FA",
//   surface: "#FFFFFF",
//   text: "#212529",
//   lightText: "#6C757D",
//   border: "#DEE2E6",
//   white: "#FFFFFF",
//   error: "#DC3545",
//   success: "#28A745"
// };

// // ✅ Helper to highlight matching words
// const highlightText = (text, query) => {
//   if (!query) return text;
//   const regex = new RegExp(`(${query})`, "gi");
//   const parts = text.split(regex);
//   return parts.map((part, index) =>
//     regex.test(part) ? (
//       <Text key={index} style={{ backgroundColor: "#fff8b3" }}>{part}</Text>
//     ) : (
//       <Text key={index}>{part}</Text>
//     )
//   );
// };

// const ChatScreenWithVoice = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [likedMessages, setLikedMessages] = useState([]);
//   const [dislikedMessages, setDislikedMessages] = useState([]);

//   const navigation = useNavigation();
//   const route = useRoute();
//   const { personId } = route.params || {};

//   useEffect(() => {
//     initVoiceDir();
//     if (personId) fetchChatHistory();
//   }, [personId]);

//   const initVoiceDir = async () => {
//     try {
//       const exists = await RNFS.exists(VOICE_DIR);
//       if (!exists) await RNFS.mkdir(VOICE_DIR);
//     } catch (err) {
//       console.error("Error creating voice directory:", err);
//     }
//   };

//   const fetchChatHistory = async () => {
//     try {
//       const res = await fetch(`${global.apiBaseUrl}/chat/person/${personId}`);
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
//       const data = await res.json();
//       if (Array.isArray(data)) {
//         const formatted = data.flatMap((msg, i) => {
//           const isVoice = msg.type === 1;
//           const user = {
//             id: i * 2,
//             text: msg.question,
//             sender: msg.type ? "user-voice" : "user",
//             time: msg.time,
//             type: msg.type,
//             cid: msg.id,
//             transcribed: msg.TranscribedQuestion
//           };
//           const bot = {
//             id: i * 2 + 1,
//             text: isVoice ? SERVER_AUDIO_BASE + msg.answer : msg.answer,
//             sender: isVoice ? "bot-voice" : "bot",
//             time: msg.time,
//             type: msg.type,
//             cid: msg.id,
//             transcribed: msg.TranscribedAnswer
//           };
//           return [user, bot];
//         });

//         setMessages(formatted);
//         setLikedMessages(data.filter(msg => msg.isfav === 0).map(msg => msg.id));
//         setDislikedMessages(data.filter(msg => msg.isfav === 1).map(msg => msg.id));
//       }
//     } catch (err) {
//       console.error("Chat history error:", err);
//       Alert.alert("Error", "Could not load chat history");
//     }
//   };

//   const togglePlayback = (url, sender) => {
//     const furl = sender === "user-voice" ? SERVER_AUDIO_BASE_query + url : SERVER_AUDIO_BASE + url;
//     const isRemote = furl.startsWith("http");
//     const path = isRemote ? furl : furl.replace("file://", "");

//     const sound = new Sound(path, isRemote ? null : Sound.DOCUMENT, (error) => {
//       if (error) {
//         console.error("Playback error:", error);
//         Alert.alert("Playback Error", "Unable to play this audio.");
//         return;
//       }

//       sound.play((success) => {
//         if (!success) {
//           console.error("Playback failed.");
//           Alert.alert("Playback Failed", "Could not play the audio.");
//         }
//         sound.release();
//       });
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔍 Header with Search Icon */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color={COLORS.white} />
//         </TouchableOpacity>
//         <Text style={styles.title}>Chat History</Text>
//         <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={{ marginLeft: "auto" }}>
//           <Ionicons name="search" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {showSearch && (
//         <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fff" }}>
//           <TextInput
//             placeholder="Search messages..."
//             style={{
//               backgroundColor: "#f0f0f0",
//               padding: 8,
//               borderRadius: 8,
//               fontSize: 14,
//             }}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//       )}

//       <FlatList
//         data={
//           searchQuery
//             ? messages.reduce((acc, curr, i, arr) => {
//                 if (i % 2 !== 0) return acc;
//                 const question = curr;
//                 const answer = arr[i + 1];
//                 const regex = new RegExp(`\\b${searchQuery.toLowerCase()}\\b`);
//                 const qMatch =
//                   (question.text && regex.test(question.text.toLowerCase())) ||
//                   (question.transcribed && regex.test(question.transcribed.toLowerCase()));
//                 const aMatch =
//                   (answer.text && regex.test(answer.text.toLowerCase())) ||
//                   (answer.transcribed && regex.test(answer.transcribed.toLowerCase()));
//                 if (qMatch || aMatch) {
//                   acc.push({ ...question, highlight: qMatch });
//                   acc.push({ ...answer, highlight: aMatch });
//                 }
//                 return acc;
//               }, [])
//             : messages
//         }
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View
//             style={[
//               styles.message,
//               item.sender.includes("user") ? styles.userMessage : styles.botMessage,
//             ]}
//           >
//             {item.type ? (
//               <>
//                 {/* 🔊 Voice Bubble */}
//                 <View style={{
//                   backgroundColor: item.sender.includes("user") ? "#dcf8c6" : "#eeeeee",
//                   padding: 12,
//                   borderRadius: 12,
//                   flexDirection: "row",
//                   alignItems: "center",
//                 }}>
//                   <TouchableOpacity onPress={() => togglePlayback(item.text, item.sender)}>
//                     <Ionicons
//                       name="play-circle"
//                       size={28}
//                       color={item.sender.includes('user') ? COLORS.primary : "#444"}
//                     />
//                   </TouchableOpacity>
//                   <Text style={{ marginLeft: 10, fontSize: 14, color: "#666" }}>[Voice Message]</Text>
//                 </View>

//                 {/* 📝 Transcribed Text */}
//                 {item.transcribed && (
//                   <View style={{
//                     marginTop: 8,
//                     backgroundColor: "#f1f1f1",
//                     padding: 10,
//                     borderRadius: 10,
//                   }}>
//                     <Text style={{ fontSize: 14, color: "#333" }}>
//                       {highlightText(item.transcribed, searchQuery)}
//                     </Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               item.text && (
//                 <Text style={styles.messageText}>
//                   {highlightText(item.text, searchQuery)}
//                 </Text>
//               )
//             )}

//             <Text style={styles.time}>{item.time}</Text>

//             {(item.sender === "bot" || item.sender === "bot-voice") && (
//               <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 6 }}>
//                 <Ionicons
//                   name="thumbs-up"
//                   size={18}
//                   color={
//                     likedMessages.includes(item.cid)
//                       ? COLORS.success
//                       : COLORS.lightText
//                   }
//                   style={{ marginRight: 12 }}
//                 />
//                 <Ionicons
//                   name="thumbs-down"
//                   size={18}
//                   color={
//                     dislikedMessages.includes(item.cid)
//                       ? COLORS.error
//                       : COLORS.lightText
//                   }
//                 />
//               </View>
//             )}
//           </View>
//         )}
//         contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.primary,
//     padding: 15,
//     paddingTop: Platform.OS === "ios" ? 50 : 15,
//     shadowColor: COLORS.primary,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: COLORS.white,
//     marginLeft: 10,
//   },
//   message: {
//     padding: 12,
//     borderRadius: 16,
//     marginVertical: 5,
//     maxWidth: "80%",
//     minWidth: "30%",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: COLORS.accent + "30",
//     borderTopRightRadius: 0,
//   },
//   botMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: COLORS.surface,
//     borderTopLeftRadius: 0,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//   },
//   messageText: {
//     color: COLORS.text,
//     fontSize: 16,
//   },
//   time: {
//     fontSize: 10,
//     color: COLORS.lightText,
//     alignSelf: "flex-end",
//     marginTop: 4,
//   },
// });

// export default ChatScreenWithVoice;








import React, { useState, useEffect } from "react";
import {
  View, FlatList, TouchableOpacity, Text,
  StyleSheet, Platform, Alert, TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';
import DateTimePicker from '@react-native-community/datetimepicker';

const audioRecorderPlayer = new AudioRecorderPlayer();
const VOICE_DIR = `${RNFS.DocumentDirectoryPath}/voice_notes`;

// const SERVER_AUDIO_BASE = `${global.apiBaseUrl}/modelAnswer/`;
// const SERVER_AUDIO_BASE_query = `${global.apiBaseUrl}/userQueries/`;

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

const highlightText = (text, query) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <Text key={index} style={{ backgroundColor: "#fff8b3" }}>{part}</Text>
    ) : (
      <Text key={index}>{part}</Text>
    )
  );
};

const formatDateParts = (date) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).split(' ');
};

const ChatScreenWithVoice = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [messages, setMessages] = useState([]);
  const [likedMessages, setLikedMessages] = useState([]);
  const [dislikedMessages, setDislikedMessages] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params || {};

  useEffect(() => {
    initVoiceDir();
    if (personId) fetchChatHistory();
  }, [personId]);

  const initVoiceDir = async () => {
    try {
      const exists = await RNFS.exists(VOICE_DIR);
      if (!exists) await RNFS.mkdir(VOICE_DIR);
    } catch (err) {
      console.error("Error creating voice directory:", err);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`${global.apiBaseUrl}/chat/person/${personId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const formatted = data.flatMap((msg, i) => {
          const isVoice = msg.type === 1;
          const user = {
            id: i * 2,
            text: msg.question,
            sender: msg.type ? "user-voice" : "user",
            time: msg.time,
            date: msg.date,
            type: msg.type,
            cid: msg.id,
            transcribed: msg.TranscribedQuestion
          };
          const bot = {
            id: i * 2 + 1,
            text: isVoice ? SERVER_AUDIO_BASE + msg.answer : msg.answer,
            sender: isVoice ? "bot-voice" : "bot",
            time: msg.time,
            date: msg.date,
            type: msg.type,
            cid: msg.id,
            transcribed: msg.TranscribedAnswer
          };
          return [user, bot];
        });

        setMessages(formatted);
        setLikedMessages(data.filter(msg => msg.isfav === 0).map(msg => msg.id));
        setDislikedMessages(data.filter(msg => msg.isfav === 1).map(msg => msg.id));
      }
    } catch (err) {
      console.error("Chat history error:", err);
      Alert.alert("Error", "Could not load chat history");
    }
  };

  const togglePlayback = (url, sender) => {
    const furl = sender === "user-voice" ? SERVER_AUDIO_BASE_query + url : SERVER_AUDIO_BASE + url;
    const isRemote = furl.startsWith("http");
    const path = isRemote ? furl : furl.replace("file://", "");

    const sound = new Sound(path, isRemote ? null : Sound.DOCUMENT, (error) => {
      if (error) {
        console.error("Playback error:", error);
        Alert.alert("Playback Error", "Unable to play this audio.");
        return;
      }

      sound.play((success) => {
        if (!success) {
          console.error("Playback failed.");
          Alert.alert("Playback Failed", "Could not play the audio.");
        }
        sound.release();
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.title}>Chat History</Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)} style={{ marginLeft: "auto" }}>
          <Ionicons name="search" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={{ paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#fff" }}>
          <TextInput
            placeholder="Search messages..."
            style={{ backgroundColor: "#f0f0f0", padding: 8, borderRadius: 8, fontSize: 14 }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={{ marginRight: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 14, color: COLORS.primary }}>
                  {startDate ? `Start: ${formatDateParts(startDate).join(' ')}` : "Pick Start Date"}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="calendar" size={16} color={COLORS.primary} style={{ marginRight: 4 }} />
                <Text style={{ fontSize: 14, color: COLORS.primary }}>
                  {endDate ? `End: ${formatDateParts(endDate).join(' ')}` : "Pick End Date"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartPicker(false);
                if (selectedDate) setStartDate(selectedDate);
              }}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) setEndDate(selectedDate);
              }}
            />
          )}
        </View>
      )}
    

      <FlatList
        data={(searchQuery || startDate || endDate)
          ? messages.reduce((acc, curr, i, arr) => {
              if (i % 2 !== 0) return acc;
              const question = curr;
              const answer = arr[i + 1];
              const fullDateTime = question.date && question.time
                ? `${question.date}T${question.time}`
                : null;
              const msgDate = fullDateTime ? new Date(fullDateTime) : null;
              if (!msgDate || msgDate.toString() === "Invalid Date") return acc;
              const endOfDay = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;
              const matchDate = (!startDate || msgDate >= startDate) && (!endOfDay || msgDate <= endOfDay);
              const regex = new RegExp(`\\b${searchQuery.toLowerCase()}\\b`);
              const qMatch =
                (question.text && regex.test(question.text.toLowerCase())) ||
                (question.transcribed && regex.test(question.transcribed.toLowerCase()));
              const aMatch =
                (answer.text && regex.test(answer.text.toLowerCase())) ||
                (answer.transcribed && regex.test(answer.transcribed.toLowerCase()));
              if (matchDate && (searchQuery === "" || qMatch || aMatch)) {
                acc.push({ ...question, highlight: qMatch });
                acc.push({ ...answer, highlight: aMatch });
              }
              return acc;
            }, [])
          : messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender.includes("user") ? styles.userMessage : styles.botMessage]}>
            {item.type ? (
              <>
                <View style={{ backgroundColor: item.sender.includes("user") ? "#dcf8c6" : "#eeeeee", padding: 12, borderRadius: 12, flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => togglePlayback(item.text, item.sender)}>
                    <Ionicons name="play-circle" size={28} color={item.sender.includes('user') ? COLORS.primary : "#444"} />
                  </TouchableOpacity>
                  <Text style={{ marginLeft: 10, fontSize: 14, color: "#666" }}>[Voice Message]</Text>
                </View>
                {item.transcribed && (
                  <View style={{ marginTop: 8, backgroundColor: "#f1f1f1", padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 14, color: "#333" }}>{highlightText(item.transcribed, searchQuery)}</Text>
                  </View>
                )}
              </>
            ) : (
              item.text && <Text style={styles.messageText}>{highlightText(item.text, searchQuery)}</Text>
            )}
            <Text style={styles.time}>{item.time}</Text>
            {(item.sender === "bot" || item.sender === "bot-voice") && (
              <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginTop: 6 }}>
                {/* <Ionicons name="thumbs-up" size={18} color={likedMessages.includes(item.cid) ? COLORS.success : COLORS.lightText} style={{ marginRight: 12 }} />
                <Ionicons name="thumbs-down" size={18} color={dislikedMessages.includes(item.cid) ? COLORS.error : COLORS.lightText} /> */}
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
      />
    </View>
  );
};

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
  },
});

export default ChatScreenWithVoice;
