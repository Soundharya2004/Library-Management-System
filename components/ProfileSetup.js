import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import UserProfile from './UserProfile';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Import Poppins font
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const ProfileSetup = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [showUserProfile, setShowUserProfile] = useState(false);

  const handleSetupClick = () => {
    setShowUserProfile(true);
  }; 

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Return null while the font is loading
  }

  const handleProfileSubmit = () => {
    setShowUserProfile(false);
    navigation.navigate('StudentDashboard'); // Redirect to StudentDashboard
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>&#128577;</Text>
      <Text style={styles.text}>
        Looks like you didn't complete setting up your profile.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleSetupClick}
      >
        <Text style={styles.buttonText}>Setup</Text>
      </TouchableOpacity>

      <Modal visible={showUserProfile} animationType="slide">
        <UserProfile onSubmitSuccess={handleProfileSubmit} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4F0',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  text: {
    color: '#391A09',
    fontSize: 30,
    fontFamily: 'Poppins_400Regular', 
    fontWeight: 'bold',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#391A09',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ProfileSetup;
