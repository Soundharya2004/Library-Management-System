import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Import Poppins font
import Icon from 'react-native-vector-icons/Ionicons';

const Home = ({ navigation }) => {
  const goToLogin = () => {
    navigation.navigate('Login'); // Navigate to Login page
  };

  // Load the Poppins font
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Return null while the font is loading
  }

  return (
    <View style={[styles.container, { width: '100%' }]}>
      <View style={styles.content}>
        <Text style={styles.caption}>Get Started with...</Text>
        <Text style={styles.title}>Realm of Knowledge</Text>
        {/* Adjust image source and styling */}
        <Image
          style={[styles.image, { width: '80%' }]} // Increase image width to 80%
          source={require('../vector.png')} // Adjust image source
          resizeMode="contain" // Adjust resizeMode to fit the image within the container
        />
      </View>
      <View style={styles.arrowbox}>
        <TouchableOpacity onPress={goToLogin} style={styles.arrowButton}>
          <Icon name="arrow-forward-outline" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF4F0', // Background color
  },
  caption: {
    color: '#391A09', 
    fontSize: 20,
    fontFamily: 'Poppins_400Regular', 
    paddingTop:50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_700Bold', // Use Poppins Bold font
    color: '#391A09', // Text color
  },
  image: {
    width: '100%', // Image width
    height: 400, // Adjusted image height
    marginBottom: 20,
  },
  arrowButton: {
    backgroundColor: '#391A09', // Arrow button background color
    padding: 15,
    borderRadius: 50,
    paddingLeft: 100,
  },
  arrowbox: {
    alignItems: 'center',
    paddingBottom: 120,
  },
});

export default Home;
