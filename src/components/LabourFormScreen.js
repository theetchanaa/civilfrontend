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
        const response = await fetch('http://192.168.234.233:5000/labour');
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
        const labourResponse = await fetch('http://192.168.234.233:5000/add-labour', {
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

      const response = await fetch('http://192.168.234.233:5000/add-category', {
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
          <View style={styles.formContainer}>
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />

            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Enter Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
            />

            <View style={styles.dropdownWrapper}>
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
                dropDownContainerStyle={styles.dropdownContainer}
                textStyle={styles.dropdownText}
                onChangeSearchText={handleSearchTextChange}
                listMode="MODAL"
                modalProps={{
                  animationType: "slide"
                }}
                modalContentContainerStyle={styles.modalContent}
                modalTitle="Select Industry Type"
                zIndex={1000}
                zIndexInverse={1000}
              />
            </View>

            <TextInput
              style={[styles.input, styles.inputSpacing, !industryType ? {} : styles.disabledInput]}
              placeholder="Add a new industry type"
              value={newIndustryType}
              onChangeText={setNewIndustryType}
              editable={!industryType}
              placeholderTextColor="#999"
            />

            <View style={styles.submitButtonContainer}>
              <Button 
                title="Submit"
                onPress={handleSubmit}
                color="#2E3A59"
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2E3A59',
  },
  inputSpacing: {
    marginBottom: 15,
  },
  disabledInput: {
    backgroundColor: '#EAEEF5',
    color: '#999',
  },
  dropdownWrapper: {
    marginBottom: 15,
    zIndex: 1000,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderRadius: 10,
  },
  dropdownContainer: {
    borderColor: '#E4E9F2',
    borderRadius: 10,
    maxHeight: 200,
  },
  dropdownText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  submitButtonContainer: {
    marginTop: 10,
  }
});

export default LabourFormPage;
