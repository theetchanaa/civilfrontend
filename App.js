import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/components/HomeScreen';
import CategorySelection from './src/components/CategorySelection';
import LabourFormScreen from './src/components/LabourFormScreen';
import MaterialFormScreen from './src/components/MaterialFormScreen';
import MachineryFormScreen from './src/components/MachineryFormScreen';
import ProjectFormScreen from './src/components/ProjectFormScreen'; // Import the screen
import AddExpenseScreen from './src/components/AddExpenseScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CategorySelection" component={CategorySelection} />
        <Stack.Screen name="LabourForm" component={LabourFormScreen} />
        <Stack.Screen name="MaterialForm" component={MaterialFormScreen} />
        <Stack.Screen name="MachineryFormScreen" component={MachineryFormScreen} />
        <Stack.Screen name="ProjectFormScreen" component={ProjectFormScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
