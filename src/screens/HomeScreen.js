import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../functions/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [dogData, setDogData] = useState(null);
  const [showFullAbout, setShowFullAbout] = useState(false);

  const fetchDogData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const dogID = userDocSnap.data().dogID;
        if (dogID) {
          const dogDocRef = doc(db, 'users', user.uid, 'dogs', dogID);
          const dogDocSnap = await getDoc(dogDocRef);
          if (dogDocSnap.exists()) {
            setDogData(dogDocSnap.data());
          }
        }
      }
    }
  };

  useEffect(() => {
    fetchDogData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDogData();
    }, [])
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user" size={24} color="black" style={{ marginRight: 15 }} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const toggleShowFullAbout = () => {
    setShowFullAbout(!showFullAbout);
  };

  if (!dogData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{dogData.name}</Text>
      <Text>Age: {dogData.age}</Text>
      <Text>Gender: {dogData.gender}</Text>
      <Text>Breed: {dogData.breed}</Text>
      <Text>Weight: {dogData.weight}</Text>
      <Text>Height: {dogData.height}</Text>
      <Text>Fur Color: {dogData.furColor}</Text>
      <Text>Behaviors:</Text>
      {dogData.behaviors.map((behavior, index) => (
        <Text key={index} style={styles.behaviorItem}>{behavior}</Text>
      ))}
      {dogData.photo && <Image source={{ uri: dogData.photo }} style={styles.photo} />}
      <Text>
        About: {showFullAbout ? dogData.about : dogData.about.split(' ').slice(0, 20).join(' ')}
        {dogData.about.split(' ').length > 20 && (
          <Text style={styles.moreText} onPress={toggleShowFullAbout}>
            {showFullAbout ? ' Less' : '... More'}
          </Text>
        )}
      </Text>
      <Button 
        title="Send Hug/Voice" 
        onPress={() => navigation.navigate('Interaction')}
      />
      <Button 
        title="Map" 
        onPress={() => Alert.alert('Map', 'Map feature coming soon!')} 
      />
      <Button 
        title="Heartrate" 
        onPress={() => Alert.alert('Heartrate', 'Heartrate feature coming soon!')} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  photo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 12,
  },
  moreText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  behaviorItem: {
    marginLeft: 10,
    marginVertical: 2,
  },
});
