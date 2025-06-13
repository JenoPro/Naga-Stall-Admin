import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AdminLoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleLogin = () => {
    const fixedUsername = 'admin';
    const fixedPassword = 'admin123';

    if (username === fixedUsername && password === fixedPassword) {
      setErrorMessage('');
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigation.navigate('ManageUsers');
      }, 2000);
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Image
          source={require('../assets/naga-city-seal.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Naga City Stall</Text>
      </View>

      <View style={styles.greenBar} />

      <View style={styles.formContainer}>
        <View style={styles.formWrapper}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.greenBar} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Naga Stall © 2024-2025</Text>
        <Text style={styles.footerText}>University of Nueva Caceres</Text>
        <Text style={styles.footerText}>
          Market Enterprise and Promotions Office
        </Text>
      </View>

      {/* MODAL POPUP */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.popup}>
            <Text style={styles.popupText}>Welcome back, Admin!</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0A2463',
    marginTop: 10,
  },
  greenBar: {
    height: 15,
    backgroundColor: '#4CAF50',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#3B6FE2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPassword: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  errorText: {
    color: '#ffcccb',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
