import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';

export function FormField({ label, placeholder, multiline, height }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldMultiline, height ? { height } : null]}
        placeholder={placeholder}
        placeholderTextColor="#8c96a3"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export function FormSelectField({ label, value }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.selectInput}>
        <Text style={styles.selectText}>{value}</Text>
        <Feather name="chevron-down" size={20} color="#87909b" />
      </View>
    </View>
  );
}

export function FormOutlineField({ label, placeholder, multiline, height }) {
  return (
    <View style={styles.outlineGroup}>
      <Text style={styles.outlineLabel}>{label}</Text>
      <TextInput
        style={[styles.outlineInput, multiline && styles.outlineMultiline, height ? { height } : null]}
        placeholder={placeholder}
        placeholderTextColor="#d7c7c1"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export const formStyles = StyleSheet.create({
  /** Rótulos de seção fora de `FormField` (ex.: painel “Estado do livro”). */
  formLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  softPanel: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 22,
    marginBottom: 40,
  },
  panelHeading: {
    color: colors.brown,
    fontSize: 18,
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  segmented: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.brown,
  },
  segmentText: {
    color: colors.ink,
    fontWeight: '900',
  },
  segmentActiveText: {
    color: colors.white,
    fontWeight: '900',
  },
  deepFormPanel: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 30,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  formSubmitButton: {
    minHeight: 54,
    minWidth: 156,
    borderRadius: 6,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    ...cardShadow,
  },
  formSubmitText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  uploadCoverLarge: {
    height: 350,
    borderRadius: 7,
    backgroundColor: colors.paperStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  uploadLabelStrong: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 24,
  },
  uploadHint: {
    color: colors.softText,
    fontSize: 13,
    marginTop: 8,
  },
  reviewFormPanel: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    borderRadius: 8,
    padding: 34,
    marginBottom: 10,
  },
  centerSubmit: {
    alignSelf: 'center',
    minWidth: 220,
    marginTop: 26,
  },
});

const styles = StyleSheet.create({
  formLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldInput: {
    minHeight: 46,
    borderRadius: 6,
    backgroundColor: colors.paperStrong,
    color: colors.ink,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  fieldMultiline: {
    paddingTop: 15,
    lineHeight: 22,
  },
  selectInput: {
    minHeight: 47,
    borderRadius: 6,
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: colors.ink,
    fontSize: 16,
  },
  outlineGroup: {
    marginBottom: 28,
  },
  outlineLabel: {
    color: colors.brown,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  outlineInput: {
    minHeight: 51,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 20,
    paddingHorizontal: 14,
  },
  outlineMultiline: {
    backgroundColor: colors.surfaceWarm,
    paddingTop: 28,
    lineHeight: 27,
  },
});
