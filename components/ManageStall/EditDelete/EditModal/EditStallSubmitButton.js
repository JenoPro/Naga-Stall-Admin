import React from "react";
import { Text, TouchableOpacity } from "react-native";
import styles from "../../../../Styles/ManageStall";

export default function EditStallSubmitButton({ onSubmit, isSubmitting }) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isSubmitting && styles.disabledButton]}
      onPress={onSubmit}
      disabled={isSubmitting}
    >
      <Text style={styles.submitButtonText}>
        {isSubmitting ? "Updating..." : "UPDATE STALL"}
      </Text>
    </TouchableOpacity>
  );
}