import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BorrowForm from './BorrowForm';
import baseURL from '../auth/connection';

const BorrowBooks = () => {
  const [borrowModalVisible, setBorrowModalVisible] = useState(false);
  const [borrowList, setBorrowList] = useState([]);

  useEffect(() => {
    fetchBorrowList();
  }, []);

  const fetchBorrowList = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/getborrowList`);
      setBorrowList(response.data);
    } catch (error) {
      console.error('Error fetching borrow list:', error);
    }
  };

  const handleBorrowButton = () => {
    setBorrowModalVisible(true);
  };

  const handleCloseModal = () => {
    setBorrowModalVisible(false);
    fetchBorrowList(); // Fetch borrow list again after modal is closed
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.pageContainer}>
      <View style={styles.header}>
        <Text style={styles.dashboardText}>Dashboard</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleBorrowButton}>
          <Text style={styles.buttonText}>Borrow</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.container}>
        <Modal visible={borrowModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <BorrowForm onSubmit={() => handleCloseModal()} />
          </View>
        </Modal>

        {borrowList.length === 0 ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.noBooksText}>No books to display</Text>
          </View>
        ) : (
          borrowList.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <View style={styles.card}>
                <Text style={styles.bookNameText}>{item.BookName}</Text>
                <Text style={styles.validityText}>Bought on {formatDate(item.FromDate)}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FAF4F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  dashboardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#391A09',
    paddingRight:140,
  },
  addButton: { 
    backgroundColor: '#391A09',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBooksText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#391A09',
  },
  cardContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 20,
  },
  bookNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#391A09',
  },
  validityText: {
    fontSize: 16,
    color: '#391A09',
  },
});

export default BorrowBooks;
