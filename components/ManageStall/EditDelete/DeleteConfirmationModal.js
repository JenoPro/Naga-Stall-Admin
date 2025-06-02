import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

export default function DeleteConfirmationModal({ 
  visible, 
  onClose, 
  onConfirm, 
  stallNo, 
  isDeleting = false 
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={deleteStyles.overlay}>
        <View style={deleteStyles.container}>
          <View style={deleteStyles.iconContainer}>
            <Text style={deleteStyles.warningIcon}>⚠️</Text>
          </View>

          <Text style={deleteStyles.title}>Delete Stall</Text>
          
          <Text style={deleteStyles.message}>
            Are you sure you want to delete Stall #{stallNo}?
          </Text>
          
          <Text style={deleteStyles.subMessage}>
            This action cannot be undone. All participant data for this stall will also be removed.
          </Text>

          <View style={deleteStyles.buttonContainer}>
            <TouchableOpacity
              style={[deleteStyles.button, deleteStyles.cancelButton]}
              onPress={onClose}
              disabled={isDeleting}
            >
              <Text style={deleteStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                deleteStyles.button, 
                deleteStyles.deleteButton,
                isDeleting && deleteStyles.disabledButton
              ]}
              onPress={onConfirm}
              disabled={isDeleting}
            >
              <Text style={deleteStyles.deleteButtonText}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const deleteStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 16,
  },
  warningIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  subMessage: {
    fontSize: 14,
    color: '#777',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});