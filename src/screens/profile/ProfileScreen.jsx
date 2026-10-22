import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import { logout } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/uiSlice';

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { likedTrackIds, userPlaylists } = useSelector((state) => state.library);

  const [audioQuality, setAudioQuality] = useState('Very High');

  const handleLogout = () => {
    dispatch(logout());
    dispatch(showToast('Logged out successfully'));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={spacing.hitSlop}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Icon name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <View style={styles.userCard}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {(user?.name || 'S')[0].toUpperCase()}
              </Text>
            </View>
          )}

          <Text style={styles.userName}>{user?.name || 'Spotify Listener'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@spotify.com'}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{userPlaylists.length}</Text>
              <Text style={styles.statLabel}>PLAYLISTS</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>{likedTrackIds.length}</Text>
              <Text style={styles.statLabel}>LIKED SONGS</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>FOLLOWING</Text>
            </View>
          </View>
        </View>

        {/* Audio Quality Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Audio Quality</Text>
          <View style={styles.qualityCard}>
            {['Normal (96 kbit/s)', 'High (160 kbit/s)', 'Very High (320 kbit/s)'].map(
              (q) => {
                const isSelected = audioQuality.startsWith(q.split(' ')[0]);
                return (
                  <TouchableOpacity
                    key={q}
                    onPress={() => {
                      setAudioQuality(q);
                      dispatch(showToast(`Audio quality set to ${q.split(' ')[0]}`));
                    }}
                    style={styles.qualityRow}
                  >
                    <Text
                      style={[
                        styles.qualityText,
                        isSelected && styles.qualityTextSelected,
                      ]}
                    >
                      {q}
                    </Text>
                    {isSelected && (
                      <Icon
                        name="checkmark-circle"
                        size={20}
                        color={colors.spotifyGreen}
                      />
                    )}
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

        {/* Account Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity style={styles.menuRow}>
              <Text style={styles.menuText}>Spotify Premium</Text>
              <Text style={styles.menuSubText}>Free Plan</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuRow}>
              <Text style={styles.menuText}>Data Saver</Text>
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity style={styles.menuRow}>
              <Text style={styles.menuText}>Offline Storage</Text>
              <Text style={styles.menuSubText}>2.4 GB used</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleLogout}
          style={styles.logoutBtn}
        >
          <Icon
            name="log-out-outline"
            size={20}
            color={colors.accentRed}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Spotify Mobile v8.9.18 (Bare RN CLI)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 130,
  },
  userCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: spacing.md,
  },
  avatarPlaceholder: {
    backgroundColor: '#535353',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    gap: spacing.xxl,
  },
  statCol: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  qualityCard: {
    backgroundColor: colors.elevated,
    borderRadius: 12,
    overflow: 'hidden',
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  qualityText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  qualityTextSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  menuCard: {
    backgroundColor: colors.elevated,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  menuText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  menuSubText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.elevated,
    borderRadius: 24,
    paddingVertical: 14,
    marginTop: spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(233, 20, 41, 0.4)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentRed,
  },
  versionText: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xl,
  },
});
