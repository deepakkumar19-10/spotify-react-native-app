import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import TrackRow from '../../components/common/TrackRow';
import MediaCard from '../../components/common/MediaCard';
import { playTrack } from '../../redux/slices/playerSlice';
import { toggleSaveAlbum } from '../../redux/slices/librarySlice';
import { showToast } from '../../redux/slices/uiSlice';

import albums from '../../data/albums.json';
import tracks from '../../data/tracks.json';
import artists from '../../data/artists.json';

export default function AlbumDetailsScreen({ route, navigation }) {
  const { albumId } = route.params || {};
  const dispatch = useDispatch();

  const { currentTrack, isPlaying, contextUri } = useSelector((state) => state.player);
  const { savedAlbumIds } = useSelector((state) => state.library);

  const album = useMemo(() => albums.find((a) => a.id === albumId) || albums[0], [albumId]);
  const artist = useMemo(() => artists.find((ar) => ar.id === album.artistId), [album]);

  const albumTracks = useMemo(() => {
    return (album?.trackIds || [])
      .map((tid) => tracks.find((t) => t.id === tid))
      .filter(Boolean);
  }, [album]);

  const moreAlbums = useMemo(() => {
    return albums.filter((a) => a.artistId === album.artistId && a.id !== album.id);
  }, [album]);

  const isSaved = savedAlbumIds.includes(album.id);
  const thisContextUri = `album:${album.id}`;
  const isThisPlaying = contextUri === thisContextUri && isPlaying;

  const handlePlayAlbum = () => {
    if (albumTracks.length === 0) return;
    dispatch(
      playTrack({
        track: albumTracks[0],
        contextTracks: albumTracks,
        contextUri: thisContextUri,
      })
    );
  };

  const handleToggleSave = () => {
    dispatch(toggleSaveAlbum(album.id));
    dispatch(
      showToast(isSaved ? 'Removed from Your Library' : 'Saved to Your Library')
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={albumTracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerArea}>
            <Image source={{ uri: album.coverUrl }} style={styles.artwork} />
            <Text style={styles.title}>{album.title}</Text>

            {/* Artist link row */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate('ArtistDetails', { artistId: album.artistId })
              }
              style={styles.artistRow}
            >
              {artist?.image ? (
                <Image source={{ uri: artist.image }} style={styles.artistAvatar} />
              ) : null}
              <Text style={styles.artistName}>{album.artistName}</Text>
            </TouchableOpacity>

            <Text style={styles.metaText}>
              {album.type || 'Album'} • {album.year}
            </Text>

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <TouchableOpacity
                hitSlop={spacing.hitSlop}
                onPress={handleToggleSave}
                style={styles.heartBtn}
              >
                <Icon
                  name={isSaved ? 'heart' : 'heart-outline'}
                  size={26}
                  color={isSaved ? colors.spotifyGreen : colors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlayAlbum}
                style={styles.playFab}
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
            showArtwork={false}
            onPress={() =>
              dispatch(
                playTrack({
                  track: item,
                  contextTracks: albumTracks,
                  contextUri: thisContextUri,
                })
              )
            }
          />
        )}
        ListFooterComponent={
          moreAlbums.length > 0 ? (
            <View style={styles.footerArea}>
              <Text style={styles.moreHeader}>More by {album.artistName}</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={moreAlbums}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <MediaCard
                    id={item.id}
                    title={item.title}
                    subtitle={`${item.year} • ${item.type || 'Album'}`}
                    imageUrl={item.coverUrl}
                    type="album"
                    onPress={() =>
                      navigation.push('AlbumDetails', { albumId: item.id })
                    }
                  />
                )}
              />
            </View>
          ) : null
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
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    padding: 6,
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
  artwork: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  artistAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  artistName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.lg,
  },
  heartBtn: {
    padding: 6,
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
  footerArea: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  moreHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
});
