import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    marginLeft: 80, // Fixed space for the navbar
    padding: 20,
  },
  header: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#002366",
  },
  refreshButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  addButtonText: {
    color: "#002366",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  searchFilterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    flex: 2,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  searchButton: {
    backgroundColor: "#002366",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  filterContainer: {
    flex: 1,
  },
  filterPicker: {
    height: 40,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 3,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#002366",
    padding: 10,
  },
  tableHeaderCell: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    alignItems: "center",
    textAlign: "center", // Centers the text horizontally
    justifyContent: "center", // Centers the content vertically
  },
  tableContent: {
    backgroundColor: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 10,
  },
  tableCell: {
    fontSize: 14,
    padding: 5,
    justifyContent: "center",
  },

  // USER MANAGEMENT TABLE CELLS - ADD THESE
  idCell: {
    width: "8%",
  },
  nameCell: {
    width: "18%",
  },
  emailCell: {
    width: "20%",
  },
  phoneCell: {
    width: "15%",
  },
  addressCell: {
    width: "20%",
  },
  validCell: {
    width: "10%",
    alignItems: "center",
  },

  // STALL MANAGEMENT TABLE CELLS
   imageCell: {
    width: "10%",
    alignItems: "center",
  },
  stallNoCell: {
    width: "8%",
    alignItems: "center", // Center stall number
  },
  locationCell: {
    width: "15%",
  },
  sizeCell: {
    width: "10%",
    alignItems: "center", // Center size
  },
  amountCell: {
    width: "10%",
    alignItems: "center", // Center amount
  },
  dateCell: {
    width: "10%",
    alignItems: "center", // Center date
  },
  applicantsCell: {
    width: "17%",
    alignItems: "center", // Center applicants column
    justifyContent: "center",
  },

  // SHARED ACTION CELL
  actionsCell: {
    width: "20%",
    flexDirection: "row",
    justifyContent: "center", // Changed from space-around to center
    alignItems: "center",
  },
  // User management specific styles
  noIdText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  acceptedContainer: {
    alignItems: "center",
  },
  acceptedText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 5,
  },
  declinedText: {
    color: "#F44336",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginRight: 5,
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  declineButton: {
    backgroundColor: "#F44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  declineButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  resendButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
  },
  resendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 10,
  },

  stallImage: {
    width: 60,
    height: 60,
    borderRadius: 4,
  },
  noImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    fontSize: 10,
    color: "#999",
  },
  viewButton: {
    backgroundColor: "#3B6FE2",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginRight: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  removeButton: {
    backgroundColor: "#F44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  goLiveButton: {
    backgroundColor: "#002366",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  goLiveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  // Modal styles - general
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    width: "80%",
    maxWidth: 600,
    maxHeight: "90%",
  },
  modalHeader: {
    backgroundColor: "#002366",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Image preview modal
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  fullImage: {
    width: "100%",
    height: 400,
    borderRadius: 4,
  },
  doneButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    margin: 15,
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  // Add stall form styles
  formContainer: {
    padding: 20,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  formColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#002366",
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 3,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  datePickerButton: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 3,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  datePickerButtonText: {
    color: "#333",
  },
  imagePickerButton: {
    height: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 3,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  imagePickerText: {
    color: "#002366",
    fontWeight: "bold",
    flex: 1,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 3,
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
    margin: 15,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // Lighter green
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    flex: 1,
    // your existing formInput styles
  },
  timePickerButton: {
    marginLeft: 8,
    padding: 8,
  },
  timeHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  participantsButtonContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  imagePickerText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default styles;