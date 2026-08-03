import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";

const COLORS = {
  primary: "#075E54",
  secondary: "#128C7E",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#212529",
  lightText: "#6C757D",
  border: "#DEE2E6",
  error: "#DC3545",
};

const ShowMsg = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { phno } = route.params || {};

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // const res = await fetch(`http://10.0.2.2:5001/notice/notification/${phno}`);

      const res = await fetch(`${global.apiBaseUrl}/notice/notification/${phno}`);

      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setNotifications(data || []);
    } catch (err) {
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.messageText}>{item.message}</Text>
      <Text style={styles.timestamp}>
        📅 {item.date || "N/A"} 🕒 {item.time || "N/A"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {/* 🔄 Loading */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
      ) : notifications.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: COLORS.lightText }}>
          No messages yet.
        </Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  notificationCard: {
    backgroundColor: COLORS.surface,
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.lightText,
    alignSelf: "flex-end",
  },
});

export default ShowMsg;
