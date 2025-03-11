import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';

const API_URL = `http://192.168.234.233:5000`; // Update with your backend URL

const ProjectDetails = () => {
  const route = useRoute();
  const { project } = route.params; // Get the project object passed from the previous screen
  const [projectDetails, setProjectDetails] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [employeeSearch, setEmployeeSearch] = useState({ name: '', type: '', date: '' });
  const [categorySearch, setCategorySearch] = useState({ type: '' });

  useEffect(() => {
    if (project) {
      fetchProjectDetails();
      fetchEmployeeData();
      fetchCategoryData();
    }
  }, [project]);

  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter(item => {
      const identifier = `${item.id || item.name}-${item.date || item.type}`; 
      if (seen.has(identifier)) {
        return false; // Duplicate found, ignore it
      }
      seen.add(identifier);
      return true; // Unique entry, keep it
    });
  };
  
    
  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/project-details?projectname=${project.projectname}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      const data = await response.json();
      setProjectDetails(data);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(error.message);
    }
  };

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch(`${API_URL}/employee-details?projectname=${project.projectname}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee details');
      }
      const data = await response.json();
   
      setEmployeeData(removeDuplicates(data));  // Apply duplicate removal before setting state
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setError(error.message);
    }
  };
  


  const fetchCategoryData = async () => {
    try {
      const response = await fetch(`${API_URL}/category-details?projectname=${project.projectname}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category details');
      }
      const data = await response.json();
    
      setCategoryData(removeDuplicates(data)); 
   
    } catch (error) {
      console.error('Error fetching category details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const filteredEmployeeData = employeeData.filter((item) =>
    item.name.toLowerCase().includes(employeeSearch.name.toLowerCase()) &&
    item.type.toLowerCase().includes(employeeSearch.type.toLowerCase()) &&
    item.date.includes(employeeSearch.date)
  );

  const filteredCategoryData = categoryData.filter((item) =>
    item.type.toLowerCase().includes(categorySearch.type.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0078D4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!projectDetails) {
    return <Text>No project data available</Text>;
  }

  const { quotedamount, totexpense } = projectDetails;
  const balanceAmount = quotedamount - totexpense;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{project.projectname}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Deadline: Not specified</Text>
        <Text style={styles.detailText}>Quoted Amount: ${quotedamount.toFixed(2)}</Text>
        <Text style={styles.detailText}>Total Expense: ${totexpense.toFixed(2)}</Text>
        <Text style={styles.detailText}>Balance Amount: ${balanceAmount.toFixed(2)}</Text>
      </View>

      {/* Employee Details Section */}
      <Text style={styles.sectionTitle}>Employee Details</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by Name"
          value={employeeSearch.name}
          onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Type"
          value={employeeSearch.type}
          onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, type: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Date"
          value={employeeSearch.date}
          onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, date: text })}
        />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Name</Text>
          <Text style={styles.headerText}>Type</Text>
          <Text style={styles.headerText}>Date</Text>
          <Text style={styles.headerText}>Amount</Text>
        </View>
        {filteredEmployeeData.map((item) => (
  <View key={item.id || `${item.name}-${item.date}`} style={styles.tableRow}>
    <Text style={styles.rowText}>{item.name}</Text>
    <Text style={styles.rowText}>{item.type}</Text>
    <Text style={styles.rowText}>{item.date}</Text>
    <Text style={styles.rowText}>${item.amount.toFixed(2)}</Text>
  </View>
))}

      </View>

      {/* Category Details Section */}
      <Text style={styles.sectionTitle}>Category Details</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search by Type"
          value={categorySearch.type}
          onChangeText={(text) => setCategorySearch({ ...categorySearch, type: text })}
        />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Type</Text>
          <Text style={styles.headerText}>Estimated Amount</Text>
          <Text style={styles.headerText}>Expense</Text>
       
        </View>
        {filteredCategoryData.map((item) => (
  <View key={item.id || item.type} style={styles.tableRow}>
    <Text style={styles.rowText}>{item.type}</Text>
    <Text style={styles.rowText}>${item.estamount.toFixed(2)}</Text>
    <Text style={styles.rowText}>${item.expense.toFixed(2)}</Text>
  </View>
))}

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  detailContainer: { marginBottom: 15, padding: 10, backgroundColor: '#fff', borderRadius: 5 },
  detailText: { fontSize: 16, marginBottom: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  filterContainer: { marginBottom: 10 },
  input: { padding: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 5, marginBottom: 5 },
  tableContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 5, backgroundColor: '#fff' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#ddd', padding: 10 },
  headerText: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  rowText: { flex: 1, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red' },
});

export default ProjectDetails;