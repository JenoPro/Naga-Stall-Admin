import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import styles from "../../../../Styles/ManageStall";

const StallForm = ({ 
  stallData, 
  onStallDataChange, 
  onImagePick, 
  isSubmitting 
}) => {
  return (
    <ScrollView style={styles.formContainer}>
      <View style={styles.formRow}>
        <View style={styles.formColumn}>
          <Text style={styles.formLabel}>Stall Number:</Text>
          <TextInput
            style={styles.formInput}
            value={stallData.stallNo}
            onChangeText={(text) =>
              onStallDataChange({ ...stallData, stallNo: text })
            }
            placeholder="Enter stall number"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.formColumn}>
          <Text style={styles.formLabel}>Amount</Text>
          <TextInput
            style={styles.formInput}
            value={stallData.rentalPrice}
            onChangeText={(text) =>
              onStallDataChange({ ...stallData, rentalPrice: text })
            }
            placeholder="Enter rental price"
            keyboardType="numeric"
            editable={!isSubmitting}
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formColumn}>
          <Text style={styles.formLabel}>Location:</Text>
          <TextInput
            style={styles.formInput}
            value={stallData.stallLocation}
            onChangeText={(text) =>
              onStallDataChange({ ...stallData, stallLocation: text })
            }
            placeholder="Enter location"
            editable={!isSubmitting}
          />
        </View>

        <View style={styles.formColumn}>
          <Text style={styles.formLabel}>Size:</Text>
          <TextInput
            style={styles.formInput}
            value={stallData.size}
            onChangeText={(text) =>
              onStallDataChange({ ...stallData, size: text })
            }
            placeholder="Enter size"
            editable={!isSubmitting}
          />
        </View>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formColumn}>
          <Text style={styles.formLabel}>Stall Image</Text>
          <View style={styles.imageContainer}>
            {stallData.stallImage ? (
              <Image
                source={{ uri: stallData.stallImage }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text>No stall image selected</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={onImagePick}
              disabled={isSubmitting}
            >
              <Text style={styles.imagePickerText}>
                {stallData.stallImage
                  ? "Change Image"
                  : "Upload Stall Image"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default StallForm;