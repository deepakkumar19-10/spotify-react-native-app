import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import TrackRow from '../../components/common/TrackRow';
import MediaCard from '../../components/common/MediaCard';
import { playTrack } from '../../redux/slices/playerSlice';
import { toggleFollowArtist } from '../../redux/slices/librarySlice';
import { showToast } from '../../redux/slices/uiSlice';

import artists from '../../data/artists.json';
import tracks from '../../data/tracks.json';
import albums from '../../data/albums.json';

export default function ArtistDetailsScreen({ route, navigation }) {
  const { artistId } = route.params || {};
  const dispatch = useDispatch();

  const { followedArtistIds } = useSelector((state) => state.library);
  const { currentTrack, isPlaying, contextUri } = useSelector(
    (state) => state.player
  );

  const artist = useMemo(
    () => artists.find((a) => a.id === artistId) || artists[0],
    [artistId]
  );

  const artistTracks = useMemo(() => {
    return tracks.filter((t) => t.artistId === artist.id);
  }, [artist]);

  const artistAlbums = useMemo(() => {
    return albums.filter((a) => a.artistId === artist.id);
  }, [artist]);

  const isFollowing = followedArtistIds.includes(artist.id);
  const thisContextUri = `artist:${artist.id}`;
  const isThisPlaying = contextUri === thisContextUri && isPlaying;

  const handlePlayArtist = () => {
    if (artistTracks.length === 0) return;
    dispatch(
      playTrack({
        track: artistTracks[0],
        contextTracks: artistTracks,
        contextUri: thisContextUri,
      })
    );
  };

  const handleToggleFollow = () => {
    dispatch(toggleFollowArtist(artist.id));
    dispatch(
      showToast(isFollowing ? `Unfollowed ${artist.name}` : `Following ${artist.name}`)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Banner */}
        <View style={styles.heroBanner}>
          <Image
            source={{ uri: artist.bannerImage || artist.image }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay} />

          {/* Floating Back Button */}
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Icon name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Artist Hero Info */}
          <View style={styles.heroInfo}>
            {artist.verified && (
              <View style={styles.verifiedRow}>
                <Icon name="checkmark-circle" size={16} color="#3d91f4" />
                <Text style={styles.verifiedText}>Verified Artist</Text>
              </View>
            )}
            <Text style={styles.artistName}>{artist.name}</Text>
            <Text style={styles.listenersCount}>
              {artist.monthlyListeners.toLocaleString()} monthly listeners
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={handleToggleFollow}
            style={[styles.followBtn, isFollowing && styles.followingBtn]}
          >
            <Text
              style={[
                styles.followBtnText,
                isFollowing && styles.followingBtnText,
              ]}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePlayArtist}
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

        {/* Popular Tracks Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
        </View>
        {artistTracks.slice(0, 5).map((track, idx) => (
          <TrackRow
            key={track.id}
            track={track}
            index={idx}
            showIndex={true}
            onPress={() =>
              dispatch(
                playTrack({
                  track,
                  contextTracks: artistTracks,
                  contextUri: thisContextUri,
                })
              )
            }
          />
        ))}

        {/* Discography Section */}
        {artistAlbums.length > 0 && (
          <View style={styles.discographySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Discography</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={artistAlbums}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: spacing.lg }}
              renderItem={({ item }) => (
                <MediaCard
                  id={item.id}
                  title={item.title}
                  subtitle={`${item.year} • ${item.type || 'Album'}`}
                  imageUrl={item.coverUrl}
                  type="album"
                  onPress={() =>
                    navigation.navigate('AlbumDetails', { albumId: item.id })
                  }
                />
              )}
            />
          </View>
        )}

        {/* About Card */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutCard}>
            <Image
              source={{ uri: artist.image }}
              style={styles.aboutImage}
            />
            <View style={styles.aboutContent}>
              <Text style={styles.aboutListeners}>
                {artist.monthlyListeners.toLocaleString()} monthly listeners
              </Text>
              <Text style={styles.aboutBio} numberOfLines={4}>
                {artist.bio}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 130,
  },
  heroBanner: {
    height: 280,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heroInfo: {
    position: 'absolute',
    bottom: 16,
    left: spacing.lg,
    right: spacing.lg,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  verifiedText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  artistName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  listenersCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  followBtn: {
    borderWidth: 1.5,
    borderColor: colors.textSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  followingBtn: {
    borderColor: colors.spotifyGreen,
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  followBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  followingBtnText: {
    color: colors.spotifyGreen,
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
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  discographySection: {
    marginTop: spacing.md,
  },
  aboutSection: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  aboutCard: {
    backgroundColor: colors.elevated,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  aboutImage: {
    width: '100%',
    height: 160,
  },
  aboutContent: {
    padding: spacing.md,
  },
  aboutListeners: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  aboutBio: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
