import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from './Icon';

export default function MediaCard({
  id,
  title,
  subtitle,
  imageUrl,
  type = 'playlist', // 'playlist' | 'album' | 'artist'
  onPress,
}) {
  const isArtist = type === 'artist';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageBox}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={[styles.image, isArtist && styles.artistImage]}
          />
        ) : (
          <View
            style={[
              styles.image,
              styles.placeholder,
              isArtist && styles.artistImage,
            ]}
          >
            <Icon
              name={isArtist ? 'person' : 'musical-note'}
              size={36}
              color={colors.textSecondary}
            />
          </View>
        )}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 146,
    marginRight: spacing.md,
  },
  imageBox: {
    width: 146,
    height: 146,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: 146,
    height: 146,
    borderRadius: 6,
  },
  artistImage: {
    borderRadius: 73,
  },
  placeholder: {
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11.5,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 15,
  },
});
