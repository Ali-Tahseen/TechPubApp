import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from './src/functions/firebaseConfig';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import CreateAvatarScreen from './src/screens/CreateAvatarScreen';
import TrainVideos from './src/screens/TrainVideos';
import InteractionScreen from './src/screens/InteractionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';

const Stack = createStackNavigator();

export default function App() {
  const checkDogData = async (navigation) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists() && !userDocSnap.data().dogID) {
        navigation.replace('CreateAvatar');
      }
    }
  };

  const HomeComponent = (props) => {
    useEffect(() => {
      checkDogData(props.navigation);
    }, [props.navigation]);

    return <HomeScreen {...props} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeComponent} />
        <Stack.Screen name="CreateAvatar" component={CreateAvatarScreen} />
        <Stack.Screen name="TrainVideos" component={TrainVideos} />
        <Stack.Screen name="Interaction" component={InteractionScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
