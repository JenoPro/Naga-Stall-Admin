import React from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function LiveParticipantsInfo({
  participantCount,
  viewerCount,
  isLive,
}) {
  return (
    <View style={styles.participantsInfo}>
      <Text style={styles.participantsText}>
        👥 {participantCount} Participants Registered
        {isLive && ` • 👁️ ${viewerCount} viewers`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  participantsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  participantsText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
});