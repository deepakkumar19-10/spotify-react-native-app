import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  trackOptionsModal: {
    visible: false,
    track: null,
    playlistId: null,
  },
  createPlaylistModalVisible: false,
  addToPlaylistModal: {
    visible: false,
    track: null,
  },
  toast: {
    visible: false,
    message: '',
  },
  dominantColor: '#121212',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openTrackOptions(state, action) {
      const { track, playlistId } = action.payload;
      state.trackOptionsModal = {
        visible: true,
        track,
        playlistId: playlistId || null,
      };
    },
    closeTrackOptions(state) {
      state.trackOptionsModal = {
        visible: false,
        track: null,
        playlistId: null,
      };
    },
    openCreatePlaylistModal(state) {
      state.createPlaylistModalVisible = true;
    },
    closeCreatePlaylistModal(state) {
      state.createPlaylistModalVisible = false;
    },
    openAddToPlaylistModal(state, action) {
      state.addToPlaylistModal = {
        visible: true,
        track: action.payload,
      };
    },
    closeAddToPlaylistModal(state) {
      state.addToPlaylistModal = {
        visible: false,
        track: null,
      };
    },
    showToast(state, action) {
      state.toast = {
        visible: true,
        message: action.payload,
      };
    },
    hideToast(state) {
      state.toast = {
        visible: false,
        message: '',
      };
    },
    setDominantColor(state, action) {
      state.dominantColor = action.payload;
    },
  },
});

export const {
  openTrackOptions,
  closeTrackOptions,
  openCreatePlaylistModal,
  closeCreatePlaylistModal,
  openAddToPlaylistModal,
  closeAddToPlaylistModal,
  showToast,
  hideToast,
  setDominantColor,
} = uiSlice.actions;

export default uiSlice.reducer;
