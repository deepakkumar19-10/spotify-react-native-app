import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import SingleAuthScreen from '../screens/auth/SingleAuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import NowPlayingModalScreen from '../screens/player/NowPlayingModalScreen';

import TrackOptionsSheet from '../components/modals/TrackOptionsSheet';
import CreatePlaylistModal from '../components/modals/CreatePlaylistModal';
import AddToPlaylistModal from '../components/modals/AddToPlaylistModal';
import CustomToast from '../components/common/CustomToast';
import useAudioController from '../hooks/useAudioController';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  useAudioController();

  return (
    <View style={styles.container}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isLoggedIn ? (
          <Stack.Screen
            name="SingleAuth"
            component={SingleAuthScreen}
            options={{
              animation: 'fade',
            }}
          />
        ) : (
          <Stack.Group>
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen
              name="NowPlayingModal"
              component={NowPlayingModalScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>

      {/* Global Modals & Overlays */}
      <TrackOptionsSheet />
      <CreatePlaylistModal />
      <AddToPlaylistModal />
      <CustomToast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
