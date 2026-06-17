import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/appColors';

export function ChatMessageBubble({ incoming = false, time, type, imageUrl, children }) {
  const isImage = type === 'image' && imageUrl;

  return (
    <View style={[styles.messageWrap, incoming ? styles.incomingWrap : styles.outgoingWrap]}>
      <View style={[
        styles.messageBubble,
        isImage && styles.imageBubble,
        incoming ? styles.incomingBubble : styles.outgoingBubble,
      ]}>
        {isImage ? (
          <Image source={{ uri: imageUrl }} style={styles.messageImage} resizeMode="cover" />
        ) : (
          <Text style={[styles.messageText, !incoming && styles.outgoingText]}>{children}</Text>
        )}
      </View>
      <Text style={[styles.messageTime, !incoming && styles.outgoingTime]}>
        {time}
        {!incoming ? '  ✓✓' : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrap: {
    marginBottom: 8,
    maxWidth: '82%',
  },
  incomingWrap: {
    alignSelf: 'flex-start',
  },
  outgoingWrap: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  imageBubble: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  incomingBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 0,
  },
  outgoingBubble: {
    backgroundColor: colors.brown,
    borderBottomRightRadius: 0,
  },
  messageImage: {
    width: 220,
    height: 220,
    borderRadius: 12,
  },
  messageText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
  },
  outgoingText: {
    color: colors.white,
  },
  messageTime: {
    color: '#695f59',
    fontSize: 11,
    marginTop: 4,
    marginLeft: 10,
  },
  outgoingTime: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});
