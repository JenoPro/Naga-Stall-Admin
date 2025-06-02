import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AdminNavbar from "../components/AdminNavbar"; // Adjust path if needed
import supabase from "../config/supabaseClient";
import StallTableRow from "../components/ManageStall/StallTableRow";
import ImagePreviewModal from "../components/ManageStall/ImagePreviewModal";
import AddStallModal from "../components/ManageStall/AddStallModal";
import styles from "../Styles/ManageStall";

export default function StallScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stalls, setStalls] = useState([]);
  const [filteredStalls, setFilteredStalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [addStallModalVisible, setAddStallModalVisible] = useState(false);

  // New state for participants data
  const [participantsData, setParticipantsData] = useState({});

  // Function to fetch participants for a specific stall
  const fetchParticipants = async (stallId) => {
    try {
      // Fixed: Using stallNo instead of stallId to match database schema
      const { data, error } = await supabase
        .from("Application") // Adjust table name as needed
        .select("*")
        .eq("stallNo", stallId) // FIXED: Changed from stallId to stallNo
        .eq("status", "pending"); // Or whatever status indicates active applications

      if (error) {
        console.log("❌ Error fetching participants:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching participants:", error);
      return [];
    }
  };

  // Function to fetch all participants data for all stalls
  const fetchAllParticipantsData = async () => {
    try {
      const participantsMap = {};

      // Fetch participants for each stall
      for (const stall of stalls) {
        // Fixed: Using stallId instead of stallId
        const participants = await fetchParticipants(stall.stallId);
        participantsMap[stall.stallId] = participants; // Changed key to stallId
      }

      setParticipantsData(participantsMap);
    } catch (error) {
      console.error("Error fetching all participants data:", error);
    }
  };

  // Function to sort stalls by participant count (highest first)
  const sortStallsByParticipants = (stallsToSort) => {
    return [...stallsToSort].sort((a, b) => {
      const aParticipants = participantsData[a.stallId] || [];
      const bParticipants = participantsData[b.stallId] || [];

      // Sort by participant count descending (most participants first)
      const participantDiff = bParticipants.length - aParticipants.length;

      // If participant counts are equal, sort by stallId ascending as secondary sort
      if (participantDiff === 0) {
        return (a.stallId || 0) - (b.stallId || 0);
      }

      return participantDiff;
    });
  };

  // Apply both status filter and search query with sorting
  const applyFiltersAndSearch = (data, status, query) => {
    let result = data;

    // Apply status filter
    if (status !== "all") {
      result = data.filter((item) => item.status === status);
    }

    // Apply search query
    if (query && query.trim() !== "") {
      const lowercaseQuery = query.toLowerCase();
      result = result.filter(
        (item) =>
          (item.stallId || "")
            .toString()
            .toLowerCase()
            .includes(lowercaseQuery) ||
          (item.stallLocation || "").toLowerCase().includes(lowercaseQuery)
      );
    }

    // Sort by participant count (only if we have participant data)
    if (Object.keys(participantsData).length > 0) {
      result = sortStallsByParticipants(result);
    }

    setFilteredStalls(result);
  };

  // Fetch data from Supabase
  const fetchStalls = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("Stall").select();
      if (error) {
        console.log("❌ Supabase error:", error);
        Alert.alert("Error", "Failed to fetch stalls data");
      } else {
        console.log("✅ Fetched stalls:", data);
        const sortedData = data || [];
        setStalls(sortedData);
        // Initial filter/search application without sorting (since participants data isn't loaded yet)
        let result = sortedData;
        if (statusFilter !== "all") {
          result = sortedData.filter((item) => item.status === statusFilter);
        }
        if (searchQuery && searchQuery.trim() !== "") {
          const lowercaseQuery = searchQuery.toLowerCase();
          result = result.filter(
            (item) =>
              (item.stallId || "")
                .toString()
                .toLowerCase()
                .includes(lowercaseQuery) ||
              (item.stallLocation || "").toLowerCase().includes(lowercaseQuery)
          );
        }
        setFilteredStalls(result);
      }
    } catch (error) {
      console.log("❌ Error fetching data:", error);
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh both stalls and participants data
  const refreshData = async () => {
    await fetchStalls();
    // fetchAllParticipantsData will be called in the useEffect when stalls are updated
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  // Fetch participants data when stalls are loaded and set up auto-refresh for participants only
  useEffect(() => {
    if (stalls.length > 0) {
      fetchAllParticipantsData();

      // Set up periodic refresh for participants data only
      const interval = setInterval(() => {
        fetchAllParticipantsData();
      }, 1000); // Refresh every 1 second

      return () => clearInterval(interval);
    }
  }, [stalls]);

  // Re-apply filters and sorting when participants data changes
  useEffect(() => {
    if (Object.keys(participantsData).length > 0 && stalls.length > 0) {
      applyFiltersAndSearch(stalls, statusFilter, searchQuery);
    }
  }, [participantsData]);

  // Auto-search effect - triggers when searchQuery changes
  useEffect(() => {
    if (stalls.length > 0) {
      applyFiltersAndSearch(stalls, statusFilter, searchQuery);
    }
  }, [searchQuery, statusFilter]); // Added statusFilter dependency to ensure consistency

  // Handle search input change (now triggers automatic search)
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    // The useEffect above will automatically trigger the search
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    // The useEffect will handle the filtering automatically
  };

  // Get image URL from Supabase storage
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const { data } = supabase.storage
      .from("stall-image")
      .getPublicUrl(imagePath);
    return data?.publicUrl;
  };

  // Handle view image
  const handleViewImage = (imagePath) => {
    const imageUrl = getImageUrl(imagePath);
    setSelectedImage({ url: imageUrl });
    setImageModalVisible(true);
  };

  // Handle edit stall - Updated to refresh data after edit
  const handleEditStall = async (stallId) => {
    Alert.alert("Edit Stall", `Edit stall with ID: ${stallId}`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Edit",
        onPress: async () => {
          // Add your edit logic here
          // After successful edit, refresh the data
          await refreshData();
          Alert.alert("Success", "Stall has been updated");
        },
      },
    ]);
  };

  // Handle remove stall - Updated to refresh data after removal
  const handleRemoveStall = (stallId) => {
    Alert.alert("Remove Stall", "Are you sure you want to remove this stall?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const stallToDelete = stalls.find(
              (stall) => stall.stallId === stallId
            );
            const { error } = await supabase
              .from("Stall")
              .delete()
              .eq("stallId", stallId);
            if (error) {
              console.log("❌ Error removing stall:", error);
              Alert.alert("Error", `Failed to remove stall: ${error.message}`);
            } else {
              if (stallToDelete?.stallImage) {
                const { error: storageError } = await supabase.storage
                  .from("stall-image")
                  .remove([stallToDelete.stallImage]);
                if (storageError) {
                  console.log("⚠️ Error removing stall image:", storageError);
                }
              }
              
              // Refresh data after successful deletion
              await refreshData();
              Alert.alert("Success", "Stall has been removed");
            }
          } catch (error) {
            console.log("❌ Unexpected error:", error);
            Alert.alert("Error", "An unexpected error occurred");
          }
        },
      },
    ]);
  };

  // Handle view participants
  const handleViewParticipants = (stallId) => {
    Alert.alert(
      "View Participants",
      `View participants for stall ID: ${stallId}`
    );
  };

  // Handle Go Live for raffle
  const handleGoLive = (stallId) => {
    Alert.alert("Go Live", `Starting raffle for stall ID: ${stallId}`);
  };

  // Handle opening add stall modal
  const handleAddStall = () => {
    setAddStallModalVisible(true);
  };

  // Handle successful stall addition - Updated to refresh data
  const handleStallAdded = async (newStallData) => {
    setAddStallModalVisible(false);
    // Refresh data after adding new stall
    await refreshData();
    Alert.alert("Success", "Stall has been added successfully");
  };

  return (
    <View style={styles.container}>
      <AdminNavbar activeId="stalls" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Manage Stall</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddStall}>
            <Text style={styles.addButtonText}>Add Available Stall</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchFilterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search Stalls..."
              value={searchQuery}
              onChangeText={handleSearchChange} // Updated to use the new handler
            />
            {/* Removed the search button since search is now automatic */}
          </View>
          <View style={styles.filterContainer}>
            <Picker
              selectedValue={statusFilter}
              style={styles.filterPicker}
              onValueChange={handleFilterChange}
            >
              <Picker.Item label="Filter" value="all" />
              <Picker.Item label="Active" value="available" />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Raffled" value="raffled" />
            </Picker>
          </View>
        </View>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, styles.imageCell]}>Image</Text>
          <Text style={[styles.tableHeaderCell, styles.stallIdCell]}>
            Stall No.
          </Text>
          <Text style={[styles.tableHeaderCell, styles.locationCell]}>
            Location
          </Text>
          <Text style={[styles.tableHeaderCell, styles.sizeCell]}>Size</Text>
          <Text style={[styles.tableHeaderCell, styles.amountCell]}>
            Amount
          </Text>
          <Text style={[styles.tableHeaderCell, styles.dateCell]}>
            Date of Raffle
          </Text>
          <Text style={[styles.tableHeaderCell, styles.applicantsCell]}>
            Applicants
          </Text>
          <Text style={[styles.tableHeaderCell, styles.actionsCell]}>
            Actions
          </Text>
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading data...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStalls}
            renderItem={({ item }) => (
              <StallTableRow
                item={item}
                getImageUrl={getImageUrl}
                onViewImage={handleViewImage}
                onEditStall={handleEditStall}
                onRemoveStall={handleRemoveStall}
                onViewParticipants={handleViewParticipants}
                onGoLive={handleGoLive}
                // New props for participant notifications
                fetchParticipants={fetchParticipants}
                participantsData={participantsData}
              />
            )}
            keyExtractor={(item) => item.stallId.toString()}
            style={styles.tableContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No stalls found</Text>
              </View>
            }
          />
        )}
        <ImagePreviewModal
          visible={imageModalVisible}
          selectedImage={selectedImage}
          onClose={() => setImageModalVisible(false)}
        />
        <AddStallModal
          visible={addStallModalVisible}
          onClose={() => setAddStallModalVisible(false)}
          onStallAdded={handleStallAdded}
        />
      </View>
    </View>
  );
}