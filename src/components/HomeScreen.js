import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({ navigation }) => {
  const logo = require('../../assets/logo.jpeg');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with logo */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      
      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.gridContainer}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('CategorySelection')}
          >
            <Icon name="account-plus" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Add User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('ProjectFormScreen')}
          >
            <Icon name="folder-plus" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Add Project</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('AddExpense')}
          >
            <Icon name="cash-plus" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('SearchProject')}
          >
            <Icon name="folder-search" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Search Project</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('SearchUserScreen')}
          >
            <Icon name="account-search" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Search User</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => navigation.navigate('Labor')}
          >
            <Icon name="pencil" size={48} color="#2E3A59" style={styles.iconImage} />
            <Text style={styles.iconText}>Edit User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop:100,
    marginBottom: 20
  },
  logo: {
    height: '100%',
    width: '70%',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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

export default HomeScreen;