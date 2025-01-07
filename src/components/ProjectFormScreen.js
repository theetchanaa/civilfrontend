import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component

const ProjectFormScreen = () => {
  const [projectName, setProjectName] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [tableData, setTableData] = useState([]);

  // Define options for each category
  const categoryTypes = {
    labour: ['Mason', 'Shuttering', 'Carpenter', 'Painter', 'Tiles Work', 'Electrician', 'Plumber', 'RR Mason'],
    machinery: ['Excavators', 'Loaders', 'Cranes', 'Bulldozers', 'Forklifts', 'Compactors', 'Generators', 'Concrete Mixers'],
    material: ['Cement', 'Bricks', 'M Sand', 'Metal', 'Steel', 'Shuttering Materials', 'Wood', 'Hardwares', 'Paint Shop', 'Tiles', 'Tiles Paste', 'Electrical Materials', 'Plumbing Materials', 'Soling', 'RR Stones'],
  };

  // Handle form submission for project details
  const handleProjectSubmit = () => {
    if (projectName && estimatedAmount) {
      alert('Project Added!');
      setProjectName('');
      setEstimatedAmount('');
    } else {
      alert('Please fill in all fields');
    }
  };

  // Handle adding a row to the table
  const handleAddRow = () => {
    if (category && type && allocatedAmount) {
      const newRow = {
        id: String(tableData.length + 1),
        category: category,
        type: type,
        amount: allocatedAmount,
      };
      setTableData([...tableData, newRow]);

      // Reset row input fields after adding
      setCategory('');
      setType('');
      setAllocatedAmount('');
    } else {
      alert('Please fill in all fields');
    }
  };

  // Render each row for the table
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

      {/* Project Input Fields */}
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

      {/* Table Header */}
      <View style={styles.header}>
        <Text style={styles.headerCell}>Category</Text>
        <Text style={styles.headerCell}>Type</Text>
        <Text style={styles.headerCell}>Amount Allocated</Text>
      </View>

      {/* Table Data */}
      <FlatList
        data={tableData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* Table Row Input Fields */}
      <Text style={styles.rowTitle}>Add Table Row</Text>

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}>
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
        enabled={category !== ''} // Enable Type dropdown only after Category is selected
      >
        <Picker.Item label="Select Type" value="" />
        {category && categoryTypes[category]?.map((item, index) => (
          <Picker.Item key={index} label={item} value={item} />
        ))}
      </Picker>

      <Text style={styles.label}>Amount Allocated</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter allocated amount"
        value={allocatedAmount}
        onChangeText={setAllocatedAmount}
        keyboardType="numeric"
      />

      {/* Add Row Button */}
      <Button title="Add Row" onPress={handleAddRow} />

      {/* Submit Project Button at the bottom */}
      <View style={styles.submitButtonContainer}>
        <Button title="Submit Project" onPress={handleProjectSubmit} />
      </View>
    </View>
  );
};

// Styles for the form and table
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
  picker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Background color for the picker
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  submitButtonContainer: {
    marginTop: 20, // Adding margin to position the Submit button better
  },
});

export default ProjectFormScreen;
