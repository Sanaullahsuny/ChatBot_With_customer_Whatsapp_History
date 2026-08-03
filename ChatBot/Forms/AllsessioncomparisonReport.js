// ChatBot/Forms/AllsessioncomparisonReport.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AllsessioncomparisonReport = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchSessions = async () => {
    try {
      // const res = await fetch('http://10.0.2.2:5001/session');

      const res = await fetch(`${global.apiBaseUrl}/session`);

      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const newReports = {};
      for (const session of sessions) {
        // const res = await fetch(`http://10.0.2.2:5001/chat/categoryReport/${session.id}`);
        const res = await fetch(`${global.apiBaseUrl}/chat/categoryReport/${session.id}`);

        const data = await res.json();
        newReports[session.title] = data;
      }
      setReports(newReports);
    } catch (err) {
      console.error('Error fetching category reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchSessions();
    };
    init();
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      fetchAllReports();
    }
  }, [sessions]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>📊 All Session Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView style={{ marginTop: 10, marginBottom: 80 }}>
          {Object.keys(reports).map((sessionTitle, idx) => (
            <View key={idx} style={styles.sessionBlock}>
              <Text style={styles.sessionTitle}>🟢 {sessionTitle}</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>📂 Category</Text>
                <Text style={styles.headerCell}>Total Chats</Text>
              </View>
              {reports[sessionTitle].map((cat, i) => (
                <View key={i} style={[styles.tableRow, i % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                  <Text style={styles.cell}>{cat.category_title}</Text>
                  <Text style={styles.cell}>{cat.total_chats}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Show Graph Button */}
      <TouchableOpacity style={styles.graphButton} onPress={() => navigation.navigate('Allgraph', { reports })}>
        <Text style={styles.graphButtonText}>Show Graph</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AllsessioncomparisonReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sessionBlock: {
    marginBottom: 25,
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    elevation: 2,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075E54',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#075E54',
    paddingVertical: 8,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  rowEven: {
    backgroundColor: '#F9F9F9',
  },
  rowOdd: {
    backgroundColor: '#FFFFFF',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  graphButton: {
    position: 'absolute',
    bottom: 15,
    left: '25%',
    right: '25%',
    backgroundColor: '#075E54',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  graphButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
