import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-modern-datepicker'
import { getToday, getFormatedDate } from 'react-native-modern-datepicker'

const Timepicker = () => {
    
  const [date, setDate] = useState(null); // Initialize date state with null
  const today = new Date();
  const startDate = getFormatedDate(today.setDate(today.getDate() + 1), 'YYYY?MM?DD');
  const [open, setOpen] = useState(false);

  function handleOnPress() {
    setOpen(!open);
  }
 
  function handleChange(propDate) {
    setDate(propDate);
  }

  return (
    <View>
      <Text>Timepicker</Text>
      <TouchableOpacity onPress={handleOnPress}>
        <Text>Open</Text>
      </TouchableOpacity>
      <Modal 
        animationType='slide'
        transparent={true}
        visible={open}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DatePicker
              mode='calendar'
              selected={date ? date : startDate} // Use startDate if date is null
              minimumDate={startDate}
              onDateChange={handleChange}
            />
            <TouchableOpacity onPress={handleOnPress}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Timepicker;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 28,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
