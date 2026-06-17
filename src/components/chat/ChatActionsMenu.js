import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';

export function ChatActionsMenu({
  visible,
  onClose,
  actions = [],
  title = 'Opcoes da conversa',
  bottomOffset = 0,
}) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuOverlay}>
      <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.menuPanel, { paddingBottom: bottomOffset + 28 }]}>
        <Text style={styles.menuTitle}>{title}</Text>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={styles.menuItem}
            onPress={() => {
              onClose();
              action.onPress();
            }}
          >
            <Text style={[styles.menuItemText, action.destructive && styles.destructiveText]}>
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 30,
    justifyContent: 'flex-end',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 27, 22, 0.26)',
  },
  menuPanel: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 18,
    backgroundColor: colors.white,
    ...cardShadow,
  },
  menuTitle: {
    color: colors.brownDark,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  menuItem: {
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    justifyContent: 'center',
  },
  menuItemText: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '600',
  },
  destructiveText: {
    color: '#a33b2b',
  },
});
