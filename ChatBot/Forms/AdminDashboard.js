import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const AdminDashboard = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [people, setPeople] = useState([]);   // server se aane wale users
  const [bellCount, setBellCount] = useState(0);  // error history ka count
  
    // 👥 People fetch karna server se
  const fetchPeople = useCallback(async () => {
    try {
     //const response = await fetch(`http://10.0.2.2:5001/person`);
     const response = await fetch(`${global.apiBaseUrl}/person`);

     
       
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching people:', error);
    }
  }, []);

  // 🔔 Error history count lana
  const fetchErrorHistoryCount = useCallback(async () => {
    try {
       
      //const res = await fetch(`http://10.0.2.2:5001/error-history`);
      const res = await fetch(`${global.apiBaseUrl}/error-history`);


      const data = await res.json();
      setBellCount(data.length);
    } catch (error) {
      console.error('Error fetching error history:', error);
    }
  }, []);

  useEffect(() => {
    fetchPeople();  // jab screen load ho to users fetch karo
  }, [fetchPeople]);

  useFocusEffect(
    useCallback(() => {
      fetchErrorHistoryCount();// jab screen wapas focus mein aaye to bell count update karo
    }, [fetchErrorHistoryCount])
  );

  const handlePersonClick = (person) => {
    navigation.navigate('ChatHistoryScreen', {
      personId: person.id,
      personName: person.name
    });
  };

  const menuOptions = [
    { id: '1', label: 'Knowledgebase', screen: 'Knowledgebase' },
    { id: '2', label: 'Session', screen: 'Session' },
      { id: '3', label: 'AddminNotice', screen: 'AddminNotice' }
  ];

  return (
    <View style={styles.container}>
       {/* 🔝 Header with back + title + notifications + menu */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Admin Dashboard</Text>
              {/* 🔔 Notification icon */}
        <View style={styles.iconGroup}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ErrorHistoryScreen')}
            style={styles.bellWrapper}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {bellCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{bellCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.absoluteDropdown}>
          {menuOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate(option.screen);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.body}>
        <FlatList
          data={people}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.personItem}
              onPress={() => handlePersonClick(item)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{item.name}</Text>
                <Text style={styles.personNumber}>
                  {item.phno || 'No number available'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('CategoriesScreen')}>
          <Ionicons name="albums-outline" size={24} color="#075E54" />
          <Text style={styles.navButtonText}>Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('ArchivedScreen')}>
          <Ionicons name="archive-outline" size={24} color="#075E54" />
          <Text style={styles.navButtonText}>Archived</Text>
        </TouchableOpacity>

 <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Comparison')}>
    <Ionicons name="bar-chart-outline" size={24} color="#075E54" />
    <Text style={styles.navButtonText}>Comparison</Text>
  </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#075E54',
    elevation: 4,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  bellWrapper: {
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  absoluteDropdown: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 8,
    width: 160,
    zIndex: 999,
  },
  dropdownItem: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  avatar: {
    backgroundColor: '#25D366',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  personInfo: {
    marginLeft: 15,
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  personNumber: {
    fontSize: 14,
    color: '#777',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 13,
    color: '#075E54',
    marginTop: 4,
    fontWeight: '500',
  },
});

export default AdminDashboard;
