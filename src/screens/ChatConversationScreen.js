import React from 'react';
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

export function ChatConversationScreen({ navigate }) {
  const { gutterContent, isCompact, width } = useResponsiveLayout();
  const showPhoneAction = width >= 340;
  const avatarSize = isCompact ? 48 : 58;
  const nameSize = isCompact ? 20 : 27;
  const roleSize = isCompact ? 15 : 19;
  const edgeIcon = isCompact ? 28 : 33;
  const contentPad = gutterContent;

  return (
    <SafeAreaView style={styles.chatScreen}>
      <KeyboardAvoidingView
        style={styles.chatKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        <View style={[styles.chatHeader, { paddingHorizontal: contentPad, minHeight: isCompact ? 72 : 86 }]}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('community')}>
            <Feather name="arrow-left" size={edgeIcon} color={colors.brownDark} />
          </TouchableOpacity>
          <UserAvatar initials="JT" color="#bf7a4e" size={avatarSize} online />
          <View style={styles.chatIdentity}>
            <Text style={[styles.chatName, { fontSize: 15 }]} numberOfLines={1}>
              Julian Thorne
            </Text>
            <Text style={[styles.chatRole, { fontSize: 10, lineHeight: roleSize }]} numberOfLines={2}>
              Especialista em Livros Raros
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
              <Text style={styles.chatListingTitle}>O Alquimista (1ª Ed. 1988)</Text>
              <Text style={styles.chatListingMeta}>R$ 2.450,00 • Oferta Pendente</Text>
            </View>
            <TouchableOpacity style={[styles.adButton, isCompact && styles.adButtonCompact]} onPress={() => navigate('bookDetail')}>
              <Text style={[styles.adButtonText, isCompact && { fontSize: 15 }]}>Ver Anúncio</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.dateChip, isCompact && { paddingHorizontal: 12, letterSpacing: 1 }]}>
            24 DE OUTUBRO DE 2023
          </Text>

          <ChatMessageBubble incoming time="10:15">
            Olá! Vi seu interesse na primeira edição de O Alquimista. É um exemplar verdadeiramente notável, com
            oxidação mínima nas guardas.
          </ChatMessageBubble>
          <ChatMessageBubble time="10:18">
            Obrigado pelo contato, Julian. As fotos parecem excelentes. Notei uma pequena marca na lombada — é um
            rasgo ou apenas um desgaste superficial?
          </ChatMessageBubble>
          <ChatMessageBubble incoming time="10:20">
            Bem observado! Na verdade, é apenas um desgaste superficial bem pequeno no couro. Subi uma foto macro
            dessa área específica na galeria do anúncio, caso queira ver melhor. Não chegou a romper a pele.
          </ChatMessageBubble>
          <ChatMessageBubble time="10:22">
            Perfeito, isso tranquiliza. Estou disposto a pagar o valor pedido se você puder incluir o frete com seguro
            para São Paulo. O que acha?
          </ChatMessageBubble>
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
            <TextInput style={[styles.messageInput, isCompact && { fontSize: 10 }]} placeholder="..." placeholderTextColor="#b8aea9" />
          </View>
          <TouchableOpacity style={[styles.sendButton, isCompact && styles.sendButtonCompact]}>
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
    paddingLeft: 50,
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

});
