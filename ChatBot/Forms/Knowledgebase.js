import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Button,
  TextInput,
  Chip,
  Searchbar,
} from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

const COLORS = {
  primary: "#075E54",
  secondary: "#128C7E",
  accent: "#25D366",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  text: "#212529",
  lightText: "#6C757D",
  border: "#DEE2E6",
  error: "#DC3545",
};

const KnowledgeBaseScreen = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      // const response = await fetch("http://10.0.2.2:5001/knowledgeBase");

      const response = await fetch(`${global.apiBaseUrl}/knowledgeBase`);

      const result = await response.json();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Fetch Error:", error);
      Alert.alert("Error", "Failed to fetch data");
    }
  };

  const handleDelete = async (id) => {
    try {
      // await fetch(`http://10.0.2.2:5001/knowledgeBase/${id}`, {

      await fetch(`${global.apiBaseUrl}/knowledgeBase/${id}`, {

        method: "DELETE",
      });
      fetchKnowledgeBase();
    } catch (error) {
      Alert.alert("Error", "Failed to delete");
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setKeyInput(item.key);
    setValueInput(item.value);
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!keyInput.trim() || !valueInput.trim()) {
      Alert.alert("Validation", "Key and Value are required.");
      return;
    }

    const url = editItem
      // ? `http://10.0.2.2:5001/knowledgeBase/${editItem.id}`
      // : "http://10.0.2.2:5001/knowledgeBase";

      ? `${global.apiBaseUrl}/knowledgeBase/${editItem.id}`
: `${global.apiBaseUrl}/knowledgeBase`;

    const method = editItem ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: keyInput, value: valueInput }),
      });

      setModalVisible(false);
      setEditItem(null);
      setKeyInput("");
      setValueInput("");
      fetchKnowledgeBase();
    } catch (error) {
      Alert.alert("Error", "Failed to save data");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = data.filter(
      (item) =>
        item.key.toLowerCase().includes(query.toLowerCase()) ||
        item.value.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} elevation={3}>
      <Card.Content>
        <Text style={styles.keyText}>{item.key}</Text>
        <Text style={styles.valueText}>{item.value}</Text>
        <View style={styles.actions}>
          <Chip icon="pencil" onPress={() => handleEdit(item)} style={styles.chip}>
            Edit
          </Chip>
          <Chip
            icon="delete"
            onPress={() => handleDelete(item.id)}
            style={[styles.chip, { backgroundColor: "#F8D7DA" }]}
            textStyle={{ color: COLORS.error }}
          >
            Delete
          </Chip>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Knowledge Base</Text>

      <Searchbar
        placeholder="Search knowledge..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.search}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <Button
        mode="contained"
        icon="plus"
        style={styles.addButton}
        onPress={() => {
          setEditItem(null);
          setKeyInput("");
          setValueInput("");
          setModalVisible(true);
        }}
        labelStyle={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}
      >
        Add New Knowledge
      </Button>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editItem ? "Edit Knowledge" : "Add Knowledge"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Card.Content>
              <TextInput
                label="Key"
                mode="outlined"
                value={keyInput}
                onChangeText={setKeyInput}
                style={styles.input}
                editable={!editItem}
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
              />
              <TextInput
                label="Value"
                mode="outlined"
                value={valueInput}
                onChangeText={setValueInput}
                style={styles.input}
                multiline
                outlineColor={COLORS.border}
                activeOutlineColor={COLORS.primary}
              />
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitBtn}
                labelStyle={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}
              >
                Submit
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

export default KnowledgeBaseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.primary,
  },
  search: {
    marginBottom: 10,
    borderRadius: 12,
  },
  card: {
    marginVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
  },
  keyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
  },
  valueText: {
    fontSize: 15,
    color: COLORS.lightText,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  chip: {
    marginLeft: 10,
    backgroundColor: COLORS.background,
  },
  addButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "60%",
    backgroundColor: COLORS.secondary,
    borderRadius: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#00000088",
  },
  modalCard: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  submitBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 10,
    marginTop: 8,
  },
});
