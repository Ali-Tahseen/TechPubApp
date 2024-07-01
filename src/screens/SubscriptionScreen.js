// SubscriptionScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SubscriptionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subscription Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
  },
});

export default SubscriptionScreen;
