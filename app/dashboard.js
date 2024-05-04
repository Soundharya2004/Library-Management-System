// Dashboard.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddComponent from '../components/AddComponent';
import AddForm from '../components/AddForm';
import DeleteComponent from '../components/DeleteComponent';
import SearchComponent from '../components/SearchComponent';
import BooksList from '../components/BooksList';
import DuesComponent from '../components/DuesComponent.js'; // Import DuesComponent
import Requests from '../components/Requests';

 
const Dashboard = () => {
  const [selectedAction, setSelectedAction] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddForm = () => {
    setShowAddForm(true);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarLinkClick = (action) => {
    setSelectedAction(action);
    setSidebarOpen(false);
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
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('add')}>
            <Ionicons name="add-circle-outline" size={24} color="black" />
            <Text style={styles.linkText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('delete')}>
            <Ionicons name="trash-outline" size={24} color="black" />
            <Text style={styles.linkText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('search')}>
            <Ionicons name="search-outline" size={24} color="black" />
            <Text style={styles.linkText}>Search</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('dues')}>
            <Ionicons name="cash-outline" size={24} color="black" />
            <Text style={styles.linkText}>Dues</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarLink} onPress={() => handleSidebarLinkClick('requests')}>
            <Ionicons name="alert-circle-outline" size={24} color="black" />
            <Text style={styles.linkText}>Requests</Text>
          </TouchableOpacity>

        </View>
      </Modal>

      <View style={styles.mainContent}>
        {selectedAction === 'add' && <AddComponent onAddForm={handleAddForm} />}
        {selectedAction === 'delete' && <DeleteComponent />}
        {selectedAction === 'search' && <SearchComponent />}
        {selectedAction === 'dues' && <DuesComponent />} 
        {selectedAction === 'requests' && <Requests />}

        {!selectedAction && <BooksList />}
      </View>

      <Modal visible={showAddForm} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setShowAddForm(false)}>
            <Ionicons name="close-circle-outline" size={24} color="black" />
          </TouchableOpacity>
          <AddForm onSubmit={() => setShowAddForm(false)} />
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
    color: '#391A09',
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
});

export default Dashboard;
