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
import moment from 'moment';

const API_BASE_URL = 'http://192.168.234.233:5000';

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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Projects</Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.userInfoContainer}>
          <Text style={styles.userInfoText}>Name: {user.category_name || 'N/A'}</Text>
          <Text style={styles.userInfoText}>ID: {user.category_id || 'N/A'}</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowProjectDropdown(!showProjectDropdown)}
          >
            <Text style={styles.filterButtonText}>{selectedProject}</Text>
            <AntDesign name="down" size={16} color="#2E3A59" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowDateDropdown(!showDateDropdown)}
          >
            <Text style={styles.filterButtonText}>{selectedDate}</Text>
            <AntDesign name="down" size={16} color="#2E3A59" />
          </TouchableOpacity>
        </View>

        {showProjectDropdown && (
          <View style={styles.dropdownMenu}>
            <FlatList
              data={availableProjects}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedProject(item);
                    setShowProjectDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {showDateDropdown && (
          <View style={styles.dropdownMenu}>
            <TextInput
              style={styles.dropdownSearch}
              placeholder="Search Date"
              value={dateSearch}
              onChangeText={setDateSearch}
            />
            <FlatList
              data={availableDates.filter((date) => date === 'All' || date.includes(dateSearch))}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedDate(item);
                    setShowDateDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {loading && <ActivityIndicator size="large" color="#2E3A59" style={styles.loader} />}

        {!loading && filteredProjects.length > 0 ? (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.columnHeader}>Project</Text>
              <Text style={styles.columnHeader}>Date</Text>
              <Text style={styles.columnHeader}>Expense</Text>
            </View>
            <FlatList
              data={filteredProjects}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.resultRow}>
                  <Text style={[styles.resultText, styles.projectColumn]}>{item.project_name}</Text>
                  <Text style={[styles.resultText, styles.dateColumn]}>{moment(item.date).format('DD/MM/YYYY')}</Text>
                  <Text style={[styles.resultText, styles.expenseColumn]}>${item.expense}</Text>
                </View>
              )}
            />
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total Expense: ${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          !loading && <Text style={styles.noDataText}>No financial details available.</Text>
        )}
      </View>
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
  searchSection: {
    padding: 16,
  },
  userInfoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  userInfoText: {
    fontSize: 16,
    color: '#2E3A59',
    marginBottom: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    maxHeight: 250,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  dropdownText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  dropdownSearch: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    fontSize: 16,
    color: '#2E3A59',
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  resultsHeader: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#2E3A59',
  },
  columnHeader: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  resultText: {
    flex: 1,
    fontSize: 16,
    color: '#2E3A59',
    textAlign: 'center',
  },
  projectColumn: {
    flex: 2,
  },
  dateColumn: {
    flex: 1.5,
  },
  expenseColumn: {
    flex: 1,
  },
  totalRow: {
    padding: 15,
    backgroundColor: '#F8F9FC',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
    textAlign: 'right',
  },
  loader: {
    marginVertical: 20,
  },
  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8F9BB3',
    marginTop: 20,
  },
});

export default UserFinancialDetails;
