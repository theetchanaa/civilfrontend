import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "http://10.1.226.6:5000"; // Replace with your Flask API URL

const CategoryScreen = () => {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        fetch(`${API_URL}/categories`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => console.error(err));
    };

    const handleEdit = (category) => {
        setEditingCategory({ ...category });
    };

    const handleSave = () => {
        fetch(`${API_URL}/update-category`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editingCategory),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Category updated successfully!");
                setEditingCategory(null);
                fetchCategories(); // Refresh list
            })
            .catch((err) => console.error(err));
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Category Management</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Search category..."
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            {loading ? <ActivityIndicator size="large" color="blue" /> : null}

            <FlatList
                data={filteredCategories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {editingCategory && editingCategory.id === item.id ? (
                            <>
                                <TextInput
                                    style={styles.input}
                                    value={editingCategory.name}
                                    onChangeText={(text) => setEditingCategory({ ...editingCategory, name: text })}
                                />
                                <Picker
                                    selectedValue={editingCategory.type}
                                    onValueChange={(value) => setEditingCategory({ ...editingCategory, type: value })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select Type" value="" />
                                    <Picker.Item label="Material" value="Material" />
                                    <Picker.Item label="Workforce" value="Workforce" />
                                    <Picker.Item label="Machinery" value="Machinery" />
                                </Picker>
                                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.categoryText}>Name: {item.name}</Text>
                                <Text style={styles.categoryText}>Type: {item.type}</Text>
                                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    card: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    categoryText: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 8,
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: "#fff",
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    editButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
    },
    saveButton: {
        backgroundColor: "#28a745",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default CategoryScreen;
