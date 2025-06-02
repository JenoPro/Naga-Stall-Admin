import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from "../../../config/supabaseClient";
import styles from "../../../Styles/ViewParticipantsModal";

export default function ViewParticipantsModal({
  visible,
  onClose,
  stallId,
  stallNo,
  lastViewedTimestamp,
}) {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [viewedParticipants, setViewedParticipants] = useState([]);

  // Load previously viewed participants from AsyncStorage
  const loadViewedParticipants = async () => {
    try {
      const key = `stall_${stallId}_viewed_participants`;
      const viewedParticipantsStr = await AsyncStorage.getItem(key);
      const viewed = viewedParticipantsStr ? JSON.parse(viewedParticipantsStr) : [];
      setViewedParticipants(viewed);
    } catch (error) {
      console.error('Error loading viewed participants:', error);
      setViewedParticipants([]);
    }
  };

  // Save viewed participants to AsyncStorage
  const saveViewedParticipants = async (updatedViewedList) => {
    try {
      const key = `stall_${stallId}_viewed_participants`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedViewedList));
    } catch (error) {
      console.error('Error saving viewed participants:', error);
    }
  };

  // Mark participant as viewed
  const markParticipantAsViewed = async (applicationId) => {
    if (!viewedParticipants.includes(applicationId)) {
      const updatedViewedList = [...viewedParticipants, applicationId];
      setViewedParticipants(updatedViewedList);
      await saveViewedParticipants(updatedViewedList);
    }
  };

  useEffect(() => {
    if (visible && stallId) {
      fetchApplicants();
      loadViewedParticipants();
    }
  }, [visible, stallId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      
      // Fetch applications for the specific stall with spouse information
      const { data: applications, error } = await supabase
        .from("Application")
        .select(`
          *,
          SpouseInformation (*)
        `)
        .eq("stallNo", stallId);

      if (error) {
        console.error("Error fetching applicants:", error);
        Alert.alert("Error", "Failed to fetch applicants");
        return;
      }

      setApplicants(applications || []);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = async (applicant) => {
    // Mark this participant as viewed
    await markParticipantAsViewed(applicant.ApplicationId);
    
    setSelectedApplicant(applicant);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedApplicant(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  // Check if a participant is new (not previously viewed)
  const isNewParticipant = (applicant) => {
    return !viewedParticipants.includes(applicant.ApplicationId);
  };

  // Check if participant was added after last viewed timestamp
  const isRecentParticipant = (applicant) => {
    if (!lastViewedTimestamp || !applicant.created_at) return false;
    const createdAt = new Date(applicant.created_at);
    return createdAt > lastViewedTimestamp;
  };

  const renderApplicantItem = ({ item }) => {
    const isNew = isNewParticipant(item);
    const isRecent = isRecentParticipant(item);
    
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
            onPress={() => handleViewMore(item)}
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
  };

  const renderDetailsModal = () => (
    <Modal
      visible={showDetails}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCloseDetails}
    >
      <View style={styles.detailsModalOverlay}>
        <View style={styles.detailsModalContent}>
          <View style={styles.detailsHeader}>
            <View style={styles.detailsTitleContainer}>
              <Text style={styles.detailsTitle}>Applicant Details</Text>
              {/* Remove the NEW badge from details modal since it's already been viewed */}
            </View>
            <TouchableOpacity
              style={styles.closeDetailsButton}
              onPress={handleCloseDetails}
            >
              <Text style={styles.closeDetailsButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsScrollView}>
            {selectedApplicant && (
              <>
                {/* Personal Information */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Full Name:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_Name || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Age:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_Age || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Civil Status:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_CivilStatus || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Contact Number:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_ContactNo || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Mailing Address:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_MailingAddress || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Highest Education:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_HighestEducationalAttainment || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Capitalization:</Text>
                    <Text style={styles.detailValue}>
                      ₱{selectedApplicant.Applicants_Capitalization?.toLocaleString() || "0"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Source of Capital:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_SourceOfCapital || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Previous Business:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_PreviousBusinessExperience || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Relatives in Market:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_RelativeStallOwner || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Proposed Trading:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_ProposeType || "Not provided"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>House Lot Address:</Text>
                    <Text style={styles.detailValue}>
                      {selectedApplicant.Applicants_HouseLocation || "Not provided"}
                    </Text>
                  </View>
                </View>

                {/* Spouse Information */}
                {selectedApplicant.SpouseInformation && selectedApplicant.SpouseInformation.length > 0 && (
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Spouse Information</Text>
                    {selectedApplicant.SpouseInformation.map((spouse, index) => (
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
                )}

                {/* Application Status */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Application Status</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[
                      styles.detailValue,
                      styles.statusText,
                      selectedApplicant.status === 'approved' && styles.approvedStatus,
                      selectedApplicant.status === 'rejected' && styles.rejectedStatus,
                      selectedApplicant.status === 'pending' && styles.pendingStatus,
                    ]}>
                      {selectedApplicant.status || "Pending"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Application Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedApplicant.created_at)}
                    </Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Participants for Stall #{stallNo}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Loading applicants...</Text>
              </View>
            ) : applicants.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No applicants found for this stall.
                </Text>
              </View>
            ) : (
              <FlatList
                data={applicants}
                renderItem={renderApplicantItem}
                keyExtractor={(item) => item.ApplicationId.toString()}
                style={styles.applicantsList}
                showsVerticalScrollIndicator={false}
              />
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.refreshButton} onPress={fetchApplicants}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {renderDetailsModal()}
    </>
  );
}

// New badge styles
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
  newBadgeDetails: {
    backgroundColor: "#FF4444",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  newBadgeTextDetails: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
};