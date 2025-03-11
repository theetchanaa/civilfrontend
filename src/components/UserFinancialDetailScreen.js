import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  TextInput 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import moment from 'moment'; // Import moment.js for date formatting

const API_BASE_URL = 'http://192.168.234.233:5000'; // Replace with your API URL

const UserFinancialDetails = () => {
  const { params } = useRoute();
  const user = params?.user || {};

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [dateSearch, setDateSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('Received user data:', user);
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/get_projects_by_id?id=${user.category_id}`);
      const data = await response.json();
      setProjects(data.projects || []);
      setFilteredProjects(data.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const availableProjects = ['All', ...new Set(projects.map((item) => item.project_name))];
  const availableDates = ['All', ...new Set(projects.map((item) => item.date))];

  useEffect(() => {
    let filtered = projects;

    if (selectedProject !== 'All') {
      filtered = filtered.filter((item) => item.project_name === selectedProject);
    }
    if (selectedDate !== 'All') {
      filtered = filtered.filter((item) => item.date === selectedDate);
    }

    setFilteredProjects(filtered);
  }, [selectedProject, selectedDate, projects]);

  const totalAmount = filteredProjects.reduce((sum, item) => sum + parseFloat(item.expense), 0);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>Name: {user.category_name || 'N/A'}</Text>
        <Text style={styles.userInfoText}>ID: {user.category_id || 'N/A'}</Text>
      </View>

      <View style={styles.dropdownRow}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowProjectDropdown(!showProjectDropdown)}>
          <Text style={styles.buttonText}>{selectedProject}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowDateDropdown(!showDateDropdown)}>
          <Text style={styles.buttonText}>{selectedDate}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {showProjectDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={availableProjects}
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
            data={availableDates.filter((date) => date === 'All' || date.includes(dateSearch))}
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

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {!loading && filteredProjects.length > 0 ? (
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Financial Details</Text>
          
          {/* Table Header */}
          <View style={styles.tableRowHeader}>
            <Text style={[styles.tableHeaderText, styles.projectColumn]}>Project</Text>
            <Text style={[styles.tableHeaderText, styles.dateColumn]}>Date</Text>
            <Text style={[styles.tableHeaderText, styles.expenseColumn]}>Expense</Text>
          </View>

          {/* Table Data */}
          <FlatList
            data={filteredProjects}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.projectColumn]}>{item.project_name}</Text>
                <Text style={[styles.tableCell, styles.dateColumn]}>{moment(item.date).format('DD/MM/YYYY')}</Text>
                <Text style={[styles.tableCell, styles.expenseColumn]}>${item.expense}</Text>
              </View>
            )}
          />

          <Text style={styles.totalAmount}>Total Expense: ${totalAmount.toFixed(2)}</Text>
        </View>
      ) : (
        !loading && <Text style={styles.noDataText}>No financial details available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  userInfoContainer: { marginBottom: 20, padding: 10, backgroundColor: '#ddd', borderRadius: 8 },
  userInfoText: { fontSize: 18, fontWeight: 'bold' },
  dropdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, backgroundColor: '#fff', flex: 1, marginHorizontal: 5 },
  buttonText: { fontSize: 16 },
  dropdown: { backgroundColor: '#fff', borderRadius: 8, elevation: 5, maxHeight: 150 },
  dropdownItem: { padding: 12, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  input: { padding: 10, borderBottomWidth: 1, marginBottom: 5 },
  tableContainer: { marginTop: 20, padding: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 3 },
  tableRowHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#ddd', borderRadius: 5 },
  tableHeaderText: { flex: 1, textAlign: 'center', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  tableCell: { flex: 1, textAlign: 'center' },
  projectColumn: { flex: 2 },
  dateColumn: { flex: 1.5 },
  expenseColumn: { flex: 1 },
  totalAmount: { marginTop: 20, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  noDataText: { fontSize: 16, textAlign: 'center', marginTop: 20, color: 'gray' },
});

export default UserFinancialDetails;
