import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../functions/firebaseConfig';
import { doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this account?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const userDocRef = doc(db, 'users', user.uid);
              const userDocSnap = await getDoc(userDocRef);
              const dogID = userDocSnap.exists() ? userDocSnap.data().dogID : null;

              if (dogID) {
                // Delete dog document
                const dogDocRef = doc(db, 'users', user.uid, 'dogs', dogID);
                await deleteDoc(dogDocRef);
              }

              // Remove dog's ID from user document
              await updateDoc(userDocRef, {
                dogID: ''
              });

              Alert.alert('Account Deleted', 'Your account has been deleted.');
              navigation.replace('CreateAvatar');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Account Settings</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notifications')}>
        <Text style={styles.buttonText}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Subscription')}>
        <Text style={styles.buttonText}>Subscription</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HelpSupport')}>
        <Text style={styles.buttonText}>Help & Support</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Log Out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  logoutButtonText: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#fff',
  },
});

export default ProfileScreen;
