import React, { useState, useEffect } from 'react';
import {
  View, StyleSheet, KeyboardAvoidingView,
  Platform, TouchableOpacity, FlatList
} from 'react-native';
import { Text, IconButton, Icon, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { isAfter, isBefore, parseISO } from 'date-fns';

const AddminNotice = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [notices, setNotices] = useState([]);

  const COLORS = {
    primary: "#075E54",
    secondary: "#128C7E",
    accent: "#25D366",
    background: "#F8F9FA",
    surface: "#FFFFFF",
    text: "#212529",
    lightText: "#6C757D",
    border: "#DEE2E6",
    white: "#FFFFFF",
    error: "#DC3545",
    success: "#28A745",
  };

  const today = new Date();

  // ✅ Fetch data from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // const response = await fetch('http://10.0.2.2:5001/notice/fetch');

        const response = await fetch(`${global.apiBaseUrl}/notice/fetch`);

        const json = await response.json();
        setNotices(json);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      }
    };

    fetchNotices();
  }, []);

  const getFilteredData = () => {
    if (activeTab === 'All') return notices;
    return notices.filter(item => {
      if (!item.date) return false;
      const itemDate = parseISO(item.date);
      return activeTab === 'Upcoming' ? isAfter(itemDate, today) : isBefore(itemDate, today);
    });
  };

  const renderTabButton = (label) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === label && { borderBottomColor: COLORS.white, borderBottomWidth: 2 },
      ]}
      onPress={() => setActiveTab(label)}
    >
      <Text style={[
        styles.tabText,
        { color: COLORS.white, fontWeight: activeTab === label ? 'bold' : 'normal' }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <View style={styles.noticeBox}>
      <Text style={styles.noticeMessage}>{item.message}</Text>
      <Text style={styles.noticeMeta}>📞 {item.receiver}</Text>
      <Text style={styles.noticeMeta}>
        📅 {item.date || 'N/A'} 🕒 {item.time || 'N/A'}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: COLORS.primary }]}
    >
      {/* 🔙 Back Arrow */}
      <View style={styles.backIconContainer}>
        <IconButton
          icon="arrow-left"
          iconColor={COLORS.white}
          size={28}
          onPress={() => navigation.navigate("AdminDashboard")}
        />
      </View>

      {/* Header Section */}
      <View style={styles.header}>
        <Icon source="bell-ring" size={70} color={COLORS.white} />
        <Text style={styles.headerText}>Admin Notices</Text>

        {/* Tabs: All | Upcoming | Previous */}
        <View style={styles.tabsContainer}>
          {renderTabButton("All")}
          {renderTabButton("Upcoming")}
          {renderTabButton("Previous")}
        </View>
      </View>

      {/* Notices Section */}
      <View style={[styles.content, { backgroundColor: COLORS.background }]}>
        <Text style={[styles.sectionTitle, { color: COLORS.primary }]}>
          📢 {activeTab} Notices
        </Text>

        <FlatList
          data={getFilteredData()}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.noticeList}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={styles.placeholder}>
              <Text style={[styles.placeholderText, { color: COLORS.lightText }]}>
                No {activeTab.toLowerCase()} notices available.
              </Text>
            </View>
          }
        />
      </View>

      {/* ➕ Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
        onPress={() => navigation.navigate("SndAddminMsg")}
      />
    </KeyboardAvoidingView>
  );
};

export default AddminNotice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIconContainer: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 1,
  },
  header: {
    paddingTop: 80,
    paddingBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff40',
  },
  tabButton: {
    marginHorizontal: 16,
    paddingBottom: 6,
  },
  tabText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 20,
    marginBottom: 12,
  },
  noticeList: {
    paddingBottom: 20,
  },
  noticeBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  noticeMessage: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#212529',
  },
  noticeMeta: {
    fontSize: 12,
    color: '#6C757D',
  },
  placeholder: {
    alignItems: 'center',
    marginTop: 40,
  },
  placeholderText: {
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#25D366',
    elevation: 4,
  },
});
