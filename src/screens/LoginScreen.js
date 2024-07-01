import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../functions/firebaseConfig'; // Adjust the path based on your project structure
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Email not verified', 'Please verify your email before logging in.');
        return;
      }

      // Check if user data exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (!userData.avatarCreated) {
          navigation.navigate('CreateAvatar');
        } else {
          const dogID = userData.dogID; // Use dogID instead of dogName
          if (dogID) {
            const dogDocRef = doc(db, 'users', user.uid, 'dogs', dogID);
            const dogDoc = await getDoc(dogDocRef);
            if (dogDoc.exists()) {
              const dogData = dogDoc.data();
              navigation.navigate('Home', { ...dogData });
            } else {
              Alert.alert('Dog Data Not Found', 'No dog data found, please create a profile.');
              navigation.navigate('CreateAvatar');
            }
          } else {
            Alert.alert('Dog Data Not Found', 'No dog data found, please create a profile.');
            navigation.navigate('CreateAvatar');
          }
        }
      } else {
        Alert.alert('User Data Not Found', 'No user data found, please contact support.');
      }
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  const handleGoogleLogin = () => {
    // Your Google login logic here
    navigation.navigate('CreateAvatar');
  };

  const handleFacebookLogin = () => {
    // Your Facebook login logic here
    navigation.navigate('TrainVideos');
  };

  const handleForgotPassword = () => {
    // Navigate to the Home screen with a default dogName for now
    navigation.navigate('Home', { dogName: 'DefaultDog' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to TechPub</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#666"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        placeholderTextColor="#666"
      />
      <Button title="Log In" onPress={handleLogin} />
      <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      <Button title="Forgot Password?" onPress={handleForgotPassword} />
      <Button title="Continue with Google" onPress={handleGoogleLogin} />
      <Button title="Continue with Facebook" onPress={handleFacebookLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
