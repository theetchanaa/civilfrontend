import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';

// Import the local image (add user icon)
import addUserIcon from '../../assets/add-category-icon.png';  // Adjust the path if needed

const AddCategoryButton = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate('Category Selection')}  // Navigate to CategorySelection screen
      >
        <Image
          source={addUserIcon}  // Add the image
          style={styles.icon}
        />
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
  iconContainer: {
    width: 100, // Adjust width to make it square
    height: 100, // Adjust height to make it square
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 10, // Round corners for a smoother look
    elevation: 5, // Optional: Add shadow to the icon
  },
  icon: {
    width: 60,  // Set a reasonable width for the icon image
    height: 60, // Set a reasonable height for the icon image
  },
});

export default AddCategoryButton;
