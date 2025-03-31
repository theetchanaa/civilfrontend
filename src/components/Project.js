import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const API_URL = 'http://192.168.141.250:5000/projects';

const Project = () => {
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
    console.log(`Navigating to ProjectDetails with project:`, project);
    navigation.navigate('EditProject', { project });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E3A59" />
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.label}>Search Projects</Text>
            <TextInput
              style={[styles.input, styles.inputSpacing]}
              placeholder="Search Projects..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#999"
            />

            {filteredProjects.map((project, index) => (
              <TouchableOpacity
                key={index}
                style={styles.projectCard}
                onPress={() => navigateToProjectDetails(project)}
              >
                <Text style={styles.projectName}>{project.projectname}</Text>
                <View style={styles.projectDetails}>
                  <Text style={styles.detailText}>Quoted Amount: ${project.quotedamount}</Text>
                  <Text style={styles.detailText}>Total Expense: ${project.totexpense}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
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
  },
  inputSpacing: {
    marginBottom: 15,
  },
  projectCard: {
    backgroundColor: '#2E3A59',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2E3A59',
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  projectDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    gap: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default Project;