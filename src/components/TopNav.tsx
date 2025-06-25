import React, { useState, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const TopNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -100], // hide header
    extrapolate: 'clamp',
  });

  return (
    <>
      <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Icon name="globe" size={24} color="#2A4365" />
            <Text style={styles.logoText}>GlobalConnect</Text>
          </View>

          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <Icon name={isMenuOpen ? 'x' : 'menu'} size={24} />
          </TouchableOpacity>
        </View>

        {isMenuOpen && (
          <View style={styles.menu}>
            <Text style={styles.menuItem}>Your Community</Text>
            <Text style={styles.menuItem}>Campus Community</Text>
          </View>
        )}
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Your page content here */}
        <View style={{ height: 1500, paddingTop: 120 }}>
          <Text style={{ fontSize: 24, textAlign: 'center' }}>Scroll down to hide nav</Text>
        </View>
      </Animated.ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A4365',
  },
  menu: {
    marginTop: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#2A4365',
    paddingVertical: 6,
  },
});

export default TopNav;
