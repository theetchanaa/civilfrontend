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
import SearchProject from './src/components/SearchProject';
import ProjectDetails from './src/components/ProjectDetails';
import SearchUserScreen from './src/components/SearchUserScreen';
import UserFinancialDetailScreen from './src/components/UserFinancialDetailScreen';
import Project from './src/components/Project';
import Labor from './src/components/Labor';
import EditScreen from './src/components/EditScreen';
import EditProject from './src/components/EditProject';
import EditLabour from './src/components/EditLabour';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CategorySelection" component={CategorySelection} options={{ headerShown: false }} />
        <Stack.Screen name="LabourForm" component={LabourFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MaterialForm" component={MaterialFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MachineryFormScreen" component={MachineryFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProjectFormScreen" component={ProjectFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchProject" component={SearchProject} options={{ headerShown: false }} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} options={{ headerShown: false }} />
        <Stack.Screen name="SearchUserScreen" component={SearchUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserFinancialDetailScreen" component={UserFinancialDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Project" component={Project} options={{ headerShown: false }} />
        <Stack.Screen name="Labor" component={Labor} options={{ headerShown: false }} />
        <Stack.Screen name="EditScreen" component={EditScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProject" component={EditProject} options={{ headerShown: false }} />
        <Stack.Screen name="EditLabour" component={EditLabour} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
