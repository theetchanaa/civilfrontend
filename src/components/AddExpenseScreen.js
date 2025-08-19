import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, StyleSheet, TouchableOpacity, Button, Alert, 
  FlatList, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const API_URL = 'http://10.1.226.6:5000/projects'; 
const FETCH_ID_URL = 'http://10.1.226.6:5000/get_project_payment_details';
const ADD_EXPENSE_URL = 'http://10.1.226.6:5000/add_expense';
const CHECK_OVERRUN_URL = 'http://10.1.226.6:5000/check-overrun';

const AddExpenseScreen = () => {
  // Existing state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [pickerOptions, setPickerOptions] = useState([]);
  const [selectedPickerValue, setSelectedPickerValue] = useState('');
  const [expense, setExpense] = useState('');
  const [searchText, setSearchText] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [namePhoneOptions, setNamePhoneOptions] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  
  // New state variables for overrun warnings
  const [showOverrunWarning, setShowOverrunWarning] = useState(false);
  const [overrunData, setOverrunData] = useState(null);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const types = ['labour', 'material', 'machinery'];

  // Existing useEffect hooks...
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetchPickerOptions(selectedType.toLowerCase());
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedProject && selectedPickerValue) {
      fetchProjectDetails(selectedProject.projectname, selectedPickerValue);
    }
  }, [selectedProject, selectedPickerValue]);

  useEffect(() => {
    if (selectedProject && selectedType) {
      fetchProjectDetails(selectedProject.projectname, selectedType);
    }
  }, [selectedProject, selectedType]);

  
  // Fetch project list
  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data.projects);
      setFilteredProjects(data.projects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  // Fetch picker options based on selected type
  const fetchPickerOptions = async (category) => {
    try {
      console.log(`Fetching options for category: ${category}`);
      const response = await axios.get(`http://10.1.226.6:5000/${category}`);
      
      console.log('API Response:', response.data);

      // Extract options dynamically based on the category
      const options = response.data[category];

      if (Array.isArray(options)) {
        // Remove null values and empty strings
        const filteredOptions = options.filter(option => option && option.trim() !== '');
        setPickerOptions(filteredOptions);
      } else {
        console.error('Invalid options format:', response.data);
        setPickerOptions([]);
      }
    } catch (error) {
      console.error('Error fetching picker options:', error);
      setPickerOptions([]);
    }
  };

  // Fetch name & ID from backend based on project name & type

  const fetchProjectDetails = async (projectname, type) => {
    try {
      console.log(`Fetching details for Project: ${projectname}, Type: ${type}`);
      const response = await axios.get(`${FETCH_ID_URL}`, {
        params: { projectname, type }
      });
  
      console.log('Project Details API Response:', response.data.categories);
  
      if (response.data && response.data.categories) {
        setNamePhoneOptions(response.data.categories); // Store fetched categories
      } else {
        setNamePhoneOptions([]);
      }
    } catch (error) {
      console.error('Error fetching project details:', response);
      setNamePhoneOptions([]);
    }
  };
  


  // New function to check for potential overruns
  const checkOverrun = async (projectname) => {
    try {
      const response = await axios.post(CHECK_OVERRUN_URL, {
        projectname: projectname
      });
      
      console.log('Overrun check response:', response.data);
      
      if (response.data.overrun) {
        setOverrunData({
          isOverrun: response.data.overrun,
          predictedCost: response.data.predicted_cost
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for overrun:', error);
      return false;
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) =>
      project.projectname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  // Modified handleSubmit function
  const handleSubmit = async () => {
    if (!selectedProject || !selectedType || !searchText || !expense) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }
  
    setSubmittingExpense(true);
    
    try {
      const categoryId = searchText.split(' - ').pop();
      const response = await axios.post(ADD_EXPENSE_URL, {
        projectname: selectedProject.projectname,
        category_id: categoryId,
        expense: parseInt(expense),
        type: selectedPickerValue
      });
  
      if (response.status === 200) {
        // After successful submission, check for potential overruns
        const hasOverrun = await checkOverrun(selectedProject.projectname);
        
        if (hasOverrun) {
          setShowOverrunWarning(true);
        } else {
          Alert.alert('Success', 'Expense added successfully!');
          resetForm();
        }
      } else {
        Alert.alert('Error', 'Failed to add expense.');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      Alert.alert('Error', 'Selected project details doesn\'t have quoted amount.');
    } finally {
      setSubmittingExpense(false);
    }
  };
  
  // Function to reset form fields
  const resetForm = () => {
    setSelectedProject(null);
    setSearchQuery('');
    setFilteredProjects(projects);
    setSelectedType('');
    setSelectedPickerValue('');
    setPickerOptions([]);
    setSearchText('');
    setExpense('');
    fetchProjects();
  };

  // Function to handle acknowledging the overrun warning
  const handleOverrunConfirm = () => {
    setShowOverrunWarning(false);
    Alert.alert(
      'Expense Added', 
      'Expense has been added successfully, but please note the potential budget overrun. An email notification has been sent to stakeholders.',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            {/* Existing form elements... */}
            
            {/* Search Project */}
            <Text style={styles.label}>Search Project</Text>
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Type project name"
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />

            {/* Rest of your existing form... */}
            {loading ? (
              <ActivityIndicator size="large" color="#0078D4" />
            ) : (
              <FlatList
                data={filteredProjects}
                keyExtractor={(item) => item.projectname}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery(item.projectname);
                      setSelectedProject(item);
                      setFilteredProjects([]);
                    }}
                  >
                    <Text style={styles.suggestionItem}>{item.projectname}</Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionList}
                keyboardShouldPersistTaps="handled"
              />
            )}

            {/* Type Selection */}
            <Text style={styles.label}>Select Type</Text>
            <View style={[styles.typeContainer, styles.inputSpacing]}>
              {types.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, selectedType === type && styles.selectedTypeButton]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text style={[styles.typeButtonText, selectedType === type && styles.selectedTypeButtonText]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Project Details */}
            {projectDetails && (
              <>
                <Text style={styles.label}>Project ID</Text>
                <Text style={[styles.input, styles.inputSpacing, styles.disabledInput]}>
                  {projectDetails.pid}
                </Text>

                <Text style={styles.label}>Project Name</Text>
                <Text style={[styles.input, styles.inputSpacing, styles.disabledInput]}>
                  {projectDetails.projectname}
                </Text>
              </>
            )}

            {/* Picker Selection */}
            <Text style={styles.label}>Select an Option</Text>
            <View style={[styles.dropdownWrapper]}>
              <Picker
                selectedValue={selectedPickerValue}
                onValueChange={(itemValue) => setSelectedPickerValue(itemValue)}
                style={styles.dropdown}
              >
                <Picker.Item label="Select an option..." value="" />
                {pickerOptions.length > 0 ? (
                  pickerOptions.map((option, index) => (
                    <Picker.Item key={index} label={option} value={option} />
                  ))
                ) : (
                  <Picker.Item label="No options available" value="" />
                )}
              </Picker>
            </View>

            {/* Category Search */}
            <Text style={styles.label}>Search by Category Name or ID</Text>
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Type category name or ID"
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                const filtered = namePhoneOptions.filter(
                  (item) =>
                    item.category_name.toLowerCase().includes(text.toLowerCase()) ||
                    item.category_id.toLowerCase().includes(text.toLowerCase())
                );
                setFilteredOptions(filtered);
              }}
              placeholderTextColor="#999"
            />

            {filteredOptions.length > 0 && (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => item.category_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchText(`${item.category_name} - ${item.category_id}`);
                      setFilteredOptions([]);
                    }}
                  >
                    <Text style={styles.suggestionItem}>
                      {item.category_name} - {item.category_id}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.suggestionList}
                keyboardShouldPersistTaps="handled"
              />
            )}

            {/* Expense Input */}
            <Text style={styles.label}>Enter Expense</Text>
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Type expense amount"
              value={expense}
              onChangeText={setExpense}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />

            {/* Submit Button */}
            <View style={styles.submitButtonContainer}>
              <Button 
                title={submittingExpense ? "Submitting..." : "Submit"}
                onPress={handleSubmit}
                color="#2E3A59"
                disabled={submittingExpense}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
      
      {/* Overrun Warning Modal */}
      <Modal
        visible={showOverrunWarning}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>⚠ Budget Overrun Warning</Text>
            <Text style={styles.modalText}>
              Our predictive model indicates this project may exceed its budget.
            </Text>
            {overrunData && (
              <View style={styles.overrunDetails}>
                <Text style={styles.overrunText}>
                  Predicted total cost: ₹{overrunData.predictedCost.toLocaleString()}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleOverrunConfirm}
            >
              <Text style={styles.confirmButtonText}>Acknowledge</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  overrunDetails: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    width: '100%',
  },
  overrunText: {
    fontSize: 15,
    color: '#E74C3C',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#2E3A59',
    padding: 12,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },


  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
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
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#2E3A59',
    borderColor: '#2E3A59',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  dropdownWrapper: {
    marginBottom: 15,
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
  },
  dropdown: {
    height: 50,
  },
  suggestionList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: -10,
    marginBottom: 15,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    color: '#2E3A59',
  },
  submitButtonContainer: {
    marginTop: 10,
  }
});

export default AddExpenseScreen;