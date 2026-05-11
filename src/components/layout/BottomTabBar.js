import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { useResponsiveLayout } from '../../theme/ResponsiveLayoutContext';

export function BottomTabBar({ active, navigate, library = false }) {
  const { headerHorizontalPadding, isCompact, bottomTabBarHeight, tabIconBase, tabIconAdd } =
    useResponsiveLayout();
  const labelSize = isCompact ? 8.5 : 10;
  const labelSpacing = isCompact ? 0.2 : 0.4;

  const tabs = [
    { key: 'discover', label: 'DESCOBRIR', icon: <Feather name="compass" /> },
    { key: 'community', label: 'COMUNIDADE', icon: <MaterialCommunityIcons name="account-group-outline" /> },
    { key: 'add', label: 'ANUNCIAR', icon: <Ionicons name="add-circle" /> },
    { key: 'chat', label: 'CHAT', icon: <Ionicons name="chatbox-outline" /> },
    { key: 'details', label: 'ESTANTE', icon: <Ionicons name="bookmarks-outline" /> },
  ];

  return (
    <View
      style={[
        styles.bottomNav,
        {
          height: bottomTabBarHeight,
          paddingHorizontal: Math.max(10, headerHorizontalPadding - 6),
        },
        library && styles.libraryBottomNav,
      ]}
    >
      {tabs.map((tab) => {
        const isActive =
          active === tab.key ||
          (active === 'review' && tab.key === 'add') ||
          (active === 'details' && tab.key === 'details');
        const tint = isActive ? colors.brown : colors.muted;
        const iconSize = tab.key === 'add' ? tabIconAdd : tabIconBase;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, isActive && styles.tabActive]}
            activeOpacity={0.75}
            onPress={() => navigate(tab.key)}
          >
            {React.cloneElement(tab.icon, { size: iconSize, color: tint })}
            <Text
              style={[styles.tabLabel, { fontSize: labelSize, letterSpacing: labelSpacing, color: tint }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  libraryBottomNav: {
    backgroundColor: colors.background,
    borderTopColor: colors.line,
  },
  tabItem: {
    flex: 1,
    minWidth: 0,
    maxHeight: 58,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    paddingVertical: 4,
    gap: 2,
  },
  tabActive: {
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.greenSoft,
  },
  tabLabel: {
    fontWeight: '800',
    textAlign: 'center',
    width: '100%',
  },
});
