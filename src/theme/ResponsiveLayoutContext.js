import React, { createContext, useContext, useMemo } from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';

const win = Dimensions.get('window');
const defaultWidth = win.width;
const defaultHeight = win.height;
const defaultFontScale = win.fontScale ?? 1;

function buildMetrics(width, height, fontScale) {
  const fs = Math.min(Math.max(fontScale || 1, 0.92), 1.25);
  const isCompact = width < 360;
  const isTablet = width >= 720;
  const gutter = isCompact ? 14 : isTablet ? Math.min(36, Math.round(width * 0.045)) : 20;
  const gutterContent = isCompact ? Math.max(gutter, 16) : isTablet ? Math.min(34, Math.round(width * 0.048)) : 26;
  const headerHorizontalPadding = isCompact ? 12 : isTablet ? 28 : 22;
  const bottomTabBarHeight = isCompact ? 74 : 80;
  const bottomScrollPadding = bottomTabBarHeight + (isCompact ? 20 : 28);
  const tabIconBase = isCompact ? 20 : 22;
  const webContainerMaxWidth = 480;

  return {
    width,
    height,
    fontScale: fs,
    isCompact,
    isTablet,
    gutter,
    gutterContent,
    headerHorizontalPadding,
    bottomTabBarHeight,
    bottomScrollPadding,
    tabIconBase,
    tabIconAdd: tabIconBase + 3,
    webContainerMaxWidth,
  };
}

const ResponsiveLayoutContext = createContext(buildMetrics(defaultWidth, defaultHeight, defaultFontScale));

export function ResponsiveLayoutProvider({ children }) {
  const { width, height, fontScale } = useWindowDimensions();
  const value = useMemo(() => buildMetrics(width, height, fontScale), [width, height, fontScale]);
  return <ResponsiveLayoutContext.Provider value={value}>{children}</ResponsiveLayoutContext.Provider>;
}

export function useResponsiveLayout() {
  return useContext(ResponsiveLayoutContext);
}
