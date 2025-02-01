import React from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useProjectForm from './ProjectFormIntegration'; // Import the custom hook

const ProjectFormScreenUI = () => {
  const {
    projectName,
    setProjectName,
    estimatedAmount,
    setEstimatedAmount,
    category,
    setCategory,
    type,
    setType,
    allocatedAmount,
    setAllocatedAmount,
    tableData,
    handleProjectSubmit,
    handleAddRow,
    categoryTypes
  } = useProjectForm(); // Use the custom hook to get all the states and handlers

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Project Form</Text>

      <Text style={styles.label}>Project Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name"
        value={projectName}
        onChangeText={setProjectName}
      />

      <Text style={styles.label}>Estimated Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter estimated amount"
        value={estimatedAmount}
        onChangeText={setEstimatedAmount}
        keyboardType="numeric"
      />

      <View style={styles.header}>
        <Text style={styles.headerCell}>Category</Text>
        <Text style={styles.headerCell}>Type</Text>
        <Text style={styles.headerCell}>Amount Allocated</Text>
      </View>

      <FlatList
        data={tableData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <Text style={styles.rowTitle}>Add Table Row</Text>

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Labour" value="labour" />
        <Picker.Item label="Material" value="material" />
        <Picker.Item label="Machinery" value="machinery" />
      </Picker>

      <Text style={styles.label}>Type</Text>
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
        enabled={category !== ''}
      >
        <Picker.Item label="Select Type" value="" />
        {categoryTypes[category] && categoryTypes[category].length > 0 ? (
          categoryTypes[category].map((item, index) => (
            <Picker.Item key={index} label={item} value={item} />
          ))
        ) : (
          <Picker.Item label="No types available" value="" />
        )}
      </Picker>

      <Text style={styles.label}>Amount Allocated</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter allocated amount"
        value={allocatedAmount}
        onChangeText={setAllocatedAmount}
        keyboardType="numeric"
      />

      <Button title="Add Row" onPress={handleAddRow} />

      <View style={styles.submitButtonContainer}>
        <Button title="Submit Project" onPress={handleProjectSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  header: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden', // Ensures the picker does not get cut off
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Ensures proper height for Android
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  submitButtonContainer: {
    marginTop: 20,
  },
});

export default ProjectFormScreenUI;
