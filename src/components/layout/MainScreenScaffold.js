import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeaderBar } from './AppHeaderBar';
import { BottomTabBar } from './BottomTabBar';
import { colors } from '../../theme/appColors';
import { useResponsiveLayout } from '../../theme/ResponsiveLayoutContext';

export function MainScreenScaffold({
  active,
  children,
  overlay,
  navigate,
  openMenu,
  library = false,
  headerSearch = true,
  headerProfile = true,
}) {
  const { gutterContent, bottomScrollPadding } = useResponsiveLayout();

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeaderBar
        openMenu={openMenu}
        navigate={navigate}
        showSearch={headerSearch}
        showProfile={headerProfile}
        library={library}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: gutterContent, paddingBottom: bottomScrollPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {overlay ? <View style={styles.overlayHost} pointerEvents="box-none">{overlay}</View> : null}
      <BottomTabBar active={active} navigate={navigate} library={library} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {},
  overlayHost: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});
