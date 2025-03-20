import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import the icon library

const EditScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.gridContainer, { marginTop: 60 }]}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Project')}
        >
          <Icon name="folder-edit" size={48} color="#2E3A59" style={styles.iconImage} />
          <Text style={styles.iconText}>Edit Project</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('Labor')}
        >
          <Icon name="account-edit" size={48} color="#2E3A59" style={styles.iconImage} />
          <Text style={styles.iconText}>Edit others</Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E3A59',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 16,
  },
  iconContainer: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconImage: {
    marginBottom: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    textAlign: 'center',
  },
});

export default EditScreen;
