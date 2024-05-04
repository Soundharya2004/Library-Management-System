import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import baseURL from '../auth/connection'; // Import baseURL from the connection file

const DuesComponent = () => {
  const [duesList, setDuesList] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    axios.get(`${baseURL}/api/duesList`)
      .then(response => {
        setDuesList(response.data);
      })
      .catch(error => {
        console.error('Error fetching dues list:', error);
      });
  }, []); // Run once on component mount

  // Function to format the date (e.g., "18.04.2024" to "April 18, 2024")
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleNotify = async (registerNumber, bookName) => {
  try {
    const response = await axios.post(`${baseURL}/api/notify`, { registerNumber, bookName });
    console.log('Notification sent successfully:', response.data.message);
    Alert.alert('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    Alert.alert('Error sending notification: ' + error.message);
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dues List</Text>
      {duesList.length === 0 ? (
        <Text>No dues to display</Text>
      ) : (
        duesList.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.BookName}</Text>
            <Text style={styles.cardText}>Register Number: {item.RegisterNumber}</Text>
            <Text style={styles.cardText}>Due Date: {formatDate(item.ToDate)}</Text>
            <TouchableOpacity style={styles.notifyButton} onPress={() => handleNotify(item.RegisterNumber, item.BookName)}>
              <Text style={styles.buttonText}>Notify</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  notifyButton: {
    backgroundColor: '#391A09',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',

  }, 
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DuesComponent;
