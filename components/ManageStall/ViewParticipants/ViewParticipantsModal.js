import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from "../../../config/supabaseClient";
import styles from "../../../Styles/ViewParticipantsModal";
import ApplicantItem from "./viewModal/ApplicantItem";
import ApplicantDetailsModal from "./viewModal/ApplicantDetailsModal";

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
    await markParticipantAsViewed(applicant.ApplicationId);
    setSelectedApplicant(applicant);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedApplicant(null);
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

  const renderApplicantItem = ({ item }) => (
    <ApplicantItem
      item={item}
      isNew={isNewParticipant(item)}
      isRecent={isRecentParticipant(item)}
      onViewMore={() => handleViewMore(item)}
    />
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

      <ApplicantDetailsModal
        visible={showDetails}
        applicant={selectedApplicant}
        onClose={handleCloseDetails}
      />
    </>
  );
}