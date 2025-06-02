import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';

const DocumentModal = ({ 
  visible, 
  onClose, 
  selectedRegistrant, 
  selectedDocuments,
  requiredDocuments,
  documentDisplayNames,
  formatUploadDate 
}) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const [currentDocumentUrl, setCurrentDocumentUrl] = useState('');
  const [currentDocumentTitle, setCurrentDocumentTitle] = useState('');

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

  const goBackToList = () => {
    setSelectedDocumentType(null);
    setCurrentDocumentUrl('');
    setCurrentDocumentTitle('');
  };

  const handleClose = () => {
    goBackToList();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContainer}>
          
          {/* Header */}
          <View style={modalStyles.modalHeader}>
            <View style={modalStyles.headerLeft}>
              {selectedDocumentType && (
                <TouchableOpacity 
                  style={modalStyles.backButton}
                  onPress={goBackToList}
                >
                  <Text style={modalStyles.backButtonText}>←</Text>
                </TouchableOpacity>
              )}
              <Text style={modalStyles.modalTitle}>
                {selectedDocumentType ? currentDocumentTitle : selectedRegistrant?.fullName}
              </Text>
            </View>
            <TouchableOpacity 
              style={modalStyles.closeButton}
              onPress={handleClose}
            >
              <Text style={modalStyles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={modalStyles.contentContainer}>
            {!selectedDocumentType ? (
              // Document List View
              <ScrollView style={modalStyles.documentsContainer}>
                {/* Registrant Info */}
                <View style={modalStyles.registrantInfo}>
                  <Text style={modalStyles.infoText}>Email: {selectedRegistrant?.emailAddress}</Text>
                  <Text style={modalStyles.infoText}>Phone: {selectedRegistrant?.phoneNumber}</Text>
                  <Text style={modalStyles.infoText}>Address: {selectedRegistrant?.address}</Text>
                </View>

                {/* Documents Grid */}
                <View style={modalStyles.documentsGrid}>
                  {requiredDocuments.map((docType, index) => {
                    const isAvailable = selectedDocuments?.[docType];
                    
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          modalStyles.documentCard,
                          { backgroundColor: isAvailable ? '#f0f8ff' : '#f5f5f5' }
                        ]}
                        onPress={() => showDocument(docType)}
                        disabled={!isAvailable}
                      >
                        <Text style={[
                          modalStyles.documentCardTitle,
                          { color: isAvailable ? '#002366' : '#999' }
                        ]}>
                          {documentDisplayNames[docType]}
                        </Text>
                        <View style={[
                          modalStyles.statusIndicator,
                          { backgroundColor: isAvailable ? '#4CAF50' : '#F44336' }
                        ]}>
                          <Text style={modalStyles.statusIndicatorText}>
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
              <View style={modalStyles.documentViewContainer}>
                <ScrollView style={modalStyles.documentContent}>
                  {/* Document Image/Content */}
                  <View style={modalStyles.documentImageContainer}>
                    <Image
                      source={{ uri: currentDocumentUrl }}
                      style={modalStyles.documentImage}
                      resizeMode="contain"
                      onError={() => {
                        Alert.alert('Error', 'Failed to load document image');
                      }}
                    />
                  </View>
                  
                  {/* Upload Date */}
                  <View style={modalStyles.uploadDateContainer}>
                    <Text style={modalStyles.uploadDateText}>
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
};

const modalStyles = {
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

export default DocumentModal;