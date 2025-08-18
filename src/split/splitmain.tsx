import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import TopNav from './components/TopNav';

interface NewExpense {
  name: string;
  payer: string;
  amount: string;
  split: string[];
}

const splitmain = () => {
  const [friends, setFriends] = useState(['Name 1', 'Name 2', 'Name 3']);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: 'Walmart',
      amounts: [50, -50, -50], // Positive means paid, negative means owes
      color: '#F5DEB3' // Light brown
    },
    // Add more expenses here
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newExpenseModalVisible, setNewExpenseModalVisible] = useState(false);
  const [newExpense, setNewExpense] = useState<NewExpense>({
    name: '',
    payer: '',
    amount: '',
    split: []
  });
  
  const openNewExpenseModal = () => {
    setNewExpense({ name: '', payer: '', amount: '', split: [] });
    setNewExpenseModalVisible(true);
  };
  
  // Calculate totals
  const calculateTotals = () => {
    const totals = friends.map(() => 0);
    
    expenses.forEach(expense => {
      expense.amounts.forEach((amount, index) => {
        totals[index] += amount;
      });
    });
    
    return totals;
  };

  const totals = calculateTotals();

  const addFriend = () => {
    if (newFriendName.trim() === '') {
      Alert.alert('Error', 'Please enter a name');
      return;
    }
    
    if (friends.includes(newFriendName)) {
      Alert.alert('Error', 'This name already exists');
      return;
    }
    
    setFriends([...friends, newFriendName]);
    
    // Update all existing expenses to include the new friend with 0 amount
    setExpenses(expenses.map(expense => ({
      ...expense,
      amounts: [...expense.amounts, 0]
    })));
    
    setNewFriendName('');
    setModalVisible(false);
  };

  const addExpense = () => {
    if (!newExpense.name || !newExpense.payer || !newExpense.amount || isNaN(parseFloat(newExpense.amount))) {
      Alert.alert('Error', 'Please fill all fields with valid values');
      return;
    }
    
    const payerIndex = friends.indexOf(newExpense.payer);
    if (payerIndex === -1) {
      Alert.alert('Error', 'Invalid payer selected');
      return;
    }
    
    const amount = parseFloat(newExpense.amount);
    const splitBetween = newExpense.split.length > 0 ? newExpense.split : friends;
    const splitCount = splitBetween.length;
    const splitAmount = amount / splitCount;
    
    const newAmounts = friends.map(friend => {
      if (friend === newExpense.payer) {
        // The payer gets the full amount minus their share of the split
        return amount - (splitBetween.includes(friend) ? splitAmount : 0);
      }
      if (splitBetween.includes(friend)) {
        // Others in the split owe their share
        return -splitAmount;
      }
      // Not involved in this expense
      return 0;
    });

    const colors = ['#F5DEB3', '#ADD8E6', '#98FB98', '#FFB6C1', '#E6E6FA'];
    
    setExpenses([
      ...expenses,
      {
        id: expenses.length + 1,
        name: newExpense.name,
        amounts: newAmounts,
        color: colors[expenses.length % colors.length]
      }
    ]);
    
    setNewExpense({
      name: '',
      payer: '',
      amount: '',
      split: []
    });
    setNewExpenseModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TopNav 
        title="Split Bills"
        rightAction={
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.icon}>👤</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={openNewExpenseModal}
            >
              <Text style={styles.icon}>➕</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      {/* Table */}
      <ScrollView horizontal={true} style={styles.scrollView}>
        <View>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.headerCell]}>
              <Text>No</Text>
            </View>
            {friends.map((friend, index) => (
              <View key={index} style={[styles.tableCell, styles.headerCell]}>
                <Text>{friend}</Text>
              </View>
            ))}
          </View>
          
          {/* Expense Rows */}
          {expenses.map((expense, rowIndex) => (
            <View 
              key={expense.id} 
              style={[styles.tableRow, { backgroundColor: expense.color }]}
            >
              <View style={styles.tableCell}>
                <Text>{expense.id}</Text>
              </View>
              {expense.amounts.map((amount, colIndex) => (
                <View key={colIndex} style={styles.tableCell}>
                  <Text>
                    {amount > 0 ? `+${amount.toFixed(2)}` : amount < 0 ? amount.toFixed(2) : ''}
                  </Text>
                </View>
              ))}
            </View>
          ))}
          
          {/* Summary Rows */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.summaryCell]}>
              <Text>You owe</Text>
            </View>
            {totals.map((total, index) => (
              <View key={index} style={[styles.tableCell, styles.summaryCell]}>
                <Text>{total < 0 ? `$${Math.abs(total).toFixed(2)}` : ''}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.summaryCell]}>
              <Text>You get</Text>
            </View>
            {totals.map((total, index) => (
              <View key={index} style={[styles.tableCell, styles.summaryCell]}>
                <Text>{total > 0 ? `$${total.toFixed(2)}` : ''}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Add Friend Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter friend's name"
              value={newFriendName}
              onChangeText={setNewFriendName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={addFriend}
              >
                <Text>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Add Expense Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newExpenseModalVisible}
        onRequestClose={() => setNewExpenseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Expense</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newExpense.name}
              onChangeText={(text) => setNewExpense(prev => ({...prev, name: text}))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Price"
              keyboardType="numeric"
              value={newExpense.amount}
              onChangeText={(text) => setNewExpense(prev => ({...prev, amount: text}))}
            />

            <Text>Paid by:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendSelector}>
              {friends.map((friend) => (
                <TouchableOpacity
                  key={friend}
                  style={[
                    styles.friendOption,
                    newExpense.payer === friend && styles.selectedFriend
                  ]}
                  onPress={() => setNewExpense(prev => ({...prev, payer: friend}))}
                >
                  <Text>{friend}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <Text>Split with (select none to split with everyone):</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.friendSelector}>
              {friends.map((friend) => (
                <TouchableOpacity
                  key={friend}
                  style={[
                    styles.friendOption,
                    newExpense.split.includes(friend) && styles.selectedFriend
                  ]}
                  onPress={() => {
                    const newSplit = newExpense.split.includes(friend)
                      ? newExpense.split.filter(item => item !== friend)
                      : [...newExpense.split, friend];
                    setNewExpense(prev => ({...prev, split: newSplit}));
                  }}
                >
                  <Text>{friend}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setNewExpenseModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={addExpense}
              >
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    width: 150,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    justifyContent: 'center',
  },
  headerCell: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  summaryCell: {
    backgroundColor: '#e0e0e0',
  },
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
  buttonText: {
    color: '#000000',
    fontSize: 16,
  },
});

export default splitmain;