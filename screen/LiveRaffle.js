import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import LiveHeader from "../components/Live/LiveHeader";
import LiveVideoStream from "../components/Live/LiveVideoStream";
import LiveParticipantsInfo from "../components/Live/LiveParticipantsInfo";
import LiveChat from "../components/Live/LiveChat";

export default function LiveRaffle({
  visible,
  onClose,
  stallData,
  stallNo,
  stallLocation,
  stallSize,
  rentalPrice,
  stallImage,
  getImageUrl,
  participants = [],
  timerRunning = false,
  timerPaused = false,
}) {
  const [chatMessages, setChatMessages] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);

  useEffect(() => {
    if (visible) {
      const sampleMessages = [
        {
          id: 1,
          user: "Admin",
          message: `Good Luck Everyone! win ${stallNo}!`,
          timestamp: new Date(),
        },
      ];
      setChatMessages(sampleMessages);

      setViewerCount(
        participants.length || Math.floor(Math.random() * 50) + 10
      );
    }
  }, [visible, stallNo, stallLocation, participants.length]);

  const handleToggleLive = async (success) => {
    if (!isLive && success !== false) {
      setIsLive(true);

      setViewerCount((prev) => prev + Math.floor(Math.random() * 20) + 5);
      Alert.alert("Live Stream", `Stall ${stallNo} is now live!`);
    } else if (isLive) {
      setIsLive(false);
      Alert.alert("Live Stream", "Stream has been stopped");
    }
  };

  const handleSendMessage = (message) => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        user: "Admin",
        message: message,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, newMessage]);
    }
  };

  const getRaffleStatus = () => {
    if (timerRunning && !timerPaused) {
      return "Raffle is Live!";
    } else if (timerPaused) {
      return "Raffle Paused";
    } else {
      return "Raffle Ready to Start";
    }
  };

  const getStallImageUrl = () => {
    if (stallImage && getImageUrl) {
      return getImageUrl(stallImage);
    }
    return null;
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        <LiveHeader
          onClose={onClose}
          stallNo={stallNo}
          stallLocation={stallLocation}
          stallSize={stallSize}
          rentalPrice={rentalPrice}
          isLive={isLive}
          onToggleLive={handleToggleLive}
          raffleStatus={getRaffleStatus()}
          timerRunning={timerRunning}
        />

        <LiveVideoStream
          isLive={isLive}
          stallNo={stallNo}
          stallLocation={stallLocation}
          stallImageUrl={getStallImageUrl()}
        />

        <LiveParticipantsInfo
          participantCount={participants.length}
          viewerCount={viewerCount}
          isLive={isLive}
        />

        <LiveChat messages={chatMessages} onSendMessage={handleSendMessage} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});
