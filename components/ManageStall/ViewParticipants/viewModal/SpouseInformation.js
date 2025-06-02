import React from "react";
import { View, Text } from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";

export default function SpouseInformation({ spouseData }) {
  if (!spouseData || spouseData.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Spouse Information</Text>
      {spouseData.map((spouse, index) => (
        <View key={index} style={styles.spouseContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Full Name:</Text>
            <Text style={styles.detailValue}>
              {spouse.spouse_FullName || "Not provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age:</Text>
            <Text style={styles.detailValue}>
              {spouse.spouse_Age || "Not provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Educational Attainment:</Text>
            <Text style={styles.detailValue}>
              {spouse.spouse_EducationalAttainment || "Not provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Occupation:</Text>
            <Text style={styles.detailValue}>
              {spouse.spouse_Occupation || "Not provided"}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Names of Children:</Text>
            <Text style={styles.detailValue}>
              {spouse.namesOfChildren || "Not provided"}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}