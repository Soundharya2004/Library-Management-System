import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import DatePicker from 'react-native-modern-datepicker';
import baseURL from '../auth/connection';

const BorrowForm = ({ onSubmit }) => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [bookName, setBookName] = useState('');
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/borrowbooks`, {
        fromDate,
        toDate,
        bookName,
      });

      console.log('Response:', response.data);

      // Show success message
      Alert.alert('Success', 'Book borrowed successfully', [{ text: 'OK', onPress: onSubmit }]);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message
      Alert.alert('Error', 'Failed to borrow book. Please try again.');
    }
  };

  const parseDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Borrow Book</Text>
     
      {/* From Date Field */}
      <TouchableOpacity style={styles.input} onPress={() => setShowFromDatePicker(true)}>
        <Text>{fromDate ? parseDateString(fromDate) : 'Select From Date'}</Text>
      </TouchableOpacity>
      {/* To Date Field */}
      <TouchableOpacity style={styles.input} onPress={() => setShowToDatePicker(true)}>
        <Text>{toDate ? parseDateString(toDate) : 'Select To Date'}</Text>
      </TouchableOpacity>
      {/* Book Name Field */}
      <TextInput
        style={styles.input}
        placeholder="Book Name"
        value={bookName}
        onChangeText={text => setBookName(text)}
      />
      {/* Borrow Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Borrow</Text>
      </TouchableOpacity>
      {/* From Date Picker Modal */}
      <Modal visible={showFromDatePicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <DatePicker
            mode="calendar"
            onSelectedChange={date => {
              setFromDate(date);
              setShowFromDatePicker(false);
            }}
          />
        </View>
      </Modal>
      {/* To Date Picker Modal */}
      <Modal visible={showToDatePicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <DatePicker
            mode="calendar"
            onSelectedChange={date => {
              setToDate(date);
              setShowToDatePicker(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF4F0', // Background color
    padding: 20,
    borderRadius: 10,
    color: '#391A09',

  },
  title: {
    color: '#391A09',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  button: { 
    width: '100%',
    height: 50,
    backgroundColor:'#391A09',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default BorrowForm;
