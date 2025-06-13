import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  // Main Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.9,
    height: height * 0.8,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 15,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },

  // Applicants List
  applicantsList: {
    flex: 1,
  },
  applicantItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  applicantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  viewMoreButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewMoreButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  applicantStatus: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  applicationDate: {
    fontSize: 12,
    color: "#999",
  },

  // Modal Footer
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 15,
    marginTop: 20,
  },
  refreshButton: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Details Modal Styles
  detailsModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsModalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: width * 0.95,
    height: height * 0.9,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
    paddingBottom: 15,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  closeDetailsButton: {
    backgroundColor: "#dc3545",
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  closeDetailsButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Details Content
  detailsScrollView: {
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#007bff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 15,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#495057",
    width: 120,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    textAlign: "left",
  },

  // Spouse Container
  spouseContainer: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },

  // Status Styles
  statusText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  approvedStatus: {
    color: "#28a745",
  },
  rejectedStatus: {
    color: "#dc3545",
  },
  pendingStatus: {
    color: "#ffc107",
  },

  //Additional Style

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    minWidth: 70,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  approveButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  rejectButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  loadingIndicator: {
    marginLeft: 10,
  },

  // Add these styles to your ViewParticipantsModal.js file
  emailInputContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  emailInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  emailButtonsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  emailButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: "center",
  },
  sendEmailButton: {
    backgroundColor: "#28a745",
  },
  sendEmailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  cancelEmailButton: {
    backgroundColor: "#6c757d",
  },
  cancelEmailButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
