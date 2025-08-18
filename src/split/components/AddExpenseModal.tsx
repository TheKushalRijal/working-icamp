import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ExpenseData } from '../spilimain';

interface AddExpenseModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  newExpense: ExpenseData;
  setNewExpense: (expense: ExpenseData) => void;
  friends: string[];
  addExpense: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  modalVisible,
  setModalVisible,
  newExpense,
  setNewExpense,
  friends,
  addExpense,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Expense</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Expense name (e.g., Walmart)"
            value={newExpense.name}
            onChangeText={(text) => setNewExpense({...newExpense, name: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={newExpense.amount}
            onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
          />
          
          <Text>Paid by:</Text>
          <View style={styles.friendSelector}>
            {friends.map((friend) => (
              <TouchableOpacity
                key={friend}
                style={[
                  styles.friendOption,
                  newExpense.payer === friend && styles.selectedFriend
                ]}
                onPress={() => setNewExpense({...newExpense, payer: friend})}
              >
                <Text>{friend}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text>Split with:</Text>
          <View style={styles.friendSelector}>
            {friends.map((friend) => (
              <TouchableOpacity
                key={friend}
                style={[
                  styles.friendOption,
                  newExpense.split.includes(friend) && styles.selectedFriend
                ]}
                onPress={() => {
                  const newSplit = [...newExpense.split];
                  const index = newSplit.indexOf(friend);
                  if (index > -1) {
                    newSplit.splice(index, 1);
                  } else {
                    newSplit.push(friend);
                  }
                  setNewExpense({...newExpense, split: newSplit});
                }}
              >
                <Text>{friend}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.addButton]}
              onPress={addExpense}
            >
              <Text>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#4CAF50',
  },
  friendSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  friendOption: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedFriend: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
});

export default AddExpenseModal;
