                                                                                                                                                                                                                                                                 import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SearchUserScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [selectedType, setSelectedType] = useState('Type');
  const [typeSearch, setTypeSearch] = useState('');

  const navigation = useNavigation();

  const users = [
    { name: 'John Doe', phone: '123-456-7890' },
    { name: 'Jane Smith', phone: '987-654-3210' },
    { name: 'Mike Johnson', phone: '456-789-0123' },
    { name: 'Anna Taylor', phone: '654-321-0987' },
  ];

  const categories = ['Labour', 'Machinery', 'Material'];
  const types = ['Painter', 'Cement', 'Electrician'];

  const handleSearchChange = (text) => {
    setSearchText(text);
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.phone.includes(text)
    );
    setFilteredUsers(filtered);
  };

  const handleTypeSearchChange = (text) => {
    setTypeSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by Name or ID"
        value={searchText}
        onChangeText={handleSearchChange}
      />
      {filteredUsers.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredUsers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSearchText(item.name);
                  setSelectedUser(item);
                  setFilteredUsers([]);
                }}
              >
                <Text style={styles.dropdownItem}>{item.name} - {item.phone}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

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
        >
          <Text style={styles.buttonText}>{selectedType}</Text>
          <AntDesign name="down" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {showCategoryDropdown && (
        <View style={styles.dropdown}>
          <FlatList
            data={categories}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedCategory(item);
                  setShowCategoryDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {showTypeDropdown && (
        <View style={styles.dropdown}>
          <TextInput
            style={styles.input}
            placeholder="Search Type"
            value={typeSearch}
            onChangeText={handleTypeSearchChange}
          />
          <FlatList
            data={types.filter((type) => type.toLowerCase().includes(typeSearch.toLowerCase()))}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedType(item);
                  setShowTypeDropdown(false);
                }}
              >
                <Text style={styles.dropdownItem}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedCategory !== 'Category' && selectedType !== 'Type' && selectedUser && (
        <TouchableOpacity
          onPress={() => navigation.navigate('UserFinancialDetailScreen', { user: selectedUser })}
          style={styles.tableContainer}
        >
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Name</Text>
            <Text style={styles.tableHeaderText}>ID</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{selectedUser.name}</Text>
            <Text style={styles.tableCell}>{selectedUser.phone}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  dropdown: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  tableContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableCell: {
    flex: 1,
  },
});

export default SearchUserScreen;