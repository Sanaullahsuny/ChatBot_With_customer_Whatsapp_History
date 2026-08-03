import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SERVER_URL = 'http://10.0.2.2:5001';

const SingleUserRatingScreen = ({ route }) => {
  const { phno, rating: initialRating, feedback: initialFeedback } = route.params;

  const [rating, setRating] = useState(initialRating);
  const [feedback, setFeedback] = useState(initialFeedback);
  const [loading, setLoading] = useState(false);

  // 🔧 Future backend fetch (commented)
  /*
  useEffect(() => {
    const fetchUserRating = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/rating/${phno}`);
        const data = await res.json();
        if (data.rating) {
          setRating(data.rating);
          setFeedback(data.feedback);
        } else {
          Alert.alert("No rating found for this user.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        Alert.alert("Error", "Could not fetch rating.");
      }
      setLoading(false);
    };

    fetchUserRating();
  }, []);
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Rating Detail</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#128C7E" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.value}>{phno}</Text>

          <Text style={styles.label}>Rating:</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((val) => (
              <Ionicons
                key={val}
                name={val <= rating ? 'star' : 'star-outline'}
                size={30}
                color="#FFD700"
              />
            ))}
          </View>

          <Text style={styles.label}>Feedback:</Text>
          <Text style={styles.feedback}>{feedback}</Text>
        </View>
      )}
    </View>
  );
};

export default SingleUserRatingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff', alignItems: 'center', paddingTop: 40,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#128C7E',
  },
  card: {
    backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, width: '90%',
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
  },
  label: { fontWeight: 'bold', fontSize: 16, marginTop: 12, color: '#444' },
  value: { fontSize: 16, color: '#333' },
  stars: { flexDirection: 'row', marginTop: 8 },
  feedback: {
    fontSize: 16, color: '#555', fontStyle: 'italic', marginTop: 4,
  },
});
