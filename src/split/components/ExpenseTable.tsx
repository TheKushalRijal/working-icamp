import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Expense } from '../spilimain';

interface ExpenseTableProps {
  friends: string[];
  expenses: Expense[];
  totals: number[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ friends, expenses, totals }) => {
  return (
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
        {expenses.map((expense) => (
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
                  {amount > 0 ? `${expense.name} +${amount}` : 
                   amount < 0 ? `${expense.name} ${amount}` : ''}
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
              <Text>{total < 0 ? `$${Math.abs(total)}` : ''}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.summaryCell]}>
            <Text>You get</Text>
          </View>
          {totals.map((total, index) => (
            <View key={index} style={[styles.tableCell, styles.summaryCell]}>
              <Text>{total > 0 ? `$${total}` : ''}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

export default ExpenseTable;
