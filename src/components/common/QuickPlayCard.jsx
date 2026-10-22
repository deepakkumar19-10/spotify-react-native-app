import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from './Icon';

export default function QuickPlayCard({
  title,
  imageUrl,
  isLikedSongs = false,
  isPlaying = false,
  onPress,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      {/* Artwork */}
      <View style={styles.imageContainer}>
        {isLikedSongs ? (
          <View style={styles.likedSongsIconBox}>
            <Icon name="heart" size={20} color="#FFFFFF" />
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Icon name="musical-notes" size={20} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Title */}
      <Text numberOfLines={2} style={styles.title}>
        {title}
      </Text>

      {/* Active Equalizer / Indicator */}
      {isPlaying && (
        <View style={styles.playingIndicator}>
          <Icon name="volume-high" size={16} color={colors.spotifyGreen} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff1a',
    borderRadius: 6,
    overflow: 'hidden',
    margin: 4,
  },
  imageContainer: {
    width: 56,
    height: 56,
  },
  image: {
    width: 56,
    height: 56,
  },
  placeholder: {
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedSongsIconBox: {
    width: 56,
    height: 56,
    backgroundColor: colors.likedSongsPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingHorizontal: spacing.sm,
  },
  playingIndicator: {
    paddingRight: spacing.sm,
  },
});
