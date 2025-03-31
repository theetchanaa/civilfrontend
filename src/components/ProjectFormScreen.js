import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  ScrollView, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Alert,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from "lucide-react-native";
import useProjectForm from './ProjectFormIntegration';

// Try to import DateTimePicker, but have a fallback if it fails
let DateTimePicker;
try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch (error) {
  // DateTimePicker will be undefined, and we'll use our fallback
  console.log('DateTimePicker import failed, using fallback');
}

const ProjectFormScreenUI = () => {
  const {
    projectName,
    setProjectName, 
    estimatedAmount,
    setEstimatedAmount,
    startDate,
    setStartDate,
    duration,
    setDuration,
    category,
    setCategory,
    type,
    setType,
    allocatedAmount,
    setAllocatedAmount,
    tableData,
    handleProjectSubmit,
    handleAddRow,
    categoryTypes
  } = useProjectForm();

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  // State for custom date picker
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
  const [tempMonth, setTempMonth] = useState(new Date().getMonth() + 1);
  const [tempDay, setTempDay] = useState(new Date().getDate());

  // Initialize with current date values if startDate exists
  useEffect(() => {
    if (startDate) {
      const [yearPart, monthPart, dayPart] = startDate.split('-');
      if (yearPart && monthPart && dayPart) {
        const parsedDate = new Date(
          parseInt(yearPart),
          parseInt(monthPart) - 1,
          parseInt(dayPart)
        );
        setDatePickerDate(parsedDate);
        setTempYear(parseInt(yearPart));
        setTempMonth(parseInt(monthPart));
        setTempDay(parseInt(dayPart));
      }
    }
  }, [startDate]);

  // Format date to display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  // Handle date change with the DateTimePicker component
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    
    if (selectedDate) {
      setDatePickerDate(selectedDate);
      
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}`;
      setStartDate(formattedDate);
    }
  };
  
  // Show date picker modal
  const showDatePickerModal = () => {
    if (DateTimePicker) {
      setShowDatePicker(true);
    } else {
      // Use our custom date picker fallback
      setShowCustomDatePicker(true);
    }
  };

  // Handle custom date picker confirm
  const handleCustomDateConfirm = () => {
    // Validate date
    if (tempYear < 1900 || tempYear > 2100 || tempMonth < 1 || tempMonth > 12 || tempDay < 1 || tempDay > 31) {
      Alert.alert("Invalid Date", "Please enter a valid date");
      return;
    }
    
    const year = String(tempYear);
    const month = String(tempMonth).padStart(2, '0');
    const day = String(tempDay).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    setStartDate(formattedDate);
    
    const newDate = new Date(tempYear, tempMonth - 1, tempDay);
    setDatePickerDate(newDate);
    
    setShowCustomDatePicker(false);
  };

  // Render our custom date picker
  const renderCustomDatePicker = () => {
    return (
      <Modal
        visible={showCustomDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomDatePicker(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            
            <View style={styles.dateInputContainer}>
              <View style={styles.dateInputField}>
                <Text style={styles.dateInputLabel}>Day</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempDay.toString()}
                  onChangeText={(text) => setTempDay(parseInt(text) || 0)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.dateInputField}>
                <Text style={styles.dateInputLabel}>Month</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempMonth.toString()}
                  onChangeText={(text) => setTempMonth(parseInt(text) || 0)}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
              
              <View style={styles.dateInputField}>
                <Text style={styles.dateInputLabel}>Year</Text>
                <TextInput
                  style={styles.dateInput}
                  value={tempYear.toString()}
                  onChangeText={(text) => setTempYear(parseInt(text) || 0)}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowCustomDatePicker(false)}
              >
                <Text style={styles.color='black'}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]} 
                onPress={handleCustomDateConfirm}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>

          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter project name"
            value={projectName}
            onChangeText={setProjectName}
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Estimated Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter estimated amount"
            value={estimatedAmount}
            onChangeText={setEstimatedAmount}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Start Date</Text>
          {/* Date Picker Button */}
          <TouchableOpacity 
            style={styles.datePickerButton} 
            onPress={showDatePickerModal}
          >
            <Calendar size={24} color="#2E3A59" />
            <Text style={styles.dateText}>
              {startDate ? formatDate(datePickerDate) : "Select Start Date"}
            </Text>
          </TouchableOpacity>

          {/* React Native Community DateTimePicker */}
          {DateTimePicker && showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={datePickerDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          {/* Custom Date Picker Fallback */}
          {renderCustomDatePicker()}

          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter duration"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <View style={styles.tableContainer}>
            <View style={styles.header}>
              <Text style={styles.headerCell}>Category</Text>
              <Text style={styles.headerCell}>Type</Text>
              <Text style={styles.headerCell}>Amount Allocated</Text>
            </View>

            <FlatList
              data={tableData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>

          <Text style={styles.sectionTitle}>Add Table Row</Text>

          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              style={styles.picker}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="Select Category" value="" />
              <Picker.Item label="Labour" value="labour" />
              <Picker.Item label="Material" value="material" />
              <Picker.Item label="Machinery" value="machinery" />
            </Picker>
          </View>

          <Text style={styles.label}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={type}
              style={styles.picker}
              onValueChange={(itemValue) => setType(itemValue)}
              enabled={category !== ''}
            >
              <Picker.Item label="Select Type" value="" />
              {categoryTypes[category] && categoryTypes[category].length > 0 ? (
                categoryTypes[category].map((item, index) => (
                  <Picker.Item key={index} label={item} value={item} />
                ))
              ) : (
                <Picker.Item label="No types available" value="" />
              )}
            </Picker>
          </View>

          <Text style={styles.label}>Amount Allocated</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter allocated amount"
            value={allocatedAmount}
            onChangeText={setAllocatedAmount}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />

          <View style={styles.buttonContainer}>
            <Button 
              title="Add Row" 
              onPress={handleAddRow}
              color="#2E3A59"
            />
          </View>

          <View style={styles.submitButtonContainer}>
            <Button 
              title="Submit Project" 
              onPress={handleProjectSubmit}
              color="#2E3A59"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    marginTop:50,
    margin: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 25,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginTop: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#2E3A59',
    marginBottom: 8,
    fontWeight: '500',
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
    marginBottom: 16,
  },
  // Updated date picker styles to match RecordScreen
  datePickerButton: {
    height: 50,
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#2E3A59',
    marginLeft: 10,
  },
  tableContainer: {
    marginVertical: 15,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  header: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#F5F7FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2E3A59',
  },
  row: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#2E3A59',
  },
  pickerContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#2E3A59',
  },
  buttonContainer: {
    marginTop: 10,
  },
  submitButtonContainer: {
    marginTop: 20,
  },
  // Custom date picker modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 20,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  dateInputField: {
    width: '30%',
    alignItems: 'center',
  },
  dateInputLabel: {
    fontSize: 14,
    color: '#2E3A59',
    marginBottom: 5,
  },
  dateInput: {
    height: 50,
    width: '100%',
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#2E3A59',
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    width: '48%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F7FA',
    borderColor: '#E4E9F2',
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: '#2E3A59',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});

export default ProjectFormScreenUI;