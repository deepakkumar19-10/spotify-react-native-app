import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import PlaylistDetailsScreen from '../screens/details/PlaylistDetailsScreen';
import AlbumDetailsScreen from '../screens/details/AlbumDetailsScreen';
import ArtistDetailsScreen from '../screens/details/ArtistDetailsScreen';
import CategoryGenreScreen from '../screens/details/CategoryGenreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="PlaylistDetails" component={PlaylistDetailsScreen} />
      <Stack.Screen name="AlbumDetails" component={AlbumDetailsScreen} />
      <Stack.Screen name="ArtistDetails" component={ArtistDetailsScreen} />
      <Stack.Screen name="CategoryGenre" component={CategoryGenreScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
