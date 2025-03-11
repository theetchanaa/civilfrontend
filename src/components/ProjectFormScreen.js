import React from 'react';
import { View, Text, TextInput, Button, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useProjectForm from './ProjectFormIntegration';

const ProjectFormScreenUI = () => {
  const {
    projectName,
    setProjectName, 
    estimatedAmount,
    setEstimatedAmount,
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
          <Text style={styles.title}>Project Form</Text>

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
});

export default ProjectFormScreenUI;
