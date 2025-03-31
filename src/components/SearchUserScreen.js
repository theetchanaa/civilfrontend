import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const SearchUserScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedType, setSelectedType] = useState('Type');
  const [typeSearch, setTypeSearch] = useState('');
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const categoryOptions = ['labour', 'machinery', 'material'];

  const handleCategorySelection = async (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.141.250:5000/${category}`);
      const data = await response.json();
      const typesList = data[category] || [];
      setTypes(typesList.filter(item => item !== null && item.trim() !== ''));
      setShowTypeDropdown(true);
    } catch (error) {
      console.error('Error fetching types:', error);
      setTypes([]);
      setShowTypeDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeSelection = async (type) => {
    setSelectedType(type);
    setShowTypeDropdown(false);
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.141.250:5000/get_categories?type=${type}`);
      const data = await response.json();
      setCategories(data.categories || []);
      setFilteredCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchText(text);
    const filtered = categories.filter(
      (category) =>
        category.category_name.toLowerCase().includes(text.toLowerCase()) ||
        category.category_id.includes(text)
    );
    setFilteredCategories(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search User</Text>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by Name or ID"
          placeholderTextColor="#8F9BB3"
          value={searchText}
          onChangeText={handleSearchChange}
        />

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
          >
            <Text style={styles.filterButtonText}>{selectedCategory}</Text>
            <AntDesign name="down" size={16} color="#2E3A59" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.filterButton, types.length === 0 && styles.disabledButton]}
            onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            disabled={types.length === 0}
          >
            <Text style={styles.filterButtonText}>{selectedType}</Text>
            <AntDesign name="down" size={16} color="#2E3A59" />
          </TouchableOpacity>
        </View>

        {showCategoryDropdown && (
          <View style={styles.dropdownMenu}>
            <FlatList
              data={categoryOptions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.dropdownItem} onPress={() => handleCategorySelection(item)}>
                  <Text style={styles.dropdownText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2E3A59" style={styles.loader} />
        ) : (
          showTypeDropdown && types.length > 0 && (
            <View style={styles.dropdownMenu}>
              <TextInput
                style={styles.dropdownSearch}
                placeholder="Search Type"
                placeholderTextColor="#8F9BB3"
                value={typeSearch}
                onChangeText={setTypeSearch}
              />
              <FlatList
                data={types.filter((type) => type.toLowerCase().includes(typeSearch.toLowerCase()))}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => handleTypeSelection(item)}>
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )
        )}

        {categories.length > 0 && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.columnHeader}>Category Name</Text>
              <Text style={styles.columnHeader}>Category ID</Text>
            </View>
            <FlatList
              data={filteredCategories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.resultRow}
                  onPress={() => navigation.navigate('UserFinancialDetailScreen', { user: item })}
                >
                  <Text style={styles.resultText}>{item.category_name}</Text>
                  <Text style={styles.resultText}>{item.category_id}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
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
    backgroundColor: '#2E3A59',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchSection: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    color: '#2E3A59',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  disabledButton: {
    opacity: 0.5,
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E4E9F2',
    maxHeight: 250,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  dropdownText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  dropdownSearch: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
    fontSize: 16,
    color: '#2E3A59',
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E9F2',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#2E3A59',
  },
  columnHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E9F2',
  },
  resultText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  loader: {
    marginVertical: 20,
  },
});

export default SearchUserScreen;