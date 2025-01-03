import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update to your Flask server URL (use actual IP for devices)

export const addCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/add-category`, categoryData);
    return response.data;
  } catch (error) {
    console.error('Error adding category:', error.response.data || error.message);
    throw error;
  }
};
