import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../Styles/ManageStall';

const SearchFilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}) => {
  return (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, email, phone, or address..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.filterPicker}>
          <Picker
            selectedValue={statusFilter}
            onValueChange={onStatusFilterChange}
            style={{ height: 40, color: '#002366' }}
          >
            <Picker.Item label="All Status" value="all" />
            <Picker.Item label="Complete" value="complete" />
            <Picker.Item label="Resubmit" value="resubmit" />
            <Picker.Item label="Not Complete" value="not complete" />
          </Picker>
        </View>
      </View>
    </View>
  );
};

export default SearchFilterBar;