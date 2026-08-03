

import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Card, TextInput, Button, Text, ActivityIndicator, Icon } from "react-native-paper";


const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Optimized color palette with better contrast and visual hierarchy
  const COLORS = {
    primary: "#075E54",       // Primary brand color (dark teal)
    secondary: "#128C7E",     // Secondary brand color (teal)
    accent: "#25D366",        // Accent color (bright green)
    background: "#F8F9FA",    // Light background (softer gray)
    surface: "#FFFFFF",       // Card/surface color
    text: "#212529",         // Primary text (almost black)
    lightText: "#6C757D",    // Secondary text (gray)
    border: "#DEE2E6",       // Border color (light gray)
    white: "#FFFFFF",        // Pure white
    error: "#DC3545",        // Error color (red)
    success: "#28A745",      // Success color (green)
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "Please enter both phone number and password.");
      return;
    }

    setLoading(true);

    try {
    

    //  const response = await fetch("http://10.0.2.2:5001/person/login", {
      const response = await fetch(`${global.apiBaseUrl}/person/login`, {
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

      if (response.ok) {
        if(data['type']){
             navigation.navigate("AdminDashboard");
        }
        else
        {
        navigation.replace("Chat", { personId: data.id ,phno:data.phno});}
      } else {
        Alert.alert("Login Failed", "Invalid phone number or password.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: COLORS.primary }]}
    >
      <View style={styles.header}>
        <Icon 
          source="chat-processing"
          size={80} 
          color={COLORS.white}
        />
        <Text style={styles.headerText}>Chatbot with Customer WhatsApp History</Text>
        {/* <Text style={styles.subHeaderText}>Customer Support Solution</Text> */}
      </View>
      
      <View style={[styles.content, { backgroundColor: COLORS.background }]}>
        <Card style={[styles.card, { 
          backgroundColor: COLORS.surface,
          shadowColor: COLORS.primary,
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }]}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.cardTitle, { 
              color: COLORS.primary,
              marginBottom: 8
            }]}>
              Welcome Back!
            </Text>
            <Text style={[styles.cardSubtitle, { color: COLORS.lightText }]}>
              Sign in to continue
            </Text>
            
            <TextInput
              label="Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              left={<TextInput.Icon icon="phone" color={COLORS.primary} />}
              autoCapitalize="none"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              placeholder="+92 3XX XXXXXXX"
              placeholderTextColor={COLORS.lightText}
            />
            
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry={secureTextEntry}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { backgroundColor: COLORS.surface }]}
              left={<TextInput.Icon icon="lock" color={COLORS.primary} />}
              right={
                <TextInput.Icon 
                  icon={secureTextEntry ? "eye-off" : "eye"} 
                  color={COLORS.primary}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                />
              }
              autoCapitalize="none"
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.secondary}
              placeholder="Enter your password"
              placeholderTextColor={COLORS.lightText}
            />
            
            <Button
              mode="contained"
              style={[styles.button, { 
                backgroundColor: COLORS.secondary,
                marginTop: 24,
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 6,
              }]}
              onPress={handleLogin}
              disabled={loading}
              contentStyle={{ height: 48 }}
              labelStyle={{ 
                fontSize: 16, 
                color: COLORS.white,
                fontWeight: '600',
                letterSpacing: 0.5,
              }}
              icon={loading ? () => <ActivityIndicator animating={true} color={COLORS.white} /> : null}
            >
              {loading ? "Processing..." : "Login"}
            </Button>
            
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: COLORS.border }]} />
              <Text style={[styles.dividerText, { color: COLORS.lightText }]}>or</Text>
              <View style={[styles.dividerLine, { backgroundColor: COLORS.border }]} />
            </View>
            
            <TouchableOpacity 
              onPress={() => navigation.navigate("Signup")}
              style={styles.signupContainer}
            >
              <Text style={[styles.signupText, { color: COLORS.text }]}>
                Don't have an account?{' '}
                <Text style={{ 
                  fontWeight: '600', 
                  color: COLORS.secondary,
                  textDecorationLine: 'underline',
                }}>
                  Sign up
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
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subHeaderText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  card: {
    borderRadius: 16,
    borderWidth: 0,
    elevation: 4,
    paddingVertical: 8,
  },
  cardTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 22,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    letterSpacing: 0.25,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    elevation: 3,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    letterSpacing: 0.25,
  },
});

export default LoginScreen;