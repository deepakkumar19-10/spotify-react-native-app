import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../redux/slices/uiSlice';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function CustomToast() {
  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (toast.visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          dispatch(hideToast());
        });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [toast.visible, fadeAnim, slideAnim, dispatch]);

  if (!toast.visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      pointerEvents="none"
    >
      <View style={styles.toastBox}>
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 125, // above MiniPlayer and Bottom Tabs
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastBox: {
    backgroundColor: colors.accentBlue,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  toastText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
