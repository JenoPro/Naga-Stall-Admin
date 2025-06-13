import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import AdminNavbar from "../components/AdminNavbar";
import supabase from "../config/supabaseClient";
import styles from "../Styles/ManageStall";

import UserHeader from "../components/ManagaUser/UserHeader";
import SearchAndFilter from "../components/ManagaUser/SearchAndFilter";
import UserTable from "../components/ManagaUser/UserTable";
import ImageModal from "../components/ManagaUser/ImageModal";
import {
  generateUsername,
  generatePassword,
  sortRegistrantData,
} from "../utils/userUtils";
import {
  sendCredentialsEmailWithRetry,
  sendStatusNotificationEmail,
} from "../services/emailServiceAccout";

export default function ManageUsersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [registrant, setRegistrant] = useState([]);
  const [filteredRegistrant, setFilteredRegistrant] = useState([]);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const applyFiltersAndSearch = (data, status, query) => {
    let result = data;
    if (status !== "all") {
      if (status === "pending") {
        result = data.filter(
          (item) => !item.status || item.status === "pending"
        );
      } else {
        result = data.filter((item) => item.status === status);
      }
    }

    if (query && query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(
        (item) =>
          (item.fullName || "").toLowerCase().includes(lowercaseQuery) ||
          (item.emailAddress || "").toLowerCase().includes(lowercaseQuery) ||
          (item.phoneNumber || "").toLowerCase().includes(lowercaseQuery)
      );
    }

    setFilteredRegistrant(result);
  };

  const fetchRegistrant = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Registrant").select();

      if (error) {
        console.log("❌ Supabase error:", error);
        Alert.alert("Error", "Failed to fetch users data");
      } else {
        console.log("✅ Fetched registrant:", data);
        const sortedData = sortRegistrantData(data || []);
        setRegistrant(sortedData);
        applyFiltersAndSearch(sortedData, statusFilter, searchQuery);
      }
    } catch (error) {
      console.log("❌ Error fetching data:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (userId) => {
    try {
      setEmailSending(true);

      const userData = registrant.find(
        (user) => user.registrationId === userId
      );
      if (!userData) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userEmail = userData.emailAddress;
      const userName = userData.fullName;

      const username = generateUsername();
      const password = generatePassword();

      console.log(`📝 Approving user ${userId}:`, {
        email: userEmail,
        name: userName,
        username,
        password,
      });

      const { data, error } = await supabase
        .from("Registrant")
        .update({
          status: "approved",
          userName: `{${username}}`,
          password: `{${password}}`,
        })
        .eq("registrationId", userId);

      if (error) {
        console.log("❌ Error updating database:", error);
        Alert.alert("Error", `Failed to approve user: ${error.message}`);
        return;
      }

      console.log("✅ Database updated successfully");

      const emailResult = await sendCredentialsEmailWithRetry(
        userEmail,
        username,
        password
      );

      if (emailResult.success) {
        Alert.alert(
          "Success",
          `User ${userName} approved and credentials sent to ${userEmail}`
        );
      } else {
        Alert.alert(
          "Partial Success",
          `User approved but email failed: ${emailResult.message}\n\nCredentials:\nUsername: ${username}\nPassword: ${password}`
        );
      }

      const updatedRegistrants = registrant.map((item) =>
        item.registrationId === userId
          ? {
              ...item,
              status: "approved",
              userName: [username],
              password: [password],
            }
          : item
      );

      const sortedData = sortRegistrantData(updatedRegistrants);
      setRegistrant(sortedData);
      applyFiltersAndSearch(sortedData, statusFilter, searchQuery);
    } catch (error) {
      console.log("❌ Unexpected error in handleAccept:", error);
      Alert.alert("Error", "An unexpected error occurred while approving user");
    } finally {
      setEmailSending(false);
    }
  };

  const handleResendCredentials = async (userId) => {
    try {
      setEmailSending(true);

      const userData = registrant.find(
        (user) => user.registrationId === userId
      );
      if (!userData) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userEmail = userData.emailAddress;
      const username = userData.userName;
      const password = userData.password;

      const cleanUsername = Array.isArray(username)
        ? username[0]
        : username?.replace(/[{}]/g, "");
      const cleanPassword = Array.isArray(password)
        ? password[0]
        : password?.replace(/[{}]/g, "");

      console.log("📧 Resending credentials:", {
        email: userEmail,
        username: cleanUsername,
        password: cleanPassword,
      });

      const result = await sendCredentialsEmailWithRetry(
        userEmail,
        cleanUsername,
        cleanPassword
      );

      if (result.success) {
        Alert.alert("Success", result.message);
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.log("❌ Error resending credentials:", error);
      Alert.alert("Error", "Failed to resend credentials");
    } finally {
      setEmailSending(false);
    }
  };

  const handleDecline = async (userId) => {
    try {
      setEmailSending(true);

      const userData = registrant.find(
        (user) => user.registrationId === userId
      );
      if (!userData) {
        Alert.alert("Error", "User data not found");
        return;
      }

      const userEmail = userData.emailAddress;
      const userName = userData.fullName;

      const { error } = await supabase
        .from("Registrant")
        .update({ status: "declined" })
        .eq("registrationId", userId);

      if (error) {
        console.log("❌ Error declining user:", error);
        Alert.alert("Error", `Failed to decline user: ${error.message}`);
        return;
      }

      const emailResult = await sendStatusNotificationEmail(
        userEmail,
        userName,
        "declined"
      );

      if (emailResult.success) {
        Alert.alert(
          "Success",
          `User ${userName} declined and notification sent to ${userEmail}`
        );
      } else {
        Alert.alert(
          "Partial Success",
          `User declined but email notification failed: ${emailResult.message}`
        );
      }

      const updatedRegistrants = registrant.map((item) =>
        item.registrationId === userId ? { ...item, status: "declined" } : item
      );

      const sortedData = sortRegistrantData(updatedRegistrants);
      setRegistrant(sortedData);
      applyFiltersAndSearch(sortedData, statusFilter, searchQuery);
    } catch (error) {
      console.log("❌ Unexpected error:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setEmailSending(false);
    }
  };

  const handleViewImage = (imageUrl, userName) => {
    setSelectedImage({ url: imageUrl, userName: userName });
    setImageModalVisible(true);
  };

  useEffect(() => {
    fetchRegistrant();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch(registrant, statusFilter, searchQuery);
  }, [searchQuery, registrant, statusFilter]);

  return (
    <View style={styles.container}>
      <AdminNavbar activeId="users" />

      <View style={styles.content}>
        <UserHeader onRefresh={fetchRegistrant} />

        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <UserTable
          data={filteredRegistrant}
          loading={loading}
          emailSending={emailSending}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onViewImage={handleViewImage}
          onResendCredentials={handleResendCredentials}
        />

        <ImageModal
          visible={imageModalVisible}
          selectedImage={selectedImage}
          onClose={() => setImageModalVisible(false)}
        />
      </View>
    </View>
  );
}
