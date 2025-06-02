import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../../Styles/ManageStall';

const ImageModal = ({ visible, selectedImage, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              ID for {selectedImage?.userName || 'User'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.imageContainer}>
            {selectedImage?.url ? (
              <Image 
                source={{ uri: selectedImage.url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            ) : (
              <Text>No image available</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ImageModal;