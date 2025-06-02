import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, Modal, ScrollView, Linking, Image, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AdminNavbar from '../components/AdminNavbar';
import styles from '../Styles/ManageStall'; // Import the comprehensive styles

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
  
  // Simplified modal states
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState('');

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
      return 'Not Complete'; // No documents found
    }

    // Check if all required documents are present
    const missingDocs = requiredDocuments.filter(docType => !userDoc[docType]);
    
    if (missingDocs.length > 0) {
      return 'Not Complete'; // Missing some documents
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

    return 'Complete'; // All documents present, no recent uploads
  };

  // Process and combine registrant and document data
  const processRegistrantData = (registrantData, documentData) => {
    const processed = registrantData.map(registrant => {
      const status = determineStatus(registrant.fullName, documentData);
      
      return {
        ...registrant,
        status: status,
        // Add a unique identifier for FlatList
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
      // Fetch registrants
      const { data: registrantData, error: registrantError } = await supabase
        .from('Registrant')
        .select('fullName, emailAddress, phoneNumber, address');

      if (registrantError) {
        console.log('❌ Registrant fetch error:', registrantError);
        Alert.alert('Error', 'Failed to fetch registrant data');
        return;
      }

      // Fetch documents
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
      
      // Process the combined data
      processRegistrantData(registrantData || [], documentData || []);

    } catch (error) {
      console.log('❌ Error fetching data:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle view document - Updated to show modal
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

  // Get status color and styling
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'complete':
        return '#4CAF50';
      case 'resubmit':
        return '#FF9800';
      case 'not complete':
        return '#F44336';
      default:
        return '#666';
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
        return {
          ...baseStyle,
          backgroundColor: '#E8F5E8',
          color: '#4CAF50',
        };
      case 'resubmit':
        return {
          ...baseStyle,
          backgroundColor: '#FFF3E0',
          color: '#FF9800',
        };
      case 'not complete':
        return {
          ...baseStyle,
          backgroundColor: '#FFEBEE',
          color: '#F44336',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#F5F5F5',
          color: '#666',
        };
    }
  };

  // Function to show individual document
  const showDocument = (docType) => {
    const documentUrl = selectedDocuments?.[docType];
    const documentTitle = documentDisplayNames[docType];
    const uploadDate = selectedDocuments?.[`${docType}_uploaded_at`];
    
    if (!documentUrl) {
      Alert.alert('Document Not Available', `${documentTitle} has not been uploaded yet.`);
      return;
    }

    setCurrentDocumentUrl(documentUrl);
    setCurrentDocumentTitle(documentTitle);
    setSelectedDocumentType({ docType, uploadDate });
  };

  // Back to document list
  const goBackToList = () => {
    setSelectedDocumentType(null);
    setCurrentDocumentUrl('');
    setCurrentDocumentTitle('');
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

  const renderTableRow = ({ item, index }) => (
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
          onPress={() => handleViewDocument(item.fullName)}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Simplified Document Modal Component
  const DocumentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={simplifiedModalStyles.modalOverlay}>
        <View style={simplifiedModalStyles.modalContainer}>
          
          {/* Header */}
          <View style={simplifiedModalStyles.modalHeader}>
            <View style={simplifiedModalStyles.headerLeft}>
              {selectedDocumentType && (
                <TouchableOpacity 
                  style={simplifiedModalStyles.backButton}
                  onPress={goBackToList}
                >
                  <Text style={simplifiedModalStyles.backButtonText}>←</Text>
                </TouchableOpacity>
              )}
              <Text style={simplifiedModalStyles.modalTitle}>
                {selectedDocumentType ? currentDocumentTitle : selectedRegistrant?.fullName}
              </Text>
            </View>
            <TouchableOpacity 
              style={simplifiedModalStyles.closeButton}
              onPress={() => {
                setModalVisible(false);
                goBackToList();
              }}
            >
              <Text style={simplifiedModalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={simplifiedModalStyles.contentContainer}>
            {!selectedDocumentType ? (
              // Document List View
              <ScrollView style={simplifiedModalStyles.documentsContainer}>
                {/* Registrant Info */}
                <View style={simplifiedModalStyles.registrantInfo}>
                  <Text style={simplifiedModalStyles.infoText}>Email: {selectedRegistrant?.emailAddress}</Text>
                  <Text style={simplifiedModalStyles.infoText}>Phone: {selectedRegistrant?.phoneNumber}</Text>
                  <Text style={simplifiedModalStyles.infoText}>Address: {selectedRegistrant?.address}</Text>
                </View>

                {/* Documents Grid */}
                <View style={simplifiedModalStyles.documentsGrid}>
                  {requiredDocuments.map((docType, index) => {
                    const isAvailable = selectedDocuments?.[docType];
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          simplifiedModalStyles.documentCard,
                          { backgroundColor: isAvailable ? '#f0f8ff' : '#f5f5f5' }
                        ]}
                        onPress={() => showDocument(docType)}
                        disabled={!isAvailable}
                      >
                        <Text style={[
                          simplifiedModalStyles.documentCardTitle,
                          { color: isAvailable ? '#002366' : '#999' }
                        ]}>
                          {documentDisplayNames[docType]}
                        </Text>
                        <View style={[
                          simplifiedModalStyles.statusIndicator,
                          { backgroundColor: isAvailable ? '#4CAF50' : '#F44336' }
                        ]}>
                          <Text style={simplifiedModalStyles.statusIndicatorText}>
                            {isAvailable ? '✓' : '✗'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            ) : (
              // Individual Document View
              <View style={simplifiedModalStyles.documentViewContainer}>
                <ScrollView style={simplifiedModalStyles.documentContent}>
                  {/* Document Image/Content */}
                  <View style={simplifiedModalStyles.documentImageContainer}>
                    <Image
                      source={{ uri: currentDocumentUrl }}
                      style={simplifiedModalStyles.documentImage}
                      resizeMode="contain"
                      onError={() => {
                        Alert.alert('Error', 'Failed to load document image');
                      }}
                    />
                  </View>
                  
                  {/* Upload Date */}
                  <View style={simplifiedModalStyles.uploadDateContainer}>
                    <Text style={simplifiedModalStyles.uploadDateText}>
                      Uploaded: {formatUploadDate(selectedDocumentType.uploadDate)}
                    </Text>
                  </View>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
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
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, email, phone, or address..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.filterContainer}>
            <View style={styles.filterPicker}>
              <Picker
                selectedValue={statusFilter}
                onValueChange={(itemValue) => setStatusFilter(itemValue)}
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

        {/* Table Container */}
        <View style={[styles.tableContent, { borderRadius: 8, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 }]}>
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
              renderItem={renderTableRow}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>

      {/* Simplified Document Modal */}
      <DocumentModal />
    </View>
  );
};

// Simplified Modal Styles
const simplifiedModalStyles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: '85%',
    width: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#002366',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  backButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#dc3545',
  },
  closeButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
  },
  registrantInfo: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  documentsContainer: {
    flex: 1,
  },
  documentsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  documentCard: {
    width: '47%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    position: 'relative',
  },
  documentCardTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  statusIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  documentViewContainer: {
    flex: 1,
  },
  documentContent: {
    flex: 1,
  },
  documentImageContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  documentImage: {
    width: '100%',
    height: 400,
    borderRadius: 8,
  },
  uploadDateContainer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: 'white',
  },
  uploadDateText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
};

export default ManageDocumentsScreen;