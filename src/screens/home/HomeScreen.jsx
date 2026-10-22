import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import FilterPillsBar from '../../components/common/FilterPillsBar';
import QuickPlayCard from '../../components/common/QuickPlayCard';
import MediaCard from '../../components/common/MediaCard';
import { playTrack } from '../../redux/slices/playerSlice';
import { showToast } from '../../redux/slices/uiSlice';

import tracks from '../../data/tracks.json';
import playlists from '../../data/playlists.json';
import albums from '../../data/albums.json';
import artists from '../../data/artists.json';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const greeting = getGreeting();

  const [activePill, setActivePill] = useState('All');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const { currentTrack, isPlaying } = useSelector((state) => state.player);
  const { recentlyPlayed } = useSelector((state) => state.library);

  // 6 Quick-play cards matching user genres
  const quickCards = useMemo(() => {
    return [
      {
        id: 'liked-songs',
        title: 'Liked Songs',
        isLikedSongs: true,
        type: 'liked-songs',
      },
      {
        id: 'p1',
        title: 'Hindi Hits',
        imageUrl: playlists[0]?.coverUrl,
        type: 'playlist',
      },
      {
        id: 'p2',
        title: 'Punjabi 101',
        imageUrl: playlists[1]?.coverUrl,
        type: 'playlist',
      },
      {
        id: 'p3',
        title: 'Haryanvi Swag',
        imageUrl: playlists[2]?.coverUrl,
        type: 'playlist',
      },
      {
        id: 'p4',
        title: 'Running 160 BPM',
        imageUrl: playlists[3]?.coverUrl,
        type: 'playlist',
      },
      {
        id: 'p6',
        title: 'Bhakti & Aarti',
        imageUrl: playlists[5]?.coverUrl,
        type: 'playlist',
      },
    ];
  }, []);

  // Filtered Playlists based on active pill
  const filteredPlaylists = useMemo(() => {
    if (activePill === 'All') return playlists;
    if (activePill === 'Hindi') return playlists.filter((p) => p.id === 'p1');
    if (activePill === 'Punjabi') return playlists.filter((p) => p.id === 'p2');
    if (activePill === 'Haryanvi') return playlists.filter((p) => p.id === 'p3');
    if (activePill === 'Running') return playlists.filter((p) => p.id === 'p4');
    if (activePill === 'Motivation') return playlists.filter((p) => p.id === 'p5');
    if (activePill === 'Bhakti') return playlists.filter((p) => ['p6', 'p8'].includes(p.id));
    if (activePill === 'AI DJ') return playlists.filter((p) => ['p7', 'p8'].includes(p.id));
    return playlists;
  }, [activePill]);

  // AI DJ Mood Prompts
  const aiMoods = [
    { label: '🔥 Gym Beast', query: 'motivation', emoji: '🔥' },
    { label: '🏃 160 BPM Run', query: 'running', emoji: '🏃' },
    { label: '🪔 Morning Bhakti', query: 'bhakti', emoji: '🪔' },
    { label: '🌾 Desi Haryanvi', query: 'haryanvi', emoji: '🌾' },
    { label: '💎 Punjabi Pop', query: 'punjabi', emoji: '💎' },
    { label: '❤️ Soulful Hindi', query: 'hindi', emoji: '❤️' },
  ];

  const handleAiMoodTrigger = (mood) => {
    let matched = [];
    const q = mood.query.toLowerCase();
    if (q === 'motivation') {
      matched = tracks.filter((t) => ['t23', 't24', 't25', 't26'].includes(t.id));
    } else if (q === 'running') {
      matched = tracks.filter((t) => ['t19', 't20', 't21', 't22'].includes(t.id));
    } else if (q === 'bhakti') {
      matched = tracks.filter((t) => ['ar7', 'ar9'].includes(t.artistId));
    } else if (q === 'haryanvi') {
      matched = tracks.filter((t) => ['ar4', 'ar5'].includes(t.artistId));
    } else if (q === 'punjabi') {
      matched = tracks.filter((t) => ['ar2', 'ar3', 'ar6', 'ar10'].includes(t.artistId));
    } else if (q === 'hindi') {
      matched = tracks.filter((t) => t.artistId === 'ar1');
    }

    if (matched.length > 0) {
      dispatch(
        playTrack({
          track: matched[0],
          contextTracks: matched,
          contextUri: `ai-dj:${q}`,
        })
      );
      dispatch(showToast(`✨ AI DJ: Playing ${mood.label} mix!`));
    }
  };

  const handleAiPromptSubmit = () => {
    if (!aiCustomPrompt.trim()) return;
    const term = aiCustomPrompt.toLowerCase().trim();
    const matched = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.artist.toLowerCase().includes(term) ||
        t.album.toLowerCase().includes(term)
    );

    if (matched.length > 0) {
      dispatch(
        playTrack({
          track: matched[0],
          contextTracks: matched,
          contextUri: `ai-custom:${term}`,
        })
      );
      dispatch(showToast(`✨ AI DJ: Curated ${matched.length} songs for "${aiCustomPrompt}"!`));
    } else {
      // Fallback to random popular
      dispatch(
        playTrack({
          track: tracks[0],
          contextTracks: tracks.slice(0, 8),
          contextUri: `ai-custom:mix`,
        })
      );
      dispatch(showToast(`✨ AI DJ: Mixed top tracks for you!`));
    }
    setAiCustomPrompt('');
  };

  const handleQuickPlayPress = (item) => {
    if (item.isLikedSongs) {
      navigation.navigate('PlaylistDetails', { playlistId: 'liked-songs' });
      return;
    }
    if (item.type === 'playlist') {
      navigation.navigate('PlaylistDetails', { playlistId: item.id });
    } else if (item.type === 'album') {
      navigation.navigate('AlbumDetails', { albumId: item.id });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.greetingText}>{greeting}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="time-outline" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={spacing.hitSlop}
            style={styles.iconBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Icon name="settings-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Pills */}
      <FilterPillsBar
        pills={['All', 'Hindi', 'Punjabi', 'Haryanvi', 'Running', 'Motivation', 'Bhakti', 'AI DJ']}
        activePill={activePill}
        onSelectPill={setActivePill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 6 Quick Play Cards Grid (2-column) */}
        <View style={styles.quickGrid}>
          {quickCards.map((item) => (
            <View key={item.id} style={styles.quickGridCol}>
              <QuickPlayCard
                title={item.title}
                imageUrl={item.imageUrl}
                isLikedSongs={item.isLikedSongs}
                onPress={() => handleQuickPlayPress(item)}
              />
            </View>
          ))}
        </View>

        {/* ✨ AI DJ Smart Music Assistant Banner */}
        <View style={styles.aiDjCard}>
          <View style={styles.aiDjHeader}>
            <View style={styles.aiBadge}>
              <Icon name="sparkles" size={14} color="#000000" />
              <Text style={styles.aiBadgeText}>AI DJ</Text>
            </View>
            <Text style={styles.aiDjTitle}>Sonic Obsidian AI Recommender</Text>
          </View>
          <Text style={styles.aiDjSub}>
            Tap a mood or type what you want to hear (e.g. workout, bhakti, bhangra):
          </Text>

          {/* AI Search / Prompt Input */}
          <View style={styles.aiInputRow}>
            <TextInput
              placeholder="Ask AI DJ: '160 BPM running' or 'Arijit romance'..."
              placeholderTextColor={colors.textMuted}
              value={aiCustomPrompt}
              onChangeText={setAiCustomPrompt}
              onSubmitEditing={handleAiPromptSubmit}
              style={styles.aiInput}
            />
            <TouchableOpacity
              onPress={handleAiPromptSubmit}
              style={styles.aiGoBtn}
            >
              <Icon name="arrow-forward" size={18} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Quick Mood Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.aiMoodRow}
          >
            {aiMoods.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                activeOpacity={0.8}
                onPress={() => handleAiMoodTrigger(mood)}
                style={styles.aiChip}
              >
                <Text style={styles.aiChipText}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Section 1: Featured Playlists */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activePill === 'All' ? 'Trending Indian & Fitness Playlists' : `${activePill} Playlists`}
          </Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filteredPlaylists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shelfContent}
          renderItem={({ item }) => (
            <MediaCard
              id={item.id}
              title={item.title}
              subtitle={item.description}
              imageUrl={item.coverUrl}
              type="playlist"
              onPress={() =>
                navigation.navigate('PlaylistDetails', { playlistId: item.id })
              }
            />
          )}
        />

        {/* Section 2: Popular Albums */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Albums & Anthems</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={albums}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shelfContent}
          renderItem={({ item }) => (
            <MediaCard
              id={item.id}
              title={item.title}
              subtitle={`${item.year} • ${item.artistName}`}
              imageUrl={item.coverUrl}
              type="album"
              onPress={() =>
                navigation.navigate('AlbumDetails', { albumId: item.id })
              }
            />
          )}
        />

        {/* Section 3: Iconic Artists */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Artists</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={artists}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shelfContent}
          renderItem={({ item }) => (
            <MediaCard
              id={item.id}
              title={item.name}
              subtitle="Artist"
              imageUrl={item.image}
              type="artist"
              onPress={() =>
                navigation.navigate('ArtistDetails', { artistId: item.id })
              }
            />
          )}
        />

        {/* Section 4: Recently Played (if any) */}
        {recentlyPlayed && recentlyPlayed.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Played</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={recentlyPlayed}
              keyExtractor={(item, idx) => `recent-${item.id}-${idx}`}
              contentContainerStyle={styles.shelfContent}
              renderItem={({ item }) => (
                <MediaCard
                  id={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  imageUrl={item.imageUrl}
                  type={item.type}
                  onPress={() => {
                    if (item.type === 'playlist') {
                      navigation.navigate('PlaylistDetails', { playlistId: item.id });
                    } else if (item.type === 'album') {
                      navigation.navigate('AlbumDetails', { albumId: item.id });
                    } else if (item.type === 'artist') {
                      navigation.navigate('ArtistDetails', { artistId: item.id });
                    }
                  }}
                />
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 130, // space for floating mini player + bottom tabs
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  quickGridCol: {
    width: '50%',
  },
  aiDjCard: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    backgroundColor: '#1a1a24',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(29, 185, 84, 0.35)',
  },
  aiDjHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.spotifyGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    gap: 4,
  },
  aiBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '800',
  },
  aiDjTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  aiDjSub: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  aiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    height: 42,
    marginBottom: spacing.sm,
  },
  aiInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 12.5,
    paddingVertical: 0,
  },
  aiGoBtn: {
    backgroundColor: colors.spotifyGreen,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiMoodRow: {
    flexDirection: 'row',
    gap: 6,
  },
  aiChip: {
    backgroundColor: '#282828',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiChipText: {
    color: colors.textPrimary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  shelfContent: {
    paddingHorizontal: spacing.md,
  },
});
