import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import TrackRow from '../../components/common/TrackRow';
import { playTrack, toggleShuffle } from '../../redux/slices/playerSlice';
import { showToast } from '../../redux/slices/uiSlice';

import playlists from '../../data/playlists.json';
import tracks from '../../data/tracks.json';

export default function PlaylistDetailsScreen({ route, navigation }) {
  const { playlistId } = route.params || {};
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const { currentTrack, isPlaying, shuffleMode, contextUri } = useSelector(
    (state) => state.player
  );
  const { likedTrackIds, userPlaylists } = useSelector((state) => state.library);

  const isLikedSongs = playlistId === 'liked-songs';

  // Resolve playlist metadata
  const playlist = useMemo(() => {
    if (isLikedSongs) {
      return {
        id: 'liked-songs',
        title: 'Liked Songs',
        description: 'All your favorite songs saved in one place.',
        creator: 'You',
        coverUrl: null,
        trackIds: likedTrackIds,
        dominantColor: '#450af5',
      };
    }

    const fromUser = userPlaylists.find((p) => p.id === playlistId);
    if (fromUser) return fromUser;

    const fromCurated = playlists.find((p) => p.id === playlistId);
    if (fromCurated) return fromCurated;

    return {
      id: playlistId,
      title: 'Playlist',
      description: '',
      creator: 'Spotify',
      coverUrl: null,
      trackIds: [],
      dominantColor: '#282828',
    };
  }, [playlistId, isLikedSongs, likedTrackIds, userPlaylists]);

  // Resolve tracks
  const playlistTracks = useMemo(() => {
    if (!playlist?.trackIds) return [];
    return playlist.trackIds
      .map((tid) => tracks.find((t) => t.id === tid))
      .filter(Boolean);
  }, [playlist]);

  // Filtered tracks
  const displayedTracks = useMemo(() => {
    if (!searchQuery.trim()) return playlistTracks;
    const q = searchQuery.toLowerCase().trim();
    return playlistTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q)
    );
  }, [playlistTracks, searchQuery]);

  const thisContextUri = `playlist:${playlist.id}`;
  const isThisPlaying = contextUri === thisContextUri && isPlaying;

  const handlePlayCollection = () => {
    if (playlistTracks.length === 0) return;
    dispatch(
      playTrack({
        track: playlistTracks[0],
        contextTracks: playlistTracks,
        contextUri: thisContextUri,
      })
    );
  };

  const handlePlayIndividualTrack = (track) => {
    dispatch(
      playTrack({
        track,
        contextTracks: playlistTracks,
        contextUri: thisContextUri,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Back Chevron & Search */}
      <View style={styles.topBar}>
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() => setShowSearch(!showSearch)}
          style={styles.searchToggleBtn}
        >
          <Icon name="search" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Inline Search in playlist */}
      {showSearch && (
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Find in playlist"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            style={styles.searchInput}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
      )}

      {/* Tracklist with Header */}
      <FlatList
        data={displayedTracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            {/* Cover image */}
            <View style={styles.artworkBox}>
              {isLikedSongs ? (
                <View style={styles.likedSongsArtwork}>
                  <Icon name="heart" size={64} color="#FFFFFF" />
                </View>
              ) : playlist.coverUrl ? (
                <Image
                  source={{ uri: playlist.coverUrl }}
                  style={styles.artwork}
                />
              ) : (
                <View style={[styles.artwork, styles.artworkPlaceholder]}>
                  <Icon name="musical-notes" size={48} color={colors.textSecondary} />
                </View>
              )}
            </View>

            {/* Title & metadata */}
            <Text style={styles.title}>{playlist.title}</Text>
            {playlist.description ? (
              <Text style={styles.description}>{playlist.description}</Text>
            ) : null}

            <View style={styles.metaRow}>
              <Text style={styles.creator}>{playlist.creator}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.trackCount}>
                {playlistTracks.length} songs
              </Text>
            </View>

            {/* Actions Bar */}
            <View style={styles.actionBar}>
              <View style={styles.leftActions}>
                <TouchableOpacity
                  hitSlop={spacing.hitSlop}
                  style={styles.iconAction}
                  onPress={() => dispatch(showToast('Added to library'))}
                >
                  <Icon name="arrow-down-circle-outline" size={26} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={spacing.hitSlop}
                  style={styles.iconAction}
                  onPress={() => dispatch(toggleShuffle())}
                >
                  <Icon
                    name="shuffle"
                    size={26}
                    color={shuffleMode ? colors.spotifyGreen : colors.textSecondary}
                  />
                  {shuffleMode && <View style={styles.shuffleDot} />}
                </TouchableOpacity>
              </View>

              {/* Large Play/Pause FAB */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlayCollection}
                disabled={playlistTracks.length === 0}
                style={[
                  styles.playFab,
                  playlistTracks.length === 0 && { opacity: 0.4 },
                ]}
              >
                <Icon
                  name={isThisPlaying ? 'pause' : 'play'}
                  size={28}
                  color="#000000"
                  style={{ marginLeft: isThisPlaying ? 0 : 3 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item, index }) => (
          <TrackRow
            track={item}
            index={index}
            showIndex={true}
            playlistId={playlist.id}
            onPress={() => handlePlayIndividualTrack(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No songs match your search' : 'No songs in this playlist yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    padding: 6,
  },
  searchToggleBtn: {
    padding: 6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.elevated,
    marginHorizontal: spacing.lg,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 42,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: colors.textPrimary,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 130,
  },
  headerArea: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  artworkBox: {
    width: 190,
    height: 190,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
    marginBottom: spacing.lg,
  },
  artwork: {
    width: 190,
    height: 190,
    borderRadius: 8,
  },
  artworkPlaceholder: {
    backgroundColor: colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likedSongsArtwork: {
    width: 190,
    height: 190,
    borderRadius: 8,
    backgroundColor: colors.likedSongsPurple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  creator: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dot: {
    color: colors.textSecondary,
    marginHorizontal: 6,
  },
  trackCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconAction: {
    padding: 4,
    position: 'relative',
  },
  shuffleDot: {
    position: 'absolute',
    bottom: -1,
    left: '50%',
    marginLeft: 1,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.spotifyGreen,
  },
  playFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.spotifyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.spotifyGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
