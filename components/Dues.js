import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import baseURL from '../auth/connection';

const Dues = () => {
  const [dues, setDues] = useState([]);

  useEffect(() => {
    fetchDues();
  }, []);

  const fetchDues = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getDues`);
      setDues(response.data);
    } catch (error) {
      console.error('Error fetching dues:', error);
    }
  };

  const handleReturnBook = async (bookName) => {
    try {
      const response = await axios.post(`${baseURL}/api/returnBook`, {
        bookName: bookName,
      });
      if (response.data.success) {
        // Reload dues after book is returned
        fetchDues();
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  const handleExtendDue = async (bookName) => {
    try {
      const response = await axios.post(`${baseURL}/api/extendBooks`, {
        bookName: bookName,
      });
      if (response.data.success) {
        // Reload dues after due date is extended
        Alert.alert("Request Sent!");
        fetchDues();
      }
    } catch (error) {
      console.error('Error extending due date:', error);
    }
  }; 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dues</Text>
      {dues.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{item.BookName}</Text>
          <Text>Due Date: {moment(item.ToDate).format('MMMM DD, YYYY')}</Text>
          <TouchableOpacity onPress={() => handleExtendDue(item.BookName)} style={styles.button}>
            <Text style={styles.buttonText}>Extend</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReturnBook(item.BookName)} style={[styles.button, styles.returnButton]}>
            <Text style={styles.buttonText}>Return</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF4F0', // Background color
    color: '#391A09',


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#391A09',

    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  returnButton: {
    backgroundColor: '#dc3545',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Dues;
