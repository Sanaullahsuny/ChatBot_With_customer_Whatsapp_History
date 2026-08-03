import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SERVER_URL = 'http://10.0.2.2:5001';

const ViewRatingsScreen = ({ navigation }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Dummy data (default)
  const dummyRatings = [
    { phno: "923001111111", rating: 5, feedback: "Excellent" },
    { phno: "923002222222", rating: 3, feedback: "Okay" },
    { phno: "923003333333", rating: 1, feedback: "Very Bad" },
  ];

  useEffect(() => {
    setRatings(dummyRatings); // ✅ Dummy by default

    // 🔧 Future backend fetch (uncomment to use later)
    /*
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SERVER_URL}/all_ratings`);
        const data = await res.json();
        setRatings(data.ratings);
      } catch (err) {
        Alert.alert("Error", "Failed to fetch ratings.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchRatings();
    */
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('SingleUserRating', { phno: item.phno, rating: item.rating, feedback: item.feedback })}
    >
      <Text style={styles.phno}>📞 {item.phno}</Text>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((val) => (
          <Ionicons
            key={val}
            name={val <= item.rating ? 'star' : 'star-outline'}
            size={20}
            color="#FFD700"
          />
        ))}
        <Text style={styles.feedbackText}> — {item.feedback}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>All Ratings</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#128C7E" />
      ) : (
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.phno}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default ViewRatingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  phno: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  row: { flexDirection: 'row', alignItems: 'center' },
  feedbackText: { marginLeft: 8, color: '#555' },
});
