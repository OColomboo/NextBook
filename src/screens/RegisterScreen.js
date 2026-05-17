import React, {useState} from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import firebase from '../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { serverTimestamp, getDatabase, ref, set } from 'firebase/database';
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
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [senha, setSenha] = useState('');
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  
  async function cadastrar(){
    if (!nome){
      alert('Insira seu nome completo!');
      return
    }
    if (!senha){
      alert('Digite uma senha!');
      return;
    }
    if (!email){
      alert('Digite um e-email!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: nome,
      });

      await set(ref(db, 'usuarios/' + user.uid), {
        nome,
        email,
        telefone,
        cidade,
        criadoEm: serverTimestamp(),
      });

      alert('Conta criada: ' + user.email);
      navigate('login');

    }catch(error) {
        if (error.code === 'auth/invalid-email'){
          alert('Insira um email válido!');
          return;
        }
        if (error.code === 'auth/weak-password'){
          alert('Senha fraca! A senha deve ter 6 caracteres entre letras e números.');
          return;
        }
        console.log(error.code, error.message);
        alert(error.code || String(error));
      }
  }

  return(
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

        <AuthInputField 
          compact 
          label="NOME COMPLETO" 
          placeholder="Como quer ser chamado?"
          value={nome}
          onChangeText={setNome}
        />
        
        <AuthInputField 
          compact 
          label="E-MAIL" 
          placeholder="seu@email.com.br" 
          value={email}
          onChangeText={setEmail}
        />

        <AuthInputField
        compact
        label="TELEFONE" 
        placeholder="(11) 99999-9999" 
        value={telefone}
        onChangeText={setTelefone}        
        />

        <AuthInputField 
        compact 
        label="CIDADE" 
        placeholder="Ex: São Paulo" 
        value={cidade}
        onChangeText={setCidade}  
        />

        <AuthInputField 
        compact 
        label="SENHA" 
        placeholder="••••••••" secureTextEntry 
        value={senha}
        onChangeText={setSenha}
        />

        <AuthCheckboxRow>
          <Text style={styles.checkText}>
            Eu aceito os <Text style={styles.underlined}>termos de uso</Text> e política de privacidade.
          </Text>
        </AuthCheckboxRow>

        <AuthPrimaryButton label="CADASTRAR" onPress={cadastrar} />

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
