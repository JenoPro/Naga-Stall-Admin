import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import styles from "../../../Styles/ManageStall";

export default function ActionButtons({ status, onEdit, onRemove, onGoLive }) {
  if (status === "available" || status === "Countdown") {
    return (
      <View style={[styles.tableCell, styles.actionsCell]}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.editButton, buttonStyles.editButton]}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Text style={[styles.editButtonText, buttonStyles.editButtonText]}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.removeButton, buttonStyles.removeButton]}
            onPress={onRemove}
            activeOpacity={0.7}
          >
            <Text style={[styles.removeButtonText, buttonStyles.removeButtonText]}>
              Remove Stall
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.tableCell, styles.actionsCell]}>
      <TouchableOpacity
        style={styles.goLiveButton}
        onPress={onGoLive}
        activeOpacity={0.7}
      >
        <Text style={styles.goLiveButtonText}>Go Live</Text>
      </TouchableOpacity>
    </View>
  );
}

const buttonStyles = StyleSheet.create({
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
    minWidth: 70,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  removeButton: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
});