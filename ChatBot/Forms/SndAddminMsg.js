import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Text, Button, IconButton, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// const SERVER_URL = 'http://10.0.2.2:5001';
const SERVER_URL = global.apiBaseUrl;


const SndAddminMsg = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState('broadcast');
  const [dropdownItems, setDropdownItems] = useState([
    { label: 'Broadcast (All)', value: 'broadcast' },
    { label: 'Specific Users', value: 'specific' },
  ]);

  const [isScheduled, setIsScheduled] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  const COLORS = {
    primary: "#075E54",
    accent: "#25D366",
    white: "#FFFFFF",
    input: "#F1F3F4",
    text: "#212529",
  };

  const fetchnotice = () => {
    fetch(`${SERVER_URL}/notice/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch(err => console.log("User fetch error:", err));
  };

  useEffect(() => {
    fetchnotice();
  }, []);

const toggleUserSelection = (phno) => {
  setSelectedUsers(prev =>
    prev.includes(phno) ? prev.filter(p => p !== phno) : [...prev, phno]
  );
};

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.phno.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSend = () => {
    if (!message) {
      Alert.alert("Missing", "Please enter a message.");
      return;
    }

    if (dropdownValue === 'specific' && selectedUsers.length === 0) {
      Alert.alert("Missing", "Please select at least one user.");
      return;
    }

    const getTodayDate = () => {
      const today = new Date();
      return today.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    };

    const payload = {
      message,
      is_scheduled: isScheduled ? 1 : 0,
      time: isScheduled
        ? selectedTime.toTimeString().split(' ')[0]
        : "00:00:00", // default time
      date: isScheduled
        ? selectedDate.toISOString().split('T')[0]
        : getTodayDate(), // default date
    };

    let endpoint = '/notice/broadcast';
    if (dropdownValue === 'specific') {
      endpoint = '/notice/selected';
      payload.phone_numbers = selectedUsers;
    }

    fetch(`${SERVER_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(() => {
        Alert.alert("Success", "Message sent successfully!");
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        Alert.alert("Error", "Failed to send message.");
      });

    fetchnotice();
  };

  const renderUser = ({ item }) => {
    const isSelected = selectedUsers.includes(item.phno);

    return (
      <TouchableOpacity
        style={[
          styles.userCard,
          { backgroundColor: isSelected ? '#E6F9EC' : '#F9F9F9' },
        ]}
        onPress={() => toggleUserSelection(item.phno)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon
            source={isSelected ? "check-circle" : "account-circle-outline"}
            size={28}
            color={isSelected ? COLORS.accent : "#888"}
          />
          <Text style={styles.userPhone}>{item.phno}</Text>
        </View>
        <Icon
          source={isSelected ? "check" : "plus"}
          size={20}
          color={isSelected ? COLORS.accent : "#ccc"}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.backIconContainer}>
            <IconButton
              icon="arrow-left"
              iconColor={COLORS.white}
              size={28}
              onPress={() => navigation.goBack()}
            />
          </View>

          <View style={styles.header}>
            <Icon source="message" size={70} color={COLORS.white} />
            <Text style={styles.headerText}>Send Admin Message</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              placeholder="Type your message here..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            />

            <Text style={styles.label}>Send To</Text>
            <DropDownPicker
              open={dropdownOpen}
              value={dropdownValue}
              items={dropdownItems}
              setOpen={setDropdownOpen}
              setValue={setDropdownValue}
              setItems={setDropdownItems}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
            />

            {dropdownValue === 'specific' && (
              <>
                <Text style={styles.label}>Search Users</Text>
                <TextInput
                  placeholder="Search by phone number..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  style={styles.input}
                />
                <FlatList
                  data={filteredUsers}
                  keyExtractor={(item) => item.phno}
                  renderItem={renderUser}
                  scrollEnabled={false}
                />
              </>
            )}

            <View style={styles.scheduleRow}>
              <Text style={styles.label}>Schedule</Text>
              <Switch value={isScheduled} onValueChange={setIsScheduled} />
            </View>

            {isScheduled && (
              <>
                <Text style={styles.label}>Select Date</Text>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(true)}
                  style={styles.input}
                >
                  <Text>{selectedDate.toDateString()}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={datePickerVisible}
                  mode="date"
                  onConfirm={(date) => {
                    setSelectedDate(date);
                    setDatePickerVisible(false);
                  }}
                  onCancel={() => setDatePickerVisible(false)}
                />

                <Text style={styles.label}>Select Time</Text>
                <TouchableOpacity
                  onPress={() => setTimePickerVisible(true)}
                  style={styles.input}
                >
                  <Text>
                    {selectedTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={timePickerVisible}
                  mode="time"
                  is24Hour
                  onConfirm={(time) => {
                    setSelectedTime(time);
                    setTimePickerVisible(false);
                  }}
                  onCancel={() => setTimePickerVisible(false)}
                />
              </>
            )}

            <Button
              mode="contained"
              onPress={handleSend}
              style={styles.button}
              buttonColor={COLORS.accent}
              textColor="white"
            >
              Send
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SndAddminMsg;

const styles = StyleSheet.create({
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212529',
  },
  input: {
    backgroundColor: '#F1F3F4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#F1F3F4',
    borderColor: '#ccc',
    marginBottom: 20,
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderColor: '#ccc',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    backgroundColor: '#F9F9F9',
    elevation: 2,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  userPhone: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 10,
  },
});
