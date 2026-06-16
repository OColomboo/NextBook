import React, { useEffect, useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Feather} from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import firebase from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
  const titleSize = Math.round((isCompact ? 28 : 34) * Math.min(fontScale, 1.08));
  
  //firebase
  const auth = getAuth(firebase);
  const [email, setEmail] = useState ('');
  const [senha, setSenha] = useState ('');
  
  async function login(){
      await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        navigate('discover');
      }
  
      ).catch((error) =>{
        if (!email){
          alert('Digite seu e-mail!')
          return;
        }
        if (!senha){
          alert('Digite sua senha!')
          return;
        }
        if (error.code === 'auth/invalid-email'){
          alert('Digite um e-mail válido!');
          return;
        }
        if (error.code === 'auth/invalid-credential'){
          alert('Senha ou email incorretos!');
          return;
        }
        alert('Não foi possivel entrar, tente novamente');
        })
  }
  
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
          <Image
            source={require("../../assets/logo.png")}
            style={{ width: 300, height: 200}}
          />
        </View>

        <Text style={[styles.loginTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>Bem-vindo de volta</Text>

        <AuthInputField
          label="ENDEREÇO DE E-MAIL"
          placeholder="arquivista@nextbook.com"
          icon={<Feather name="mail" size={27} color="#e7dad4" />}
          value={email}
          onChangeText={setEmail}
        />

        <AuthInputField
          label="SENHA"
          rightLabel="ESQUECEU?"
          placeholder="••••••••••••"
          icon={<Feather name="lock" size={27} color="#e7dad4" />}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/*
        // implementar depois
        <AuthCheckboxRow label="Permanecer conectado por 30 dias" large />
        */}

        <AuthPrimaryButton
          label= "Entrar"
          icon={<Feather name="arrow-right" size={18} color={colors.white}/>}
          onPress={login}
        />

        <TouchableOpacity style={styles.authLink} onPress={() => navigate('register')}>
          <Text style={styles.authLinkText}>
            Não tem uma conta? <Text style={styles.authLinkStrong}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <AuthDividerLabel label="OU CONTINUE COM" />

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.googleMark} />
            <Image
              source={require("../../assets/google_logo.png")}
              style={styles.socialLogo}
            />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require("../../assets/facebook_logo.png")}
              style={styles.socialLogo}
            />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authFooter}>
          <Text style={styles.authFooterBrand}>NextBook</Text>
          <Text style={styles.authFooterCopy}>© 2026 UTFPR</Text>
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
    marginBottom: 10,
  },
  loginTitle: {
    color: colors.ink,
    textAlign: 'center',
    marginTop: 14,
    marginBottom: 50,
    fontFamily: 'Helvetica',
  },
  authLink: {
    alignItems: 'center',
    paddingVertical: 30,
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
  socialLogo: {
    width: 40,
    height: 40
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
