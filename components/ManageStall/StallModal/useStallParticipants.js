import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useStallParticipants(
  item,
  fetchParticipants,
  participantsData,
  setShowParticipantsModal
) {
  const [participants, setParticipants] = useState([]);
  const [lastViewedCount, setLastViewedCount] = useState(0);
  const [newParticipantsCount, setNewParticipantsCount] = useState(0);

  // AsyncStorage helpers
  const getViewedCountKey = (stallId) => `stall_${stallId}_viewed_count`;

  const loadViewedCount = async (stallId) => {
    try {
      const key = getViewedCountKey(stallId);
      const value = await AsyncStorage.getItem(key);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error("Error loading viewed count:", error);
      return 0;
    }
  };

  const saveViewedCount = async (stallId, count) => {
    try {
      const key = getViewedCountKey(stallId);
      await AsyncStorage.setItem(key, count.toString());
    } catch (error) {
      console.error("Error saving viewed count:", error);
    }
  };

  // Load participants data
  useEffect(() => {
    const loadParticipants = async () => {
      try {
        let participantList = [];
        if (fetchParticipants && typeof fetchParticipants === "function") {
          participantList = await fetchParticipants(item.stallId);
        } else if (participantsData && participantsData[item.stallId]) {
          participantList = participantsData[item.stallId];
        }

        setParticipants(participantList);

        const savedViewedCount = await loadViewedCount(item.stallId);
        setLastViewedCount(savedViewedCount);

        const currentCount = participantList.length;
        const newCount = Math.max(0, currentCount - savedViewedCount);
        setNewParticipantsCount(newCount);
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    loadParticipants();
  }, [item.stallId, participantsData, fetchParticipants]);

  const handleViewParticipants = () => {
    setShowParticipantsModal(true);
  };

  const handleCloseParticipantsModal = async () => {
    setShowParticipantsModal(false);
    const currentParticipantCount = participants.length;
    setLastViewedCount(currentParticipantCount);
    setNewParticipantsCount(0);
    await saveViewedCount(item.stallId, currentParticipantCount);
  };

  return {
    participants,
    newParticipantsCount,
    handleViewParticipants,
    handleCloseParticipantsModal,
  };
}