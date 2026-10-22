import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../common/Icon';
import {
  closeAddToPlaylistModal,
  openCreatePlaylistModal,
  showToast,
} from '../../redux/slices/uiSlice';
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from '../../redux/slices/librarySlice';

export default function AddToPlaylistModal() {
  const dispatch = useDispatch();
  const { addToPlaylistModal } = useSelector((state) => state.ui);
  const { userPlaylists } = useSelector((state) => state.library);

  const { visible, track } = addToPlaylistModal;

  if (!visible || !track) return null;

  const handleClose = () => {
    dispatch(closeAddToPlaylistModal());
  };

  const handleToggleTrackInPlaylist = (playlist) => {
    const isIncluded = playlist.trackIds.includes(track.id);
    if (isIncluded) {
      dispatch(
        removeTrackFromPlaylist({
          playlistId: playlist.id,
          trackId: track.id,
        })
      );
      dispatch(showToast(`Removed from ${playlist.title}`));
    } else {
      dispatch(
        addTrackToPlaylist({
          playlistId: playlist.id,
          trackId: track.id,
        })
      );
      dispatch(showToast(`Added to ${playlist.title}`));
    }
  };

  const handleNewPlaylist = () => {
    handleClose();
    setTimeout(() => {
      dispatch(openCreatePlaylistModal());
    }, 150);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={handleClose}
            style={styles.closeBtn}
          >
            <Icon name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add to playlist</Text>
          <View style={styles.closeBtn} />
        </View>

        {/* New Playlist CTA */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleNewPlaylist}
          style={styles.newPlaylistRow}
        >
          <View style={styles.plusBox}>
            <Icon name="add" size={26} color="#000000" />
          </View>
          <Text style={styles.newPlaylistText}>New playlist</Text>
        </TouchableOpacity>

        {/* Playlists List */}
        <FlatList
          data={userPlaylists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isChecked = item.trackIds.includes(track.id);
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleToggleTrackInPlaylist(item)}
                style={styles.playlistRow}
              >
                <Image
                  source={{ uri: item.coverUrl }}
                  style={styles.playlistArtwork}
                />
                <View style={styles.playlistMeta}>
                  <Text numberOfLines={1} style={styles.playlistTitle}>
                    {item.title}
                  </Text>
                  <Text style={styles.playlistTracks}>
                    {item.trackIds.length} songs
                  </Text>
                </View>

                {/* Checkbox indicator */}
                <View
                  style={[
                    styles.checkbox,
                    isChecked && styles.checkboxActive,
                  ]}
                >
                  {isChecked && (
                    <Icon name="checkmark" size={16} color="#000000" />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No custom playlists yet</Text>
              <Text style={styles.emptySubText}>
                Tap "New playlist" above to create one.
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  newPlaylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  plusBox: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  newPlaylistText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  playlistArtwork: {
    width: 48,
    height: 48,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  playlistMeta: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  playlistTracks: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.spotifyGreen,
    borderColor: colors.spotifyGreen,
  },
  emptyBox: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  emptySubText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
