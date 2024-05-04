import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import BorrowBooks from '../components/BorrowBooks';
import Dues from '../components/Dues';
import BorrowForm from '../components/BorrowForm';
import baseURL from '../auth/connection';
 
const StudentDashboard = () => { // Pass navigation as props
  const [selectedAction, setSelectedAction] = useState(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showDues, setShowDues] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = useNavigation();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBorrowForm = () => {
    setShowBorrowForm(true);
  };

  const handleSidebarLinkClick = (action) => {
    setSelectedAction(action);
    setSidebarOpen(false);
    if (action === 'dues') {
      setShowDues(true);
    } else {
      setShowDues(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get(`${baseURL}/api/logout`); // Add localhost:5000 to API call
     
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>

      <Modal visible={sidebarOpen} transparent={true} animationType="slide">
        <View style={styles.sidebar}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('books')}>
            <Ionicons name="book-outline" size={24} color="black" />
            <Text style={styles.linkText}>Books</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('dues')}>
            <Ionicons name="cash-outline" size={24} color="black" />
            <Text style={styles.linkText}>Dues</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="black" />
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.mainContent}>
          {!selectedAction &&<BorrowBooks onAddForm={handleBorrowForm} />
}
          {selectedAction === 'books' && <BorrowBooks onAddForm={handleBorrowForm} />}
          {selectedAction === 'dues' && <Dues />}
        </View>
      </ScrollView>

      <Modal visible={showBorrowForm} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setShowBorrowForm(false)}>
            <Ionicons name="close-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <BorrowForm onSubmit={() => setShowBorrowForm(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  menuButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  sidebar: {
    width: 200,
    backgroundColor: '#FAF4F0',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 10,
  },
  sidebarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
  linkText: {
    fontSize: 12,
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default StudentDashboard;
