import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { UserAvatar } from '../components/community/UserAvatar';

function formatChatDate(value) {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
}

export function ChatListScreen({ navigate, openMenu }) {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    const userChatsRef = ref(db, `userChats/${user.uid}`);

    const unsubscribe = onValue(userChatsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setChats([]);
        return;
      }

      const chatsArray = Object.entries(data)
        .map(([id, chat]) => ({
          id,
          ...chat,
        }))
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

      setChats(chatsArray);
    });

    return () => unsubscribe();
  }, [db, user]);

  const filteredChats = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return chats;
    }

    return chats.filter((chat) => {
      const person = (chat.otherUserName || '').toLowerCase();
      const listing = (chat.listingTitle || '').toLowerCase();
      const message = (chat.lastMessage || '').toLowerCase();

      return person.includes(query) || listing.includes(query) || message.includes(query);
    });
  }, [chats, searchTerm]);

  return (
    <MainScreenScaffold active="chat" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <View style={styles.headerBlock}>
        <Text style={styles.pageTitle}>Chats</Text>
        <Text style={styles.chatCount}>{chats.length}</Text>
      </View>

      <View style={styles.searchBox}>
        <Feather name="search" size={18} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar conversa"
          placeholderTextColor={colors.softText}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {!user ? (
        <View style={styles.emptyState}>
          <Feather name="lock" size={24} color={colors.brown} />
          <Text style={styles.emptyTitle}>Voce precisa estar logado.</Text>
        </View>
      ) : filteredChats.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="message-square" size={24} color={colors.brown} />
          <Text style={styles.emptyTitle}>
            {chats.length === 0 ? 'Nenhuma conversa ativa.' : 'Nenhuma conversa encontrada.'}
          </Text>
          <Text style={styles.emptyText}>Abra um anuncio e toque em conversar com o vendedor.</Text>
        </View>
      ) : (
        <View style={styles.chatList}>
          {filteredChats.map((chat) => {
            const hasUnread = !!chat.unread && chat.lastSenderId !== user?.uid;

            return (
              <TouchableOpacity
                key={chat.id}
                style={styles.chatRow}
                activeOpacity={0.74}
                onPress={() => navigate('chatConversation', { chatId: chat.id })}
              >
                <View style={styles.avatarWrap}>
                  <UserAvatar
                    initials={chat.otherUserName?.slice(0, 2).toUpperCase() || 'US'}
                    color={hasUnread ? colors.greenDark : colors.brown}
                    size={54}
                  />
                  {hasUnread ? <View style={styles.unreadDot} /> : null}
                </View>

                <View style={styles.chatInfo}>
                  <View style={styles.chatTopLine}>
                    <Text style={[styles.personName, hasUnread && styles.unreadText]} numberOfLines={1}>
                      {chat.otherUserName || 'Usuario'}
                    </Text>
                    <Text style={[styles.chatDate, hasUnread && styles.unreadDate]}>
                      {formatChatDate(chat.updatedAt)}
                    </Text>
                  </View>

                  <Text style={styles.listingTitle} numberOfLines={1}>
                    {chat.listingTitle || 'Anuncio sem titulo'}
                  </Text>

                  <View style={styles.messageLine}>
                    <Text style={[styles.lastMessage, hasUnread && styles.unreadPreview]} numberOfLines={1}>
                      {chat.lastMessage || 'Conversa iniciada'}
                    </Text>
                    {hasUnread ? (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadBadgeText}>1</Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                {chat.listingImage ? (
                  <Image source={{ uri: chat.listingImage }} style={styles.listingImage} />
                ) : (
                  <View style={styles.listingFallback}>
                    <Feather name="book-open" size={17} color={colors.brown} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  pageTitle: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
  },
  chatCount: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.greenDark,
    color: colors.white,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '900',
    overflow: 'hidden',
    paddingTop: 8,
  },
  searchBox: {
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
  },
  chatList: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  chatRow: {
    minHeight: 92,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  avatarWrap: {
    width: 58,
    height: 58,
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    right: 2,
    top: 3,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  chatInfo: {
    flex: 1,
    minWidth: 0,
  },
  chatTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  personName: {
    flex: 1,
    color: colors.ink,
    fontSize: 17,
    fontWeight: '800',
  },
  unreadText: {
    fontWeight: '900',
  },
  chatDate: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '800',
  },
  unreadDate: {
    color: colors.greenDark,
  },
  listingTitle: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 3,
  },
  messageLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  lastMessage: {
    flex: 1,
    color: '#6d645e',
    fontSize: 13,
    lineHeight: 18,
  },
  unreadPreview: {
    color: colors.ink,
    fontWeight: '800',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  listingImage: {
    width: 42,
    height: 58,
    borderRadius: 5,
    backgroundColor: colors.paperStrong,
  },
  listingFallback: {
    width: 42,
    height: 58,
    borderRadius: 5,
    backgroundColor: colors.greenWash,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 24,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
