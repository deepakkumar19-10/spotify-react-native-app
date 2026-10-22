import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TrackPlayer, {
  Capability,
  Event,
  State,
  useProgress,
} from 'react-native-track-player';
import {
  setIsPlaying,
  playNextTrack,
  updateProgress,
} from '../redux/slices/playerSlice';

let isPlayerSetup = false;
let setupPromise = null;

export async function setupTrackPlayer() {
  if (isPlayerSetup) return true;
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    try {
      await TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
      isPlayerSetup = true;
      console.log('TrackPlayer setup successful!');
      return true;
    } catch (e) {
      console.log('TrackPlayer setup note:', e);
      isPlayerSetup = true;
      return true;
    } finally {
      setupPromise = null;
    }
  })();

  return setupPromise;
}

export default function useAudioController() {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const lastTrackId = useRef(null);

  // Setup player once on mount
  useEffect(() => {
    setupTrackPlayer();
  }, []);

  // Listen to track completion and queue end
  useEffect(() => {
    const queueSub = TrackPlayer.addEventListener(
      Event.PlaybackQueueEnded,
      () => {
        dispatch(playNextTrack());
      }
    );

    const stateSub = TrackPlayer.addEventListener(
      Event.PlaybackState,
      (event) => {
        if (event.state === State.Playing) {
          dispatch(setIsPlaying(true));
        } else if (event.state === State.Paused || event.state === State.Stopped) {
          dispatch(setIsPlaying(false));
        }
      }
    );

    return () => {
      queueSub.remove();
      stateSub.remove();
    };
  }, [dispatch]);

  // Load new track when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;

    let isMounted = true;
    const loadAndPlayTrack = async () => {
      try {
        await setupTrackPlayer();
        if (currentTrack.id !== lastTrackId.current) {
          lastTrackId.current = currentTrack.id;
          await TrackPlayer.reset();
          await TrackPlayer.add({
            id: currentTrack.id,
            url: currentTrack.audioUrl,
            title: currentTrack.title,
            artist: currentTrack.artist,
            album: currentTrack.album,
            artwork: currentTrack.coverUrl,
            duration: currentTrack.duration,
          });
        }
        if (isMounted && isPlaying) {
          await TrackPlayer.play();
        }
      } catch (err) {
        console.warn('TrackPlayer load error:', err);
      }
    };

    loadAndPlayTrack();

    return () => {
      isMounted = false;
    };
  }, [currentTrack]);

  // Sync play/pause toggle
  useEffect(() => {
    if (!currentTrack) return;

    const syncPlayState = async () => {
      try {
        await setupTrackPlayer();
        if (isPlaying) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      } catch (err) {
        console.warn('TrackPlayer play/pause error:', err);
      }
    };

    syncPlayState();
  }, [isPlaying]);

  // Progress polling (every 400ms)
  const progress = useProgress(400);

  useEffect(() => {
    if (progress.position > 0 || progress.duration > 0) {
      dispatch(
        updateProgress({
          position: Math.floor(progress.position),
          duration: Math.floor(progress.duration || currentTrack?.duration || 0),
        })
      );
    }
  }, [progress.position, progress.duration, dispatch, currentTrack]);

  const seekTo = useCallback(async (seconds) => {
    try {
      await TrackPlayer.seekTo(seconds);
    } catch (e) {
      console.warn('TrackPlayer seek error:', e);
    }
  }, []);

  return { seekTo, progress };
}
