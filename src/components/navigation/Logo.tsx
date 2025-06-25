import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <Icon name="globe" size={24} color="black" />
      <Text style={styles.text}>Icamp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000', // You can change this for dark mode or theming
  },
});

export default Logo;
