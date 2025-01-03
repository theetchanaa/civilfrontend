import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addCategory } from '../api/api';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [id, setId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const categoryData = { id, name, type };

    try {
      const response = await addCategory(categoryData);
      setMessage(response.message);
    } catch (error) {
      setMessage('Failed to add category');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Category</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Category ID"
        value={id}
        onChangeText={setId}
      />
      <TextInput
        style={styles.input}
        placeholder="Category Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category Type"
        value={type}
        onChangeText={setType}
      />

      <Button title="Add Category" onPress={handleSubmit} />

      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
});

export default AddCategory;
