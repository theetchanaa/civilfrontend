import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

const ProjectDetails = ({ route }) => {
  const { project } = route.params || {};

  if (!project) {
    return <Text>No project data available</Text>;
  }

  const { name, quotedAmount, budgetAmount, deadline } = project;

  const quotedValue = parseFloat(quotedAmount.replace('$', '')) || 0;
  const budgetValue = parseFloat(budgetAmount.replace('$', '')) || 0;
  const balanceAmount = quotedValue - budgetValue;

  // Expanded test cases
  const employeeData = [
    { id: '1', name: 'John Doe', type: 'Manager', date: '2024-09-15', amount: 1200 },
    { id: '2', name: 'John Doe', type: 'Worker', date: '2024-09-16', amount: 800 },
    { id: '3', name: 'Jane Doe', type: 'Manager', date: '2024-09-15', amount: 1500 },
    { id: '4', name: 'Michael Johnson', type: 'Engineer', date: '2024-09-17', amount: 1800 },
    { id: '5', name: 'Michael Johnson', type: 'Engineer', date: '2024-09-17', amount: 1600 },
    { id: '6', name: 'Emily Smith', type: 'Worker', date: '2024-09-18', amount: 900 },
    { id: '7', name: 'John Doe', type: 'Worker', date: '2024-09-16', amount: 850 },
    { id: '8', name: 'Emma Davis', type: 'Manager', date: '2024-09-19', amount: 2000 },
    { id: '9', name: 'Jane Doe', type: 'Manager', date: '2024-09-15', amount: 1450 },
    { id: '10', name: 'Michael Johnson', type: 'Engineer', date: '2024-09-17', amount: 1750 },
  ];

  const categoryData = [
    { id: '1', category: 'Infrastructure', type: 'Construction', quotedAmount: 5000, amountSpent: 4000 },
    { id: '2', category: 'Technology', type: 'Development', quotedAmount: 3000, amountSpent: 2500 },
    { id: '3', category: 'Marketing', type: 'Advertisement', quotedAmount: 2000, amountSpent: 1500 },
    { id: '4', category: 'Infrastructure', type: 'Maintenance', quotedAmount: 6000, amountSpent: 4500 },
    { id: '5', category: 'Technology', type: 'Software', quotedAmount: 4000, amountSpent: 3200 },
    { id: '6', category: 'Infrastructure', type: 'Construction', quotedAmount: 5500, amountSpent: 4200 },
    { id: '7', category: 'Marketing', type: 'Advertisement', quotedAmount: 1800, amountSpent: 1400 },
    { id: '8', category: 'Technology', type: 'Software', quotedAmount: 3500, amountSpent: 3000 },
  ];

  const [employeeSearch, setEmployeeSearch] = useState({ name: '', type: '', date: '' });
  const [categorySearch, setCategorySearch] = useState({ category: '', type: '' });

  const filteredEmployeeData = employeeData.filter((item) =>
    item.name.toLowerCase().includes(employeeSearch.name.toLowerCase()) &&
    item.type.toLowerCase().includes(employeeSearch.type.toLowerCase()) &&
    item.date.includes(employeeSearch.date)
  );

  const filteredCategoryData = categoryData.filter((item) =>
    item.category.toLowerCase().includes(categorySearch.category.toLowerCase()) &&
    item.type.toLowerCase().includes(categorySearch.type.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailText}>Deadline: {deadline || 'Not specified'}</Text>
        <Text style={styles.detailText}>Quoted Amount: ${quotedValue.toFixed(2)}</Text>
        <Text style={styles.detailText}>Budget Amount: ${budgetValue.toFixed(2)}</Text>
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
          <View key={item.id} style={styles.tableRow}>
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
          placeholder="Search by Category"
          value={categorySearch.category}
          onChangeText={(text) => setCategorySearch({ ...categorySearch, category: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Search by Type"
          value={categorySearch.type}
          onChangeText={(text) => setCategorySearch({ ...categorySearch, type: text })}
        />
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Category</Text>
          <Text style={styles.headerText}>Type</Text>
          <Text style={styles.headerText}>Quoted Amount</Text>
          <Text style={styles.headerText}>Amount Spent</Text>
        </View>
        {filteredCategoryData.map((item) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.rowText}>{item.category}</Text>
            <Text style={styles.rowText}>{item.type}</Text>
            <Text style={styles.rowText}>${item.quotedAmount.toFixed(2)}</Text>
            <Text style={styles.rowText}>${item.amountSpent.toFixed(2)}</Text>
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
});

export default ProjectDetails;