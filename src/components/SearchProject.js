import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.161.250:5000/projects'; // Update with your backend URL

const SearchProject = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.projects);
      setFilteredProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) =>
      project.projectname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [projects]);

  const navigateToProjectDetails = (project) => {
    console.log(`Navigating to ProjectDetails with project:`, project); // Debugging log
    navigation.navigate('ProjectDetails', { project }); // Pass the full project object
  };

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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Projects..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <ScrollView style={styles.tabContainer}>
        {filteredProjects.map((project, index) => (
          <TouchableOpacity
            key={index}
            style={styles.projectContainer}
            onPress={() => navigateToProjectDetails(project)} // Pass the selected project object
          >
            <View style={styles.tab}>
              <Text style={styles.tabText}>{project.projectname}</Text>
            </View>
            <View style={styles.projectDetails}>
              <Text style={styles.detailText}>Quoted Amount: ${project.quotedamount}</Text>
              <Text style={styles.detailText}>Total Expense: ${project.totexpense}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flex: 1,
  },
  projectContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
  },
  tab: {
    padding: 15,
    backgroundColor: '#0078D4',
    borderRadius: 10,
    marginBottom: 10,
  },
  tabText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  projectDetails: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
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
    color: 'red',
  },
});

export default SearchProject;