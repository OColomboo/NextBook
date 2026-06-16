import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme/appColors';
import { cardShadow } from '../../theme/cardShadow';

export function AuthInputField({ label, rightLabel, placeholder, icon, compact, secureTextEntry, value, onChangeText, }) {
  return (
    <View style={[styles.authInputGroup, compact && styles.authInputCompact]}>
      <View style={styles.authLabelRow}>
        <Text style={styles.authLabel}>{label}</Text>
        {rightLabel && <Text style={styles.authRightLabel}>{rightLabel}</Text>}
      </View>
      <View style={[styles.authInputBox, compact && styles.authInputBoxCompact]}>
        <TextInput
          style={[styles.authTextInput, compact && styles.authTextInputCompact]}
          placeholder={placeholder}
          placeholderTextColor="#918881"
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
        />
        {icon}
      </View>
    </View>
  );
}

export function AuthCheckboxRow({ label, children, large = false }) {
  return (
    <View style={styles.checkLine}>
      <View style={[styles.checkbox, large && styles.checkboxLarge]} />
      {children || <Text style={[styles.checkText, large && styles.checkTextLarge]}>{label}</Text>}
    </View>
  );
}

export function AuthDividerLabel({ label }) {
  return (
    <View style={styles.dividerWrap}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

export function AuthPrimaryButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      {icon && <View style={styles.primaryIcon}>{icon}</View>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  authInputGroup: {
    marginBottom: 30,
  },
  authInputCompact: {
    marginBottom: 24,
  },
  authLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  authLabel: {
    color: '#7c716c',
    fontSize: 16,
    letterSpacing: 2,
  },
  authRightLabel: {
    color: colors.brownDark,
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '800',
  },
  authInputBox: {
    minHeight: 72,
    backgroundColor: colors.white,
    borderBottomWidth: 4,
    borderBottomColor: '#eee6df',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authInputBoxCompact: {
    minHeight: 66,
    borderBottomWidth: 0,
    borderRadius: 7,
    backgroundColor: colors.paperStrong,
  },
  authTextInput: {
    flex: 1,
    minHeight: 60,
    color: colors.ink,
    fontSize: 18,
  },
  authTextInputCompact: {
    fontSize: 15,
  },
  checkLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 6,
    marginBottom: 30,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.paperStrong,
  },
  checkboxLarge: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d8c9c1',
  },
  checkText: {
    flex: 1,
    color: '#534b46',
    fontSize: 15,
    lineHeight: 30,
  },
  checkTextLarge: {
    fontSize: 16,
  },
  primaryButton: {
    minHeight: 70,
    borderRadius: 10,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    ...cardShadow,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
    marginLeft: 15,
  },
  primaryIcon: {
    marginTop: 3,
    marginRight: 10,
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginVertical: 5,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  dividerText: {
    color: '#a99d95',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
});
