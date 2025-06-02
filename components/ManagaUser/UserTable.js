import React from 'react';
import { View, Text, FlatList } from 'react-native';
import styles from '../../Styles/ManageStall';
import UserTableRow from './UserTableRow';

const UserTable = ({ 
  data, 
  loading, 
  emailSending, 
  onAccept, 
  onDecline, 
  onViewImage, 
  onResendCredentials 
}) => {
  const renderTableRow = ({ item }) => (
    <UserTableRow
      item={item}
      emailSending={emailSending}
      onAccept={onAccept}
      onDecline={onDecline}
      onViewImage={onViewImage}
      onResendCredentials={onResendCredentials}
    />
  );

  return (
    <>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderCell, styles.idCell]}>ID</Text>
        <Text style={[styles.tableHeaderCell, styles.nameCell]}>Full Name</Text>
        <Text style={[styles.tableHeaderCell, styles.emailCell]}>Email</Text>
        <Text style={[styles.tableHeaderCell, styles.phoneCell]}>Phone Number</Text>
        <Text style={[styles.tableHeaderCell, styles.addressCell]}>Address</Text>
        <Text style={[styles.tableHeaderCell, styles.validCell]}>Valid ID</Text>
        <Text style={[styles.tableHeaderCell, styles.actionsCell]}>Actions</Text>
      </View>

      {/* Table Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading data...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderTableRow}
          keyExtractor={item => item.registrationId.toString()}
          style={styles.tableContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No registrants found</Text>
            </View>
          }
        />
      )}
    </>
  );
};

export default UserTable;