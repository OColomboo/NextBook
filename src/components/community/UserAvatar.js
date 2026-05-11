import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/appColors';

export function UserAvatar({ initials, color, size = 48, online = false }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size > 54 ? 16 : 14 }]}>{initials}</Text>
      {online && <View style={styles.onlineDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
});
