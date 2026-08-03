// ErrorHistoryScreen.js
// Yeh screen admin ko sari error tags aur unke chatId ke sath dikhati hai

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useRoute } from '@react-navigation/native';

const ErrorHistoryScreen = ({ navigation }) => {
  const [errors, setErrors] = useState([]);
  const [filteredErrors, setFilteredErrors] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const { refreshed } = route.params || {};

  const fetchErrorHistory = async () => {
    setLoading(true);
    try {
      // const res = await fetch('http://10.0.2.2:5001/error-history');

      const res = await fetch(`${global.apiBaseUrl}/error-history`);

      const data = await res.json();
      setErrors(data);
      setFilteredErrors(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrorHistory(); // initial load
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (refreshed) {
        fetchErrorHistory();
      }
    }, [refreshed])
  );

  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = errors.filter(item =>
      item.tag.toLowerCase().includes(lower)
    );
    setFilteredErrors(filtered);
  }, [searchText, errors]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('AddKnowledgeScreen', { tag: item.tag, id: item.id })
      }
    >
      <View style={styles.tagRow}>
        <Ionicons name="bug-outline" size={22} color="#E91E63" />
        <Text style={styles.tagText}>{item.tag}</Text>
      </View>
      <Text style={styles.chatId}>Chat ID: {item.chatId}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')}>
          <Ionicons name="arrow-back" size={24} color="#FFF" style={{ marginRight: 10 }} />
        </TouchableOpacity>
        <Ionicons name="alert-circle-outline" size={22} color="#FFF" style={styles.icon} />
        <Text style={styles.title}>Error History</Text>
      </View>

      <TextInput
        placeholder="Search tags..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#888"
      />

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#075E54" />
        </View>
      ) : filteredErrors.length === 0 ? (
        <Text style={styles.emptyText}>No error tags found.</Text>
      ) : (
        <FlatList
          data={filteredErrors}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default ErrorHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#075E54',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 12,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 17,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  chatId: {
    fontSize: 14,
    color: '#777',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 16,
  },
});
