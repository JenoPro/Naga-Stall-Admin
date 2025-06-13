import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const AdminNavbar = ({ activeId }) => {
  const navigation = useNavigation();
  const [isHovered, setIsHovered] = useState(false);
  const animatedWidth = useRef(new Animated.Value(80)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: isHovered ? 200 : 80,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isHovered]);

  const navItems = [
    {
      id: "documents",
      icon: require("../assets/Documents.png"),
      label: "Documents",
      screen: "ManageDocument",
    },
    {
      id: "stalls",
      icon: require("../assets/stalls.png"),
      label: "Stalls",
      screen: "Stalls",
    },
    {
      id: "users",
      icon: require("../assets/User.png"),
      label: "User",
      screen: "ManageUsers",
    },
  ];

  const handleNavigation = (screen) => {
    if (screen) {
      navigation.navigate(screen);
    }
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "AdminLogin" }],
    });
  };

  return (
    <Animated.View
      style={[styles.sidebar, { width: animatedWidth }]}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/Profile.png")}
          style={styles.profileIcon}
        />
        {isHovered && (
          <View>
            <Text style={styles.profileName}>Admin</Text>
            <Text style={styles.profileSub}>View Profile</Text>
          </View>
        )}
      </View>

      {/* Navigation and Logout */}
      <View style={styles.navSection}>
        <View>
          {navItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navItem,
                  isHovered && styles.navItemExpanded,
                  isActive && styles.activeNavItem,
                ]}
                onPress={() => handleNavigation(item.screen)}
              >
                <Image source={item.icon} style={styles.navIcon} />
                {isHovered && <Text style={styles.navLabel}>{item.label}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.navItem, isHovered && styles.navItemExpanded]}
          onPress={handleLogout}
        >
          <Image
            source={require("../assets/logout.png")}
            style={styles.navIcon}
          />
          {isHovered && <Text style={styles.navLabel}>Logout</Text>}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
    zIndex: 1000,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  profileIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignSelf: "center",
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  profileSub: {
    fontSize: 12,
    color: "#888",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  navSection: {
    flex: 1,
    justifyContent: "space-between",
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
    borderRadius: 12,
  },
  navItemExpanded: {
    justifyContent: "flex-start",
  },
  activeNavItem: {
    backgroundColor: "#f0f0f0",
  },
  navIcon: {
    width: 28,
    height: 28,
    marginRight: 15,
    resizeMode: "contain",
    alignSelf: "center",
  },
  navLabel: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 1,
  },
});

export default AdminNavbar;
