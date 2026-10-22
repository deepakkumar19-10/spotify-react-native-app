import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import CategoryTile from '../../components/common/CategoryTile';
import TrackRow from '../../components/common/TrackRow';
import MediaCard from '../../components/common/MediaCard';
import {
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from '../../redux/slices/librarySlice';
import { playTrack } from '../../redux/slices/playerSlice';

import categories from '../../data/categories.json';
import tracks from '../../data/tracks.json';
import artists from '../../data/artists.json';
import albums from '../../data/albums.json';
import playlists from '../../data/playlists.json';

export default function SearchScreen({ navigation }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Top'); // 'Top' | 'Songs' | 'Artists' | 'Albums' | 'Playlists'

  const { recentSearches } = useSelector((state) => state.library);

  // Search Results computation
  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    const matchedTracks = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );

    const matchedArtists = artists.filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    const matchedAlbums = albums.filter(
      (al) =>
        al.title.toLowerCase().includes(q) ||
        al.artistName.toLowerCase().includes(q)
    );

    const matchedPlaylists = playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    return {
      tracks: matchedTracks,
      artists: matchedArtists,
      albums: matchedAlbums,
      playlists: matchedPlaylists,
    };
  }, [query]);

  const handleSelectRecent = (term) => {
    setQuery(term);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      dispatch(addRecentSearch(query.trim()));
    }
  };

  const handlePlayTrackItem = (track) => {
    dispatch(addRecentSearch(track.title));
    dispatch(
      playTrack({
        track,
        contextTracks: results?.tracks || [track],
        contextUri: `search:${query}`,
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Search Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={22}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="What do you want to listen to?"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity
              hitSlop={spacing.hitSlop}
              onPress={() => setQuery('')}
              style={styles.clearBtn}
            >
              <Icon name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs when query is present */}
        {query.length > 0 && (
          <View style={styles.tabsRow}>
            {['Top', 'Songs', 'Artists', 'Albums', 'Playlists'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              >
                <Text
                  style={[
                    styles.tabPillText,
                    activeTab === tab && styles.tabPillTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Content */}
      {!query ? (
        /* Empty State: Recent Searches + Browse All Categories */
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.recentSection}>
                  <View style={styles.recentHeaderRow}>
                    <Text style={styles.sectionHeader}>Recent searches</Text>
                    <TouchableOpacity
                      onPress={() => dispatch(clearRecentSearches())}
                    >
                      <Text style={styles.clearAllText}>Clear all</Text>
                    </TouchableOpacity>
                  </View>

                  {recentSearches.map((item, idx) => (
                    <TouchableOpacity
                      key={`recent-${idx}`}
                      onPress={() => handleSelectRecent(item)}
                      style={styles.recentItem}
                    >
                      <Icon
                        name="time-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.recentText}>{item}</Text>
                      <TouchableOpacity
                        hitSlop={spacing.hitSlop}
                        onPress={() => dispatch(removeRecentSearch(item))}
                      >
                        <Icon name="close" size={18} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <Text style={[styles.sectionHeader, { marginTop: spacing.lg }]}>
                Browse all
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CategoryTile
              category={item}
              onPress={() =>
                navigation.navigate('CategoryGenre', {
                  categoryId: item.id,
                  categoryName: item.name,
                  categoryColor: item.color,
                })
              }
            />
          )}
        />
      ) : (
        /* Active Search Results */
        <FlatList
          data={[]}
          keyExtractor={() => 'dummy'}
          renderItem={null}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              {/* Top / Songs View */}
              {(activeTab === 'Top' || activeTab === 'Songs') && (
                <View style={styles.resultGroup}>
                  <Text style={styles.sectionHeader}>Songs</Text>
                  {results?.tracks.length === 0 ? (
                    <Text style={styles.noResultsText}>No songs found</Text>
                  ) : (
                    results?.tracks
                      .slice(0, activeTab === 'Songs' ? 20 : 4)
                      .map((t, idx) => (
                        <TrackRow
                          key={t.id}
                          track={t}
                          index={idx}
                          onPress={() => handlePlayTrackItem(t)}
                        />
                      ))
                  )}
                </View>
              )}

              {/* Artists View */}
              {(activeTab === 'Top' || activeTab === 'Artists') &&
                results?.artists.length > 0 && (
                  <View style={styles.resultGroup}>
                    <Text style={styles.sectionHeader}>Artists</Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={results.artists}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <MediaCard
                          id={item.id}
                          title={item.name}
                          subtitle="Artist"
                          imageUrl={item.image}
                          type="artist"
                          onPress={() =>
                            navigation.navigate('ArtistDetails', {
                              artistId: item.id,
                            })
                          }
                        />
                      )}
                    />
                  </View>
                )}

              {/* Albums View */}
              {(activeTab === 'Top' || activeTab === 'Albums') &&
                results?.albums.length > 0 && (
                  <View style={styles.resultGroup}>
                    <Text style={styles.sectionHeader}>Albums</Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={results.albums}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <MediaCard
                          id={item.id}
                          title={item.title}
                          subtitle={`${item.year} • ${item.artistName}`}
                          imageUrl={item.coverUrl}
                          type="album"
                          onPress={() =>
                            navigation.navigate('AlbumDetails', {
                              albumId: item.id,
                            })
                          }
                        />
                      )}
                    />
                  </View>
                )}

              {/* Playlists View */}
              {(activeTab === 'Top' || activeTab === 'Playlists') &&
                results?.playlists.length > 0 && (
                  <View style={styles.resultGroup}>
                    <Text style={styles.sectionHeader}>Playlists</Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={results.playlists}
                      keyExtractor={(item) => item.id}
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
                  </View>
                )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: spacing.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    color: '#000000',
    fontSize: 14.5,
    fontWeight: '600',
  },
  clearBtn: {
    padding: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.elevated,
  },
  tabPillActive: {
    backgroundColor: colors.spotifyGreen,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tabPillTextActive: {
    color: '#000000',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: 130,
  },
  recentSection: {
    marginBottom: spacing.md,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
  },
  recentText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  resultGroup: {
    marginTop: spacing.lg,
  },
  noResultsText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
});
