import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { UserAvatar } from './UserAvatar';

export function CommunityPostCard({
  avatar,
  name,
  meta,
  text,
  imageType,
  badge,
  quote,
  likes,
  comments,
  action,
  accent,
  centered,
}) {
  return (
    <View style={[styles.postCard, accent && styles.postAccent]}>
      <View style={styles.postHeader}>
        <UserAvatar initials={avatar} color={avatar === 'BO' ? '#944d2e' : avatar === 'RS' ? '#77a568' : '#a06a52'} />
        <View style={styles.postIdentity}>
          <Text style={styles.postName}>{name}</Text>
          <Text style={styles.postMeta}>{meta}</Text>
        </View>
        {badge ? (
          <View style={styles.postBadge}>
            <Text style={styles.postBadgeText}>{badge}</Text>
          </View>
        ) : (
          <Entypo name="dots-three-horizontal" size={20} color={colors.muted} />
        )}
      </View>

      {quote ? (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>INTERESSE EM TROCA</Text>
          <Text style={styles.postText}>{text}</Text>
        </View>
      ) : (
        <Text style={[styles.postText, centered && styles.centeredPost]}>{text}</Text>
      )}

      {imageType === 'openBook' && (
        <View style={styles.postImage}>
          <View style={styles.openBook}>
            <View style={styles.pageLeft} />
            <View style={styles.pageRight} />
          </View>
          <View style={styles.coffeeCup} />
        </View>
      )}

      <View style={styles.postFooter}>
        <View style={styles.postStats}>
          <View style={styles.statPair}>
            <FontAwesome name={likes === '124' ? 'heart' : 'heart-o'} size={23} color={likes === '124' ? colors.brown : colors.muted} />
            <Text style={styles.statText}>{likes}</Text>
          </View>
          <View style={styles.statPair}>
            <Feather name="message-square" size={24} color={colors.muted} />
            <Text style={styles.statText}>{comments}</Text>
          </View>
        </View>
        {action ? (
          <View style={styles.interestButtonWrap}>
            <TouchableOpacity style={styles.interestButton} activeOpacity={0.85}>
              <Text style={styles.interestText}>{action}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Feather name={centered ? 'share-2' : 'bookmark'} size={23} color={colors.muted} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 24,
    marginBottom: 30,
  },
  postAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.brown,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  postIdentity: {
    flex: 1,
  },
  postName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  postMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 3,
  },
  postBadge: {
    backgroundColor: '#f3cec7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
  },
  postBadgeText: {
    color: colors.brown,
    fontSize: 10,
    fontWeight: '800',
  },
  postText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 29,
  },
  centeredPost: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 30,
    paddingVertical: 34,
  },
  quoteBox: {
    backgroundColor: colors.paperStrong,
    padding: 18,
    borderRadius: 4,
  },
  quoteLabel: {
    color: colors.brown,
    fontSize: 15,
    letterSpacing: 1,
    marginBottom: 8,
  },
  postImage: {
    height: 196,
    backgroundColor: '#815b38',
    marginTop: 22,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  openBook: {
    width: 170,
    height: 120,
    backgroundColor: colors.paperStrong,
    borderRadius: 3,
    flexDirection: 'row',
    padding: 10,
  },
  pageLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    backgroundColor: colors.surfaceWarm,
  },
  pageRight: {
    flex: 1,
    backgroundColor: colors.surfaceWarm,
  },
  coffeeCup: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#28251f',
    borderWidth: 12,
    borderColor: '#ece1d1',
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eadfcc',
    marginTop: 24,
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  postStats: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 12,
    minHeight: 32,
  },
  statPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  interestButtonWrap: {
    flexShrink: 1,
    maxWidth: '48%',
    alignItems: 'flex-end',
  },
  statText: {
    color: '#756b65',
    fontWeight: '800',
  },
  interestButton: {
    width: '100%',
    backgroundColor: colors.brown,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  interestText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
