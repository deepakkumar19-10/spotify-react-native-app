import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  likedTrackIds: ['t1', 't4', 't7', 't13'],
  userPlaylists: [
    {
      id: 'upl_1',
      title: 'My Driving Jam',
      description: 'Songs to blast with the windows down',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop',
      creator: 'You',
      trackIds: ['t6', 't9', 't14'],
      dominantColor: '#831843',
      createdAt: '2024-01-15',
    },
    {
      id: 'upl_2',
      title: 'Workout Energy',
      description: 'High bpm beats to push hard',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400&fit=crop',
      creator: 'You',
      trackIds: ['t3', 't4', 't16'],
      dominantColor: '#1e3a8a',
      createdAt: '2024-02-10',
    },
  ],
  savedAlbumIds: ['al1', 'al3'],
  followedArtistIds: ['ar1', 'ar3', 'ar10'],
  recentlyPlayed: [
    { type: 'playlist', id: 'p1', title: "Today's Top Hits", subtitle: 'Playlist • Spotify', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop' },
    { type: 'album', id: 'al1', title: 'Neon Dreams', subtitle: 'Album • Luna Echoes', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop' },
    { type: 'artist', id: 'ar1', title: 'Luna Echoes', subtitle: 'Artist', imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
  ],
  recentSearches: ['Synthwave', 'Luna Echoes', 'Lo-Fi Cafe', 'Future Bass'],
  activeFilter: 'All', // 'All' | 'Playlists' | 'Artists' | 'Albums' | 'Downloaded'
  sortBy: 'Recents', // 'Recents' | 'Recently Added' | 'Alphabetical' | 'Creator'
  viewMode: 'list', // 'list' | 'grid'
  playlistCounter: 2,
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    toggleLikeTrack(state, action) {
      const trackId = action.payload;
      const idx = state.likedTrackIds.indexOf(trackId);
      if (idx >= 0) {
        state.likedTrackIds.splice(idx, 1);
      } else {
        state.likedTrackIds.push(trackId);
      }
    },
    createPlaylist(state, action) {
      state.playlistCounter += 1;
      const { name, description, coverUrl } = action.payload || {};
      const newPlaylist = {
        id: `upl_${Date.now()}`,
        title: name || `My Playlist #${state.playlistCounter}`,
        description: description || '',
        coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop',
        creator: 'You',
        trackIds: [],
        dominantColor: '#282828',
        createdAt: new Date().toISOString(),
      };
      state.userPlaylists.unshift(newPlaylist);
    },
    updatePlaylist(state, action) {
      const { id, name, title, description, coverUrl } = action.payload;
      const pl = state.userPlaylists.find((p) => p.id === id);
      if (pl) {
        if (name || title) pl.title = name || title;
        if (description !== undefined) pl.description = description;
        if (coverUrl !== undefined) pl.coverUrl = coverUrl;
      }
    },
    deletePlaylist(state, action) {
      state.userPlaylists = state.userPlaylists.filter((p) => p.id !== action.payload);
    },
    addTrackToPlaylist(state, action) {
      const { playlistId, trackId } = action.payload;
      const pl = state.userPlaylists.find((p) => p.id === playlistId);
      if (pl && !pl.trackIds.includes(trackId)) {
        pl.trackIds.push(trackId);
      }
    },
    removeTrackFromPlaylist(state, action) {
      const { playlistId, trackId } = action.payload;
      const pl = state.userPlaylists.find((p) => p.id === playlistId);
      if (pl) {
        pl.trackIds = pl.trackIds.filter((tid) => tid !== trackId);
      }
    },
    toggleSaveAlbum(state, action) {
      const albumId = action.payload;
      const idx = state.savedAlbumIds.indexOf(albumId);
      if (idx >= 0) {
        state.savedAlbumIds.splice(idx, 1);
      } else {
        state.savedAlbumIds.push(albumId);
      }
    },
    toggleFollowArtist(state, action) {
      const artistId = action.payload;
      const idx = state.followedArtistIds.indexOf(artistId);
      if (idx >= 0) {
        state.followedArtistIds.splice(idx, 1);
      } else {
        state.followedArtistIds.push(artistId);
      }
    },
    addToRecentlyPlayed(state, action) {
      const item = action.payload;
      state.recentlyPlayed = state.recentlyPlayed.filter(
        (r) => !(r.type === item.type && r.id === item.id)
      );
      state.recentlyPlayed.unshift(item);
      if (state.recentlyPlayed.length > 20) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 20);
      }
    },
    addRecentSearch(state, action) {
      const q = action.payload.trim();
      if (!q) return;
      state.recentSearches = state.recentSearches.filter((item) => item.toLowerCase() !== q.toLowerCase());
      state.recentSearches.unshift(q);
      if (state.recentSearches.length > 10) {
        state.recentSearches = state.recentSearches.slice(0, 10);
      }
    },
    removeRecentSearch(state, action) {
      state.recentSearches = state.recentSearches.filter((item) => item !== action.payload);
    },
    clearRecentSearches(state) {
      state.recentSearches = [];
    },
    setActiveFilter(state, action) {
      state.activeFilter = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setViewMode(state, action) {
      state.viewMode = action.payload;
    },
  },
});

export const {
  toggleLikeTrack,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  toggleSaveAlbum,
  toggleFollowArtist,
  addToRecentlyPlayed,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setActiveFilter,
  setSortBy,
  setViewMode,
} = librarySlice.actions;

export default librarySlice.reducer;
