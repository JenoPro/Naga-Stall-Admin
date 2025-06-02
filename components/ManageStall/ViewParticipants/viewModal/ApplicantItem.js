import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";

const newBadgeStyles = {
  newBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  newBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
};

const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString();
};

export default function ApplicantItem({ item, isNew, isRecent, onViewMore }) {
  return (
    <View style={styles.applicantItem}>
      <View style={styles.applicantHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.applicantName}>
            {item.Applicants_Name || "No Name Provided"}
          </Text>
          {(isNew || isRecent) && (
            <View style={newBadgeStyles.newBadge}>
              <Text style={newBadgeStyles.newBadgeText}>NEW!</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.viewMoreButton}
          onPress={onViewMore}
        >
          <Text style={styles.viewMoreButtonText}>View More</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.applicantStatus}>
        Status: {item.status || "Pending"}
      </Text>
      <Text style={styles.applicationDate}>
        Applied: {formatDate(item.created_at)}
      </Text>
    </View>
  );
}