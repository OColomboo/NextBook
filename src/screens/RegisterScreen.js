import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import {
  AuthCheckboxRow,
  AuthDividerLabel,
  AuthInputField,
  AuthPrimaryButton,
} from '../components/auth/AuthFormControls';

export function RegisterScreen({ navigate }) {
  const { gutterContent, isCompact, fontScale } = useResponsiveLayout();
  const schoolSize = isCompact ? 72 : 95;
  const titleSize = Math.round((isCompact ? 30 : 38) * Math.min(fontScale, 1.06));
  const subSize = Math.round((isCompact ? 17 : 21) * Math.min(fontScale, 1.05));

  return (
    <SafeAreaView style={styles.authScreenLight}>
      <ScrollView
        contentContainerStyle={[
          styles.registerContent,
          {
            paddingHorizontal: gutterContent,
            paddingTop: isCompact ? 36 : 52,
            paddingBottom: isCompact ? 40 : 52,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <MaterialCommunityIcons name="school" size={schoolSize} color={colors.brownDark} style={styles.registerIcon} />
        <Text style={[styles.registerTitle, { fontSize: titleSize, lineHeight: titleSize + 6 }]}>Criar sua conta</Text>
        <Text style={[styles.registerSubtitle, { fontSize: subSize, lineHeight: subSize + 11 }]}>
          Junte-se à nossa comunidade de curadores literários.
        </Text>

        <AuthInputField compact label="NOME COMPLETO" placeholder="Como quer ser chamado?" />
        <AuthInputField compact label="E-MAIL" placeholder="seu@email.com.br" />
        <AuthInputField compact label="TELEFONE" placeholder="(11) 99999-9999" />
        <AuthInputField compact label="CIDADE" placeholder="Ex: São Paulo" />
        <AuthInputField compact label="SENHA" placeholder="••••••••" secureTextEntry />
        <AuthInputField compact label="CONFIRMAR SENHA" placeholder="••••••••" secureTextEntry />

        <AuthCheckboxRow>
          <Text style={styles.checkText}>
            Eu aceito os <Text style={styles.underlined}>termos de uso</Text> e política de privacidade.
          </Text>
        </AuthCheckboxRow>

        <AuthPrimaryButton label="CADASTRAR" onPress={() => navigate('discover')} />

        <TouchableOpacity style={styles.authLink} onPress={() => navigate('login')}>
          <Text style={styles.authLinkText}>
            Já possui uma estante? <Text style={styles.authLinkStrong}>ENTRAR</Text>
          </Text>
        </TouchableOpacity>

        <AuthDividerLabel label="LEITURA É CONEXÃO" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  authScreenLight: {
    flex: 1,
    backgroundColor: colors.background,
  },
  registerContent: {
    minHeight: '100%',
  },
  registerIcon: {
    alignSelf: 'center',
    marginBottom: 26,
  },
  registerTitle: {
    color: colors.ink,
    fontWeight: '900',
    textAlign: 'center',
  },
  registerSubtitle: {
    color: colors.muted,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 52,
  },
  checkText: {
    flex: 1,
    color: '#534b46',
    fontSize: 20,
    lineHeight: 30,
  },
  underlined: {
    color: colors.brownDark,
    textDecorationLine: 'underline',
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
});
