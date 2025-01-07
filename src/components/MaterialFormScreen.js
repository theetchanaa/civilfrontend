import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Importing DropDownPicker

const MaterialFormScreen = ({ navigation }) => {
  const [companyId, setCompanyId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [materialType, setMaterialType] = useState('');
  const [newType, setNewType] = useState('');
  
  const [materialOptions, setMaterialOptions] = useState([
    'Cement', 'Bricks', 'M Sand', 'Metal', 'Steel', 
    'Shuttering Materials', 'Wood', 'Hardwares',
    'Paint Shop', 'Tiles', 'Tiles Paste', 'Electrical Materials',
    'Plumbing Materials', 'Soling', 'RR Stones'
  ]);

  const [filteredMaterialOptions, setFilteredMaterialOptions] = useState(materialOptions); // for filtering the options
  const [openMaterial, setOpenMaterial] = useState(false); // For dropdown visibility

  const handleAddNewType = () => {
    if (newType.trim() && !materialOptions.includes(newType.trim())) {
      setMaterialOptions([...materialOptions, newType.trim()]);
      setNewType('');
    }
  };

  const handleSearchTextChange = (text) => {
    const filtered = materialOptions.filter(option =>
      option.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredMaterialOptions(filtered); // Update the filtered options
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Material Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Company ID"
        value={companyId}
        onChangeText={setCompanyId}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Choose Material Type:</Text>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={openMaterial}
          value={materialType}
          items={filteredMaterialOptions.map(option => ({ label: option, value: option }))}
          setOpen={setOpenMaterial}
          setValue={setMaterialType}
          placeholder="Select Material Type"
          searchable={true}
          searchPlaceholder="Search material..."
          style={styles.dropdown}
          onChangeSearchText={handleSearchTextChange} // Filters based on typed text
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add New Material Type"
        value={newType}
        onChangeText={setNewType}
      />
      <TouchableOpacity onPress={handleAddNewType} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Type</Text>
      </TouchableOpacity>

      <Button title="Submit" onPress={() => console.log('Material Form Submitted')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdown: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MaterialFormScreen;
