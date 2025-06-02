import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../../../Styles/ViewParticipantsModal";
import PersonalInformation from "./PersonalInformation";
import SpouseInformation from "./SpouseInformation";
import ApplicationStatus from "./ApplicationStatus";

export default function ApplicantDetailsModal({ visible, applicant, onClose }) {
  if (!applicant) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.detailsModalOverlay}>
        <View style={styles.detailsModalContent}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsTitleContainer}>
              <Text style={styles.detailsTitle}>Applicant Details</Text>
            </View>
            <TouchableOpacity
              style={styles.closeDetailsButton}
              onPress={onClose}
            >
              <Text style={styles.closeDetailsButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsScrollView}>
            <PersonalInformation applicant={applicant} />
            <SpouseInformation spouseData={applicant.SpouseInformation} />
            <ApplicationStatus applicant={applicant} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}