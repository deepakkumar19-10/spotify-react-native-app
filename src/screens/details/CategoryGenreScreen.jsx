import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import MediaCard from '../../components/common/MediaCard';
import TrackRow from '../../components/common/TrackRow';
import { playTrack } from '../../redux/slices/playerSlice';

import playlists from '../../data/playlists.json';
import tracks from '../../data/tracks.json';

export default function CategoryGenreScreen({ route, navigation }) {
  const { categoryId, categoryName, categoryColor } = route.params || {};
  const dispatch = useDispatch();

  const genreTracks = useMemo(() => {
    if (!categoryId) return tracks;
    if (categoryId === 'c1' || categoryId === 'c7') {
      // Hindi / Romance
      return tracks.filter((t) => t.artistId === 'ar1');
    }
    if (categoryId === 'c2') {
      // Punjabi
      return tracks.filter((t) => ['ar2', 'ar3', 'ar6', 'ar10'].includes(t.artistId));
    }
    if (categoryId === 'c3') {
      // Haryanvi
      return tracks.filter((t) => ['ar4', 'ar5'].includes(t.artistId));
    }
    if (categoryId === 'c4') {
      // Running
      return tracks.filter((t) => ['t19', 't20', 't21', 't22'].includes(t.id));
    }
    if (categoryId === 'c5') {
      // Motivation
      return tracks.filter((t) => ['t23', 't24', 't25', 't26'].includes(t.id));
    }
    if (categoryId === 'c6') {
      // Bhakti
      return tracks.filter((t) => ['ar7', 'ar9'].includes(t.artistId));
    }
    return tracks;
  }, [categoryId]);

  const genrePlaylists = useMemo(() => {
    if (!categoryId) return playlists;
    if (categoryId === 'c1') return playlists.filter((p) => p.id === 'p1');
    if (categoryId === 'c2') return playlists.filter((p) => p.id === 'p2');
    if (categoryId === 'c3') return playlists.filter((p) => p.id === 'p3');
    if (categoryId === 'c4') return playlists.filter((p) => p.id === 'p4');
    if (categoryId === 'c5') return playlists.filter((p) => p.id === 'p5');
    if (categoryId === 'c6') return playlists.filter((p) => ['p6', 'p8'].includes(p.id));
    return playlists;
  }, [categoryId]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: categoryColor || colors.accentBlue },
        ]}
      >
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || 'Genre'}</Text>
      </View>

      <FlatList
        data={genreTracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.playlistsHeader}>
            <Text style={styles.sectionTitle}>Popular Playlists</Text>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={genrePlaylists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: spacing.md }}
              renderItem={({ item }) => (
                <MediaCard
                  id={item.id}
                  title={item.title}
                  subtitle={`By ${item.creator}`}
                  imageUrl={item.coverUrl}
                  type="playlist"
                  onPress={() =>
                    navigation.navigate('PlaylistDetails', {
                      playlistId: item.id,
                    })
                  }
                />
              )}
            />
            <Text style={[styles.sectionTitle, { marginTop: spacing.xl, paddingHorizontal: spacing.md }]}>
              Popular Tracks
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TrackRow
            track={item}
            index={index}
            onPress={() =>
              dispatch(
                playTrack({
                  track: item,
                  contextTracks: genreTracks,
                  contextUri: `genre:${categoryId}`,
                })
              )
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 90,
    paddingHorizontal: spacing.md,
    justifyContent: 'flex-end',
    paddingBottom: spacing.sm,
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    paddingLeft: spacing.sm,
  },
  listContent: {
    paddingBottom: 130,
  },
  playlistsHeader: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
});
