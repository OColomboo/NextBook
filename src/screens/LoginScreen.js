import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import {
  AuthCheckboxRow,
  AuthDividerLabel,
  AuthInputField,
  AuthPrimaryButton,
} from '../components/auth/AuthFormControls';

export function LoginScreen({ navigate }) {
  const { gutterContent, width, isCompact, fontScale } = useResponsiveLayout();
  const logoW = Math.min(260, width - gutterContent * 2);
  const logoH = Math.round(logoW * (172 / 260));
  const owlSize = isCompact ? 54 : 68;
  const titleSize = Math.round((isCompact ? 28 : 34) * Math.min(fontScale, 1.08));
  const subtitleSize = Math.round((isCompact ? 16 : 18) * Math.min(fontScale, 1.06));
  const logoFontSize = Math.min(58, Math.round(logoW * 0.22));

  return (
    <SafeAreaView style={styles.authScreen}>
      <ScrollView
        contentContainerStyle={[
          styles.loginContent,
          {
            paddingHorizontal: gutterContent,
            paddingTop: isCompact ? 28 : 42,
            paddingBottom: isCompact ? 32 : 44,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.nextLogo, { width: logoW, height: logoH }]}>
          <Text style={[styles.logoText, { fontSize: logoFontSize, lineHeight: logoFontSize }]}>NEXT{'\n'}BOOK</Text>
          <View style={styles.logoOwl}>
            <MaterialCommunityIcons name="owl" size={owlSize} color={colors.brownDark} />
          </View>
        </View>

        <Text style={[styles.loginTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>Bem-vindo de volta</Text>

        <AuthInputField
          label="ENDEREÇO DE E-MAIL"
          placeholder="arquivista@nextbook.com"
          icon={<Feather name="mail" size={27} color="#e7dad4" />}
        />

        <AuthInputField
          label="SENHA"
          rightLabel="ESQUECEU?"
          placeholder="••••••••••••"
          icon={<Feather name="lock" size={27} color="#e7dad4" />}
          secureTextEntry
        />

        <AuthCheckboxRow label="Permanecer conectado por 30 dias" large />

        <AuthPrimaryButton
          label= "Entrar na Biblioteca"
          icon={<Feather name="arrow-right" size={18} color={colors.white}/>}
          onPress={() => navigate('discover')} />

        <TouchableOpacity style={styles.authLink} onPress={() => navigate('register')}>
          <Text style={styles.authLinkText}>
            Não tem uma conta? <Text style={styles.authLinkStrong}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <AuthDividerLabel label="OU CONTINUE COM" />

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.googleMark} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="alpha-a-box-outline" size={40} color={colors.ink} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authFooter}>
          <Text style={styles.authFooterBrand}>NextBook</Text>
          <Text style={styles.authFooterCopy}>© 2024 COLETIVO ARCHIVIST</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginContent: {
    minHeight: '100%',
  },
  nextLogo: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: 'rgba(29, 70, 38, 0.95)',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(74, 55, 43, 0.28)',
    textShadowOffset: { width: 3, height: 5 },
    textShadowRadius: 6,
  },
  logoOwl: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  loginTitle: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 50,
    fontFamily: 'Helvetica',
  },
  loginSubtitle: {
    color: '#5f5751',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 44,
  },
  authLink: {
    alignItems: 'center',
    paddingVertical: 46,
  },
  authLinkText: {
    color: '#5c544f',
    fontSize: 20,
    textAlign: 'center',
  },
  authLinkStrong: {
    color: colors.brownDark,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 36,
  },
  socialButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    backgroundColor: colors.surfaceWarm,
  },
  googleMark: {
    width: 36,
    height: 36,
    backgroundColor: '#2d2d3a',
  },
  socialText: {
    color: colors.ink,
    fontSize: 22,
  },
  authFooter: {
    alignItems: 'center',
    marginTop: 78,
    gap: 18,
  },
  authFooterBrand: {
    color: colors.softText,
    fontSize: 26,
  },
  authFooterCopy: {
    color: colors.muted,
    fontSize: 15,
    letterSpacing: 3,
  },
});
