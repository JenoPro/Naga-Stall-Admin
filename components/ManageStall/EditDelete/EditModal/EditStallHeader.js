import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styles from "../../../../Styles/ManageStall";

export default function EditStallHeader({ stallNo, onClose, isSubmitting }) {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>
        Edit Stall #{stallNo}
      </Text>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        disabled={isSubmitting}
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}