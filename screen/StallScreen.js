import React, { useState, useEffect } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import AdminNavbar from "../components/AdminNavbar";
import supabase from "../config/supabaseClient";
import StallTableRow from "../components/ManageStall/StallTableRow";
import ImagePreviewModal from "../components/ManageStall/ImagePreviewModal";
import AddStallModal from "../components/ManageStall/AddStallModal";
import StallHeader from "./StallModal/StallHeader";
import StallSearchFilter from "./StallModal/StallSearchFilter";
import StallTableHeader from "./StallModal/StallTableHeader";
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
  const [participantsData, setParticipantsData] = useState({});

  // Function to fetch participants for a specific stall
  const fetchParticipants = async (stallId) => {
    try {
      const { data, error } = await supabase
        .from("Application")
        .select("*")
        .eq("stallNo", stallId)
        .eq("status", "pending");

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

      for (const stall of stalls) {
        const participants = await fetchParticipants(stall.stallId);
        participantsMap[stall.stallId] = participants;
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

      const participantDiff = bParticipants.length - aParticipants.length;

      if (participantDiff === 0) {
        return (a.stallId || 0) - (b.stallId || 0);
      }

      return participantDiff;
    });
  };

  // Apply both status filter and search query with sorting
  const applyFiltersAndSearch = (data, status, query) => {
    let result = data;

    if (status !== "all") {
      result = data.filter((item) => item.status === status);
    }

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
  };

  useEffect(() => {
    fetchStalls();
  }, []);

  useEffect(() => {
    if (stalls.length > 0) {
      fetchAllParticipantsData();

      const interval = setInterval(() => {
        fetchAllParticipantsData();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [stalls]);

  useEffect(() => {
    if (Object.keys(participantsData).length > 0 && stalls.length > 0) {
      applyFiltersAndSearch(stalls, statusFilter, searchQuery);
    }
  }, [participantsData]);

  useEffect(() => {
    if (stalls.length > 0) {
      applyFiltersAndSearch(stalls, statusFilter, searchQuery);
    }
  }, [searchQuery, statusFilter]);

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  // Handle filter change
  const handleFilterChange = (value) => {
    setStatusFilter(value);
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

  // Handle edit stall
  const handleEditStall = async (stallId) => {
    Alert.alert("Edit Stall", `Edit stall with ID: ${stallId}`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Edit",
        onPress: async () => {
          await refreshData();
          Alert.alert("Success", "Stall has been updated");
        },
      },
    ]);
  };

  // Handle remove stall
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

  // Handle successful stall addition
  const handleStallAdded = async (newStallData) => {
    setAddStallModalVisible(false);
    await refreshData();
    Alert.alert("Success", "Stall has been added successfully");
  };

  return (
    <View style={styles.container}>
      <AdminNavbar activeId="stalls" />
      <View style={styles.content}>
        <StallHeader onAddStall={handleAddStall} />
        
        <StallSearchFilter
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        <StallTableHeader />

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