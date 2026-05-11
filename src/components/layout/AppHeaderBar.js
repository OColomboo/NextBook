import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { useResponsiveLayout } from '../../theme/ResponsiveLayoutContext';

export function AppHeaderBar({ openMenu, navigate, showSearch = true, showProfile = true, library = false }) {
  const { headerHorizontalPadding, isCompact } = useResponsiveLayout();
  const brandSize = isCompact ? 18 : 21;
  const menuSize = isCompact ? 22 : 24;
  const actionSize = isCompact ? 20 : 22;

  return (
    <View style={[styles.header, { paddingHorizontal: headerHorizontalPadding }, library && styles.libraryHeader]}>
      <TouchableOpacity style={styles.headerIcon} onPress={openMenu} activeOpacity={0.75}>
        <Feather name="menu" size={menuSize} color={colors.brownDark} />
      </TouchableOpacity>
      <Text style={[styles.brand, { fontSize: brandSize, marginLeft: isCompact ? 8 : 14 }]} numberOfLines={1}>
        NextBook
      </Text>
      <View style={styles.headerActions}>
        {showSearch && (
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('discover')}>
            <Feather name="search" size={actionSize} color={colors.brownDark} />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('login')}>
            <Feather name="user-circle" size={actionSize} color={colors.brownDark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 74,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  libraryHeader: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.greenSoft,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brand: {
    flex: 1,
    color: colors.brownDark,
    fontWeight: '800',
    minWidth: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
});
