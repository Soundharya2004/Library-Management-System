import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'; // Import Image component
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Import Poppins font

import baseURL from '../auth/connection'; // Import baseURL from connection file
 
const UserProfile = ({ onSubmitSuccess }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [email, setEmail] = useState('');

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Return null while the font is loading
  }

  const handleSubmit = async () => {
    try {
      const userData = { name, department, year, section, email };
      await axios.post(`${baseURL}/api/addProfile`, userData);
      console.log('Profile added successfully!');
      onSubmitSuccess();
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../profile.png')} // Image location
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>User Profile</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Picker
        style={[styles.input, styles.picker]}
        selectedValue={department}
        onValueChange={setDepartment}
      >
        <Picker.Item label="Select Department" value="" />
        <Picker.Item label="CSE" value="CSE" />
        <Picker.Item label="IT" value="IT" />
        <Picker.Item label="AIDS" value="AIDS" />
        <Picker.Item label="CSBS" value="CSBS" />
        <Picker.Item label="MECH" value="MECH" />
        <Picker.Item label="S&H" value="S&H" />
        <Picker.Item label="GENERAL" value="GENERAL" />
      </Picker>

      <Picker
        style={[styles.input, styles.picker]}
        selectedValue={year}
        onValueChange={setYear}
      >
        <Picker.Item label="Select Year" value="" />
        <Picker.Item label="I" value="I" />
        <Picker.Item label="II" value="II" />
        <Picker.Item label="III" value="III" />
        <Picker.Item label="IV" value="IV" />
      </Picker>

      <Picker
        style={[styles.input, styles.picker]}
        selectedValue={section}
        onValueChange={setSection}
      >
        <Picker.Item label="Select Section" value="" />
        <Picker.Item label="A" value="A" />
        <Picker.Item label="B" value="B" />
      </Picker>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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
  image: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#391A09',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  picker: {
    color: '#391A09',
    backgroundColor: '#FAF4F0',
  },
  button: {
    width: 150,
    height: 40,
    backgroundColor: '#391A09',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default UserProfile;