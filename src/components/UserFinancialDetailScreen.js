import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const UserFinancialDetails = () => {
  const { params } = useRoute();
  const { user } = params; 

  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [dateSearch, setDateSearch] = useState('');

  const projects = ['Project A', 'Project B', 'Project C'];
  const dates = ['2023-01-01', '2023-02-01', '2023-03-01'];

  const financialData = [
    { date: '2023-01-01', project: 'Project A', amount: '$500' },
    { date: '2023-02-01', project: 'Project B', amount: '$750' },
    { date: '2023-03-01', project: 'Project C', amount: '$1000' },
  ];

  const filteredData = financialData.filter(
    (item) => item.date === selectedDate && item.project === selectedProject
  );
  const totalAmount = filteredData.reduce((sum, item) => {
    return sum + parseFloat(item.amount.replace('$', ''));
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>Name: {user.name}</Text>
        <Text style={styles.userInfoText}>ID: {user.phone}</Text>
      </View>

      <View style={styles.dropdownRow}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowProjectDropdown(!showProjectDropdown)}
        >
          <Text style={styles.buttonText}>{selectedProject || 'Select Project'}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowDateDropdown(!showDateDropdown)}
        >
          <Text style={styles.buttonText}>{selectedDate || 'Select Date'}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {showProjectDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={projects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedProject(item);
                  setShowProjectDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {showDateDropdown && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.input}
            placeholder="Search Date"
            value={dateSearch}
            onChangeText={setDateSearch}
          />
          <FlatList
            data={dates.filter((date) => date.includes(dateSearch))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedDate(item);
                  setShowDateDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

{selectedProject && selectedDate && (
        <View>
          <View style={styles.tableContainer}>
            <Text style={styles.tableHeader}>Financial Details</Text>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Project</Text>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            {filteredData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.date}</Text>
                <Text style={styles.tableCell}>{item.project}</Text>
                <Text style={styles.tableCell}>{item.amount}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.totalAmount}>Total: ${totalAmount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  userInfoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  userInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  tableContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  totalAmount: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
});

export default UserFinancialDetails;