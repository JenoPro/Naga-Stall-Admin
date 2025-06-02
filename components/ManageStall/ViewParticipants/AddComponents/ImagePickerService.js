import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export const pickStallImage = async () => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to grant image library permissions to upload an image."
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  } catch (error) {
    console.log("❌ Error picking image:", error);
    Alert.alert("Error", "Failed to select image");
    return null;
  }
};