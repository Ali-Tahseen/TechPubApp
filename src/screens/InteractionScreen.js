import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../functions/firebaseConfig';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const InteractionScreen = ({ navigation }) => {
  const [dogData, setDogData] = useState(null);
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const [scrollValue, setScrollValue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogData = async () => {
      try {
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
              } else {
                Alert.alert('Error', 'Dog data not found.');
              }
            } else {
              Alert.alert('Error', 'Dog ID not found.');
            }
          } else {
            Alert.alert('Error', 'User data not found.');
          }
        } else {
          Alert.alert('Error', 'User not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching dog data:', error);
        Alert.alert('Error', 'Failed to fetch dog data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDogData();
  }, []);

  const handleRecordButtonPress = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecordedUri(uri);
        setRecording(null);
      } else {
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (error) {
      console.error('Error handling record button:', error);
    }
  };

  const handlePlayButtonPress = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: recordedUri });
      await soundObject.playAsync();
    } catch (error) {
      console.error('Error playing the audio:', error);
    }
  };

  const handleSendButtonPress = () => {
    if (dogData) {
      Alert.alert('Hug Sent', `Your hug has been sent to ${dogData.name}.`);
      setScrollValue(0);
    }
  };

  const handleDeleteButtonPress = () => {
    setRecordedUri(null);
    setRecording(null);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!dogData) {
    return (
      <View style={styles.container}>
        <Text>No dog data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Connect With {dogData.name}</Text>
      {dogData.photo && (
        <Image source={{ uri: dogData.photo }} style={styles.dogImage} />
      )}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          value={scrollValue}
          onValueChange={setScrollValue}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendButtonPress}
          disabled={scrollValue === 0}
        >
          <FontAwesome name="paper-plane" size={24} color="green" />
        </TouchableOpacity>
      </View>
      <Text>Send a Hug</Text>
      <TouchableOpacity style={styles.recordButton} onPress={handleRecordButtonPress}>
        {recording ? (
          <View style={styles.recordingIndicator}></View>
        ) : (
          <FontAwesome name="microphone" size={24} color="red" />
        )}
      </TouchableOpacity>
      <Text>Send a voice message</Text>
      {recordedUri && (
        <View style={styles.audioControls}>
          <TouchableOpacity onPress={handlePlayButtonPress}>
            <FontAwesome name="play" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { /* handle send audio message */ }}>
            <FontAwesome name="paper-plane" size={24} color="green" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteButtonPress}>
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
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
  dogImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
    borderRadius: 100,
  },
  placeholder: {
    fontSize: 24,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginLeft: 10,
  },
  recordButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 50,
    marginVertical: 12,
  },
  recordingIndicator: {
    width: 24,
    height: 24,
    backgroundColor: 'red',
    borderRadius: 12,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 12,
  },
  homeButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  homeButtonText: {
    color: 'white',
  },
});

export default InteractionScreen;
