import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../auth/connection';

const DeleteComponent = () => {
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    try {
       
      const response = await axios.post(`${baseURL}/api/deleteBooks`, {
        name,
      });
      console.log('Delete response:', response.data);
     
      setName('');
      setReason('');
    } catch (error) {
      console.error('Error deleting book:', error);
      
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Book</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Reason"
        value={reason}
        onChangeText={(text) => setReason(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    width: '80%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DeleteComponent;
