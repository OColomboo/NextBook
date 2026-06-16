import React, { use, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormSelectField, formStyles } from '../components/forms/FormFields';
import firebase from '../firebaseConfig';
import { getAuth, reauthenticateWithRedirect } from 'firebase/auth';
import { getDatabase, ref, set, get, push, serverTimestamp } from 'firebase/database';
import { bookGenres } from './BookReviewScreen';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export function AddBookListingScreen({ navigate, openMenu }) {
  const [condition, setCondition] = useState('Novo');
  const [dealType, setDealType] = useState('Venda');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [pages, setPages] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const storage = getStorage(firebase);

  async function criarAnuncio() {
    const user = auth.currentUser;

    if (!user) {
      alert('Você precisa estar logado para anunciar um livro!');
      return;
    }

    if (!title.trim()) {
      alert("Você precisa informar o nome do livro!");
      return;
    }

    if (!author.trim()) {
      alert("Você precisa informar o nome do autor!");
      return;
    }

    if (!description.trim()) {
      alert("Você precisa informar a descrição do livro!");
      return;
    }

    if (dealType === 'venda' && !price.trim()) {
      alert('Você precisa informar o preço do livro!');
      return;
    }

    const userSnapshot = await get(ref(db, 'usuarios/' + user.uid));
    const userData = userSnapshot.val();
    const novoAnuncioRef = push(ref(db, 'bookListings'));
    const imageSource = await uploadCoverImage(user.uid);

    await set(novoAnuncioRef, {
      userId: user.uid,
      userName: userData?.nome || user.displayName || 'usuário',
      condition,
      dealType,
      price,
      title,
      author,
      publisher,
      genre,
      pages,
      synopsis,
      description,
      imageSource,
      criadoEm: serverTimestamp(),
    });

    alert('Anúncio criado com sucesso!');
    navigate('discover');
  }

  async function escolherImagem() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permita acesso à galeria para escolher uma imagem!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  }
  async function tirarFoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Permita o acesso à camera para tirar uma foto!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  }
  async function uploadCoverImage(userId) {
    if (!coverImage) {
      return '';
    }

    const response = await fetch(coverImage);
    const blob = await response.blob();

    const fileRef = storageRef(storage, `listing-covers/${userId}/${Date.now()}.jpg`);
    await uploadBytes(fileRef, blob);

    return await getDownloadURL(fileRef);
  }

  return (
    <MainScreenScaffold active="add" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.addTitle}>Anunciar livro</Text>
      <Text style={styles.addSubtitle}>
        Preencha os campos abaixo para criar um anúncio do seu livro.
      </Text>

      <View style={formStyles.uploadCoverLarge}>
        {coverImage ? (
          <Image
            source={{ uri: coverImage }}
            style={styles.coverPreview}
          />
        ) : (
          <>
            <Feather name="camera" size={34} color={colors.muted} />
            <Text style={formStyles.uploadLabel}>CAPA DO LIVRO</Text>
          </>
        )}

        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButtons} onPress={tirarFoto}>
            <Text style={styles.photoButtonsText}>Tirar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButtons} onPress={escolherImagem}>
            <Text style={styles.photoButtonsText}>Escolher da galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={formStyles.softPanel}>
        <Text style={formStyles.formLabel}>FORMA DE NEGOCIAÇÃO</Text>
        <View style={formStyles.segmented}>
          <TouchableOpacity
            style={[formStyles.segment, dealType === 'venda' && formStyles.segmentActive]}
            onPress={() => setDealType('venda')}
          >
            <Text style={dealType === 'venda' ? formStyles.segmentActiveText : formStyles.segmentText}>
              VENDA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.segment, dealType === 'troca' && formStyles.segmentActive]}
            onPress={() => setDealType('troca')}
          >
            <Text style={dealType === 'troca' ? formStyles.segmentActiveText : formStyles.segmentText}>
              TROCA
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={formStyles.formLabel}>ESTADO DO LIVRO</Text>
        <View style={formStyles.segmented}>
          <TouchableOpacity
            style={[formStyles.segment, condition === 'novo' && formStyles.segmentActive]}
            onPress={() => setCondition('novo')}
          >
            <Text style={condition === 'novo' ? formStyles.segmentActiveText : formStyles.segmentText}>
              NOVO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.segment, condition === 'usado' && formStyles.segmentActive]}
            onPress={() => setCondition('usado')}
          >
            <Text style={condition === 'usado' ? formStyles.segmentActiveText : formStyles.segmentText}>
              USADO
            </Text>
          </TouchableOpacity>
        </View>
        {dealType === 'venda' && (
          <FormField
            label="Valor (R$)"
            placeholder="0,00"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={formStyles.deepFormPanel}>
        <FormField
          label="NOME DO LIVRO"
          placeholder="Ex: O Alquimista"
          value={title}
          onChangeText={setTitle}
        />

        <FormField
          label="AUTOR"
          placeholder="Paulo Coelho"
          value={author}
          onChangeText={setAuthor}
        />

        <FormField
          label="EDITORA"
          placeholder="Companhia das Letras"
          value={publisher}
          onChangeText={setPublisher}
        />

        <FormSelectField
          label="GÊNERO"
          value={genre}
          options={bookGenres}
          onChange={setGenre}
        />

        <FormField
          label="Nº DE PÁGINAS"
          placeholder="208"
          value={pages}
          onChangeText={setPages}
          keyboardType="numeric"

        />

        <FormField
          label="BREVE RESUMO / SINOPSE"
          placeholder="Uma breve introdução à obra..."
          multiline height={95}
          value={synopsis}
          onChangeText={setSynopsis}
        />

        <FormField
          label="DESCRIÇÃO DA UNIDADE"
          placeholder="Descreva o estado físico, dedicatórias ou detalhes específicos do seu exemplar..."
          value={description}
          onChangeText={setDescription}
          multiline
          height={132}
        />
        <View style={formStyles.alignRight}>
          <TouchableOpacity
            style={formStyles.formSubmitButton} onPress={criarAnuncio}>
            <Text style={formStyles.formSubmitText}>ANUNCIAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  addTitle: {
    color: colors.brown,
    fontSize: 30,
    lineHeight: 34,
    marginTop: 20,
  },
  addSubtitle: {
    color: '#756b65',
    fontSize: 16,
    lineHeight: 25,
    marginTop: 15,
    marginBottom: 15,
  },
  coverPreview: {
    width: 174,
    height: 242,
    borderRadius: 5,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  PhotoButton: {
    backgroundColor: colors.brown,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  photoButtonsText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
});
