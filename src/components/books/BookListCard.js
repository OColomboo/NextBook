import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';

export function BookListCard({ title, author, description, badge, action, color, portrait }) {
  return (
    <View style={styles.listBookCard}>
      <View style={[styles.listBookImage, { backgroundColor: color }]}>
        {portrait === 'sea' ? <View style={styles.seaLine} /> : <View style={styles.sageFace} />}
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
          <View style={[styles.tinyDot, badge === 'VENDEDOR PREMIUM' && styles.redDot]} />
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
  seaLine: {
    width: '120%',
    height: 76,
    borderTopWidth: 2,
    borderTopColor: '#5a6f73',
    borderBottomWidth: 2,
    borderBottomColor: '#5a6f73',
    transform: [{ rotate: '-5deg' }],
  },
  sageFace: {
    width: 98,
    height: 138,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#d0bea2',
    backgroundColor: '#6d5846',
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
  redDot: {
    backgroundColor: colors.red,
  },
  badgeText: {
    color: '#6d625c',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  actionText: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '900',
  },
});
