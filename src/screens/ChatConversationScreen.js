import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { UserAvatar } from '../components/community/UserAvatar';
import { ChatMessageBubble } from '../components/chat/ChatMessageBubble';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, onValue, push, set, update, serverTimestamp } from 'firebase/database';

export function ChatConversationScreen({ navigate, routeParams }) {
  const { chatId } = routeParams || {};
  const { gutterContent, isCompact, width } = useResponsiveLayout();
  const showPhoneAction = width >= 340;
  const avatarSize = isCompact ? 48 : 58;
  const nameSize = isCompact ? 20 : 27;
  const roleSize = isCompact ? 15 : 19;
  const edgeIcon = isCompact ? 28 : 33;
  const contentPad = gutterContent;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;
  const isSeller = user?.uid === chat?.sellerId;
  const otherUserName = isSeller ? chat?.buyerName : chat?.sellerName;
  const otherUserInitials = otherUserName?.slice(0, 2).toUpperCase() || 'US';
  const currentDateLabel = new Date()
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();

  useEffect(() => {
    if (!chatId) return;

    const chatRef = ref(db, `chats/${chatId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      setChat(snapshot.val());
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    if (!chatId || !user) return;

    update(ref(db, `userChats/${user.uid}/${chatId}`), {
      unread: false,
    });
  }, [chatId, user]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = ref(db, `chats/${chatId}/messages`);

    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setMessages([]);
        return;
      }

      const messagesArray = Object.entries(data)
        .map(([id, message]) => ({ id, ...message }))
        .sort((a, b) => (a.criadoEm || 0) - (b.criadoEm || 0));

      setMessages(messagesArray);
    });

    return () => unsubscribe();
  }, [chatId]);

  async function enviarMensagem() {
    if (!chatId || !chat || !user) return;

    const text = messageText.trim();

    if (!text) return;

    const messageRef = push(ref(db, `chats/${chatId}/messages`));

    await set(messageRef, {
      senderId: user.uid,
      text,
      criadoEm: serverTimestamp(),
    });

    await update(ref(db, `chats/${chatId}`), {
      lastMessage: text,
      lastSenderId: user.uid,
      updatedAt: serverTimestamp(),
    });

    await update(ref(db, `userChats/${chat.sellerId}/${chatId}`), {
      lastMessage: text,
      lastSenderId: user.uid,
      unread: user.uid !== chat.sellerId,
      updatedAt: serverTimestamp(),
    });

    await update(ref(db, `userChats/${chat.buyerId}/${chatId}`), {
      lastMessage: text,
      lastSenderId: user.uid,
      unread: user.uid !== chat.buyerId,
      updatedAt: serverTimestamp(),
    });

    setMessageText('');
  }

  return (
    <SafeAreaView style={styles.chatScreen}>
      <KeyboardAvoidingView
        style={styles.chatKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={[styles.chatHeader, { paddingHorizontal: contentPad, minHeight: isCompact ? 72 : 86 }]}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('chat')}>
            <Feather name="arrow-left" size={edgeIcon} color={colors.brownDark} />
          </TouchableOpacity>
          <UserAvatar initials={otherUserInitials} color="#bf7a4e" size={avatarSize} online />
          <View style={styles.chatIdentity}>
            <Text style={[styles.chatName, { fontSize: 15 }]} numberOfLines={1}>
              {otherUserName || 'Usuário'}
            </Text>
            <Text style={[styles.chatRole, { fontSize: 10, lineHeight: roleSize }]} numberOfLines={2}>
              Conversa sobre anúncio
            </Text>
          </View>

          <TouchableOpacity style={styles.headerIcon}>
            <Entypo name="dots-three-vertical" size={isCompact ? 20 : 23} color={colors.brownDark} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.chatScroll}
          contentContainerStyle={[styles.chatContent, { paddingHorizontal: contentPad, paddingBottom: 24 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <View style={[styles.chatListing, isCompact && styles.chatListingCompact]}>
          <View style={styles.chatThumb}>
            <Text style={styles.chatThumbText}>1ª ED.</Text>
          </View>
          <View style={[styles.chatListingText, { minWidth: 0 }]}>
            <Text style={styles.chatListingTitle}>{chat?.listingTitle}</Text>
            <Text style={styles.chatListingMeta}>
              {chat?.lastMessage || 'Conversa iniciada'}
            </Text>
          </View>
          <TouchableOpacity style={[styles.adButton, isCompact && styles.adButtonCompact]} onPress={() => navigate('details')}>
            <Text style={[styles.adButtonText, isCompact && { fontSize: 15 }]}>Ver Anúncio</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.dateChip, isCompact && { paddingHorizontal: 12, letterSpacing: 1 }]}>
          {currentDateLabel}
        </Text>

        {messages.map((message) => (
          <ChatMessageBubble
            key={message.id}
            incoming={message.senderId !== user?.uid}
          >
            {message.text}
          </ChatMessageBubble>
        ))}
        </ScrollView>

        <View style={[styles.typingLine, { paddingHorizontal: contentPad }]}>
          <View style={styles.typingDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.typingText}>Julian está digitando...</Text>
        </View>

        <View style={[styles.messageBar, { paddingHorizontal: Math.max(12, contentPad - 4) }]}>
          <TouchableOpacity style={[styles.addMessageButton, isCompact && styles.addMessageButtonCompact]}>
            <Feather name="plus" size={isCompact ? 15 : 20} color={colors.brown} />
          </TouchableOpacity>
          
          <View style={[styles.messageInputWrap, isCompact && styles.messageInputWrapCompact]}>
            <TextInput style={[styles.messageInput, isCompact && { fontSize: 10 }]}
              placeholder="..." 
              placeholderTextColor="#b8aea9" 
              value={messageText}
              onChangeText={setMessageText}
            />
          </View>

          <TouchableOpacity style={[styles.sendButton, isCompact && styles.sendButtonCompact]} onPress={enviarMensagem}>
            <Ionicons name="send" size={isCompact ? 15 : 20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  chatScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  chatKeyboard: {
    flex: 1,
  },
  chatHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chatIdentity: {
    flex: 1,
    minWidth: 0,
  },
  chatName: {
    color: colors.brownDark,
    fontWeight: '800',
  },
  chatRole: {
    color: '#665b55',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 8,
  },
  chatListing: {
    backgroundColor: colors.greenWash,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 48,
    ...cardShadow,
  },
  chatListingCompact: {
    padding: 16,
  },
  chatThumb: {
    display: 'none',
    width: 100,
    height: 30,
    borderRadius: 4,
    backgroundColor: '#6b3b24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatThumbText: {
    color: '#e7c291',
    fontSize: 13,
    fontWeight: '900',
  },
  chatListingText: {
    flex: 1,
    minWidth: 100,
  },
  chatListingTitle: {
    color: colors.brownDark,
    fontSize: 16,
    lineHeight: 22,
  },
  chatListingMeta: {
    color: '#5f5751',
    fontSize: 16,
    lineHeight: 22,
  },
  adButton: {
    borderRadius: 30,
    backgroundColor: colors.peach,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexShrink: 0,
  },
  adButtonCompact: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
  },
  adButtonText: {
    color: colors.brown,
    fontSize: 17,
    fontWeight: '900',
  },
  dateChip: {
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.greenSoft,
    color: '#5d5550',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
    paddingHorizontal: 28,
    paddingVertical: 9,
    marginBottom: 40,
  },
  typingLine: {
    display: 'none',
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#c6bda6',
  },
  typingText: {
    color: '#5b534d',
    fontSize: 12,
    fontWeight: '800',
  },
  messageBar: {
    minHeight: 88,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  addMessageButtonCompact: {
    width: 30,
    height: 30,
    borderRadius: 24,
  },
  messageInputWrap: {
    flex: 1,
    minHeight: 56,
    minWidth: 0,
    borderRadius: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  messageInputWrapCompact: {
    minHeight: 48,
    paddingHorizontal: 12,
  },
  messageInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sendButtonCompact: {
    width: 50,
    height: 50,
  },
});
