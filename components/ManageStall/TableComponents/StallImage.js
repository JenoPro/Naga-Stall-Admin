import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import styles from "../../../Styles/ManageStall";

export default function StallImage({ stallImage, getImageUrl, onViewImage }) {
  return (
    <View style={[styles.tableCell, styles.imageCell]}>
      {stallImage ? (
        <TouchableOpacity onPress={() => onViewImage(stallImage)}>
          <Image
            source={{ uri: getImageUrl(stallImage) }}
            style={styles.stallImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}
    </View>
  );
}