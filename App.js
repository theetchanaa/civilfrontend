import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import AddCategory from './src/components/AddCategory';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AddCategory />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default App;
