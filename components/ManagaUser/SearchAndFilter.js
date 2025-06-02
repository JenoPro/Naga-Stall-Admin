import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../Styles/ManageStall';

const SearchAndFilter = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onFilterChange 
}) => {
  const handleSearch = () => {
    // Optional: Add any additional search logic here
    console.log('Search triggered for:', searchQuery);
  };

  return (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email or phone..."
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={statusFilter}
          style={styles.filterPicker}
          onValueChange={onFilterChange}
        >
          <Picker.Item label="All Status" value="all" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Approved" value="approved" />
          <Picker.Item label="Declined" value="declined" />
        </Picker>
      </View>
    </View>
  );
};

export default SearchAndFilter;