import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import axios from 'axios';
import baseURL from '../auth/connection';

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/bookslist`);
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching books:', error);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Cleanup code here (if needed)
    };
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Books List</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.scrollView} horizontal={true}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.cellWidth33]}>Book Name</Text>
              <Text style={[styles.headerCell, styles.cellWidth33]}>Published Date</Text>
              <Text style={[styles.headerCell, styles.cellWidth33]}>Domain</Text>
            </View>
            {books.map((book) => (
              <View key={book.BookID} style={styles.tableRow}>
                <Text style={[styles.cell, styles.cellWidth33]}>{book.BookName}</Text>
                <Text style={[styles.cell, styles.cellWidth33]}>{formatDate(book.PublishedDate)}</Text>
                <Text style={[styles.cell, styles.cellWidth33]}>{book.Department}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: windowWidth < 600 ? 24 : 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  table: {
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000000',
  },
  headerCell: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: windowWidth < 600 ? 16 : 20,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    textAlign: 'center',
    fontSize: windowWidth < 600 ? 16 : 20,
  },
  cellWidth33: {
    width: '33%',
  },
});

export default BooksList;
