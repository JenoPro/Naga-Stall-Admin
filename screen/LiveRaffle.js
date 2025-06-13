import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from "react-native";
// Only import Camera for native platforms
let Camera;
if (Platform.OS !== "web") {
  Camera = require("expo-camera").Camera;
}

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
  const [newMessage, setNewMessage] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraType, setCameraType] = useState(
    Platform.OS !== "web" ? Camera?.Constants?.Type?.back : "user"
  );
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const scrollViewRef = useRef(null);

  // Request camera permissions
  useEffect(() => {
    if (Platform.OS === "web") {
      // Web camera permission handling
      setHasPermission(true); // We'll check this when starting the stream
    } else {
      // Native camera permission handling
      (async () => {
        if (Camera) {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        }
      })();
    }
  }, []);

  // Initialize with some sample messages and participant data
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

      // Set initial viewer count based on participants
      setViewerCount(
        participants.length || Math.floor(Math.random() * 50) + 10
      );
    }
  }, [visible, stallNo, stallLocation, participants.length]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream && Platform.OS === "web") {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startWebCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraType === "user" ? "user" : "environment",
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: true,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
        };
      }
      return true;
    } catch (error) {
      console.error("Error accessing camera:", error);
      Alert.alert(
        "Camera Error",
        "Unable to access camera. Please check permissions."
      );
      return false;
    }
  };

  const stopWebCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: "Admin",
        message: newMessage,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleToggleLive = async () => {
    if (!isLive) {
      // Starting live stream
      if (Platform.OS === "web") {
        const success = await startWebCamera();
        if (!success) return;
      } else {
        // Native platform handling
        if (hasPermission === null && Camera) {
          Alert.alert("Permission", "Requesting camera permission...");
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");

          if (status !== "granted") {
            Alert.alert(
              "Permission Denied",
              "Camera access is required to start live streaming."
            );
            return;
          }
        } else if (hasPermission === false) {
          Alert.alert(
            "Permission Denied",
            "Camera access is required to start live streaming. Please enable camera permissions in your device settings."
          );
          return;
        }
      }

      setIsLive(true);
      // Simulate viewer increase when going live
      setViewerCount((prev) => prev + Math.floor(Math.random() * 20) + 5);
      Alert.alert("Live Stream", `Stall ${stallNo} is now live!`);
    } else {
      // Stopping live stream
      if (Platform.OS === "web") {
        stopWebCamera();
      }
      setIsLive(false);
      Alert.alert("Live Stream", "Stream has been stopped");
    }
  };

  const flipCamera = () => {
    if (Platform.OS === "web") {
      const newCameraType = cameraType === "user" ? "environment" : "user";
      setCameraType(newCameraType);

      // Restart camera with new facing mode
      if (stream) {
        stopWebCamera();
        setTimeout(() => {
          setCameraType(newCameraType);
          startWebCamera();
        }, 100);
      }
    } else if (Camera) {
      setCameraType(
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStallImageUrl = () => {
    if (stallImage && getImageUrl) {
      return getImageUrl(stallImage);
    }
    return null;
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

  const renderVideoContent = () => {
    if (isLive) {
      if (Platform.OS === "web") {
        return (
          <View style={liveStyles.cameraContainer}>
            <video
              ref={videoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 12,
                backgroundColor: "#000",
              }}
              autoPlay
              muted
              playsInline
            />
            <View style={liveStyles.cameraOverlay}>
              {/* Live indicator */}
              <View style={liveStyles.liveIndicatorOverlay}>
                <View style={liveStyles.liveCircleSmall}>
                  <View style={liveStyles.liveDotSmall} />
                </View>
                <Text style={liveStyles.liveTextOverlay}>🔴 LIVE</Text>
              </View>

              {/* Camera controls */}
              <View style={liveStyles.cameraControls}>
                <TouchableOpacity
                  style={liveStyles.flipButton}
                  onPress={flipCamera}
                >
                  <Text style={liveStyles.flipButtonText}>↻</Text>
                </TouchableOpacity>
              </View>

              {/* Stream info overlay */}
              <View style={liveStyles.streamInfoOverlay}>
                <Text style={liveStyles.streamInfoText}>
                  Broadcasting Stall {stallNo}
                </Text>
                <Text style={liveStyles.streamLocationText}>
                  {stallLocation}
                </Text>
              </View>
            </View>
          </View>
        );
      } else if (hasPermission && Camera) {
        return (
          <View style={liveStyles.cameraContainer}>
            <Camera
              style={liveStyles.camera}
              type={cameraType}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={liveStyles.cameraOverlay}>
                {/* Live indicator */}
                <View style={liveStyles.liveIndicatorOverlay}>
                  <View style={liveStyles.liveCircleSmall}>
                    <View style={liveStyles.liveDotSmall} />
                  </View>
                  <Text style={liveStyles.liveTextOverlay}>🔴 LIVE</Text>
                </View>

                {/* Camera controls */}
                <View style={liveStyles.cameraControls}>
                  <TouchableOpacity
                    style={liveStyles.flipButton}
                    onPress={flipCamera}
                  >
                    <Text style={liveStyles.flipButtonText}>↻</Text>
                  </TouchableOpacity>
                </View>

                {/* Stream info overlay */}
                <View style={liveStyles.streamInfoOverlay}>
                  <Text style={liveStyles.streamInfoText}>
                    Broadcasting Stall {stallNo}
                  </Text>
                  <Text style={liveStyles.streamLocationText}>
                    {stallLocation}
                  </Text>
                </View>
              </View>
            </Camera>
          </View>
        );
      } else {
        return (
          <View style={liveStyles.permissionDenied}>
            <Text style={liveStyles.permissionText}>
              Camera Permission Required
            </Text>
            <Text style={liveStyles.permissionSubtext}>
              Please enable camera access to start live streaming
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View style={liveStyles.offlineIndicator}>
          <Text style={liveStyles.offlineText}>Stream Offline</Text>
          <Text style={liveStyles.offlineSubtext}>
            Click "Start Live" to begin broadcasting
          </Text>
          <Text style={liveStyles.stallInfoText}>
            Stall {stallNo} • {stallLocation}
          </Text>

          {/* Show stall image when offline */}
          {getStallImageUrl() && (
            <View style={liveStyles.stallImageContainer}>
              <Image
                source={{ uri: getStallImageUrl() }}
                style={liveStyles.stallImageOffline}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={liveStyles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

        {/* Header */}
        <View style={liveStyles.header}>
          <View style={liveStyles.headerLeft}>
            <TouchableOpacity style={liveStyles.backButton} onPress={onClose}>
              <Text style={liveStyles.backButtonText}>←</Text>
            </TouchableOpacity>
            <View style={liveStyles.headerInfo}>
              <Text style={liveStyles.stallTitle}>Stall {stallNo}</Text>
              <View style={liveStyles.stallDetails}>
                <Text style={liveStyles.stallDetailText}>
                  📍 {stallLocation} • {stallSize} • ₱{rentalPrice}
                </Text>
              </View>
              <View style={liveStyles.statusContainer}>
                <Text style={liveStyles.statusLabel}>Status: </Text>
                <Text
                  style={[
                    liveStyles.statusText,
                    { color: timerRunning ? "#10B981" : "#F59E0B" },
                  ]}
                >
                  {getRaffleStatus()}
                </Text>
              </View>
            </View>
          </View>

          <View style={liveStyles.headerRight}>
            <TouchableOpacity
              style={[
                liveStyles.liveButton,
                { backgroundColor: isLive ? "#DC2626" : "#10B981" },
              ]}
              onPress={handleToggleLive}
            >
              <Text style={liveStyles.liveButtonText}>
                {isLive ? "Stop Live" : "Start Live"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Video Stream Area */}
        <View style={liveStyles.videoContainer}>
          <View style={liveStyles.videoArea}>{renderVideoContent()}</View>
        </View>

        {/* Participants Info */}
        <View style={liveStyles.participantsInfo}>
          <Text style={liveStyles.participantsText}>
            👥 {participants.length} Participants Registered
            {isLive && ` • 👁️ ${viewerCount} viewers`}
          </Text>
        </View>

        {/* Chat Section */}
        <View style={liveStyles.chatSection}>
          <View style={liveStyles.chatContainer}>
            <View style={liveStyles.chatHeader}>
              <Text style={liveStyles.chatTitle}>Live Chat</Text>
              <Text style={liveStyles.chatSubtitle}>
                {chatMessages.length} messages
              </Text>
            </View>

            {/* Chat Messages */}
            <ScrollView
              ref={scrollViewRef}
              style={liveStyles.chatMessages}
              showsVerticalScrollIndicator={false}
            >
              {chatMessages.map((msg) => (
                <View key={msg.id} style={liveStyles.messageContainer}>
                  <View style={liveStyles.messageAvatar}>
                    <Text style={liveStyles.avatarText}>
                      {msg.user.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={liveStyles.messageContent}>
                    <View style={liveStyles.messageHeader}>
                      <Text style={liveStyles.messageUser}>{msg.user}</Text>
                      <Text style={liveStyles.messageTime}>
                        {formatTime(msg.timestamp)}
                      </Text>
                    </View>
                    <Text style={liveStyles.messageText}>{msg.message}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Chat Input */}
            <View style={liveStyles.chatInput}>
              <TextInput
                style={liveStyles.textInput}
                value={newMessage}
                onChangeText={setNewMessage}
                placeholder="Comment as Admin"
                placeholderTextColor="#9CA3AF"
                multiline={false}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={liveStyles.sendButton}
                onPress={handleSendMessage}
              >
                <Text style={liveStyles.sendButtonText}>SEND</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const liveStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
  },
  headerInfo: {
    flex: 1,
  },
  stallTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  stallDetails: {
    marginTop: 2,
  },
  stallDetailText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  liveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  liveButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  videoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  videoArea: {
    backgroundColor: "#000000",
    borderRadius: 12,
    width: "90%",
    aspectRatio: 16 / 9, // Set to widescreen
    maxWidth: 600, // Optional: sets a reasonable max width
    alignSelf: "center",
    overflow: "hidden",
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  liveIndicatorOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveCircleSmall: {
    width: 12,
    height: 12,
    backgroundColor: "#DC2626",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  liveDotSmall: {
    width: 6,
    height: 6,
    backgroundColor: "#ffffff",
    borderRadius: 3,
  },
  liveTextOverlay: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cameraControls: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  flipButtonText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  streamInfoOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  streamInfoText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  streamLocationText: {
    color: "#D1D5DB",
    fontSize: 12,
  },
  // Permission denied styles
  permissionDenied: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "#DC2626",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  permissionSubtext: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  // Offline styles
  offlineIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  offlineText: {
    color: "#9CA3AF",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  offlineSubtext: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 8,
  },
  stallInfoText: {
    color: "#6B7280",
    fontSize: 12,
    marginBottom: 16,
  },
  stallImageContainer: {
    marginTop: 16,
  },
  stallImageOffline: {
    width: 120,
    height: 80,
    borderRadius: 8,
    opacity: 0.7,
  },
  participantsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  participantsText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  chatSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chatContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    flex: 1,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  chatSubtitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  chatMessages: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  messageAvatar: {
    width: 24,
    height: 24,
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  messageUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  messageText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  chatInput: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
});
