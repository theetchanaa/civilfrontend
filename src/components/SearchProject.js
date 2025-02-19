import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const API_URL = 'http://192.168.1.4:5000/projects'; // Update with your backend URL

const SearchProject = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) =>
      project.projectname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Projects..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0078D4" />
      ) : (
        <ScrollView style={styles.tabContainer}>
          {filteredProjects.map((project, index) => (
            <View key={index} style={styles.projectContainer}>
              <View style={styles.tab}>
                <Text style={styles.tabText}>{project.projectname}</Text>
              </View>
              <View style={styles.projectDetails}>
                <Text style={styles.detailText}>Quoted Amount: ${project.quotedamount}</Text>
                <Text style={styles.detailText}>Total Expense: ${project.totexpense}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
});

export default SearchProject;
