import React, { useState } from 'react';
import { TextInput, View, Button, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const MachineryFormScreen = () => {
  const [companyId, setCompanyId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [machineryType, setMachineryType] = useState('');
  const [newType, setNewType] = useState('');

  const [machineryOptions, setMachineryOptions] = useState([
    'Excavators', 'Loaders', 'Cranes', 'Bulldozers', 'Forklifts', 'Compactors', 'Generators', 'Concrete Mixers',
  ]);

  const [filteredMachineryOptions, setFilteredMachineryOptions] = useState(machineryOptions);
  const [openMachinery, setOpenMachinery] = useState(false);

  // Handle adding a new machinery type
  const handleAddType = () => {
    if (newType.trim() !== '' && !machineryOptions.includes(newType)) {
      setMachineryOptions([...machineryOptions, newType]);
      setFilteredMachineryOptions([...machineryOptions, newType]);
      setNewType('');
    }
  };

  // Filter options based on the text typed
  const handleSearchTextChange = (text) => {
    const filtered = machineryOptions.filter(option =>
      option.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredMachineryOptions(filtered);
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form Submitted', { companyId, phoneNumber, name, machineryType });
  };

  return (
    <View style={styles.container}>
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
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      {/* Searchable Machinery Dropdown */}
      <DropDownPicker
        open={openMachinery}
        value={machineryType}
        items={filteredMachineryOptions.map(option => ({ label: option, value: option }))}
        setOpen={setOpenMachinery}
        setValue={setMachineryType}
        placeholder="Select Machinery Type"
        searchable={true}
        searchPlaceholder="Search machinery..."
        style={styles.dropdown}
        onChangeSearchText={handleSearchTextChange}
      />

      <TextInput
        style={styles.input}
        placeholder="Add a new machinery type"
        value={newType}
        onChangeText={setNewType}
      />
      
      <View style={styles.addButtonContainer}>
        <Button title="Add Type" onPress={handleAddType} />
      </View>

      <View style={styles.submitButtonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  dropdown: {
    height: 50,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  addButtonContainer: {
    marginBottom: 30,
  },
  submitButtonContainer: {
    marginBottom: 50,
  },
});

export default MachineryFormScreen;
