import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';

const API_URL = `http://192.168.234.250:5000`; // Update with your backend URL

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
        return false;
      }
      seen.add(identifier);
      return true;
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
      setEmployeeData(removeDuplicates(data));
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
      <View style={styles.header}>
        <Text style={styles.title}>{project.projectname}</Text>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Project Balance</Text>
          <Text style={styles.balanceAmount}>${balanceAmount.toFixed(2)}</Text>
          <View style={styles.balanceDetails}>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Quoted</Text>
              <Text style={styles.balanceValue}>${quotedamount.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <Text style={styles.balanceLabel}>Spent</Text>
              <Text style={styles.balanceValue}>${totexpense.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Employee Expense</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Employee Name"
            value={employeeSearch.name}
            onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Work Type"
            value={employeeSearch.type}
            onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, type: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={employeeSearch.date}
            onChangeText={(text) => setEmployeeSearch({ ...employeeSearch, date: text })}
          />
          
        </View>

        <Text style={styles.listTitle}>Recent Employee Expenses</Text>
        {filteredEmployeeData.map((item) => (
          <View key={item.id || `${item.name}-${item.date}`} style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <Text style={styles.expenseName}>{item.name}</Text>
              <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
            </View>
            <View style={styles.expenseDetails}>
              <Text style={styles.expenseType}>{item.type}</Text>
              <Text style={styles.expenseDate}>{item.date}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Category Expense</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Category Type"
            value={categorySearch.type}
            onChangeText={(text) => setCategorySearch({ ...categorySearch, type: text })}
          />
          
        </View>

        <Text style={styles.listTitle}>Category Summary</Text>
        {filteredCategoryData.map((item) => (
          <View key={item.id || item.type} style={styles.categoryCard}>
            <Text style={styles.categoryType}>{item.type}</Text>
            <View style={styles.categoryDetails}>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryLabel}>Estimated</Text>
                <Text style={styles.categoryValue}>${item.estamount.toFixed(2)}</Text>
              </View>
              <View style={styles.categoryItem}>
                <Text style={styles.categoryLabel}>Actual</Text>
                <Text style={styles.categoryValue}>${item.expense.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#2E3A59',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 16,
    color: '#8F9BB3',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 16,
  },
  inputGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#0078D4',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 12,
  },
  expenseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0078D4',
  },
  expenseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseType: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  expenseDate: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  categoryType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryLabel: {
    fontSize: 14,
    color: '#8F9BB3',
  },
  categoryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3D71',
  },
});

export default ProjectDetails;