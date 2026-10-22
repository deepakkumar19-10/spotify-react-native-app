import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function SyncedLyricsCard({
  lyrics = [],
  currentTime = 0,
  onSeekLine,
  backgroundColor = '#1f6f78',
}) {
  const scrollViewRef = useRef(null);

  // Find active line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  useEffect(() => {
    if (activeIndex >= 0 && scrollViewRef.current) {
      // scroll to active line
      const approxLineHeight = 44;
      const targetY = Math.max(0, activeIndex * approxLineHeight - 80);
      scrollViewRef.current.scrollTo({ y: targetY, animated: true });
    }
  }, [activeIndex]);

  if (!lyrics || lyrics.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor }]}>
        <Text style={styles.cardHeader}>Lyrics</Text>
        <Text style={styles.emptyText}>Lyrics not available for this song</Text>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor }]}>
      <Text style={styles.cardHeader}>Lyrics</Text>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
      >
        {lyrics.map((line, idx) => {
          const isActive = idx === activeIndex;
          const isPast = idx < activeIndex;

          return (
            <TouchableOpacity
              key={`lyric-${idx}`}
              activeOpacity={0.7}
              onPress={() => onSeekLine?.(line.time)}
              style={styles.lineTouch}
            >
              <Text
                style={[
                  styles.lineText,
                  isActive && styles.activeLineText,
                  isPast && styles.pastLineText,
                ]}
              >
                {line.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: spacing.lg,
    maxHeight: 320,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingVertical: spacing.sm,
  },
  lineTouch: {
    paddingVertical: 6,
  },
  lineText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: 28,
  },
  activeLineText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  pastLineText: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 12,
  },
});
