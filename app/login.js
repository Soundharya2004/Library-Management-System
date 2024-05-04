import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins'; // Import Poppins font
import baseURL from '../auth/connection';

 

const Login = () => {
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Return null while the font is loading
  }

  const handleLogin = async () => {
    try {
      let apiUrl = '';
      if (userType === 'student') {
        apiUrl = `${baseURL}/api/studentLogin`;
      } else if (userType === 'admin') {
        apiUrl = `${baseURL}/api/adminLogin`;
      }

      const response = await axios.post(apiUrl, {
        registerNumber: registerNumber,
        password: password
      });

      if (response.data.success) {
        console.log('Login successful');
        if (userType === 'student') {
          navigation.navigate('DashboardWrapper'); // Navigate to StudentDashboard if userType is student
        } else if (userType === 'admin') {
          navigation.navigate('Dashboard'); // Navigate to AdminDashboard if userType is admin
        }
      } else { 
        console.log('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../login.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Register Number"
        value={registerNumber}
        onChangeText={(text) => setRegisterNumber(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}>
        <Picker.Item label="Student" value="student" />
        <Picker.Item label="Admin" value="admin" />
      </Picker>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAF4F0',
  },
  image: {
    width: 340,
    height: 340,
  },
  title: {
    fontSize: 24,
    color: '#391A09',
    fontFamily: 'Poppins_400Regular', 
   fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 0,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderColor: '#391A09',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#391A09',
    color:'#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  picker: {
    width: 300,
    height: 50,
    borderColor: '#391A09',
    backgroundColor: '#FAF4F0',

    borderRadius: 5,
    marginBottom: 15,
  },
});

export default Login;
