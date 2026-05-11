import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/appColors';

export function ChatMessageBubble({ incoming = false, time, children }) {
  return (
    <View style={[styles.messageWrap, incoming ? styles.incomingWrap : styles.outgoingWrap]}>
      <View style={[styles.messageBubble, incoming ? styles.incomingBubble : styles.outgoingBubble]}>
        <Text style={[styles.messageText, !incoming && styles.outgoingText]}>{children}</Text>
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
    marginBottom: 10,
    maxWidth: '86%',
  },
  incomingWrap: {
    alignSelf: 'flex-start',
  },
  outgoingWrap: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 26,
  },
  incomingBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 0,
  },
  outgoingBubble: {
    backgroundColor: colors.brown,
    borderBottomRightRadius: 0,
  },
  messageText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 26,
  },
  outgoingText: {
    color: colors.white,
  },
  messageTime: {
    color: '#695f59',
    fontSize: 16,
    marginTop: 8,
    marginLeft: 14,
  },
  outgoingTime: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});
