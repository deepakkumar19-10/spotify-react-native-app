import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import FilterPillsBar from '../../components/common/FilterPillsBar';
import {
  openCreatePlaylistModal,
  showToast,
} from '../../redux/slices/uiSlice';
import {
  setActiveFilter,
  setSortBy,
  setViewMode,
} from '../../redux/slices/librarySlice';

import playlists from '../../data/playlists.json';
import albums from '../../data/albums.json';
import artists from '../../data/artists.json';

export default function LibraryScreen({ navigation }) {
  const dispatch = useDispatch();

  const {
    likedTrackIds,
    userPlaylists,
    savedAlbumIds,
    followedArtistIds,
    activeFilter,
    sortBy,
    viewMode,
  } = useSelector((state) => state.library);
  const { user } = useSelector((state) => state.auth);

  // Compile library items
  const allItems = useMemo(() => {
    const list = [];

    // Pinned Liked Songs item
    list.push({
      id: 'liked-songs',
      type: 'liked-songs',
      title: 'Liked Songs',
      subtitle: `Playlist • ${likedTrackIds.length} songs`,
      imageUrl: null,
      isPinned: true,
    });

    // User-created playlists
    userPlaylists.forEach((pl) => {
      list.push({
        id: pl.id,
        type: 'user-playlist',
        title: pl.title,
        subtitle: `Playlist • ${pl.creator}`,
        imageUrl: pl.coverUrl,
        trackCount: pl.trackIds.length,
      });
    });

    // Curated playlists
    playlists.forEach((pl) => {
      list.push({
        id: pl.id,
        type: 'playlist',
        title: pl.title,
        subtitle: `Playlist • ${pl.creator}`,
        imageUrl: pl.coverUrl,
      });
    });

    // Saved albums
    savedAlbumIds.forEach((aid) => {
      const alb = albums.find((a) => a.id === aid);
      if (alb) {
        list.push({
          id: alb.id,
          type: 'album',
          title: alb.title,
          subtitle: `Album • ${alb.artistName}`,
          imageUrl: alb.coverUrl,
        });
      }
    });

    // Followed artists
    followedArtistIds.forEach((arid) => {
      const art = artists.find((a) => a.id === arid);
      if (art) {
        list.push({
          id: art.id,
          type: 'artist',
          title: art.name,
          subtitle: 'Artist',
          imageUrl: art.image,
        });
      }
    });

    return list;
  }, [likedTrackIds, userPlaylists, savedAlbumIds, followedArtistIds]);

  // Filter items
  const filteredItems = useMemo(() => {
    let result = allItems;
    if (activeFilter === 'Playlists') {
      result = result.filter(
        (i) => i.type === 'playlist' || i.type === 'user-playlist' || i.type === 'liked-songs'
      );
    } else if (activeFilter === 'Artists') {
      result = result.filter((i) => i.type === 'artist');
    } else if (activeFilter === 'Albums') {
      result = result.filter((i) => i.type === 'album');
    } else if (activeFilter === 'Liked') {
      result = result.filter((i) => i.type === 'liked-songs');
    }
    return result;
  }, [allItems, activeFilter]);

  const handleItemPress = (item) => {
    if (item.type === 'liked-songs') {
      navigation.navigate('PlaylistDetails', { playlistId: 'liked-songs' });
    } else if (item.type === 'user-playlist' || item.type === 'playlist') {
      navigation.navigate('PlaylistDetails', { playlistId: item.id });
    } else if (item.type === 'album') {
      navigation.navigate('AlbumDetails', { albumId: item.id });
    } else if (item.type === 'artist') {
      navigation.navigate('ArtistDetails', { artistId: item.id });
    }
  };

  const handleOpenCreatePlaylist = () => {
    dispatch(openCreatePlaylistModal());
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.avatarBtn}
        >
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(user?.name || 'S')[0].toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Your Library</Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            style={styles.actionBtn}
            onPress={() => navigation.navigate('Search')}
          >
            <Icon name="search" size={24} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            style={styles.actionBtn}
            onPress={handleOpenCreatePlaylist}
          >
            <Icon name="add" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips Bar */}
      <FilterPillsBar
        pills={['All', 'Playlists', 'Artists', 'Albums', 'Liked']}
        activePill={activeFilter}
        onSelectPill={(pill) => dispatch(setActiveFilter(pill))}
      />

      {/* Sort / View Switcher Row */}
      <View style={styles.subHeaderRow}>
        <TouchableOpacity style={styles.sortBtn}>
          <Icon
            name="swap-vertical"
            size={16}
            color={colors.textPrimary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.sortText}>{sortBy}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() =>
            dispatch(setViewMode(viewMode === 'list' ? 'grid' : 'list'))
          }
          style={styles.viewModeBtn}
        >
          <Icon
            name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
            size={20}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Library Items List */}
      <FlatList
        key={viewMode}
        data={filteredItems}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        numColumns={viewMode === 'grid' ? 2 : 1}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isArtist = item.type === 'artist';

          if (viewMode === 'grid') {
            return (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleItemPress(item)}
                style={styles.gridCard}
              >
                {item.type === 'liked-songs' ? (
                  <View style={styles.likedSongsGridBox}>
                    <Icon name="heart" size={36} color="#FFFFFF" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={[styles.gridImage, isArtist && styles.gridArtistImage]}
                  />
                )}
                <Text numberOfLines={1} style={styles.gridTitle}>
                  {item.title}
                </Text>
                <Text numberOfLines={1} style={styles.gridSubtitle}>
                  {item.subtitle}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleItemPress(item)}
              style={styles.listItem}
            >
              {item.type === 'liked-songs' ? (
                <View style={styles.likedSongsBox}>
                  <Icon name="heart" size={24} color="#FFFFFF" />
                </View>
              ) : (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={[styles.artwork, isArtist && styles.artistArtwork]}
                />
              )}

              <View style={styles.itemMeta}>
                <View style={styles.titleRow}>
                  {item.isPinned && (
                    <Icon
                      name="pin"
                      size={13}
                      color={colors.spotifyGreen}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text numberOfLines={1} style={styles.itemTitle}>
                    {item.title}
                  </Text>
                </View>
                <Text numberOfLines={1} style={styles.itemSubtitle}>
                  {item.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  avatarBtn: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatarPlaceholder: {
    backgroundColor: '#535353',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionBtn: {
    padding: 4,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    color: colors.textPrimary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  viewModeBtn: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingBottom: 130,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  artistArtwork: {
    borderRadius: 30,
  },
  likedSongsBox: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: colors.likedSongsPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  itemMeta: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
    flex: 1,
  },
  itemSubtitle: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  gridCard: {
    flex: 1,
    margin: spacing.sm,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  gridArtistImage: {
    borderRadius: 999,
  },
  likedSongsGridBox: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 6,
    backgroundColor: colors.likedSongsPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  gridTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  gridSubtitle: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
