import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';
import { UserAvatar } from '../community/UserAvatar';

function ProfileField({ label, value }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || 'Nao informado'}</Text>
    </View>
  );
}

export function ChatUserProfileModal({ visible, onClose, profile, loading, displayName }) {
  if (!visible) {
    return null;
  }

  const initials = displayName?.slice(0, 2).toUpperCase() || 'US';

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.panel}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={22} color={colors.brownDark} />
        </TouchableOpacity>

        <UserAvatar initials={initials} color="#bf7a4e" size={72} />
        <Text style={styles.profileName}>{profile?.nome || displayName || 'Usuario'}</Text>

        {loading ? (
          <ActivityIndicator color={colors.brown} style={styles.loader} />
        ) : (
          <>
            <ProfileField label="E-MAIL" value={profile?.email} />
            <ProfileField label="TELEFONE" value={profile?.telefone} />
            <ProfileField label="CIDADE" value={profile?.cidade} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 27, 22, 0.32)',
  },
  panel: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    alignItems: 'center',
    ...cardShadow,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    color: colors.ink,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  fieldBlock: {
    width: '100%',
    marginBottom: 16,
  },
  fieldLabel: {
    color: colors.brown,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  fieldValue: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  loader: {
    marginTop: 12,
  },
});
