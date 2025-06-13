import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../../Styles/ManageStall";

export default function ParticipantsButton({
  participants,
  newParticipantsCount,
  onViewParticipants,
  stallId,
}) {
  const [lastViewedCount, setLastViewedCount] = useState(0);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);

  const totalParticipants = participants.length;
  const buttonText = "View Participants";

  const hasNewParticipants = totalParticipants > lastViewedCount;

  useEffect(() => {
    loadLastViewedCount();
  }, [stallId]);

  useEffect(() => {
    if (totalParticipants > 0 && !hasBeenViewed) {
      return;
    }
  }, [totalParticipants, hasBeenViewed]);

  const loadLastViewedCount = async () => {
    try {
      const key = `stall_${stallId}_last_viewed_count`;
      const storedCount = await AsyncStorage.getItem(key);
      const count = storedCount ? parseInt(storedCount, 10) : 0;
      setLastViewedCount(count);
      setHasBeenViewed(true);
    } catch (error) {
      console.error("Error loading last viewed count:", error);
      setLastViewedCount(0);
      setHasBeenViewed(true);
    }
  };

  const saveLastViewedCount = async (count) => {
    try {
      const key = `stall_${stallId}_last_viewed_count`;
      await AsyncStorage.setItem(key, count.toString());
      setLastViewedCount(count);
    } catch (error) {
      console.error("Error saving last viewed count:", error);
    }
  };

  const handleViewParticipants = async () => {
    await saveLastViewedCount(totalParticipants);

    if (onViewParticipants) {
      onViewParticipants();
    }
  };

  const shouldShowBadge =
    hasBeenViewed && hasNewParticipants && totalParticipants > 0;

  return (
    <View style={[styles.tableCell, styles.applicantsCell]}>
      <View style={styles.participantsButtonContainer}>
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={handleViewParticipants}
          >
            <Text style={styles.viewButtonText}>{buttonText}</Text>
          </TouchableOpacity>

          {shouldShowBadge && (
            <View style={badgeStyles.newParticipantsBadge}>
              <Text style={badgeStyles.badgeText}>
                {totalParticipants - lastViewedCount}
              </Text>
            </View>
          )}

          {totalParticipants > 0 && (
            <View style={badgeStyles.totalCountBadge}>
              <Text style={badgeStyles.totalCountText}>
                {totalParticipants}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  newParticipantsBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF0000",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 999,
  },
  totalCountBadge: {
    position: "absolute",
    top: -8,
    left: -8,
    backgroundColor: "#6c757d",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    zIndex: 998,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  totalCountText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "500",
    textAlign: "center",
  },
});
