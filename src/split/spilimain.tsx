import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import TopNav from './components/TopNav';
import ExpenseTable from './components/ExpenseTable';
import AddFriendModal from './components/AddFriendModal';
import AddExpenseModal from './components/AddExpenseModal';

// Types
export interface Expense {
  id: number;
  name: string;
  amounts: number[];
  color: string;
}

export interface ExpenseData {
  name: string;
  payer: string;
  amount: string;
  split: string[];
}

// Colors
const EXPENSE_COLORS = ['#F5DEB3', '#ADD8E6', '#98FB98', '#FFB6C1', '#E6E6FA'];

// Validation functions
const validateFriendName = (name: string, existingFriends: string[]): boolean => {
  if (name.trim() === '') {
    Alert.alert('Error', 'Please enter a name');
    return false;
  }
  
  if (existingFriends.includes(name)) {
    Alert.alert('Error', 'This name already exists');
    return false;
  }
  
  return true;
};

const validateExpense = (expense: ExpenseData, friends: string[]): boolean => {
  if (!expense.name || !expense.payer || !expense.amount || isNaN(parseFloat(expense.amount))) {
    Alert.alert('Error', 'Please fill all fields with valid values');
    return false;
  }
  
  if (!friends.includes(expense.payer)) {
    Alert.alert('Error', 'Invalid payer selected');
    return false;
  }
  
  return true;
};

// Custom hook for bill calculations
const useSplitBills = () => {
  const calculateTotals = (friends: string[], expenses: Expense[]): number[] => {
    const totals = friends.map(() => 0);
    
    expenses.forEach(expense => {
      expense.amounts.forEach((amount, index) => {
        totals[index] += amount;
      });
    });
    
    return totals;
  };

  return { calculateTotals };
};

const SplitBills = () => {
  const [friends, setFriends] = useState(['Name 1', 'Name 2', 'Name 3']);
  const [expenses, setExpenses] = useState<Expense[]>([
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
  const [newExpense, setNewExpense] = useState<ExpenseData>({
    name: '',
    payer: '',
    amount: '',
    split: []
  });

  // Use custom hook for bill splitting calculations
  const { calculateTotals } = useSplitBills();
  const totals = calculateTotals(friends, expenses);

  const addFriend = () => {
    if (!validateFriendName(newFriendName, friends)) {
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
    if (!validateExpense(newExpense, friends)) {
      return;
    }
    
    const payerIndex = friends.indexOf(newExpense.payer);
    
    const amount = parseFloat(newExpense.amount);
    const splitCount = newExpense.split.length;
    const splitAmount = amount / (splitCount || 1);
    
    const newAmounts = friends.map((friend, index) => {
      if (index === payerIndex) {
        return amount; // Payer pays full amount
      }
      if (newExpense.split.includes(friend)) {
        return -splitAmount; // Split among selected friends
      }
      return 0; // Not involved in this expense
    });
    
    // Use colors from the constants file
    const colors = EXPENSE_COLORS;
    
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
      {/* TopNav (includes navigation and header) */}
      
      
      {/* Table */}
      <ExpenseTable 
        friends={friends}
        expenses={expenses}
        totals={totals}
      />
      
      {/* Add Friend Modal */}
      
      
      {/* Add Expense Modal */}
      <AddExpenseModal
        modalVisible={newExpenseModalVisible}
        setModalVisible={setNewExpenseModalVisible}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        friends={friends}
        addExpense={addExpense}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default SplitBills;