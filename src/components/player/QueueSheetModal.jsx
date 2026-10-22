import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../common/Icon';
import {
  removeFromQueue,
  reorderQueue,
  clearQueue,
  playTrack,
} from '../../redux/slices/playerSlice';

export default function QueueSheetModal({ visible, onClose }) {
  const dispatch = useDispatch();
  const { currentTrack, queue, contextQueue, contextUri } = useSelector(
    (state) => state.player
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            onPress={onClose}
            style={styles.closeBtn}
          >
            <Icon name="chevron-down" size={28} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Queue</Text>
          <View style={styles.headerRight} />
        </View>

        <FlatList
          data={[]}
          keyExtractor={() => 'dummy'}
          renderItem={null}
          ListHeaderComponent={
            <View style={styles.content}>
              {/* Now Playing Section */}
              <Text style={styles.sectionTitle}>Now Playing</Text>
              {currentTrack ? (
                <View style={styles.trackItem}>
                  <Image
                    source={{ uri: currentTrack.coverUrl }}
                    style={styles.artwork}
                  />
                  <View style={styles.meta}>
                    <Text numberOfLines={1} style={styles.activeTitle}>
                      {currentTrack.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.artist}>
                      {currentTrack.artist}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.emptyText}>Nothing currently playing</Text>
              )}

              {/* Next in Queue Section */}
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Next in Queue</Text>
                {queue.length > 0 && (
                  <TouchableOpacity
                    onPress={() => dispatch(clearQueue())}
                    hitSlop={spacing.hitSlop}
                  >
                    <Text style={styles.clearText}>Clear queue</Text>
                  </TouchableOpacity>
                )}
              </View>

              {queue.length === 0 ? (
                <Text style={styles.emptyText}>
                  Add songs to your queue using the track options menu (•••)
                </Text>
              ) : (
                queue.map((track, idx) => (
                  <View key={`queue-${track.id}-${idx}`} style={styles.trackItem}>
                    <Image
                      source={{ uri: track.coverUrl }}
                      style={styles.artwork}
                    />
                    <View style={styles.meta}>
                      <Text numberOfLines={1} style={styles.title}>
                        {track.title}
                      </Text>
                      <Text numberOfLines={1} style={styles.artist}>
                        {track.artist}
                      </Text>
                    </View>

                    {/* Up / Down Reorder */}
                    <View style={styles.reorderControls}>
                      <TouchableOpacity
                        disabled={idx === 0}
                        onPress={() =>
                          dispatch(reorderQueue({ from: idx, to: idx - 1 }))
                        }
                        style={styles.reorderBtn}
                      >
                        <Icon
                          name="chevron-up"
                          size={18}
                          color={idx === 0 ? colors.textDisabled : colors.textPrimary}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        disabled={idx === queue.length - 1}
                        onPress={() =>
                          dispatch(reorderQueue({ from: idx, to: idx + 1 }))
                        }
                        style={styles.reorderBtn}
                      >
                        <Icon
                          name="chevron-down"
                          size={18}
                          color={
                            idx === queue.length - 1
                              ? colors.textDisabled
                              : colors.textPrimary
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Remove button */}
                    <TouchableOpacity
                      hitSlop={spacing.hitSlop}
                      onPress={() => dispatch(removeFromQueue(idx))}
                      style={styles.removeBtn}
                    >
                      <Icon name="close" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                ))
              )}

              {/* Next from Context Section */}
              {contextQueue.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>
                    Next Up
                  </Text>
                  {contextQueue.slice(0, 15).map((track, idx) => (
                    <TouchableOpacity
                      key={`context-${track.id}-${idx}`}
                      onPress={() => {
                        dispatch(
                          playTrack({
                            track,
                            contextTracks: contextQueue,
                            contextUri,
                          })
                        );
                      }}
                      style={styles.trackItem}
                    >
                      <Image
                        source={{ uri: track.coverUrl }}
                        style={styles.artwork}
                      />
                      <View style={styles.meta}>
                        <Text numberOfLines={1} style={styles.title}>
                          {track.title}
                        </Text>
                        <Text numberOfLines={1} style={styles.artist}>
                          {track.artist}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          }
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 44,
  },
  content: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.spotifyGreen,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginRight: spacing.md,
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.spotifyGreen,
  },
  artist: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: spacing.sm,
  },
  reorderControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  reorderBtn: {
    padding: 6,
  },
  removeBtn: {
    padding: 6,
  },
});
