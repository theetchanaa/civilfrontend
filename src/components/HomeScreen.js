import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.gridContainer, { marginTop: 60 }]}>
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

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('ProjectFormScreen')}
        >
          <Image
            source={require('../../assets/add-project-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Add Project</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Image
            source={require('../../assets/add-project-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('SearchProject')}
        >
          <Image
            source={require('../../assets/add-project-icon.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Search Project</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => navigation.navigate('SearchUserScreen')}
        >
          <Image
            source={require('../../assets/search-user-icon.jpeg')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>Search User</Text>
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
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
    textAlign: 'center',
  },
});

export default HomeScreen;
