import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../functions/firebaseConfig'; // Adjust the path based on your project structure

export default function CreateAvatarScreen({ navigation }) {
  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [furColor, setFurColor] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [accessories, setAccessories] = useState('');
  const [error, setError] = useState('');

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError('User not authenticated');
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const dogDocRef = doc(db, 'users', user.uid, 'dogs', dogName);
    const dogDoc = await getDoc(dogDocRef);

    if (dogDoc.exists()) {
      setError('Dog profile already exists');
      return;
    }

    try {
      await setDoc(dogDocRef, {
        name: dogName,
        breed: breed,
        age: age,
        weight: weight,
        furColor: furColor,
        eyeColor: eyeColor,
        accessories: accessories
      });

      Alert.alert('Profile Saved', 'Your dog\'s profile has been saved successfully.');
      navigation.navigate('TrainVideos');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSkip = () => {
    navigation.navigate('TrainVideos');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Your Dog's Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Dog’s Name"
        value={dogName}
        onChangeText={setDogName}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fur Color"
        value={furColor}
        onChangeText={setFurColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Eye Color"
        value={eyeColor}
        onChangeText={setEyeColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Accessories (collar, bandana, etc.)"
        value={accessories}
        onChangeText={setAccessories}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Save Profile" onPress={handleSaveProfile} />
      <Button title="Skip" onPress={handleSkip} />
    </ScrollView>
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
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
});
