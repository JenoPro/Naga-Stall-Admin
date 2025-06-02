import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import styles from "../../../Styles/ManageStall";

export default function ParticipantsButton({
  participants,
  newParticipantsCount,
  onViewParticipants,
}) {
  const totalParticipants = participants.length;
  const buttonText =
    totalParticipants > 0
      ? `View Participants (${totalParticipants})`
      : "View Participants";

  return (
    <View style={[styles.tableCell, styles.applicantsCell]}>
      <View style={styles.participantsButtonContainer}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={onViewParticipants}
          >
            <Text style={styles.viewButtonText}>{buttonText}</Text>
          </TouchableOpacity>

          {newParticipantsCount > 0 && (
            <View style={badgeStyles.badge}>
              <Text style={badgeStyles.badgeText}>
                {newParticipantsCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF0000",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 999,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 2,
  },
});