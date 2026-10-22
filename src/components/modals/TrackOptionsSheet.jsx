import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../common/Icon';
import {
  closeTrackOptions,
  openAddToPlaylistModal,
  showToast,
} from '../../redux/slices/uiSlice';
import {
  toggleLikeTrack,
  removeTrackFromPlaylist,
} from '../../redux/slices/librarySlice';
import { addToQueue } from '../../redux/slices/playerSlice';

export default function TrackOptionsSheet() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { trackOptionsModal } = useSelector((state) => state.ui);
  const { likedTrackIds } = useSelector((state) => state.library);

  const { visible, track, playlistId } = trackOptionsModal;

  if (!visible || !track) return null;

  const isLiked = likedTrackIds.includes(track.id);

  const handleClose = () => {
    dispatch(closeTrackOptions());
  };

  const handleToggleLike = () => {
    dispatch(toggleLikeTrack(track.id));
    dispatch(
      showToast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs')
    );
    handleClose();
  };

  const handleAddToQueue = () => {
    dispatch(addToQueue(track));
    dispatch(showToast(`Added to queue: ${track.title}`));
    handleClose();
  };

  const handleOpenAddToPlaylist = () => {
    handleClose();
    setTimeout(() => {
      dispatch(openAddToPlaylistModal(track));
    }, 150);
  };

  const handleRemoveFromPlaylist = () => {
    if (playlistId) {
      dispatch(removeTrackFromPlaylist({ playlistId, trackId: track.id }));
      dispatch(showToast(`Removed from playlist`));
    }
    handleClose();
  };

  const handleGoToArtist = () => {
    handleClose();
    navigation.navigate('ArtistDetails', { artistId: track.artistId });
  };

  const handleGoToAlbum = () => {
    handleClose();
    navigation.navigate('AlbumDetails', { albumId: track.albumId });
  };

  const handleShare = async () => {
    handleClose();
    try {
      await Share.share({
        message: `Listen to "${track.title}" by ${track.artist} on Spotify!`,
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Header preview */}
              <View style={styles.trackPreview}>
                <Image
                  source={{ uri: track.coverUrl }}
                  style={styles.artwork}
                />
                <View style={styles.meta}>
                  <Text numberOfLines={1} style={styles.title}>
                    {track.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.artist}>
                    {track.artist}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Action List */}
              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleToggleLike}
              >
                <Icon
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isLiked ? colors.spotifyGreen : colors.textPrimary}
                />
                <Text style={styles.actionText}>
                  {isLiked ? 'Remove from your Liked Songs' : 'Like'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleOpenAddToPlaylist}
              >
                <Icon name="add-circle-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.actionText}>Add to playlist</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleAddToQueue}
              >
                <Icon name="list-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.actionText}>Add to queue</Text>
              </TouchableOpacity>

              {playlistId && (
                <TouchableOpacity
                  style={styles.actionRow}
                  onPress={handleRemoveFromPlaylist}
                >
                  <Icon name="trash-outline" size={24} color={colors.accentRed} />
                  <Text style={[styles.actionText, { color: colors.accentRed }]}>
                    Remove from this playlist
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleGoToArtist}
              >
                <Icon name="person-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.actionText}>View artist</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleGoToAlbum}
              >
                <Icon name="disc-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.actionText}>View album</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionRow}
                onPress={handleShare}
              >
                <Icon name="share-outline" size={24} color={colors.textPrimary} />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: colors.bottomSheet,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: spacing.lg,
    paddingBottom: 32,
    paddingHorizontal: spacing.lg,
  },
  trackPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 6,
    marginRight: spacing.md,
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  artist: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.lg,
  },
});
