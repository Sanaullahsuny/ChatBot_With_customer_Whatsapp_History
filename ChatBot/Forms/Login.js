import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Card, TextInput, Button, Text } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("03327551955"); // Default phone number
  const [password, setPassword] = useState("S123456782s"); // Default password

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter both phone number and password.");
      return;
    }

    setLoading(true);

    try {
      if (phone === "11" && password === "1122") {
        // If phone and password match the default, navigate to Admin Dashboard
        navigation.navigate("AdminDashboard");
        return;
      }

      const response = await fetch("http://10.0.2.2:5000/person/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phno: phone,
          password: password,
        }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
       // const { id } = data.user; // Extract Pid from response
        console.log("Navigating with Pid:", data.id);
        navigation.replace("Chat", { personId: data.id }); // Pass Pid to Chat screen
      } else {
        Alert.alert("Login Failed", "Invalid phone number or password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Chatbot with Customer{"\n"}WhatsApp History
      </Text>
      <Card style={styles.card}>
        <Card.Title title="Login" titleStyle={styles.cardTitle} />
        <Card.Content>
          <TextInput
            label="Phone Number"
            mode="outlined"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={styles.link}>Don't have an account? Signup</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    lineHeight: 28,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "blue",
    fontWeight: "bold",
  },
});

export default LoginScreen;
