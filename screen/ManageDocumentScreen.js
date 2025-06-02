import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import AdminNavbar from '../components/AdminNavbar';
import DocumentTableRow from './DocumentsModal/DocumentTableRow';
import DocumentModal from './DocumentsModal/DocumentModal';
import SearchFilterBar from './DocumentsModal/SearchFilterBar';
import styles from '../Styles/ManageStall';
import supabase from '../config/supabaseClient';

const ManageDocumentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [registrants, setRegistrants] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(null);

  // Required documents list
  const requiredDocuments = [
    'AwardPaper',
    'LeaseContract', 
    'MEPOMarketClearance',
    'BarangayBusinessClearance',
    'Cedula',
    'AssociationClearance',
    "Voter'sID",
    'HealthCard'
  ];

  // Document display names
  const documentDisplayNames = {
    'AwardPaper': 'Award Paper',
    'LeaseContract': 'Lease Contract',
    'MEPOMarketClearance': 'MEPO Market Clearance',
    'BarangayBusinessClearance': 'Barangay Business Clearance',
    'Cedula': 'Cedula',
    'AssociationClearance': 'Association Clearance',
    "Voter'sID": "Voter's ID",
    'HealthCard': 'Health Card'
  };

  // Determine document status based on Documents table
  const determineStatus = (registrantName, documentsData) => {
    const userDoc = documentsData.find(doc => doc.registrantFullName === registrantName);
    
    if (!userDoc) {
      return 'Not Complete';
    }

    const missingDocs = requiredDocuments.filter(docType => !userDoc[docType]);
    
    if (missingDocs.length > 0) {
      return 'Not Complete';
    }

    // Check for recent uploads (within last 7 days) - indicates resubmit
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
    
    const hasRecentUpload = requiredDocuments.some(docType => {
      const uploadField = `${docType}_uploaded_at`;
      const uploadDate = userDoc[uploadField];
      
      if (uploadDate) {
        const uploadTime = new Date(uploadDate);
        return uploadTime > sevenDaysAgo;
      }
      return false;
    });

    if (hasRecentUpload) {
      return 'Resubmit';
    }

    return 'Complete';
  };

  // Process and combine registrant and document data
  const processRegistrantData = (registrantData, documentData) => {
    const processed = registrantData.map(registrant => {
      const status = determineStatus(registrant.fullName, documentData);
      
      return {
        ...registrant,
        status: status,
        id: registrant.fullName
      };
    });

    setProcessedData(processed);
    applyFiltersAndSearch(processed, statusFilter, searchQuery);
  };

  // Apply both status filter and search query
  const applyFiltersAndSearch = (data, status, query) => {
    let result = data;
    
    if (status !== 'all') {
      result = data.filter(item => item.status.toLowerCase() === status.toLowerCase());
    }
    
    if (query && query.trim() !== '') {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(item =>
        (item.fullName || '').toLowerCase().includes(lowercaseQuery) ||
        (item.emailAddress || '').toLowerCase().includes(lowercaseQuery) ||
        (item.phoneNumber || '').toLowerCase().includes(lowercaseQuery) ||
        (item.address || '').toLowerCase().includes(lowercaseQuery)
      );
    }
    
    setFilteredData(result);
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: registrantData, error: registrantError } = await supabase
        .from('Registrant')
        .select('fullName, emailAddress, phoneNumber, address');

      if (registrantError) {
        console.log('❌ Registrant fetch error:', registrantError);
        Alert.alert('Error', 'Failed to fetch registrant data');
        return;
      }

      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .select('*');

      if (documentError) {
        console.log('❌ Document fetch error:', documentError);
        Alert.alert('Error', 'Failed to fetch document data');
        return;
      }

      console.log('✅ Fetched registrants:', registrantData);
      console.log('✅ Fetched documents:', documentData);
      
      setRegistrants(registrantData || []);
      setDocuments(documentData || []);
      
      processRegistrantData(registrantData || [], documentData || []);

    } catch (error) {
      console.log('❌ Error fetching data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle view document
  const handleViewDocument = (fullName) => {
    const userDoc = documents.find(doc => doc.registrantFullName === fullName);
    const registrant = registrants.find(reg => reg.fullName === fullName);
    
    if (!userDoc) {
      Alert.alert('No Documents', `No documents found for ${fullName}`);
      return;
    }

    setSelectedRegistrant(registrant);
    setSelectedDocuments(userDoc);
    setModalVisible(true);
  };

  // Format upload date
  const formatUploadDate = (dateString) => {
    if (!dateString) return 'Not uploaded';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch(processedData, statusFilter, searchQuery);
  }, [searchQuery, processedData, statusFilter]);

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Full Name</Text>
      <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Email Address</Text>
      <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Phone Number</Text>
      <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Address</Text>
      <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Status</Text>
      <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Actions</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <AdminNavbar activeId="documents" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Documents</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchData}>
            <Text style={styles.refreshButtonText}>Refresh Data</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Table Container */}
        <View style={[styles.tableContent, { 
          borderRadius: 8, 
          overflow: 'hidden', 
          elevation: 2, 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 4 
        }]}>
          {renderTableHeader()}
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#002366" />
              <Text style={{ marginTop: 10, color: '#666', fontSize: 16 }}>Loading registrants...</Text>
            </View>
          ) : filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No registrants found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item, index }) => (
                <DocumentTableRow 
                  item={item} 
                  index={index} 
                  onViewDocument={handleViewDocument} 
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      {/* Document Modal */}
      <DocumentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedRegistrant={selectedRegistrant}
        selectedDocuments={selectedDocuments}
        requiredDocuments={requiredDocuments}
        documentDisplayNames={documentDisplayNames}
        formatUploadDate={formatUploadDate}
      />
    </View>
  );
};

export default ManageDocumentsScreen;