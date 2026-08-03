import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ArchivedScreen = () => {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      //const response = await fetch("http://192.168.0.103:5001/session");
        // const response = await fetch("http://10.0.2.2:5001/session");
        const response = await fetch(`${global.apiBaseUrl}/session`);

      
      const data = await response.json();
      setSessions(data);
      setFilteredSessions(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = sessions.filter((session) =>
      session.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSessions(filtered);
  };

  const handleSessionPress = (session) => {
    navigation.navigate("CategoryReportBySession", {
      sessionId: session.id,
      sessionTitle: session.title,
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSessionPress(item)}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.statusRow}>
        <Ionicons
          name={item.isActive ? "checkmark-circle" : "close-circle"}
          size={16}
          color={item.isActive ? "#4CAF50" : "#F44336"}
        />
        <Text style={styles.statusText}>
          {item.isActive ? " Active" : " Inactive"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with back to AdminDashboard */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("AdminDashboard")}>
          <Ionicons name="arrow-back" size={22} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <Ionicons name="archive-outline" size={22} color="#fff" style={[styles.icon, { marginLeft: 8 }]} />
        <Text style={styles.heading}>Archived Sessions</Text>
      </View>
      {/* 🔍 Search box */}

      <TextInput
        placeholder="Search session..."
        value={searchText}
        onChangeText={handleSearch}
        style={styles.searchInput}
        placeholderTextColor="#999"
      />
      {/* 📥 Loading indicator ya FlatList */}
      {loading ? (
        <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredSessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default ArchivedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    backgroundColor: "#075E54",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
});
