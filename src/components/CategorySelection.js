import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategorySelection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.gridContainer, { marginTop: 60 }]}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('LabourForm')}
        >
          <MaterialIcons name="person" size={48} color="#2E3A59" style={styles.icon} />
          <Text style={styles.iconText}>Labour Form</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('MaterialForm')}
        >
          <MaterialIcons name="category" size={48} color="#2E3A59" style={styles.icon} />
          <Text style={styles.iconText}>Material Form</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('MachineryFormScreen')}
        >
          <MaterialIcons name="build" size={48} color="#2E3A59" style={styles.icon} />
          <Text style={styles.iconText}>Machinery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
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
  icon: {
    marginBottom: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    textAlign: 'center',
  },
});

export default CategorySelection;
