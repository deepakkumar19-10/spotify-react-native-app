import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from './Icon';
import { toggleLikeTrack } from '../../redux/slices/librarySlice';
import { openTrackOptions, showToast } from '../../redux/slices/uiSlice';

export default function TrackRow({
  track,
  index,
  showArtwork = true,
  showIndex = false,
  playlistId,
  onPress,
}) {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const { likedTrackIds } = useSelector((state) => state.library);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;
  const isLiked = likedTrackIds.includes(track.id);

  const handleToggleLike = () => {
    dispatch(toggleLikeTrack(track.id));
    dispatch(
      showToast(isLiked ? 'Removed from your Liked Songs' : 'Added to your Liked Songs')
    );
  };

  const handleOpenOptions = () => {
    dispatch(openTrackOptions({ track, playlistId }));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[styles.row, isCurrentTrack && styles.activeRow]}
    >
      {/* Index Number */}
      {showIndex && (
        <View style={styles.indexBox}>
          {isCurrentlyPlaying ? (
            <Icon name="volume-high" size={16} color={colors.spotifyGreen} />
          ) : (
            <Text style={[styles.indexText, isCurrentTrack && styles.activeText]}>
              {index + 1}
            </Text>
          )}
        </View>
      )}

      {/* Artwork */}
      {showArtwork && (
        <Image source={{ uri: track.coverUrl }} style={styles.artwork} />
      )}

      {/* Title & Artist info */}
      <View style={styles.metaContainer}>
        <Text
          numberOfLines={1}
          style={[styles.title, isCurrentTrack && styles.activeText]}
        >
          {track.title}
        </Text>
        <View style={styles.artistRow}>
          {track.explicit && (
            <View style={styles.explicitBadge}>
              <Text style={styles.explicitText}>E</Text>
            </View>
          )}
          <Text numberOfLines={1} style={styles.artist}>
            {track.artist}
          </Text>
        </View>
      </View>

      {/* Like / Heart Icon */}
      <TouchableOpacity
        hitSlop={spacing.hitSlop}
        onPress={handleToggleLike}
        style={styles.iconButton}
      >
        <Icon
          name={isLiked ? 'heart' : 'heart-outline'}
          size={20}
          color={isLiked ? colors.spotifyGreen : colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Options / 3-dots */}
      <TouchableOpacity
        hitSlop={spacing.hitSlop}
        onPress={handleOpenOptions}
        style={styles.iconButton}
      >
        <Icon
          name="ellipsis-vertical"
          size={18}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  activeRow: {
    backgroundColor: '#ffffff0a',
  },
  indexBox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  indexText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  artwork: {
    width: 46,
    height: 46,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  metaContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  activeText: {
    color: colors.spotifyGreen,
    fontWeight: '700',
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  explicitBadge: {
    backgroundColor: colors.textSecondary,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginRight: 6,
  },
  explicitText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
  },
  artist: {
    fontSize: 12.5,
    color: colors.textSecondary,
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
