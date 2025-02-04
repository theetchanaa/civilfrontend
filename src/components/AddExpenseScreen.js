import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';

const AddExpenseScreen = () => {
  const [projectName, setProjectName] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [expense, setExpense] = useState('');

  const projects = ['Project A', 'Project B', 'Project C', 'Project D'];

  const rows = [
    { name: 'John Doe', phone: '1234567890', sector: 'Carpenter' },
    { name: 'Jane Smith', phone: '9876543210', sector: 'Painter' },
    { name: 'Mike Johnson', phone: '4567890123', sector: 'Mason' },
    { name: 'Anna Taylor', phone: '6543210987', sector: 'Shuttering' },
  ];

  const types = ['Labour', 'Material', 'Machinery'];

  const handleProjectNameChange = (text) => {
    setProjectName(text);
    const filtered = projects.filter((project) =>
      project.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    const filtered = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(text.toLowerCase()) ||
        row.phone.includes(text)
    );
    setFilteredRows(filtered);
  };

  const handleSubmit = () => {
    if (!projectName || !selectedType || !selectedDetails || !expense) {
      Alert.alert('Error', 'Please fill out all fields before submitting.');
      return;
    }

    const data = {
      projectName,
      selectedType,
      name: selectedDetails.name,
      phone: selectedDetails.phone,
      sector: selectedDetails.sector,
      expense,
    };

    console.log('Submitted Data:', data);
    Alert.alert('Success', 'Expense submitted successfully!');
    // Reset fields
    setProjectName('');
    setSelectedType('');
    setSearchText('');
    setSelectedDetails(null);
    setExpense('');
  };

  return (
    <View style={styles.container}>
      {/* Project Name Input */}
      <Text style={styles.label}>Enter Project Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type project name"
        value={projectName}
        onChangeText={handleProjectNameChange}
      />
      {filteredProjects.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredProjects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setProjectName(item);
                  setFilteredProjects([]);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Type Selection */}
      <Text style={styles.label}>Select Type:</Text>
      <View style={styles.typeContainer}>
        {types.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.selectedTypeButton,
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === type && styles.selectedTypeButtonText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.selectedTypeLabel}>
        Selected Type: {selectedType || 'None'}
      </Text>

      {/* Search Input */}
      <Text style={styles.label}>Search by Name or Phone:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type name or phone number"
        value={searchText}
        onChangeText={handleSearchChange}
      />
      {filteredRows.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredRows}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDetails(item);
                  setFilteredRows([]);
                  setSearchText(item.name);
                }}
              >
                <Text style={styles.dropdownItem}>
                  {item.name} ({item.phone})
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Selected Details */}
      {selectedDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Name:</Text> {selectedDetails.name}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Phone:</Text> {selectedDetails.phone}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.bold}>Sector:</Text> {selectedDetails.sector}
          </Text>
        </View>
      )}

      {/* Expense Input */}
      <Text style={styles.label}>Enter Expense:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type expense amount"
        value={expense}
        onChangeText={setExpense}
        keyboardType="numeric"
      />

      {/* Submit Button */}
      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} color="#007bff" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    maxHeight: 150,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#e9f7ef',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b2dfdb',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  typeButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    width: '30%',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedTypeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  submitButton: {
    marginTop: 20,
  },
});

export default AddExpenseScreen;