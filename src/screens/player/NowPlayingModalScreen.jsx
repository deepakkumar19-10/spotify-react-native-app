import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  Share,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Slider from '@react-native-community/slider';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import SyncedLyricsCard from '../../components/player/SyncedLyricsCard';
import QueueSheetModal from '../../components/player/QueueSheetModal';
import {
  togglePlayPause,
  playNextTrack,
  playPrevTrack,
  toggleShuffle,
  cycleRepeatMode,
  seekToPosition,
} from '../../redux/slices/playerSlice';
import { toggleLikeTrack } from '../../redux/slices/librarySlice';
import { openTrackOptions, showToast } from '../../redux/slices/uiSlice';
import useAudioController from '../../hooks/useAudioController';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function NowPlayingModalScreen({ navigation }) {
  const dispatch = useDispatch();
  const { seekTo } = useAudioController();

  const {
    currentTrack,
    isPlaying,
    position,
    duration,
    shuffleMode,
    repeatMode,
    contextUri,
  } = useSelector((state) => state.player);
  const { likedTrackIds } = useSelector((state) => state.library);

  const [queueModalVisible, setQueueModalVisible] = useState(false);
  const [artworkPreviewVisible, setArtworkPreviewVisible] = useState(false);

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.collapseBtn}
        >
          <Icon name="chevron-down" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.emptyText}>No song currently playing</Text>
      </SafeAreaView>
    );
  }

  const isLiked = likedTrackIds.includes(currentTrack.id);

  const handleToggleLike = () => {
    dispatch(toggleLikeTrack(currentTrack.id));
    dispatch(
      showToast(isLiked ? 'Removed from Liked Songs' : 'Added to Liked Songs')
    );
  };

  const handleSlidingComplete = (val) => {
    dispatch(seekToPosition(val));
    seekTo(val);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Listening to "${currentTrack.title}" by ${currentTrack.artist} on Spotify!`,
      });
    } catch (e) {
      // ignore
    }
  };

  const dominantBg = currentTrack.dominantColor || '#1f3d3e';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#121212' }]}>
      {/* Background Gradient Simulator */}
      <View
        style={[
          styles.gradientBackground,
          { backgroundColor: dominantBg },
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => navigation.goBack()}
            style={styles.collapseBtn}
          >
            <Icon name="chevron-down" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.topTitleBox}>
            <Text style={styles.overline}>PLAYING FROM PLAYLIST</Text>
            <Text numberOfLines={1} style={styles.sourceTitle}>
              {currentTrack.album || 'Spotify Music'}
            </Text>
          </View>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() =>
              dispatch(openTrackOptions({ track: currentTrack }))
            }
            style={styles.optionsBtn}
          >
            <Icon name="ellipsis-vertical" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Big Artwork */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setArtworkPreviewVisible(true)}
          style={styles.artworkWrapper}
        >
          <Image
            source={{ uri: currentTrack.coverUrl }}
            style={styles.bigArtwork}
          />
        </TouchableOpacity>

        {/* Title, Artist, and Heart */}
        <View style={styles.metaRow}>
          <View style={styles.metaTextBox}>
            <Text numberOfLines={1} style={styles.trackTitle}>
              {currentTrack.title}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
                navigation.navigate('ArtistDetails', {
                  artistId: currentTrack.artistId,
                });
              }}
            >
              <Text numberOfLines={1} style={styles.artistName}>
                {currentTrack.artist}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={handleToggleLike}
            style={styles.heartBtn}
          >
            <Icon
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color={isLiked ? colors.spotifyGreen : colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Seek Scrubber & Timestamps */}
        <View style={styles.scrubberArea}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={duration || currentTrack.duration || 100}
            value={position}
            onSlidingComplete={handleSlidingComplete}
            minimumTrackTintColor={colors.textPrimary}
            maximumTrackTintColor={colors.sliderTrack}
            thumbTintColor={colors.textPrimary}
          />
          <View style={styles.timestampsRow}>
            <Text style={styles.timestampText}>{formatTime(position)}</Text>
            <Text style={styles.timestampText}>
              {formatTime(duration || currentTrack.duration)}
            </Text>
          </View>
        </View>

        {/* Transport Controls */}
        <View style={styles.transportRow}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => dispatch(toggleShuffle())}
            style={styles.ctrlBtn}
          >
            <Icon
              name="shuffle"
              size={24}
              color={shuffleMode ? colors.spotifyGreen : colors.textSecondary}
            />
            {shuffleMode && <View style={styles.activeDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => dispatch(playPrevTrack())}
            style={styles.ctrlBtn}
          >
            <Icon name="play-skip-back" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => dispatch(togglePlayPause())}
            style={styles.playPauseCircle}
          >
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="#000000"
              style={{ marginLeft: isPlaying ? 0 : 3 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => dispatch(playNextTrack())}
            style={styles.ctrlBtn}
          >
            <Icon name="play-skip-forward" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => dispatch(cycleRepeatMode())}
            style={styles.ctrlBtn}
          >
            <Icon
              name={repeatMode === 'track' ? 'repeat' : 'repeat'}
              size={24}
              color={repeatMode !== 'off' ? colors.spotifyGreen : colors.textSecondary}
            />
            {repeatMode !== 'off' && (
              <View style={styles.repeatBadge}>
                {repeatMode === 'track' && <Text style={styles.repeat1Text}>1</Text>}
                <View style={styles.activeDot} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom Utility Row */}
        <View style={styles.utilityRow}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={() => dispatch(showToast('Connected to Phone Speaker'))}
            style={styles.utilityBtn}
          >
            <Icon name="hardware-chip-outline" size={20} color={colors.spotifyGreen} />
            <Text style={styles.utilityText}>This Phone</Text>
          </TouchableOpacity>

          <View style={styles.rightUtilities}>
            <TouchableOpacity
              hitSlop={spacing.hitSlop}
              onPress={handleShare}
              style={styles.iconUtilityBtn}
            >
              <Icon name="share-social-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              hitSlop={spacing.hitSlop}
              onPress={() => setQueueModalVisible(true)}
              style={styles.iconUtilityBtn}
            >
              <Icon name="list-outline" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Synced Lyrics Preview Card */}
        <SyncedLyricsCard
          lyrics={currentTrack.lyrics}
          currentTime={position}
          onSeekLine={(t) => {
            dispatch(seekToPosition(t));
            seekTo(t);
          }}
          backgroundColor={dominantBg}
        />
      </ScrollView>

      {/* Queue Modal */}
      <QueueSheetModal
        visible={queueModalVisible}
        onClose={() => setQueueModalVisible(false)}
      />

      {/* Full-Screen Zoomable Artwork Preview Modal */}
      <Modal
        visible={artworkPreviewVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setArtworkPreviewVisible(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setArtworkPreviewVisible(false)}
          style={styles.zoomModalBackground}
        >
          <Image
            source={{ uri: currentTrack.coverUrl }}
            style={styles.zoomedArtwork}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapseBtn: {
    padding: 6,
  },
  topTitleBox: {
    alignItems: 'center',
    maxWidth: '70%',
  },
  overline: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  sourceTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  optionsBtn: {
    padding: 6,
  },
  artworkWrapper: {
    width: '100%',
    aspectRatio: 1,
    marginVertical: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 16,
  },
  bigArtwork: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  metaTextBox: {
    flex: 1,
    marginRight: spacing.md,
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  artistName: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 3,
  },
  heartBtn: {
    padding: 6,
  },
  scrubberArea: {
    marginVertical: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 36,
  },
  timestampsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  timestampText: {
    fontSize: 11.5,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.lg,
  },
  ctrlBtn: {
    padding: 8,
    position: 'relative',
    alignItems: 'center',
  },
  activeDot: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.spotifyGreen,
  },
  repeatBadge: {
    alignItems: 'center',
  },
  repeat1Text: {
    position: 'absolute',
    top: -6,
    right: -4,
    fontSize: 9,
    fontWeight: '900',
    color: colors.spotifyGreen,
  },
  playPauseCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  utilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  utilityText: {
    color: colors.spotifyGreen,
    fontSize: 12,
    fontWeight: '700',
  },
  rightUtilities: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconUtilityBtn: {
    padding: 4,
  },
  zoomModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  zoomedArtwork: {
    width: '100%',
    height: '80%',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.md,
  },
});
