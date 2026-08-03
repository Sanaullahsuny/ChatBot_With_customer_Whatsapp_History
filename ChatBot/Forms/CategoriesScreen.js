

// CategoriesScreen.js
// Is screen mein current session ke categories fetch hote hain aur search bhi kiya ja sakta hai
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

const CategoriesScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [currentSession, setCurrentSession] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionid, setsessionid] = useState('');
  useEffect(() => {
    fetchCurrentSession();
  }, []);

  const fetchCurrentSession = async () => {
    try {
       const res = await fetch('http://192.168.2.173:5001/session/current');

      //const res = await fetch(`${global.apiBaseUrl}/session/current`);

      const session = await res.json();
      setsessionid(session)
      setCurrentSession(session);
      fetchCategoriesBySession(session.id);
    } catch (error) {
      console.error('Error fetching session:', error);
      setLoading(false);
    }
  };

  const fetchCategoriesBySession = async (sessionId) => {
    try {
       //const res = await fetch(`'http://192.168.206.173:5001/chat/categoryReport/${sessionId}`);

      const res = await fetch(`${global.apiBaseUrl}/chat/categoryReport/${sessionId}`);

      const data = await res.json();
      setCategories(data);
      setFilteredCategories(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
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
    //console.log("session",sessionid.id),
    //console.log("item.category_id",item.category_id),
    //console.log("item.category_title",item.category_title),
    
    <TouchableOpacity
      style={styles.categoryCard}
        onPress={() =>
    navigation.navigate('ShowChatCategory', {
      sessionId:sessionid.id,         // pass sessionId
      categoryId:item.category_id,          // pass category ID
      categoryTitle:item.category_title,    // pass category title
    })

      }
    >
      <View style={styles.categoryInfo}>
        <Ionicons name="pricetag" size={24} color="#075E54" />
        <Text style={styles.categoryText}>{item.category_title}</Text>
      </View>
      <Text style={styles.countText}>{item.total_chats}</Text>
       <Text  style={{backgroundColor:'yellow'}}>{item.avg_rate}</Text>
    </TouchableOpacity>
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
        <Text style={styles.headerTitle}>
          Categories {currentSession ? `(${currentSession.title})` : ''}
        </Text>
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#999"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#075E54',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 60,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#075E54',
  },
});

export default CategoriesScreen;
