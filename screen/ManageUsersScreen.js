import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import AdminNavbar from '../components/AdminNavbar';
import supabase from '../config/supabaseClient';
import emailjs from '@emailjs/browser';
import styles from '../Styles/ManageStall';

import UserHeader from '../components/ManagaUser/UserHeader';
import SearchAndFilter from '../components/ManagaUser/SearchAndFilter';
import UserTable from '../components/ManagaUser/UserTable';
import ImageModal from '../components/ManagaUser/ImageModal';
import { generateUsername, generatePassword, sortRegistrantData } from '../utils/userUtils';
import { sendAutomatedEmail } from '../services/emailService';

// Initialize EmailJS
const EMAILJS_USER_ID = 'sTpDE-Oq2-9XH_UZd';
emailjs.init(EMAILJS_USER_ID);

export default function ManageUsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [registrant, setRegistrant] = useState([]);
  const [filteredRegistrant, setFilteredRegistrant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Apply both status filter and search query
  const applyFiltersAndSearch = (data, status, query) => {
    let result = data;
    if (status !== 'all') {
      if (status === 'pending') {
        result = data.filter(item => !item.status || item.status === 'pending');
      } else {
        result = data.filter(item => item.status === status);
      }
    }
    
    if (query && query.trim() !== '') {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(item =>
        (item.fullName || '').toLowerCase().includes(lowercaseQuery) ||
        (item.emailAddress || '').toLowerCase().includes(lowercaseQuery) ||
        (item.phoneNumber || '').toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredRegistrant(result);
  };

  // Fetch data from Supabase
  const fetchRegistrant = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Registrant')
        .select();

      if (error) {
        console.log('❌ Supabase error:', error);
        Alert.alert('Error', 'Failed to fetch users data');
      } else {
        console.log('✅ Fetched registrant:', data);
        const sortedData = sortRegistrantData(data || []);
        setRegistrant(sortedData);
        applyFiltersAndSearch(sortedData, statusFilter, searchQuery);
      }
    } catch (error) {
      console.log('❌ Error fetching data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Show credentials modal after approval
  const showCredentialsModal = (username, password, emailAddress) => {
    Alert.alert(
      'User Approved',
      `User has been approved with the following credentials:\n\nUsername: ${username}\nPassword: ${password}\n\nSending email automatically...`,
      [{ text: 'OK' }]
    );
    
    sendAutomatedEmail(emailAddress, username, password, setEmailSending);
  };

  // Handle accept user
  const handleAccept = async (userId, userEmail) => {
    try {
      const username = generateUsername();
      const password = generatePassword();
      
      console.log(`Updating user ${userId} with username: ${username}, password: ${password}`);
      
      const { data, error } = await supabase
        .from('Registrant')
        .update({ 
          status: 'approved',
          userName: `{${username}}`,
          password: `{${password}}`
        })
        .eq('registrationId', userId);

      if (error) {
        console.log('❌ Error approving user:', error);
        Alert.alert('Error', `Failed to approve user: ${error.message}`);
        return;
      }
      
      console.log('✅ User approved successfully:', data);
      
      const updatedRegistrants = registrant.map(item => 
        item.registrationId === userId 
          ? {...item, status: 'approved', userName: [username], password: [password]} 
          : item
      );
      
      const sortedData = sortRegistrantData(updatedRegistrants);
      setRegistrant(sortedData);
      showCredentialsModal(username, password, userEmail);
      
    } catch (error) {
      console.log('❌ Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Handle resend credentials
  const handleResendCredentials = async (userId, emailAddress, username, password) => {
    try {
      setEmailSending(true);
      const success = await sendAutomatedEmail(emailAddress, username, password, setEmailSending);
      
      if (success) {
        Alert.alert('Success', `Credentials resent to ${emailAddress}`);
      }
    } catch (error) {
      console.log('❌ Error resending credentials:', error);
      Alert.alert('Error', 'Failed to resend credentials');
    } finally {
      setEmailSending(false);
    }
  };

  // Handle decline user
  const handleDecline = async (userId) => {
    try {
      const { error } = await supabase
        .from('Registrant')
        .update({ status: 'declined' })
        .eq('registrationId', userId);

      if (error) {
        console.log('❌ Error declining user:', error);
        Alert.alert('Error', `Failed to decline user: ${error.message}`);
      } else {
        const updatedRegistrants = registrant.map(item => 
          item.registrationId === userId ? {...item, status: 'declined'} : item
        );
        
        const sortedData = sortRegistrantData(updatedRegistrants);
        setRegistrant(sortedData);
        Alert.alert('Success', 'User has been declined');
      }
    } catch (error) {
      console.log('❌ Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }
  };

  // Handle view image
  const handleViewImage = (imageUrl, userName) => {
    setSelectedImage({ url: imageUrl, userName: userName });
    setImageModalVisible(true);
  };

  useEffect(() => {
    fetchRegistrant();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch(registrant, statusFilter, searchQuery);
  }, [searchQuery, registrant, statusFilter]);

  return (
    <View style={styles.container}>
      <AdminNavbar activeId="users" />

      <View style={styles.content}>
        <UserHeader onRefresh={fetchRegistrant} />
        
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <UserTable
          data={filteredRegistrant}
          loading={loading}
          emailSending={emailSending}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onViewImage={handleViewImage}
          onResendCredentials={handleResendCredentials}
        />

        <ImageModal
          visible={imageModalVisible}
          selectedImage={selectedImage}
          onClose={() => setImageModalVisible(false)}
        />
      </View>
    </View>
  );
}