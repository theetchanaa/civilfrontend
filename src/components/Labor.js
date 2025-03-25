import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Button, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://192.168.150.250:5000"; // Flask API URL

const Labor = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pickerSearchQuery, setPickerSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [options, setOptions] = useState([]); // Store fetched options
  const [filteredOptions, setFilteredOptions] = useState([]); // Store filtered options
  const [allPickerItems, setAllPickerItems] = useState([]); // Store all unique picker values

  useEffect(() => {
    fetchCategories();
    fetchOptions();
  }, []);
  
  const fetchOptions = () => {
    fetch(`${API_URL}/get-options`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          // Filter out any null or empty values
          const validOptions = data.map(option => {
            const filteredOption = {};
            Object.entries(option).forEach(([key, value]) => {
              if (value && value.toString().trim() !== '') {
                filteredOption[key] = value;
              }
            });
            return filteredOption;
          }).filter(option => Object.keys(option).length > 0);
          
          setOptions(validOptions);
          setFilteredOptions(validOptions);
          
          // Extract all unique values for the picker
          const uniqueValues = new Set();
          validOptions.forEach(option => {
            Object.values(option).forEach(value => {
              if (value && value.toString().trim() !== '') {
                uniqueValues.add(value.toString());
              }
            });
          });
          setAllPickerItems(Array.from(uniqueValues).sort());
        } else {
          console.error("Options fetch error:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  const fetchCategories = () => {
    setLoading(true);
    fetch(`${API_URL}/get_category`)
      .then((res) => res.json())
      .then((data) => {
        const validData = data.filter((cat) => cat.name && cat.name.trim() !== ""); // Remove categories with null/empty names
        const sortedData = validData.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  };
  
  const filteredCategories = categories.filter((category) =>
    category.name && category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category) => {
    setSelectedCategory({ ...category, old_id: category.id }); // Store old_id
    setModalVisible(true);
    setPickerSearchQuery(""); // Reset picker search when opening modal
  };
  
  const handleSave = () => {
    if (!selectedCategory) return;
  
    fetch(`${API_URL}/update-category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        old_id: selectedCategory.old_id || selectedCategory.id, // Ensure old_id exists
        id: selectedCategory.id,
        name: selectedCategory.name,
        type: selectedCategory.type,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          alert("Category updated successfully!");
          fetchCategories(); // Refresh categories
          setModalVisible(false);
        } else {
          alert("Update failed! " + (data.error || ""));
        }
      })
      .catch((err) => console.error("Update error:", err));
  };
  
  const handleDelete = (categoryId) => {
    fetch(`${API_URL}/delete-category/${categoryId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId)); // Remove from UI
        setModalVisible(false);
      })
      .catch((err) => console.error("Delete error:", err));
  };

  const handlePickerSearch = (text) => {
    setPickerSearchQuery(text);
    
    // Always show all options while typing, but highlight/filter based on search
    if (text.trim() === "") {
      // Show all options when search is empty
      setFilteredOptions(options);
    } else {
      // When searching, still keep all options in the state
      setFilteredOptions(options);
    }
  };

  // Get filtered picker items based on search query
  const getPickerItems = () => {
    if (pickerSearchQuery.trim() === "") {
      return allPickerItems;
    }
    
    // Filter items that match the search query
    return allPickerItems.filter(item => 
      item.toLowerCase().includes(pickerSearchQuery.toLowerCase())
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Project Categories</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search categories..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {loading ? <ActivityIndicator size="large" color="blue" /> : null}

      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              item.type && item.type.toLowerCase() === "labour" && styles.labourHighlight,
            ]}
            onPress={() => handleCategoryPress(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.categoryId}>#{item.id}</Text>
              <Text style={styles.categoryType}>
                {item.type ? item.type.toUpperCase() : ""}
              </Text>
            </View>
            <Text style={styles.categoryName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyMessage}>No categories found. Try a different search.</Text>
          )
        }
      />

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Category</Text>

            {selectedCategory && (
              <>
                <Text style={styles.label}>Category ID:</Text>
                <TextInput
                  style={styles.input}
                  value={selectedCategory.id ? selectedCategory.id.toString() : ""}
                  onChangeText={(text) =>
                    setSelectedCategory((prev) => ({ ...prev, id: text }))
                  }
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Category Name:</Text>
                <TextInput
                  style={styles.input}
                  value={selectedCategory.name || ""}
                  onChangeText={(text) =>
                    setSelectedCategory((prev) => ({ ...prev, name: text }))
                  }
                />

                <Text style={styles.label}>Category Type:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Search category types..."
                  value={pickerSearchQuery}
                  onChangeText={handlePickerSearch}
                />

                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>
                    {pickerSearchQuery
                      ? `Showing results for "${pickerSearchQuery}"`
                      : "All category types"}
                  </Text>

                  {getPickerItems().length > 0 ? (
                    <Picker
                      selectedValue={selectedCategory.type || ""}
                      onValueChange={(value) =>
                        setSelectedCategory((prev) => ({ ...prev, type: value }))
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="Select a type" value="" />
                      {getPickerItems().map((value, index) => (
                        <Picker.Item
                          key={`${value}-${index}`}
                          label={value}
                          value={value}
                          color={
                            pickerSearchQuery &&
                            value.toLowerCase().includes(pickerSearchQuery.toLowerCase())
                              ? "#000"
                              : "#444"
                          }
                        />
                      ))}
                    </Picker>
                  ) : (
                    <Text style={styles.noResults}>No matching types found</Text>
                  )}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(selectedCategory.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f8" },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  searchInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderColor: "#ddd",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  categoryId: { fontSize: 14, color: "#888" },
  categoryType: { fontSize: 14, fontWeight: "bold", color: "#555" },
  categoryName: { fontSize: 20, fontWeight: "bold", color: "#333" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#555" },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderColor: "#ddd",
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  pickerLabel: { fontSize: 14, color: "#666", marginBottom: 5, paddingHorizontal: 5 },
  picker: { marginBottom: 5 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  saveButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#F44336" },
  cancelButton: { backgroundColor: "#9E9E9E" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  labourHighlight: { borderLeftWidth: 5, borderLeftColor: "#4a90e2" },
  noResults: { padding: 10, textAlign: "center", color: "#888", marginBottom: 15 },
  emptyMessage: { textAlign: "center", color: "#888", marginTop: 20, fontSize: 16 },
});
export default Labor;