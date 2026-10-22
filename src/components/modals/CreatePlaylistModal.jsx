import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import { closeCreatePlaylistModal, showToast } from '../../redux/slices/uiSlice';
import { createPlaylist } from '../../redux/slices/librarySlice';

export default function CreatePlaylistModal() {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.ui.createPlaylistModalVisible);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!visible) return null;

  const handleClose = () => {
    setName('');
    setDescription('');
    dispatch(closeCreatePlaylistModal());
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      dispatch(showToast('Please enter a playlist name'));
      return;
    }

    dispatch(
      createPlaylist({
        name: trimmed,
        description: description.trim(),
      })
    );
    dispatch(showToast(`Created playlist: ${trimmed}`));
    handleClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.dialog}>
          <Text style={styles.title}>Give your playlist a name</Text>

          <TextInput
            placeholder="My Playlist"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus={true}
            style={styles.input}
          />

          <TextInput
            placeholder="Add an optional description"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.descInput]}
            multiline={true}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={handleClose}
              style={[styles.btn, styles.cancelBtn]}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreate}
              style={[styles.btn, styles.createBtn]}
            >
              <Text style={styles.createBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  dialog: {
    width: '100%',
    backgroundColor: colors.elevated,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#3E3E3E',
    color: colors.textPrimary,
    fontSize: 15,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  descInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.sm,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelBtn: {
    backgroundColor: 'transparent',
  },
  cancelBtnText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  createBtn: {
    backgroundColor: colors.spotifyGreen,
  },
  createBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
});
