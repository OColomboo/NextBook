import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';
import { screenDrawerMenuItems } from '../../constants/screenDrawerMenuItems';
import { useResponsiveLayout } from '../../theme/ResponsiveLayoutContext';

export function NavigationDrawerMenu({ visible, navigate, onClose }) {
  const { width, gutter, gutterContent, isCompact } = useResponsiveLayout();
  const panelWidth = Math.min(isCompact ? width - gutterContent * 2 : 272, width - gutter * 2);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuOverlay}>
      <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.menuPanel, { width: panelWidth, marginLeft: gutterContent, marginTop: isCompact ? 48 : 58 }]}>
        <Text style={styles.menuTitle}>Telas NextBook</Text>
        {screenDrawerMenuItems.map(([key, label]) => (
          <TouchableOpacity key={key} style={styles.menuItem} onPress={() => navigate(key)}>
            <Text style={styles.menuItemText}>{label}</Text>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: 'flex-start',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 27, 22, 0.26)',
  },
  menuPanel: {
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.white,
    ...cardShadow,
  },
  menuTitle: {
    color: colors.brownDark,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  menuItem: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
});
