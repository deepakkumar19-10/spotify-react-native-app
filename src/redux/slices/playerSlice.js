import { createSlice } from '@reduxjs/toolkit';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const initialState = {
  currentTrack: null,
  contextUri: null,
  isPlaying: false,
  queue: [], // user-added priority queue
  contextQueue: [], // upcoming from playlist/album
  originalContextQueue: [],
  history: [],
  position: 0,
  duration: 0,
  shuffleMode: false,
  repeatMode: 'off', // 'off' | 'context' | 'track'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    playTrack(state, action) {
      const { track, contextTracks, contextUri } = action.payload;
      if (state.currentTrack) {
        state.history.push(state.currentTrack);
        if (state.history.length > 50) state.history.shift();
      }
      state.currentTrack = track;
      state.isPlaying = true;
      state.position = 0;
      state.duration = track.duration || 0;
      if (contextUri) state.contextUri = contextUri;

      if (contextTracks && contextTracks.length > 0) {
        const idx = contextTracks.findIndex((t) => t.id === track.id);
        const remaining = contextTracks.filter((_, i) => i > idx);
        state.originalContextQueue = remaining;
        state.contextQueue = state.shuffleMode ? shuffleArray(remaining) : remaining;
      }
    },
    togglePlayPause(state) {
      if (state.currentTrack) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    playNextTrack(state) {
      if (state.repeatMode === 'track') {
        state.position = 0;
        return;
      }
      if (state.currentTrack) {
        state.history.push(state.currentTrack);
        if (state.history.length > 50) state.history.shift();
      }
      // User-added queue takes priority
      if (state.queue.length > 0) {
        state.currentTrack = state.queue.shift();
        state.position = 0;
        state.duration = state.currentTrack?.duration || 0;
        state.isPlaying = true;
      } else if (state.contextQueue.length > 0) {
        state.currentTrack = state.contextQueue.shift();
        state.position = 0;
        state.duration = state.currentTrack?.duration || 0;
        state.isPlaying = true;
      } else if (state.repeatMode === 'context' && state.originalContextQueue.length > 0) {
        const allTracks = [state.currentTrack, ...state.originalContextQueue];
        state.currentTrack = allTracks[0];
        state.contextQueue = state.shuffleMode
          ? shuffleArray(allTracks.slice(1))
          : allTracks.slice(1);
        state.position = 0;
        state.duration = state.currentTrack?.duration || 0;
        state.isPlaying = true;
      } else {
        state.isPlaying = false;
        state.position = 0;
      }
    },
    playPrevTrack(state) {
      if (state.position > 3) {
        state.position = 0;
        return;
      }
      if (state.history.length > 0) {
        if (state.currentTrack) {
          state.contextQueue.unshift(state.currentTrack);
        }
        state.currentTrack = state.history.pop();
        state.position = 0;
        state.duration = state.currentTrack?.duration || 0;
        state.isPlaying = true;
      } else {
        state.position = 0;
      }
    },
    seekToPosition(state, action) {
      state.position = action.payload;
    },
    updateProgress(state, action) {
      const { position, duration } = action.payload;
      state.position = position;
      if (duration > 0) state.duration = duration;
    },
    toggleShuffle(state) {
      state.shuffleMode = !state.shuffleMode;
      if (state.shuffleMode) {
        state.contextQueue = shuffleArray(state.contextQueue);
      } else {
        const playedIds = new Set(state.history.map((t) => t.id));
        if (state.currentTrack) playedIds.add(state.currentTrack.id);
        state.contextQueue = state.originalContextQueue.filter(
          (t) => !playedIds.has(t.id)
        );
      }
    },
    cycleRepeatMode(state) {
      const modes = ['off', 'context', 'track'];
      const idx = modes.indexOf(state.repeatMode);
      state.repeatMode = modes[(idx + 1) % 3];
    },
    addToQueue(state, action) {
      state.queue.push(action.payload);
    },
    removeFromQueue(state, action) {
      state.queue.splice(action.payload, 1);
    },
    reorderQueue(state, action) {
      const { from, to } = action.payload;
      const [item] = state.queue.splice(from, 1);
      state.queue.splice(to, 0, item);
    },
    clearQueue(state) {
      state.queue = [];
    },
  },
});

export const {
  playTrack,
  togglePlayPause,
  setIsPlaying,
  playNextTrack,
  playPrevTrack,
  seekToPosition,
  updateProgress,
  toggleShuffle,
  cycleRepeatMode,
  addToQueue,
  removeFromQueue,
  reorderQueue,
  clearQueue,
} = playerSlice.actions;

export default playerSlice.reducer;
