import React from "react";
import { View, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from "../../Styles/ManageStall";

export default function StallSearchFilter({ 
  searchQuery, 
  statusFilter, 
  onSearchChange, 
  onFilterChange 
}) {
  return (
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Stalls..."
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={statusFilter}
          style={styles.filterPicker}
          onValueChange={onFilterChange}
        >
          <Picker.Item label="Filter" value="all" />
          <Picker.Item label="Active" value="available" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Raffled" value="raffled" />
        </Picker>
      </View>
    </View>
  );
}