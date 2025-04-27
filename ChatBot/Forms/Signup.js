import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, TextInput, Button, Text } from "react-native-paper";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const handleSignup = async () => {
    if (!name || !phone || !password) {
      alert("All fields are required!");
      return;
    }
  
    try {
      const response = await fetch("http://10.0.2.2:5000/person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name, phno: phone, password: password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Signup successful:", data);
        navigation.replace("Chat");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Network error. Please try again.");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Chatbot with Customer{"\n"}WhatsApp History
      </Text>
      <Card style={styles.card}>
        <Card.Title title="Signup" titleStyle={styles.cardTitle} />
        <Card.Content>
          <TextInput
            label="Name"
            mode="outlined"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
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
          <Button mode="contained" style={styles.button} onPress={handleSignup}>
            Sign Up
          </Button>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
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
    lineHeight: 28, // Better spacing between lines
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

export default SignupScreen;
