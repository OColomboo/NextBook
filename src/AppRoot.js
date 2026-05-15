import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './theme/appColors';
import { ResponsiveLayoutProvider, useResponsiveLayout } from './theme/ResponsiveLayoutContext';
import { NavigationDrawerMenu } from './components/navigation/NavigationDrawerMenu';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { DiscoverBooksScreen } from './screens/DiscoverBooksScreen';
import { CommunityFeedScreen } from './screens/CommunityFeedScreen';
import { AddBookListingScreen } from './screens/AddBookListingScreen';
import { BookReviewScreen } from './screens/BookReviewScreen';
import { BookDetailsScreen } from './screens/BookDetailsScreen';
import { BookListingDetailScreen } from './screens/BookListingDetailScreen';
import { ChatConversationScreen } from './screens/ChatConversationScreen';
import firebase from './firebaseConfig';

function AppContent() {
  const [screen, setScreen] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);
  const { width, webContainerMaxWidth } = useResponsiveLayout();

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
    setMenuOpen(false);
  };

  const sharedProps = {
    navigate,
    openMenu: () => setMenuOpen(true),
  };

  const webPhoneFrame =
    Platform.OS === 'web' && width > webContainerMaxWidth
      ? { maxWidth: webContainerMaxWidth, width: '100%', alignSelf: 'center' }
      : null;

  return (
    <View style={[styles.appRoot, webPhoneFrame]}>
      <StatusBar style="dark" />
      {screen === 'login' && <LoginScreen {...sharedProps} />}
      {screen === 'register' && <RegisterScreen {...sharedProps} />}
      {screen === 'discover' && <DiscoverBooksScreen {...sharedProps} />}
      {screen === 'community' && <CommunityFeedScreen {...sharedProps} />}
      {screen === 'add' && <AddBookListingScreen {...sharedProps} />}
      {screen === 'review' && <BookReviewScreen {...sharedProps} />}
      {screen === 'details' && <BookDetailsScreen {...sharedProps} />}
      {screen === 'bookDetail' && <BookListingDetailScreen {...sharedProps} />}
      {screen === 'chat' && <ChatConversationScreen {...sharedProps} />}
      <NavigationDrawerMenu visible={menuOpen} navigate={navigate} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

export default function App() {
  return (
    <ResponsiveLayoutProvider>
      <AppContent />
    </ResponsiveLayoutProvider>
  );
}

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
});
