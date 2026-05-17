import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { UserAvatar } from './UserAvatar';

export function CommunityPostCard({
  avatar,
  name,
  meta,
  bookname,
  rating,
  text,
  imageSource,
  likes,
  comments,
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
      </View>
        
        {bookname ? (
          <View style={styles.BookRatingRow}>
            <Text style={styles.postBookName}>{bookname}</Text>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesome
                  key={star}
                  name={star <= rating ? 'star' : 'star-o'}
                  size={18}
                  color={colors.brownDark}        
                />
              ))}
            </View>
          </View>
        ) : null}

        <Text style={[styles.postText, centered && styles.centeredPost]}>{text}</Text>
      
      {imageSource ? (
        <Image
          source={{ uri: imageSource}}
          style={styles.postImage}
          resizeMode='cover'
        />
      ) : null}
      
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
          <Feather name={'bookmark'} size={23} color={colors.muted} />
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
  postBookName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
    flexShrink: 1,
  },
  postMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 3,
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
  postImage: {
    width: '100%',
    height: 196,
    backgroundColor: colors.paperStrong,
    marginTop: 22,
    borderRadius: 3,
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
  BookRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statPair: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  statText: {
    color: '#756b65',
    fontWeight: '800',
  },
});
