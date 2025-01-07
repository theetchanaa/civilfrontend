import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('CategorySelection')}
        >
          <Image
            source={require('../../assets/add-category-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Add User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.iconWrapper}>
      <TouchableOpacity
  style={styles.iconContainer}
  onPress={() => navigation.navigate('ProjectFormScreen')} // 'Add Project' must match the name in the navigator
>
  <Image
    source={require('../../assets/add-project-icon.png')}
    style={styles.iconImage}
  />
  <Text style={styles.iconText}>Add Project</Text>
</TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  iconWrapper: {
    marginBottom: 20, // Add space between icons
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
  },
  iconImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  iconText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
