import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SERVER_URL = 'http://10.0.2.2:5001';

// ⭐ Mapping stars to string values
const ratingLabels = {
  1: 'Very Bad',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const RateBotScreen = ({ navigation, route }) => {
  const { phno } = route.params;
  const [rating, setRating] = useState(0);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Please select a rating.");
      return;
    }

    const ratingText = ratingLabels[rating];

    // ✅ Dummy behavior
    Alert.alert('Thank You!', `Rating: ${rating} star(s)\nFeedback: ${ratingText}`);
    navigation.navigate('ViewRatings');

    // 🔧 Future backend POST logic:
    /*
    try {
      const res = await fetch(`${SERVER_URL}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phno, rating, feedback: ratingText }),
      });

      if (res.ok) {
        Alert.alert("Thanks!", "Rating submitted.");
        navigation.navigate('ViewRatings');
      } else {
        Alert.alert("Error", "Failed to submit rating.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      Alert.alert("Error", "Server not responding.");
    }
    */
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate Your Chat</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((val) => (
          <TouchableOpacity key={val} onPress={() => setRating(val)}>
            <Ionicons
              name={val <= rating ? 'star' : 'star-outline'}
              size={45}
              color="#FFD700"
              style={styles.starIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      {rating > 0 && (
        <Text style={styles.labelText}>You selected: {ratingLabels[rating]}</Text>
      )}

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RateBotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',
  },
  title: {
    fontSize: 22, marginBottom: 20, fontWeight: 'bold', color: '#333',
  },
  starRow: {
    flexDirection: 'row', marginBottom: 20,
  },
  starIcon: {
    marginHorizontal: 8,
  },
  labelText: {
    fontSize: 16, marginBottom: 20, color: '#444',
  },
  submitBtn: {
    backgroundColor: '#128C7E', padding: 12, borderRadius: 8,
  },
  submitText: {
    color: 'white', fontWeight: 'bold', fontSize: 16,
  },
});
