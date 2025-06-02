import React from "react";
import { View, Text } from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";

const formatDate = (dateString) => {
  if (!dateString) return "Not provided";
  return new Date(dateString).toLocaleDateString();
};

export default function ApplicationStatus({ applicant }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Application Status</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status:</Text>
        <Text style={[
          styles.detailValue,
          styles.statusText,
          applicant.status === 'approved' && styles.approvedStatus,
          applicant.status === 'rejected' && styles.rejectedStatus,
          applicant.status === 'pending' && styles.pendingStatus,
        ]}>
          {applicant.status || "Pending"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Application Date:</Text>
        <Text style={styles.detailValue}>
          {formatDate(applicant.created_at)}
        </Text>
      </View>
    </View>
  );
}