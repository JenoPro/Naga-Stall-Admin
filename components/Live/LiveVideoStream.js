import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from "react-native";

let Camera;
if (Platform.OS !== "web") {
  Camera = require("expo-camera").Camera;
}

export default function LiveVideoStream({
  isLive,
  stallNo,
  stallLocation,
  stallImageUrl,
}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [cameraType, setCameraType] = useState(
    Platform.OS !== "web" ? Camera?.Constants?.Type?.back : "user"
  );
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  useEffect(() => {
    if (Platform.OS === "web") {
      setHasPermission(true);
    } else {
      (async () => {
        if (Camera) {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");
        }
      })();
    }
  }, []);
  useEffect(() => {
    return () => {
      if (stream && Platform.OS === "web") {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);
  useEffect(() => {
    if (isLive) {
      if (Platform.OS === "web") {
        startWebCamera();
      }
    } else {
      if (Platform.OS === "web") {
        stopWebCamera();
      }
    }
  }, [isLive]);

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

  const flipCamera = () => {
    if (Platform.OS === "web") {
      const newCameraType = cameraType === "user" ? "environment" : "user";
      setCameraType(newCameraType);
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

  const renderVideoContent = () => {
    if (isLive) {
      if (Platform.OS === "web") {
        return (
          <View style={styles.cameraContainer}>
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
            <View style={styles.cameraOverlay}>
              <View style={styles.liveIndicatorOverlay}>
                <View style={styles.liveCircleSmall}>
                  <View style={styles.liveDotSmall} />
                </View>
                <Text style={styles.liveTextOverlay}>🔴 LIVE</Text>
              </View>
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.flipButton}
                  onPress={flipCamera}
                >
                  <Text style={styles.flipButtonText}>↻</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.streamInfoOverlay}>
                <Text style={styles.streamInfoText}>
                  Broadcasting Stall {stallNo}
                </Text>
                <Text style={styles.streamLocationText}>{stallLocation}</Text>
              </View>
            </View>
          </View>
        );
      } else if (hasPermission && Camera) {
        return (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              type={cameraType}
              ref={(ref) => setCameraRef(ref)}
            >
              <View style={styles.cameraOverlay}>
                <View style={styles.liveIndicatorOverlay}>
                  <View style={styles.liveCircleSmall}>
                    <View style={styles.liveDotSmall} />
                  </View>
                  <Text style={styles.liveTextOverlay}>🔴 LIVE</Text>
                </View>
                <View style={styles.cameraControls}>
                  <TouchableOpacity
                    style={styles.flipButton}
                    onPress={flipCamera}
                  >
                    <Text style={styles.flipButtonText}>↻</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.streamInfoOverlay}>
                  <Text style={styles.streamInfoText}>
                    Broadcasting Stall {stallNo}
                  </Text>
                  <Text style={styles.streamLocationText}>{stallLocation}</Text>
                </View>
              </View>
            </Camera>
          </View>
        );
      } else {
        return (
          <View style={styles.permissionDenied}>
            <Text style={styles.permissionText}>
              Camera Permission Required
            </Text>
            <Text style={styles.permissionSubtext}>
              Please enable camera access to start live streaming
            </Text>
          </View>
        );
      }
    } else {
      return (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>Stream Offline</Text>
          <Text style={styles.offlineSubtext}>
            Click "Start Live" to begin broadcasting
          </Text>
          <Text style={styles.stallInfoText}>
            Stall {stallNo} • {stallLocation}
          </Text>

          {/* Show stall image when offline */}
          {stallImageUrl && (
            <View style={styles.stallImageContainer}>
              <Image
                source={{ uri: stallImageUrl }}
                style={styles.stallImageOffline}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.videoContainer}>
      <View style={styles.videoArea}>{renderVideoContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  videoArea: {
    backgroundColor: "#000000",
    borderRadius: 12,
    width: "90%",
    aspectRatio: 16 / 9,
    maxWidth: 600,
    alignSelf: "center",
    overflow: "hidden",
  },
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
});
