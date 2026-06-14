import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { UserAvatar } from '../community/UserAvatar';

export function BookListCard({ title, author, description, badge, action, color, avatar, name, imageSource}) {
  return (
    <View style={styles.listBookCard}>
      <View style={styles.publisherRow}>
        <UserAvatar initials={avatar || 'US'} color={colors.brown} size={38} />
        <View>
          <Text style={styles.publisherLabel}>PUBLICADO POR</Text>
          <Text style={styles.publisherName}>{name}</Text>
        </View>
      </View>
      <View style={[styles.listBookImage, { backgroundColor: color }]}>
        {imageSource && (
          <Image source={{ uri: imageSource}} style={styles.listBookPhoto} />
        )}
      </View>
      <View style={styles.listBookHeader}>
        <View>
          <Text style={styles.listBookTitle}>{title}</Text>
          <Text style={styles.listBookAuthor}>{author}</Text>
        </View>
        <Feather name="bookmark" size={22} color={colors.muted} />
      </View>
      <Text style={styles.listDescription}>{description}</Text>
      <View style={styles.listBookFooter}>
        <View style={styles.badgeLine}>
          <View style={styles.tinyDot} />
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.actionText}>{action}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listBookCard: {
    backgroundColor: colors.white,
    borderRadius: 7,
    padding: 14,
    marginBottom: 28,
  },
  listBookImage: {
    height: 196,
    marginBottom: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  publisherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  publisherLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  publisherName: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },
  listBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listBookTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  listBookAuthor: {
    color: '#6f6761',
    fontSize: 14,
    marginTop: 2,
  },
  listDescription: {
    color: '#6d645e',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  listBookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tinyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#836f48',
  },
  badgeText: {
    color: '#6d625c',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  actionText: {
    color: colors.brown,
    fontSize: 20,
    fontWeight: '900',
  },
  listBookPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});
