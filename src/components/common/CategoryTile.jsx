import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function CategoryTile({ category, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.tile, { backgroundColor: category.color || '#1e3264' }]}
    >
      <Text numberOfLines={2} style={styles.name}>
        {category.name}
      </Text>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 98,
    borderRadius: 8,
    padding: spacing.md,
    margin: 6,
    overflow: 'hidden',
    position: 'relative',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    maxWidth: '75%',
    letterSpacing: -0.2,
  },
  imageWrapper: {
    position: 'absolute',
    bottom: -6,
    right: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 4,
    transform: [{ rotate: '25deg' }],
  },
});
