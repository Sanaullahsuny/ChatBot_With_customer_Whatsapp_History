import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { Card, TextInput, Button, Text, Icon } from "react-native-paper";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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

  const handleSignup = async () => {
    if (!name || !phone || !password) {
      alert("All fields are required!");
      return;
    }

    try {
      //const response = await fetch("http://192.168.0.100:5001/person", {
         // const response = await fetch("http://10.0.2.2:5001/person", {
         const response = await fetch(`${global.apiBaseUrl}/person`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phno: phone, password }),
      });

      const data = await response.json();
      if (response.ok) {
        navigation.replace("Chat");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView         //use kiya gaya hai taa keh iOS/Android dono par keyboard view ko adjust kar sake.
      style={[styles.container, { backgroundColor: COLORS.primary }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Icon source="account-plus" size={80} color={COLORS.white} />
        <Text style={styles.headerText}>Chatbot with Customer WhatsApp History</Text>
      </View>

      <View style={[styles.content, { backgroundColor: COLORS.background }]}>
        <Card style={[styles.card, { backgroundColor: COLORS.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { color: COLORS.primary }]}>
              Create Account
            </Text>
            <Text style={[styles.cardSubtitle, { color: COLORS.lightText }]}>
              Fill your details to get started
            </Text>

            <TextInput
              label="Name"
              mode="outlined"
              value={name}
              onChangeText={setName}
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              left={<TextInput.Icon icon="account" color={COLORS.primary} />}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
            />

            <TextInput
              label="Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              left={<TextInput.Icon icon="phone" color={COLORS.primary} />}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
            />

            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              left={<TextInput.Icon icon="lock" color={COLORS.primary} />}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
            />

            <Button
              mode="contained"
              style={[styles.button, { backgroundColor: COLORS.secondary }]}
              contentStyle={{ height: 48 }}
              labelStyle={{ fontSize: 16, color: COLORS.white, fontWeight: '600' }}
              onPress={handleSignup}
            >
              Sign Up
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.linkContainer}>
              <Text style={[styles.link, { color: COLORS.text }]}>
                Already have an account?{" "}
                <Text style={{ color: COLORS.secondary, fontWeight: "600", textDecorationLine: "underline" }}>
                  Login
                </Text>
              </Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 8,
  },
  cardTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 22,
    marginBottom: 4,
  },
  cardSubtitle: {
    textAlign: "center",
    marginBottom: 24,
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 8,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  link: {
    fontSize: 14,
    letterSpacing: 0.25,
  },
});

export default SignupScreen;
