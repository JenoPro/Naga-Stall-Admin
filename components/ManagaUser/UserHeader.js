import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../Styles/ManageStall';

const UserHeader = ({ onRefresh }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Manage Users</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserHeader;