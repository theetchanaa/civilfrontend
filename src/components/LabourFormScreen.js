import React, { useState, useEffect } from 'react';
import {
  TextInput,
  View,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const LabourFormPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [newIndustryType, setNewIndustryType] = useState('');
  const [industryOptions, setIndustryOptions] = useState([]);
  const [filteredIndustryOptions, setFilteredIndustryOptions] = useState([]);
  const [openIndustry, setOpenIndustry] = useState(false);

  useEffect(() => {
    const fetchIndustryOptions = async () => {
      try {
        const response = await fetch('http://192.168.1.4:5000/labour');
        const data = await response.json();
        console.log(data);
        setIndustryOptions(data.labour);
        setFilteredIndustryOptions(data.labour);
      } catch (error) {
        console.error('Error fetching industry types:', error);
      }
    };

    fetchIndustryOptions();
  }, []);

  const handleSearchTextChange = (text) => {
    const filtered = industryOptions.filter(
      (option) =>
        option &&
        option.toLowerCase().startsWith(text.toLowerCase())
    );
    setFilteredIndustryOptions(filtered);
  };

  const handleSubmit = async () => {
    const formData = {
      name,
      id: phone,
      type: industryType || newIndustryType,
    };

    try {
      if (newIndustryType && !industryType) {
        const labourResponse = await fetch('http://192.168.1.4:5000/add-labour', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ labour: newIndustryType }),
        });

        const labourData = await labourResponse.json();

        if (labourData.error) {
          alert(`Error: ${labourData.error}`);
          return;
        }

        if (labourData.success) {
          alert('Success: New labour type added successfully!');
        }
      }

      const response = await fetch('http://192.168.1.4:5000/add-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else if (data.success) {
        alert('Success: Form submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
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

          <DropDownPicker
            open={openIndustry}
            value={industryType}
            items={[
              { label: "None", value: null },
              ...filteredIndustryOptions
                ?.filter((option) => option)
                .map((option, index) => ({
                  label: option,
                  value: option,
                  key: index,
                })),
            ]}
            setOpen={setOpenIndustry}
            setValue={setIndustryType}
            placeholder="Select Industry Type"
            searchable={true}
            searchPlaceholder="Search industry..."
            style={styles.dropdown}
            onChangeSearchText={handleSearchTextChange}
            listMode="SCROLLVIEW" 
            zIndex={1000} 
            zIndexInverse={1000} 
          />

          <TextInput
            style={styles.input}
            placeholder="Add a new industry type"
            value={newIndustryType}
            onChangeText={setNewIndustryType}
            editable={!industryType}
          />

          <View style={styles.submitButtonContainer}>
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    padding: 20,
    paddingBottom: 50,
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
  submitButtonContainer: {
    marginBottom: 50,
  },
});

export default LabourFormPage;
