import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../common/Icon';
import { togglePlayPause } from '../../redux/slices/playerSlice';
import { toggleLikeTrack } from '../../redux/slices/librarySlice';
import { showToast } from '../../redux/slices/uiSlice';

export default function MiniPlayerBar() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { currentTrack, isPlaying, position, duration } = useSelector(
    (state) => state.player
  );
  const { likedTrackIds } = useSelector((state) => state.library);

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (position / duration) * 100 : 0;

  const handleOpenNowPlaying = () => {
    navigation.navigate('NowPlayingModal');
  };

  const handleToggleLike = (e) => {
    e?.stopPropagation?.();
    dispatch(toggleLikeTrack(currentTrack.id));
    dispatch(
      showToast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs')
    );
  };

  const handleTogglePlay = (e) => {
    e?.stopPropagation?.();
    dispatch(togglePlayPause());
  };

  const barBg = currentTrack.dominantColor
    ? currentTrack.dominantColor
    : colors.miniPlayerBackground;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleOpenNowPlaying}
        style={[styles.container, { backgroundColor: barBg }]}
      >
        {/* Cover Art */}
        <Image
          source={{ uri: currentTrack.coverUrl }}
          style={styles.artwork}
        />

        {/* Title & Artist */}
        <View style={styles.metaContainer}>
          <Text numberOfLines={1} style={styles.title}>
            {currentTrack.title}
          </Text>
          <Text numberOfLines={1} style={styles.artist}>
            {currentTrack.artist}
          </Text>
        </View>

        {/* Like Button */}
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={handleToggleLike}
          style={styles.actionButton}
        >
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={22}
            color={isLiked ? colors.spotifyGreen : colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Play / Pause Button */}
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={handleTogglePlay}
          style={styles.actionButton}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={26}
            color={colors.textPrimary}
          />
        </TouchableOpacity>

        {/* Bottom Progress Bar */}
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 58, // sitting directly above custom bottom tab bar
    left: 0,
    right: 0,
    zIndex: 100,
  },
  container: {
    height: 56,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  metaContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  artist: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBackground: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 2.5,
    backgroundColor: '#ffffff26',
    borderRadius: 2,
  },
  progressFill: {
    height: 2.5,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
  },
});
