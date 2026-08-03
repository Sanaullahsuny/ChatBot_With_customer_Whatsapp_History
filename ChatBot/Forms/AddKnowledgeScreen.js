// 📄 Ye screen error tag ko knowledge base mein convert karti hai

import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const AddKnowledgeScreen = ({ route, navigation }) => {
  const { tag, id } = route.params;// route se tag aur error ID milti hai
  const [keyInput, setKeyInput] = useState(tag || ''); // default key = tag
  const [valueInput, setValueInput] = useState('');
  const [loading, setLoading] = useState(false);
    // ✅ Jab user submit kare

  const handleSubmit = async () => {
    if (!keyInput.trim() || !valueInput.trim()) {
      Alert.alert('Validation', 'Both key and value are required.');
      return;
    }

    setLoading(true);


       // 📤 KnowledgeBase mein entry bhejna
    try {
      // const response = await fetch('http://10.0.2.2:5001/knowledgeBase', {

      const response = await fetch(`${global.apiBaseUrl}/knowledgeBase`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput.trim(), value: valueInput.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoading(false);
        Alert.alert('Error', result.error || 'Something went wrong.');
        return;
      }
             // 🗑️ Agar ID mili hai to us error ko delete karo
      if (id) {
        // await fetch(`http://10.0.2.2:5001/error-history/${id}`, {

        await fetch(`${global.apiBaseUrl}/error-history/${id}`, {

          method: 'DELETE',
        });
      }

      setLoading(false);
      Alert.alert('Success', 'Knowledge entry added and error removed!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ErrorHistoryScreen', { refreshed: true }),
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Network error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.primary }]}>
      <Card style={[styles.card, { backgroundColor: COLORS.surface }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ErrorHistoryScreen')}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <Card.Title
          title="Add Knowledgebase Entry"
          titleStyle={{ color: COLORS.primary, fontWeight: 'bold', fontSize: 20 }}
        />
        <Card.Content>
          <TextInput
            label="Key"
            mode="outlined"
            value={keyInput}
            onChangeText={setKeyInput}
            style={styles.input}
            editable={false}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.secondary}
          />
          <TextInput
            label="Value"
            mode="outlined"
            value={valueInput}
            onChangeText={setValueInput}
            multiline
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.secondary}
          />
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.submitBtn, { backgroundColor: COLORS.secondary }]}
            contentStyle={{ height: 48 }}
            labelStyle={{
              fontSize: 16,
              fontWeight: '600',
              color: COLORS.white,
            }}
          >
            Submit
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default AddKnowledgeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
});
