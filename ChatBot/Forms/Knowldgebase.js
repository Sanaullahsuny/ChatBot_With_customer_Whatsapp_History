import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Modal } from "react-native";
import { Text, Card, Button, TextInput, Chip, Searchbar } from "react-native-paper";

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
      const response = await fetch("http://10.0.2.2:5000/knowledgeBase");
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
      await fetch(`http://10.0.2.2:5000/knowledgeBase/${id}`, {
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
    const payload = { key: keyInput, value: valueInput };

    try {
      const url = editItem
        ? `http://10.0.2.2:5000/knowledgeBase/${editItem.id}`
        : "http://10.0.2.2:5000/knowledgeBase";

      const method = editItem ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.keyText}>{item.key}</Text>
        <Text>{item.value}</Text>
        <View style={styles.actions}>
          <Chip icon="pencil" onPress={() => handleEdit(item)} style={styles.chip}>
            Edit
          </Chip>
          <Chip
            icon="delete"
            onPress={() => handleDelete(item.id)}
            style={styles.chip}
            textStyle={{ color: "red" }}
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
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Button
        mode="contained"
        style={styles.addButton}
        onPress={() => {
          setEditItem(null);
          setKeyInput("");
          setValueInput("");
          setModalVisible(true);
        }}
      >
        Add New Knowledge
      </Button>

      {/* Modal for Add/Edit */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Title title={editItem ? "Edit Knowledge" : "Add Knowledge"} />
            <Card.Content>
              <TextInput
                label="Key"
                mode="outlined"
                value={keyInput}
                onChangeText={setKeyInput}
                style={styles.input}
              />
              <TextInput
                label="Value"
                mode="outlined"
                value={valueInput}
                onChangeText={setValueInput}
                style={styles.input}
              />
              <Button mode="contained" onPress={handleSubmit}>
                Submit
              </Button>
            </Card.Content>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#e1f5fe",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  search: {
    marginBottom: 10,
    borderRadius: 10,
  },
  card: {
    marginVertical: 8,
    padding: 10,
  },
  keyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  chip: {
    marginLeft: 10,
  },
  addButton: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#000000aa",
  },
  modalCard: {
    backgroundColor: "white",
    padding: 15,
  },
  input: {
    marginBottom: 10,
  },
});

export default KnowledgeBaseScreen;
