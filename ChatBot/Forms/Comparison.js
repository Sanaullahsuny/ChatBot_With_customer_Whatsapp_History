import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';

const Comparison = ({ navigation }) => {
  const [sessions, setSessions] = useState([]);
  const [session1, setSession1] = useState(null);
  const [session2, setSession2] = useState(null);
  const [categories1, setCategories1] = useState([]);
  const [categories2, setCategories2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(true);

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

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

  const fetchCategoryReport = async (sessionId, setCategoryFn) => {
    try {
      setLoading(true);
      const url = sessionId === 'all'
        // ? `http://10.0.2.2:5001/chat/categoryReportAll`
        // : `http://10.0.2.2:5001/chat/categoryReport/${sessionId}`;

        ? `${global.apiBaseUrl}/chat/categoryReportAll`

       : `${global.apiBaseUrl}/chat/categoryReport/${sessionId}`;

      const res = await fetch(url);
      const data = await res.json();
      setCategoryFn(data);
    } catch (err) {
      console.error('Error fetching category report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (session1 !== null && showData) fetchCategoryReport(session1, setCategories1);
  }, [session1]);

  useEffect(() => {
    if (session2 !== null && showData) fetchCategoryReport(session2, setCategories2);
  }, [session2]);

  const mergeCategories = () => {
    const map = {};
    categories1.forEach(cat => {
      map[cat.category_title] = { s1: cat.total_chats, s2: 0 };
    });
    categories2.forEach(cat => {
      if (map[cat.category_title]) {
        map[cat.category_title].s2 = cat.total_chats;
      } else {
        map[cat.category_title] = { s1: 0, s2: cat.total_chats };
      }
    });
    return Object.keys(map).map(title => ({
      title,
      session1Chats: map[title].s1,
      session2Chats: map[title].s2,
    }));
  };

  const merged = mergeCategories();

  const getSessionTitle = (id) => {
    if (id === 'all') return 'All';
    const session = sessions.find(s => s.id === id);
    return session ? session.title : '';
  };

  const handleHideData = () => {
    setCategories1([]);
    setCategories2([]);
    setSession1(null);
    setSession2(null);
    setShowData(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate('AdminDashboard')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>📊 Compare Sessions</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.dropdownRow}>
        <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>Session 1</Text>
          <DropDownPicker
            open={open1}
            value={session1}
            setOpen={setOpen1}
            setValue={setSession1}
            items={[
              { label: '-- All Sessions --', value: 'all' },
              ...sessions.map(s => ({ label: s.title, value: s.id }))
            ]}
            placeholder="Select Session 1"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            zIndex={2000}
            zIndexInverse={1000}
            onChangeValue={() => setShowData(true)}
          />
        </View>

        <View style={styles.dropdownWrapper}>
          <Text style={styles.label}>Session 2</Text>
          <DropDownPicker
            open={open2}
            value={session2}
            setOpen={setOpen2}
            setValue={setSession2}
            items={[
              { label: '-- All Sessions --', value: 'all' },
              ...sessions.map(s => ({ label: s.title, value: s.id }))
            ]}
            placeholder="Select Session 2"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownBox}
            zIndex={1000}
            zIndexInverse={2000}
            onChangeValue={() => setShowData(true)}
          />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="#075E54" style={{ marginTop: 20 }} />}

      {session1 && session2 && !loading && merged.length > 0 && showData && (
        <>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.headerCell}>📂 Category</Text>
            <Text style={styles.headerCell}>{getSessionTitle(session1)}</Text>
            <Text style={styles.headerCell}>{getSessionTitle(session2)}</Text>
            <TouchableOpacity onPress={handleHideData}>
              <Ionicons name="close-circle" size={24} color="#B00020" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.tableContainer}>
            {merged.map((item, index) => (
              <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.rowEven : styles.rowOdd]}>
                <Text style={styles.cell}>{item.title}</Text>
                <Text style={styles.cell}>{item.session1Chats}</Text>
                <Text style={styles.cell}>{item.session2Chats}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.graphButton}
            onPress={() => {
              navigation.navigate('Mixgraph', {
                graphData: merged,
                session1Title: getSessionTitle(session1),
                session2Title: getSessionTitle(session2),
              });
            }}
          >
            <Ionicons name="bar-chart-outline" size={22} color="#fff" />
            <Text style={styles.graphButtonText}>Show Graph</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AllsessioncomparisonReport')}
      >
        <Ionicons name="document-text-outline" size={26} color="#fff" />
        <Text style={styles.fabText}>All Report</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Comparison;

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
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    zIndex: 1000,
  },
  dropdownWrapper: {
    flex: 0.48,
    zIndex: 1000,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 5,
    color: '#075E54',
  },
  dropdown: {
    borderColor: '#ccc',
    height: 45,
  },
  dropdownBox: {
    borderColor: '#ccc',
  },
  tableContainer: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    maxHeight: 300,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#075E54',
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'space-between',
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
    paddingVertical: 10,
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
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
    backgroundColor: '#075E54',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  fabText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
  graphButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#128C7E',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginVertical: 15,
    alignSelf: 'center',
    elevation: 4,
  },
  graphButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
