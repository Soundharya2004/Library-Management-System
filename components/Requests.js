import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseURL from '../auth/connection'; // Import baseURL from your auth/connection file

const Requests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/requests`); // Use baseURL
      setRequests(response.data);
      
    } catch (error) {
      console.error('Error fetching requests:', error);
      Alert.alert('Error', 'Failed to fetch requests. Please try again.');
    }
  };

  const handleApprove = async (registerNumber, bookName) => {
    try {
      const response = await axios.post(`${baseURL}/api/approve`, {
        registerNumber: registerNumber,
        bookName: bookName,
      });
      console.log('Approval response:', response.data);
      fetchRequests();
      // Assuming success message received from the server, you can update the UI accordingly
    } catch (error) {
      console.error('Error approving request:', error);
      Alert.alert('Error', 'Failed to approve request. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Requests</Text>
      {requests.map((request, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.text}>Register Number: {request.RegisterNumber}</Text>
          <Text style={styles.text}>Book Name: {request.BookName}</Text>
          <Text style={styles.text}>To Date: {formatDate(request.ToDate)}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleApprove(request.RegisterNumber, request.BookName)}
          >
            <Text style={styles.buttonText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#FAF4F0', // Background color
    color: '#391A09',
  }, 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingLeft:10,
    paddingRight:190,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
    marginBottom: 20,
    width: '80%',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: '#391A09',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Requests;
