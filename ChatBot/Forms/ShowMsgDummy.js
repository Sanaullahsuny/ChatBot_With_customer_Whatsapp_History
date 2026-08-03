import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ShowMsg = ({ navigation }) => {
  const phno = '923000000001'; // Dummy user phone

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Chat Completed!</Text>
      <Text style={styles.sub}>Want to rate this chat?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RateBot', { phno })}
      >
        <Text style={styles.btnText}>Rate Now ⭐</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShowMsg;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  sub: { fontSize: 16, marginBottom: 30 },
  button: {
    backgroundColor: '#128C7E',
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
