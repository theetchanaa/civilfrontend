import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategorySelection = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LabourForm')}
      >
        <Text style={styles.buttonText}>Labour Form</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MaterialForm')}
      >
        <Text style={styles.buttonText}>Material Form</Text>
      </TouchableOpacity>
      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('MachineryFormScreen')}
>
  <Text style={styles.buttonText}>Machinery</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    marginBottom: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CategorySelection;
