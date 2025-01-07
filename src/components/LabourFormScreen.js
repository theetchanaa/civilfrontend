import React, { useState } from 'react';
import { TextInput, View, Button, Text, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const LabourFormPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [labourId, setLabourId] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [newIndustryType, setNewIndustryType] = useState('');

  const [industryOptions, setIndustryOptions] = useState([
    'Mason', 'Shuttering', 'Carpenter', 'Painter', 'Tiles Work', 'Electrician', 'Plumber', 'RR Mason',
  ]);

  const [filteredIndustryOptions, setFilteredIndustryOptions] = useState(industryOptions); // for filtering the options
  const [openIndustry, setOpenIndustry] = useState(false); // For dropdown visibility

  // Handle adding new industry type
  const handleAddType = () => {
    if (newIndustryType.trim() !== '' && !industryOptions.includes(newIndustryType)) {
      setIndustryOptions([...industryOptions, newIndustryType]);
      setFilteredIndustryOptions([...industryOptions, newIndustryType]); // Update filtered options too
      setNewIndustryType('');
    }
  };

  // Filter options based on the text typed
  const handleSearchTextChange = (text) => {
    const filtered = industryOptions.filter(option =>
      option.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredIndustryOptions(filtered); // Update the filtered options
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log('Form Submitted', { name, phone, labourId, industryType });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Labour ID"
        value={labourId}
        onChangeText={setLabourId}
      />

      {/* Searchable Industry Dropdown */}
      <DropDownPicker
        open={openIndustry}
        value={industryType}
        items={filteredIndustryOptions.map(option => ({ label: option, value: option }))}
        setOpen={setOpenIndustry}
        setValue={setIndustryType}
        placeholder="Select Industry Type"
        searchable={true}
        searchPlaceholder="Search industry..."
        style={styles.dropdown}
        onChangeSearchText={handleSearchTextChange} // Filter dropdown items as user types
      />

      <TextInput
        style={styles.input}
        placeholder="Add a new industry type"
        value={newIndustryType}
        onChangeText={setNewIndustryType}
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
    marginBottom: 30, // Adjusts the position of the "Add Type" button
  },
  submitButtonContainer: {
    marginBottom: 50, // Ensures the submit button is not hidden
  },
});

export default LabourFormPage;
