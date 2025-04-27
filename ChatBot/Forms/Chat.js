import React, { useState, useEffect } from "react";
import { 
  View, FlatList, TextInput, TouchableOpacity, Text, 
  StyleSheet, KeyboardAvoidingView, Platform 
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatScreen = () => {
  const [sessionid, setsessionid] = useState("");
  const [categoryid, setcategoryid] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigation = useNavigation();
  const route = useRoute();
  const { personId } = route.params || {}; 

  useEffect(() => {
    if (personId) {
      fetchChatHistory();
      fetchcurrentsession();
    }
  }, [personId]);
  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/chat/person/${personId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedMessages = data.flatMap((msg, index) => [
          {
            id: index * 2 + 1,
            text: msg.question,
            sender: "user",
            time: msg.time,
          },
          {
            id: index * 2 + 2,
            text: msg.answer,
            sender: "bot",
            time: msg.time,
          }
        ]);
        setMessages(formattedMessages);
      } else {
        console.log("No previous chats found");
      }
    } catch (error) {
      console.error("Chat History Error:", error);
    }
  };
  

  //////////////////////////////

  const savechat = async (personId, sessionid, question, answer, time, date, categoryid) => {
    try {
      const response = await fetch(`http://10.0.2.2:5000/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: time,
          question: question,
          answer: answer,
          person_Id: personId,
          session_Id: sessionid,
          category_id: categoryid,
          date: date
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Chat saved:", data);
  
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };
  

  




//////////////////////////////

const fetchcurrentsession = async () => {
  try {
    const response = await fetch(`http://10.0.2.2:5000/session/current`);
    const data = await response.json();

      if(response.ok){
      setsessionid(data.id); // Maintain top-to-bottom order
    } 
  } catch (error) {
    console.error("Current seesion error:", error);
  }
};

//////////////////////////////

const fetchcategoryid = async (name) => {
  try {
    const response = await fetch(`http://10.0.2.2:5000/category/${name}`);
    const data = await response.json();

    if (response.ok) {
      return data.id; // Direct return karo
    } else {
      console.error("Category fetch failed with status:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Category error:", error);
    return null;
  }
};



const sendMessage = async () => {
  if (input.trim() === "") return;

  const now = new Date();
  const timestamp = now.toTimeString().split(' ')[0]; // 👈 Correct HH:MM:SS time
  const date = now.toISOString().split('T')[0];       // 👈 Correct YYYY-MM-DD date

  const userMessage = { id: messages.length + 1, text: input, sender: "user", time: timestamp };
  setMessages((prevMessages) => [...prevMessages, userMessage]); 
  setInput("");

  try {
    const response = await fetch("http://10.0.2.2:5000/get_answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await response.json();
    if (response.ok) {
      const botResponse = { 
        id: messages.length + 2, 
        text: data["Processed answer"] || "No response", 
        sender: "bot", 
        time: timestamp 
      };

      const categoryIdFetched = await fetchcategoryid(data["label"]);
      if (categoryIdFetched) {
        await savechat(personId, sessionid, input, data["Processed answer"], timestamp, date, categoryIdFetched);
      }

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = { id: messages.length + 2, text: "Error fetching response.", sender: "bot", time: timestamp };
    setMessages((prevMessages) => [...prevMessages, errorMessage]);
  }
};


  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Knowldgebase")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Chat</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 15, paddingHorizontal: 10 }}
      />
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.inputContainer}>
        <TouchableOpacity style={styles.prefixIcon}>
          <MaterialIcons name="attach-file" size={24} color="#888" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />

        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={26} color="#25D366" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECE5DD" },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "#075E54", padding: 15, paddingTop: Platform.OS === "ios" ? 50 : 15 },
  title: { fontSize: 20, fontWeight: "bold", color: "white", marginLeft: 10 },
  
  message: { padding: 10, borderRadius: 15, marginVertical: 5, maxWidth: "75%" },
  userMessage: { alignSelf: "flex-end", backgroundColor: "#DCF8C6", borderTopRightRadius: 0 },
  botMessage: { alignSelf: "flex-start", backgroundColor: "#EAEAEA", borderTopLeftRadius: 0 },

  

  messageText: { color: "#000", fontSize: 16 },
  time: { fontSize: 10, color: "#666", alignSelf: "flex-end", marginTop: 2 },
  
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ccc" },
  prefixIcon: { padding: 10 },
  input: { flex: 1, borderRadius: 30, padding: 10, borderColor: "#ccc", backgroundColor: "#fff", fontSize: 16, color: "#000" }
});

export default ChatScreen;
