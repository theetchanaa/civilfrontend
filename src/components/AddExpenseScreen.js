import React, { useState } from 'react';
import axios from 'axios';

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
  const types = ['Labour', 'Materials', 'Machinery']; // Example


  const handleProjectNameChange = async (text) => {
    setProjectName(text);
    try {
      const response = await axios.get(`http://192.168.14.233:5000/search?project_name=${text}&search_text=${searchText}`);
      setFilteredProjects(response.data.filtered_projects);
      setFilteredRows(response.data.filtered_workers);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };
  
  const handleSearchChange = async (text) => {
    setSearchText(text);
    try {
      const response = await axios.get(`http://192.168.14.233:5000/search?project_name=${projectName}&search_text=${text}`);
      setFilteredProjects(response.data.filtered_projects);
      setFilteredRows(response.data.filtered_workers);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !selectedType || !selectedDetails || !expense) {
      Alert.alert('Error', 'Please fill out all fields before submitting.');
      return;
    }
  
    const data = {
      project_name: projectName,
      
      name: selectedDetails.name,
      phone: selectedDetails.id,  // Using phone as user identifier
      expense_type: selectedDetails.type,
      expense: parseFloat(expense),
    };
  
    try {
      const response = await fetch('http://192.168.14.233:5000/add_expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Expense submitted successfully!');
        setProjectName('');
        setSelectedType('');
        setSearchText('');
        setSelectedDetails(null);
        setExpense('');
      } else {
        Alert.alert('Error', result.error || 'Failed to add expense.');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      Alert.alert('Error', 'An error occurred while submitting the expense.');
    }
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
                  setProjectName(item.projectname); // Correctly access projectname
                  setFilteredProjects([]);
                }}
              >
                <Text style={styles.dropdownItem}>
                  {item.projectname} 
                </Text>
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
                  {item.name} {item.phone && `(${item.phone})`}
                </Text>

              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Selected Details */   }

      {selectedDetails && (
  <View style={styles.detailsContainer}>
    <Text style={styles.detailText}>
      <Text style={styles.bold}>Name:</Text> {selectedDetails.name}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.bold}>Phone:</Text> {selectedDetails.id || 'Not available'}
    </Text>
    <Text style={styles.detailText}>
      <Text style={styles.bold}>Sector:</Text> {selectedDetails.type || 'Not available'}
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