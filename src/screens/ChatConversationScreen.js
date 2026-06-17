import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
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
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { UserAvatar } from '../components/community/UserAvatar';
import { ChatMessageBubble } from '../components/chat/ChatMessageBubble';
import { ChatActionsMenu } from '../components/chat/ChatActionsMenu';
import { ChatUserProfileModal } from '../components/chat/ChatUserProfileModal';
import {
  blockUser,
  clearTyping,
  deleteChatForUser,
  fetchListingForChat,
  fetchUserProfile,
  reportUser,
  sendImageMessage,
  sendTextMessage,
  setTyping,
} from '../components/chat/ChatService';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref, update } from 'firebase/database';

const TYPING_STALE_MS = 3000;
const TYPING_DEBOUNCE_MS = 2500;

function resolveTimestamp(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  return Date.now();
}

function formatListingMeta(book, chat) {
  const status = book?.status || chat?.listingStatus;
  const dealType = String(book?.dealType || chat?.listingDealType || '').toLowerCase();
  const price = book?.price || chat?.listingPrice;

  if (status) {
    return String(status).toUpperCase();
  }

  if (dealType === 'troca') {
    return 'TROCA';
  }

  if (price) {
    const priceText = String(price);
    return priceText.includes('R$') ? priceText : `R$ ${priceText}`;
  }

  return 'ANUNCIO';
}

export function ChatConversationScreen({ navigate, routeParams }) {
  const { chatId } = routeParams || {};
  const { gutterContent, isCompact, width } = useResponsiveLayout();
  const avatarSize = isCompact ? 48 : 58;
  const roleSize = isCompact ? 15 : 19;
  const edgeIcon = isCompact ? 28 : 33;
  const contentPad = gutterContent;
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [sendingAttachment, setSendingAttachment] = useState(false);
  const [loadingListing, setLoadingListing] = useState(false);
  const [listingDetails, setListingDetails] = useState(null);
  const typingDebounceRef = useRef(null);
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;
  const isSeller = user?.uid === chat?.sellerId;
  const otherUserId = isSeller ? chat?.buyerId : chat?.sellerId;
  const otherUserName = isSeller ? chat?.buyerName : chat?.sellerName;
  const otherUserInitials = otherUserName?.slice(0, 2).toUpperCase() || 'US';
  const currentDateLabel = new Date()
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    .toUpperCase();
  const listingTitle = listingDetails?.title || chat?.listingTitle || 'Anuncio';
  const listingImage = listingDetails?.imageSource || chat?.listingImage;
  const listingMeta = formatListingMeta(listingDetails, chat);

  useEffect(() => {
    if (!chatId) return;

    const chatRef = ref(db, `chats/${chatId}`);

    const unsubscribe = onValue(chatRef, (snapshot) => {
      setChat(snapshot.val());
    });

    return () => unsubscribe();
  }, [chatId, db]);

  useEffect(() => {
    if (!chatId || !user) return;

    update(ref(db, `userChats/${user.uid}/${chatId}`), {
      unread: false,
    });
  }, [chatId, user, db]);

  useEffect(() => {
    if (!chat?.listingId) {
      setListingDetails(null);
      return undefined;
    }

    let active = true;

    async function loadListingDetails() {
      try {
        const book = await fetchListingForChat(chat.listingId, chat.sellerId);

        if (active) {
          setListingDetails(book);
        }
      } catch (error) {
        if (active) {
          setListingDetails(null);
        }
      }
    }

    loadListingDetails();

    return () => {
      active = false;
    };
  }, [chat?.listingId, chat?.sellerId]);

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
  }, [chatId, db]);

  useEffect(() => {
    if (!chatId || !otherUserId) {
      setOtherUserTyping(false);
      return undefined;
    }

    const typingRef = ref(db, `chats/${chatId}/typing/${otherUserId}`);

    const unsubscribe = onValue(typingRef, (snapshot) => {
      if (!snapshot.exists()) {
        setOtherUserTyping(false);
        return;
      }

      const timestamp = resolveTimestamp(snapshot.val());
      setOtherUserTyping(Boolean(timestamp && Date.now() - timestamp < TYPING_STALE_MS));
    });

    return () => unsubscribe();
  }, [chatId, otherUserId, db]);

  useEffect(() => {
    return () => {
      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      if (chatId && user?.uid) {
        clearTyping(chatId, user.uid);
      }
    };
  }, [chatId, user?.uid]);

  function scheduleClearTyping() {
    if (typingDebounceRef.current) {
      clearTimeout(typingDebounceRef.current);
    }

    typingDebounceRef.current = setTimeout(() => {
      if (chatId && user?.uid) {
        clearTyping(chatId, user.uid);
      }
    }, TYPING_DEBOUNCE_MS);
  }

  function handleMessageChange(text) {
    setMessageText(text);

    if (!chatId || !user?.uid) {
      return;
    }

    if (text.trim()) {
      setTyping(chatId, user.uid);
      scheduleClearTyping();
    } else {
      clearTyping(chatId, user.uid);
    }
  }

  async function enviarMensagem() {
    if (!chatId || !chat || !user) return;

    const text = messageText.trim();

    if (!text) return;

    await clearTyping(chatId, user.uid);
    await sendTextMessage(chatId, chat, user, text);
    setMessageText('');
  }

  async function handleVerAnuncio() {
    if (!chat?.listingId) {
      alert('Nao foi possivel encontrar o anuncio desta conversa.');
      return;
    }

    setLoadingListing(true);

    try {
      const book = await fetchListingForChat(chat.listingId, chat.sellerId);

      if (!book) {
        alert('Este anuncio nao esta mais disponivel.');
        return;
      }

      navigate('bookDetail', { book });
    } catch (error) {
      alert(error.message || 'Nao foi possivel abrir o anuncio.');
    } finally {
      setLoadingListing(false);
    }
  }

  async function handleDeleteChat() {
    Alert.alert('Excluir conversa', 'Esta conversa sumira apenas para voce.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteChatForUser(user.uid, chatId);
            navigate('chat');
          } catch (error) {
            alert(error.message || 'Nao foi possivel excluir a conversa.');
          }
        },
      },
    ]);
  }

  async function handleBlockUser() {
    Alert.alert(
      'Bloquear usuario',
      `Voce nao podera mais conversar com ${otherUserName || 'este usuario'}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: async () => {
            try {
              await blockUser(user.uid, otherUserId);
              alert('Usuario bloqueado.');
              navigate('chat');
            } catch (error) {
              alert(error.message || 'Nao foi possivel bloquear o usuario.');
            }
          },
        },
      ],
    );
  }

  function handleReportUser() {
    const reasons = ['Assedio', 'Golpe/fraude', 'Spam', 'Outro'];

    Alert.alert('Denunciar usuario', 'Selecione o motivo da denuncia:', [
      ...reasons.map((reason) => ({
        text: reason,
        onPress: async () => {
          try {
            await reportUser({
              reporterId: user.uid,
              reportedId: otherUserId,
              chatId,
              reason,
            });
            alert('Denuncia enviada. Obrigado por nos avisar.');
          } catch (error) {
            alert(error.message || 'Nao foi possivel enviar a denuncia.');
          }
        },
      })),
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function handleViewProfile() {
    setProfileVisible(true);
    setProfileLoading(true);
    setProfileData(null);

    try {
      const profile = await fetchUserProfile(otherUserId);
      setProfileData(profile);
    } catch (error) {
      alert(error.message || 'Nao foi possivel carregar o perfil.');
      setProfileVisible(false);
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permita acesso a galeria para enviar uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (result.canceled || !chatId || !chat || !user) {
      return;
    }

    setSendingAttachment(true);

    try {
      await clearTyping(chatId, user.uid);
      await sendImageMessage(chatId, chat, user, result.assets[0].uri);
    } catch (error) {
      alert(error.message || 'Nao foi possivel enviar a imagem.');
    } finally {
      setSendingAttachment(false);
    }
  }

  function handleAttachmentPress() {
    Alert.alert('Anexar', 'Escolha uma opcao:', [
      { text: 'Enviar imagem da galeria', onPress: handlePickImage },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  const menuActions = [
    { label: 'Ver anuncio', onPress: handleVerAnuncio },
    { label: 'Ver perfil', onPress: handleViewProfile },
    { label: 'Denunciar usuario', onPress: handleReportUser },
    { label: 'Bloquear usuario', onPress: handleBlockUser, destructive: true },
    { label: 'Excluir conversa', onPress: handleDeleteChat, destructive: true },
  ];

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
              {otherUserName || 'Usuario'}
            </Text>
            <Text style={[styles.chatRole, { fontSize: 10, lineHeight: roleSize }]} numberOfLines={2}>
              Conversa sobre anuncio
            </Text>
          </View>

          <TouchableOpacity style={styles.headerIcon} onPress={() => setMenuVisible(true)}>
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
            {listingImage ? (
              <Image source={{ uri: listingImage }} style={styles.chatListingImage} />
            ) : (
              <View style={styles.chatListingFallback}>
                <Feather name="book-open" size={24} color={colors.brown} />
              </View>
            )}
            <View style={[styles.chatListingText, { minWidth: 0 }]}>
              <Text style={styles.chatListingTitle} numberOfLines={2}>{listingTitle}</Text>
              <Text style={styles.chatListingMeta}>{listingMeta}</Text>
              <TouchableOpacity
                style={[styles.adButton, isCompact && styles.adButtonCompact]}
                onPress={handleVerAnuncio}
                disabled={loadingListing}
              >
                <Text style={[styles.adButtonText, isCompact && { fontSize: 13 }]}>
                  {loadingListing ? 'Carregando...' : 'Ver anuncio'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.dateChip, isCompact && { paddingHorizontal: 12, letterSpacing: 1 }]}>
            {currentDateLabel}
          </Text>

          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              incoming={message.senderId !== user?.uid}
              type={message.type}
              imageUrl={message.imageUrl}
            >
              {message.text}
            </ChatMessageBubble>
          ))}
        </ScrollView>

        {otherUserTyping ? (
          <View style={[styles.typingLine, { paddingHorizontal: contentPad }]}>
            <View style={styles.typingDots}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.typingText}>{otherUserName || 'Usuario'} esta digitando...</Text>
          </View>
        ) : null}

        <View style={[styles.messageBar, { paddingHorizontal: Math.max(12, contentPad - 4) }]}>
          <TouchableOpacity
            style={[styles.addMessageButton, isCompact && styles.addMessageButtonCompact]}
            onPress={handleAttachmentPress}
            disabled={sendingAttachment}
          >
            <Feather name="plus" size={isCompact ? 15 : 20} color={colors.brown} />
          </TouchableOpacity>

          <View style={[styles.messageInputWrap, isCompact && styles.messageInputWrapCompact]}>
            <TextInput
              style={[styles.messageInput, isCompact && { fontSize: 10 }]}
              placeholder="..."
              placeholderTextColor="#b8aea9"
              value={messageText}
              onChangeText={handleMessageChange}
              editable={!sendingAttachment}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, isCompact && styles.sendButtonCompact]}
            onPress={enviarMensagem}
            disabled={sendingAttachment}
          >
            <Ionicons name="send" size={isCompact ? 15 : 20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ChatActionsMenu visible={menuVisible} onClose={() => setMenuVisible(false)} actions={menuActions} />
      <ChatUserProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        profile={profileData}
        loading={profileLoading}
        displayName={otherUserName}
      />
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
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '86%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 34,
    ...cardShadow,
  },
  chatListingCompact: {
    width: '92%',
    padding: 10,
  },
  chatListingImage: {
    width: 58,
    height: 78,
    borderRadius: 6,
    backgroundColor: colors.paperStrong,
    flexShrink: 0,
  },
  chatListingFallback: {
    width: 58,
    height: 78,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    flexShrink: 0,
  },
  chatListingText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  chatListingTitle: {
    color: colors.brownDark,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
  },
  chatListingMeta: {
    color: colors.brown,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '900',
    marginTop: 3,
  },
  adButton: {
    borderRadius: 16,
    backgroundColor: colors.peach,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  adButtonCompact: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
  },
  adButtonText: {
    color: colors.brown,
    fontSize: 13,
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
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
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
