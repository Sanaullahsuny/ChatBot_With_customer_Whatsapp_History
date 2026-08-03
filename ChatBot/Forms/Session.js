import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COLORS = {
  primary: '#075E54',
  secondary: '#128C7E',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#212121',
  lightText: '#607D8B',
  error: '#F44336',
  success: '#4CAF50',
};

const SessionScreen = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newSessionTitle, setNewSessionTitle] = useState('');
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateSessionTitle, setUpdateSessionTitle] = useState('');
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);

  useEffect(() => {
    fetchSessions();
    fetchCurrentSession();
  }, []);

  const fetchSessions = async () => {
    try {
      // const response = await fetch('http://192.168.0.100:5001/session');

      const response = await fetch(`${global.apiBaseUrl}/session`);

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchCurrentSession = async () => {
    try {
      // const response = await fetch('http://10.0.2.2:5001/session/current');

      const response = await fetch(`${global.apiBaseUrl}/session/current`);

      const data = await response.json();
      setCurrentSession(data);
    } catch (error) {
      console.error('Error fetching current session:', error);
    }
  };

  const handleAddSession = async () => {
    if (newSessionTitle.trim() === '') {
      Alert.alert('Error', 'Session title cannot be empty!');
      return;
    }

    try {
      // await fetch('http://10.0.2.2:5001/session', {

      await fetch(`${global.apiBaseUrl}/session`, {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newSessionTitle }),
      });
      fetchSessions();
      setAddModalVisible(false);
      setNewSessionTitle('');
    } catch (error) {
      console.error('Error adding session:', error);
    }
  };

  const handleActivateSession = async (id) => {
    try {
      // await fetch(`http://10.0.2.2:5001/session/activate/${id}`, {

      await fetch(`${global.apiBaseUrl}/session/activate/${id}`, {

        method: 'PUT',
      });
      fetchSessions();
      fetchCurrentSession();
    } catch (error) {
      console.error('Error activating session:', error);
    }
  };

  const handleDeleteSession = (id) => {
    Alert.alert('Confirm', 'Are you sure you want to delete this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // await fetch(`http://10.0.2.2:5001/session/${id}`, {

await fetch(`${global.apiBaseUrl}/session/${id}`, {


              method: 'DELETE',
            });
            fetchSessions();
            fetchCurrentSession();
          } catch (error) {
            console.error('Error deleting session:', error);
          }
        },
      },
    ]);
  };

  const handleUpdateSession = async () => {
    if (!updateSessionTitle.trim()) return;

    try {
      // await fetch(`http://10.0.2.2:5001/session/${selectedUpdateId}`, {

      await fetch(`${global.apiBaseUrl}/session/${selectedUpdateId}`, {

        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updateSessionTitle }),
      });
      fetchSessions();
      setUpdateModalVisible(false);
      setUpdateSessionTitle('');
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Sessions</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Sessions"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <Icon name="search" size={22} color="#999" style={styles.searchIcon} />
      </View>

      {/* Active Session Display */}
      <Text style={styles.activeSession}>
        Active Session:{" "}
        <Text style={{ fontWeight: 'bold', color: COLORS.primary }}>
          {currentSession ? currentSession.title : 'None'}
        </Text>
      </Text>

      {/* Session List */}
      <FlatList
        data={filteredSessions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>{item.title}</Text>
              {!item.isActive && (
                <Text style={styles.inactiveText}>Inactive</Text>
              )}
            </View>

            <TouchableOpacity onPress={() => handleActivateSession(item.id)}>
              <Icon
                name={
                  currentSession && currentSession.id === item.id
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedUpdateId(item.id);
                  setUpdateSessionTitle(item.title);
                  setUpdateModalVisible(true);
                }}
              >
                <Icon name="edit" size={24} color={COLORS.success} style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteSession(item.id)}>
                <Icon name="delete" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Icon name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={addModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Session</Text>
            <TextInput
              placeholder="Session Title"
              value={newSessionTitle}
              onChangeText={setNewSessionTitle}
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleAddSession}>
              <Text style={styles.modalButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: COLORS.lightText }]}
              onPress={() => setAddModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Update Modal */}
      <Modal visible={updateModalVisible} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Session</Text>
            <TextInput
              placeholder="Session Title"
              value={updateSessionTitle}
              onChangeText={setUpdateSessionTitle}
              style={styles.modalInput}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateSession}>
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: COLORS.lightText }]}
              onPress={() => setUpdateModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SessionScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 15,
    elevation: 4,
  },
  headerText: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  activeSession: {
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    color: COLORS.text,
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  sessionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  inactiveText: {
    fontSize: 13,
    color: COLORS.lightText,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 50,
    elevation: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
