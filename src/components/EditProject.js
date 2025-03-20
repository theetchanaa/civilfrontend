import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Button, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL = `http://192.168.234.233:5000`;

const EditProject = ({ route }) => {
    const { project } = route.params;
    const [projectDetails, setProjectDetails] = useState(null);
    const [employeeDetails, setEmployeeDetails] = useState([]);
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [newEntry, setNewEntry] = useState({ type: "", name: "", cost: 0 });

    const [editableProject, setEditableProject] = useState({
        quotedamount: project.quotedamount,
        totexpense: project.totexpense,
    });

    useEffect(() => {
        fetch(`${API_URL}/project-details?projectname=${project.projectname}`)
            .then((res) => res.json())
            .then((data) => setProjectDetails(data))
            .catch((err) => console.error(err));

        fetch(`${API_URL}/employee-details?projectname=${project.projectname}`)
            .then((res) => res.json())
            .then((data) => setEmployeeDetails(data))
            .catch((err) => console.error(err));

        fetch(`${API_URL}/category-details?projectname=${project.projectname}`)
            .then((res) => res.json())
            .then((data) => setCategoryDetails(data))
            .catch((err) => console.error(err));
    }, [project.projectname]);

    const handleSaveProjectDetails = () => {
        fetch(`${API_URL}/update-project`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectname: project.projectname,
                quotedamount: editableProject.quotedamount,
                totexpense: editableProject.totexpense,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                alert("Project details updated successfully!");
            })
            .catch((err) => console.error(err));
    };

    const handleAddEntry = () => {
        if (!newEntry.type || !newEntry.name || newEntry.cost <= 0) {
            alert("Please fill all fields correctly.");
            return;
        }

        fetch(`${API_URL}/add-entry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newEntry, projectname: project.projectname }),
        })
            .then((res) => res.json())
            .then(() => {
                alert("Entry added successfully!");
                setNewEntry({ type: "", name: "", cost: 0 });
            })
            .catch((err) => console.error(err));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Edit Project: {project.projectname}</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Quoted Amount:</Text>
                <TextInput
                    value={editableProject.quotedamount.toString()}
                    onChangeText={(text) => setEditableProject({ ...editableProject, quotedamount: text })}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <Text style={styles.label}>Total Expense:</Text>
                <TextInput
                    value={editableProject.totexpense.toString()}
                    onChangeText={(text) => setEditableProject({ ...editableProject, totexpense: text })}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleSaveProjectDetails}>
                    <Text style={styles.buttonText}>Save Changes</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Project Details</Text>
            <Text>{JSON.stringify(projectDetails, null, 2)}</Text>

            <Text style={styles.sectionTitle}>Employee Details</Text>
            {employeeDetails.map((emp, index) => (
                <Text key={index} style={styles.detailItem}>{emp.name}</Text>
            ))}

            <Text style={styles.sectionTitle}>Category Details</Text>
            {categoryDetails.map((cat, index) => (
                <Text key={index} style={styles.detailItem}>{cat.name}</Text>
            ))}

            <Text style={styles.sectionTitle}>Add New Entry</Text>
            <View style={styles.section}>
                <Text style={styles.label}>Type:</Text>
                <Picker
                    selectedValue={newEntry.type}
                    onValueChange={(itemValue) => setNewEntry({ ...newEntry, type: itemValue })}
                    style={styles.picker}
                >
                    <Picker.Item label="Select" value="" />
                    <Picker.Item label="Labour" value="labour" />
                    <Picker.Item label="Machinery" value="machinery" />
                    <Picker.Item label="Material" value="material" />
                </Picker>

                <Text style={styles.label}>Name:</Text>
                <TextInput
                    value={newEntry.name}
                    onChangeText={(text) => setNewEntry({ ...newEntry, name: text })}
                    style={styles.input}
                />

                <Text style={styles.label}>Cost:</Text>
                <TextInput
                    value={newEntry.cost.toString()}
                    onChangeText={(text) => setNewEntry({ ...newEntry, cost: parseFloat(text) })}
                    keyboardType="numeric"
                    style={styles.input}
                />

                <TouchableOpacity style={styles.button} onPress={handleAddEntry}>
                    <Text style={styles.buttonText}>Add Entry</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    section: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    detailItem: {
        fontSize: 16,
        paddingVertical: 5,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default EditProject;
