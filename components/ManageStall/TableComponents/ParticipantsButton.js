import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from "../../../Styles/ManageStall";

export default function ParticipantsButton({
  participants,
  newParticipantsCount,
  onViewParticipants,
  stallId, // Make sure this prop is passed from parent
}) {
  const [lastViewedCount, setLastViewedCount] = useState(0);
  const [hasBeenViewed, setHasBeenViewed] = useState(false);
  
  const totalParticipants = participants.length;
  const buttonText = "View Participants";
  
  // Check if there are truly new participants since last view
  const hasNewParticipants = totalParticipants > lastViewedCount;

  // Load the last viewed count from storage when component mounts
  useEffect(() => {
    loadLastViewedCount();
  }, [stallId]);

  // Update when participants change
  useEffect(() => {
    if (totalParticipants > 0 && !hasBeenViewed) {
      // If we haven't loaded the stored count yet, don't show badge
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
      console.error('Error loading last viewed count:', error);
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
      console.error('Error saving last viewed count:', error);
    }
  };

  const handleViewParticipants = async () => {
    // Save the current participant count as "viewed"
    await saveLastViewedCount(totalParticipants);
    
    // Call the original onViewParticipants function
    if (onViewParticipants) {
      onViewParticipants();
    }
  };

  // Only show badge if there are truly new participants since last view
  const shouldShowBadge = hasBeenViewed && hasNewParticipants && totalParticipants > 0;

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

          {/* Red badge for new participants since last view */}
          {shouldShowBadge && (
            <View style={badgeStyles.newParticipantsBadge}>
              <Text style={badgeStyles.badgeText}>
                {totalParticipants - lastViewedCount}
              </Text>
            </View>
          )}

          {/* Optional: Show total count in a subtle way */}
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