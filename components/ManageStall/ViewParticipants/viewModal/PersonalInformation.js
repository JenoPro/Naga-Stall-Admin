import React from "react";
import { View, Text } from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";

export default function PersonalInformation({ applicant }) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Full Name:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_Name || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Age:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_Age || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Civil Status:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_CivilStatus || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Contact Number:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_ContactNo || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Mailing Address:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_MailingAddress || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Highest Education:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_HighestEducationalAttainment || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Capitalization:</Text>
        <Text style={styles.detailValue}>
          ₱{applicant.Applicants_Capitalization?.toLocaleString() || "0"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Source of Capital:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_SourceOfCapital || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Previous Business:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_PreviousBusinessExperience || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Relatives in Market:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_RelativeStallOwner || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Proposed Trading:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_ProposeType || "Not provided"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>House Lot Address:</Text>
        <Text style={styles.detailValue}>
          {applicant.Applicants_HouseLocation || "Not provided"}
        </Text>
      </View>
    </View>
  );
}