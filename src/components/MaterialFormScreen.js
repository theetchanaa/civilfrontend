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
  Text,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const MaterialFormScreen = () => {
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
        const response = await fetch('http://192.168.98.250:5000/material');
        const data = await response.json();
        console.log(data);
        setIndustryOptions(data.material);
        setFilteredIndustryOptions(data.material);
      } catch (error) {
        console.error('Error fetching material types:', error);
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
        const labourResponse = await fetch('http://192.168.98.250:5000/add-material', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ material: newIndustryType }),
        });

        const materialData = await materialResponse.json();

        if (materialData.error) {
          alert(`Error: ${materialData.error}`);
          return;
        }

        if (materialData.success) {
          alert('Success: New material type added successfully!');
        }
      }

      const response = await fetch('http://192.168.98.250:5000/add-category', {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Material</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.formContainer}
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
              placeholderTextColor="#2E3A59"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#2E3A59"
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
              placeholder="Select Material Type"
              searchable={true}
              searchPlaceholder="Search material..."
              style={styles.dropdown}
              onChangeSearchText={handleSearchTextChange}
              listMode="SCROLLVIEW"
              zIndex={1000}
              zIndexInverse={1000}
              dropDownContainerStyle={styles.dropDownContainer}
              textStyle={styles.dropdownText}
              placeholderStyle={styles.dropdownPlaceholder}
            />

            <TextInput
              style={styles.input}
              placeholder="Add a new material type"
              value={newIndustryType}
              onChangeText={setNewIndustryType}
              editable={!industryType}
              placeholderTextColor="#2E3A59"
            />

            <View style={styles.submitButtonContainer}>
              <Button 
                title="Submit" 
                onPress={handleSubmit}
                color="#2E3A59"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#2E3A59',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    fontSize: 16,
    color: '#2E3A59',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E9F2',
    marginBottom: 15,
  },
  dropDownContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E9F2',
  },
  dropdownText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  dropdownPlaceholder: {
    color: '#2E3A59',
  },
  submitButtonContainer: {
    marginBottom: 50,
  },
});

export default MaterialFormScreen;