import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../Styles/ManageStall";

export default function StallHeader({ onAddStall }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Manage Stall</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddStall}>
        <Text style={styles.addButtonText}>Add Available Stall</Text>
      </TouchableOpacity>
    </View>
  );
}