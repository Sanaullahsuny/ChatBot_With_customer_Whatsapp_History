import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CategoryReportBySession = ({ navigation, route }) => {
  const { sessionId, sessionTitle } = route.params;
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryReport(sessionId);
  }, [sessionId]);

  const fetchCategoryReport = async (id) => {
    try {
      const response = await fetch(`http://192.168.206.1:5001/chat/categoryReport/${id}`);

      //const response = await fetch(`${global.apiBaseUrl}/chat/categoryReport/${id}`);

      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Error fetching category report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lower = searchText.toLowerCase();
    const filtered = categories.filter((item) =>
      item.category_title.toLowerCase().includes(lower)
    );
    setFilteredCategories(filtered);
  }, [searchText, categories]);

  const renderItem = ({ item }) => (
    <View style={styles.categoryItem}>
      <View style={styles.iconText}>
        <Ionicons name="pricetag" size={24} color="#075E54" />
        <Text style={styles.categoryText}>{item.category_title}</Text>
      </View>
      <Text style={styles.countText}>{item.total_chats} </Text>
      
    </View>

    
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#075E54" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          Report - {sessionTitle}
        </Text>
      </View>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#888"
      />

      {/* Category List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.category_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default CategoryReportBySession;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    marginBottom: 16,
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 50,
  },
  categoryItem: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flexShrink: 1,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
  },
});
