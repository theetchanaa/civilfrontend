import axios from 'axios';

const API_URL = 'http://192.168.161.250:5000/projects'; // Update with your backend URL
const FETCH_ID_URL = 'http://192.168.161.250:5000/get_project_payment_details'; // Replace with actual endpoint
const ADD_EXPENSE_URL = 'http://192.168.161.250:5000/add_expense';

const fetchProjects = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProjects(data.projects);
      setFilteredProjects(data.projects);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  // Fetch picker options based on selected type
  const fetchPickerOptions = async (category) => {
    try {
      console.log(`Fetching options for category: ${category}`);
      const response = await axios.get(`http://192.168.161.250:5000/${category}`);
      
      console.log('API Response:', response.data);

      // Extract options dynamically based on the category
      const options = response.data[category];

      if (Array.isArray(options)) {
        // Remove null values and empty strings
        const filteredOptions = options.filter(option => option && option.trim() !== '');
        setPickerOptions(filteredOptions);
      } else {
        console.error('Invalid options format:', response.data);
        setPickerOptions([]);
      }
    } catch (error) {
      console.error('Error fetching picker options:', error);
      setPickerOptions([]);
    }
  };

  // Fetch name & ID from backend based on project name & type

  const fetchProjectDetails = async (projectname, type) => {
    try {
      console.log(`Fetching details for Project: ${projectname}, Type: ${type}`);
      const response = await axios.get(`${FETCH_ID_URL}`, {
        params: { projectname, type }
      });
  
      console.log('Project Details API Response:', response.data.categories);
  
      if (response.data && response.data.categories) {
        setNamePhoneOptions(response.data.categories); // Store fetched categories
      } else {
        setNamePhoneOptions([]);
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
      setNamePhoneOptions([]);
    }
  };
  


  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = projects.filter((project) =>
      project.projectname.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleSubmit = async () => {
    if (!selectedProject || !selectedType || !searchText || !expense) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }
  
    try {
      const categoryId = searchText.split(' - ').pop(); // Extract ID from search text
      const response = await axios.post(ADD_EXPENSE_URL, {
        projectname: selectedProject.projectname,
        category_id: categoryId,
        expense: parseInt(expense),
        type: selectedPickerValue
      });
  
      if (response.status === 200) {
        Alert.alert('Success', 'Expense added successfully!');
  
        // Reset the form fields
        setSelectedProject(null);
        setSearchQuery('');
        setFilteredProjects(projects);
        setSelectedType('');
        setSelectedPickerValue('');
        setPickerOptions([]);
        setSearchText('');
        setExpense('');
  
        // Fetch updated projects or data
        fetchProjects(); // Refresh projects list
      } else {
        Alert.alert('Error', 'Failed to add expense.');
      }
    } catch (error) {
      console.error('Error submitting expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };
  