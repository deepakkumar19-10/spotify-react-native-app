import React from 'react';
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function FilterPillsBar({
  pills = ['All', 'Music', 'Podcasts'],
  activePill = 'All',
  onSelectPill,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {pills.map((pill) => {
        const isActive = activePill === pill;
        return (
          <TouchableOpacity
            key={pill}
            activeOpacity={0.7}
            onPress={() => onSelectPill(pill)}
            style={[styles.pill, isActive && styles.activePill]}
          >
            <Text style={[styles.pillText, isActive && styles.activePillText]}>
              {pill}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pill: {
    backgroundColor: colors.elevated,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    backgroundColor: colors.spotifyGreen,
  },
  pillText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  activePillText: {
    color: '#000000',
    fontWeight: '700',
  },
});
