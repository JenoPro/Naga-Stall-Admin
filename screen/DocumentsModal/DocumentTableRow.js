import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../Styles/ManageStall';

const DocumentTableRow = ({ item, index, onViewDocument }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'complete': return '#4CAF50';
      case 'resubmit': return '#FF9800';
      case 'not complete': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      fontSize: 12,
      fontWeight: 'bold',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      textAlign: 'center',
      overflow: 'hidden',
    };

    switch (status.toLowerCase()) {
      case 'complete':
        return { ...baseStyle, backgroundColor: '#E8F5E8', color: '#4CAF50' };
      case 'resubmit':
        return { ...baseStyle, backgroundColor: '#FFF3E0', color: '#FF9800' };
      case 'not complete':
        return { ...baseStyle, backgroundColor: '#FFEBEE', color: '#F44336' };
      default:
        return { ...baseStyle, backgroundColor: '#F5F5F5', color: '#666' };
    }
  };

  return (
    <View style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }]}>
      <View style={[styles.tableCell, { width: '20%' }]}>
        <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }}>{item.fullName}</Text>
      </View>
      <View style={[styles.tableCell, { width: '20%' }]}>
        <Text style={{ fontSize: 14, color: '#333' }} numberOfLines={2}>{item.emailAddress}</Text>
      </View>
      <View style={[styles.tableCell, { width: '15%' }]}>
        <Text style={{ fontSize: 14, color: '#333' }}>{item.phoneNumber}</Text>
      </View>
      <View style={[styles.tableCell, { width: '25%' }]}>
        <Text style={{ fontSize: 14, color: '#333' }} numberOfLines={2}>{item.address}</Text>
      </View>
      <View style={[styles.tableCell, { width: '10%', alignItems: 'center' }]}>
        <View style={getStatusStyle(item.status)}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: getStatusColor(item.status) }}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={[styles.tableCell, { width: '10%', alignItems: 'center' }]}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => onViewDocument(item.fullName)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DocumentTableRow;