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
      const response = await fetch(`http://192.168.234.233:5000/${category}`);
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
      const response = await fetch(`http://192.168.234.233:5000/get_categories?type=${type}`);
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
      <TextInput
        style={styles.input}
        placeholder="Search by Name or ID"
        value={searchText}
        onChangeText={handleSearchChange}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={styles.buttonText}>{selectedCategory}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setShowTypeDropdown(!showTypeDropdown)}
          disabled={types.length === 0}
        >
          <Text style={styles.buttonText}>{selectedType}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={categoryOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCategorySelection(item)}>
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        showTypeDropdown && types.length > 0 && (
          <View style={styles.dropdown}>
            <TextInput
              style={styles.input}
              placeholder="Search Type"
              value={typeSearch}
              onChangeText={setTypeSearch}
            />
            <FlatList
              data={types.filter((type) => type.toLowerCase().includes(typeSearch.toLowerCase()))}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleTypeSelection(item)}>
                  <Text style={styles.dropdownItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )
      )}

      {categories.length > 0 && (
        <View style={styles.userList}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Category Name</Text>
            <Text style={styles.tableHeaderText}>Category ID</Text>
          </View>
          <FlatList
            data={filteredCategories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.tableRow} 
                onPress={() => navigation.navigate('UserFinancialDetailScreen', { user: item })}
              >
                <Text style={styles.tableCell}>{item.category_name}</Text>
                <Text style={styles.tableCell}>{item.category_id}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8f8f8' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#fff', marginBottom: 16 },
  dropdown: { marginBottom: 16, backgroundColor: '#fff', borderRadius: 8, elevation: 5, maxHeight: 280, overflow: 'hidden' },
  dropdownItem: { padding: 12, fontSize: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 20, backgroundColor: '#fff', flex: 1, marginHorizontal: 5 },
  buttonText: { fontSize: 16 },
  userList: { marginTop: 20, backgroundColor: '#fff', borderRadius: 8, padding: 10 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#ddd', paddingBottom: 5, marginBottom: 5 },
  tableHeaderText: { fontSize: 16, fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 5, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tableCell: { fontSize: 16 },
});

export default SearchUserScreen;