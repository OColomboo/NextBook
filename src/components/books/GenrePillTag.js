import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/appColors';

export function GenrePillTag({ label, active, muted }) {
  return (
    <View style={[styles.pill, active && styles.pillActive, muted && styles.pillMuted]}>
      <Text style={[styles.pillText, active && styles.pillActiveText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 23,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    paddingVertical: 9,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  pillActive: {
    backgroundColor: colors.brown,
    borderColor: colors.greenDark,
  },
  pillMuted: {
    backgroundColor: colors.greenWash,
    borderColor: colors.line,
  },
  pillText: {
    color: colors.brownDark,
    fontSize: 14,
    fontWeight: '800',
  },
  pillActiveText: {
    color: colors.white,
  },
});
