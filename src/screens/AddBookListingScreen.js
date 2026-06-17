import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormSelectField, formStyles } from '../components/forms/FormFields';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { bookGenres } from './BookReviewScreen';
import {
  createListing,
  fetchListing,
  updateListing,
} from '../components/books/ListingService';
import { fetchBookByIsbn } from '../services/BookApiService';

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(String(value || ''));
}

export function AddBookListingScreen({ navigate, openMenu, routeParams }) {
  const listingId = routeParams?.listingId;
  const isEditing = Boolean(listingId);

  const [condition, setCondition] = useState('novo');
  const [dealType, setDealType] = useState('venda');
  const [price, setPrice] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [pages, setPages] = useState('');
  const [genre, setGenre] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [description, setDescription] = useState('');
  const [isbn, setIsbn] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [existingImageSource, setExistingImageSource] = useState('');
  const [coverImageChanged, setCoverImageChanged] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingIsbn, setFetchingIsbn] = useState(false);

  const auth = getAuth(firebase);
  const storage = getStorage(firebase);

  useEffect(() => {
    if (!listingId) {
      return undefined;
    }

    let active = true;

    async function loadListing() {
      setLoadingListing(true);

      try {
        const listing = await fetchListing(listingId);

        if (!listing) {
          alert('Anuncio nao encontrado.');
          navigate('discover');
          return;
        }

        if (!active) {
          return;
        }

        setCondition(String(listing.condition || 'novo').toLowerCase());
        setDealType(String(listing.dealType || 'venda').toLowerCase());
        setPrice(listing.price || '');
        setTitle(listing.title || '');
        setAuthor(listing.author || '');
        setPublisher(listing.publisher || '');
        setPages(listing.pages ? String(listing.pages) : '');
        setGenre(listing.genre || '');
        setSynopsis(listing.synopsis || '');
        setDescription(listing.description || '');
        setIsbn(listing.isbn || '');
        setExistingImageSource(listing.imageSource || '');
        setCoverImage(listing.imageSource || '');
        setCoverImageChanged(false);
      } catch (error) {
        alert(error.message || 'Nao foi possivel carregar o anuncio.');
        navigate('discover');
      } finally {
        if (active) {
          setLoadingListing(false);
        }
      }
    }

    loadListing();

    return () => {
      active = false;
    };
  }, [listingId]);

  async function handleSubmit() {
    const user = auth.currentUser;

    if (!user) {
      alert('Voce precisa estar logado para anunciar um livro!');
      return;
    }

    if (!title.trim()) {
      alert('Voce precisa informar o nome do livro!');
      return;
    }

    if (!author.trim()) {
      alert('Voce precisa informar o nome do autor!');
      return;
    }

    if (!description.trim()) {
      alert('Voce precisa informar a descricao do livro!');
      return;
    }

    if (dealType === 'venda' && !price.trim()) {
      alert('Voce precisa informar o preco do livro!');
      return;
    }

    setSubmitting(true);

    try {
      let imageSource = existingImageSource;

      if (coverImageChanged && coverImage) {
        imageSource = await uploadCoverImage(user.uid);
      } else if (!coverImageChanged && coverImage) {
        imageSource = coverImage;
      }

      const payload = {
        condition,
        dealType,
        price,
        title: title.trim(),
        author: author.trim(),
        publisher: publisher.trim(),
        genre,
        pages,
        synopsis,
        description: description.trim(),
        imageSource,
        isbn: isbn.trim(),
      };

      if (isEditing) {
        await updateListing(listingId, user.uid, payload);
        alert('Anuncio atualizado com sucesso!');
      } else {
        await createListing(user, payload);
        alert('Anuncio criado com sucesso!');
      }

      navigate('discover');
    } catch (error) {
      alert(error.message || 'Nao foi possivel salvar o anuncio.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleFetchByIsbn() {
    setFetchingIsbn(true);

    try {
      const bookData = await fetchBookByIsbn(isbn);

      if (bookData.title) setTitle(bookData.title);
      if (bookData.author) setAuthor(bookData.author);
      if (bookData.publisher) setPublisher(bookData.publisher);
      if (bookData.pages) setPages(bookData.pages);
      if (bookData.synopsis) setSynopsis(bookData.synopsis);
      if (bookData.genre) setGenre(bookData.genre);
      if (bookData.isbn) setIsbn(bookData.isbn);

      if (bookData.imageSource) {
        setCoverImage(bookData.imageSource);
        setCoverImageChanged(false);
      }
    } catch (error) {
      alert(error.message || 'Nao foi possivel buscar o livro.');
    } finally {
      setFetchingIsbn(false);
    }
  }

  async function escolherImagem() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert('Permita acesso a galeria para escolher uma imagem!');
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
      setCoverImageChanged(true);
    }
  }

  async function tirarFoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert('Permita o acesso a camera para tirar uma foto!');
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
      setCoverImageChanged(true);
    }
  }

  async function uploadCoverImage(userId) {
    if (!coverImage) {
      return '';
    }

    if (isRemoteUrl(coverImage)) {
      return coverImage.replace(/^http:/, 'https:');
    }

    const response = await fetch(coverImage);
    const blob = await response.blob();
    const fileRef = storageRef(storage, `listing-covers/${userId}/${Date.now()}.jpg`);

    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  }

  if (loadingListing) {
    return (
      <MainScreenScaffold active="add" navigate={navigate} openMenu={openMenu} headerSearch={false}>
        <Text style={styles.addTitle}>Carregando anuncio...</Text>
      </MainScreenScaffold>
    );
  }

  return (
    <MainScreenScaffold active="add" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.addTitle}>{isEditing ? 'Editar anuncio' : 'Anunciar livro'}</Text>
      <Text style={styles.addSubtitle}>
        {isEditing
          ? 'Atualize as informacoes do seu anuncio.'
          : 'Preencha os campos abaixo para criar um anuncio do seu livro.'}
      </Text>

      <View style={formStyles.uploadCoverLarge}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverPreview} />
        ) : (
          <>
            <Feather name="camera" size={34} color={colors.muted} />
            <Text style={formStyles.uploadLabel}>CAPA DO LIVRO</Text>
          </>
        )}

        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={tirarFoto}>
            <Text style={styles.photoButtonsText}>Tirar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={escolherImagem}>
            <Text style={styles.photoButtonsText}>Escolher da galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={formStyles.softPanel}>
        <FormField
          label="ISBN"
          placeholder="9788535910159"
          value={isbn}
          onChangeText={setIsbn}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.isbnButton, fetchingIsbn && styles.isbnButtonDisabled]}
          onPress={handleFetchByIsbn}
          disabled={fetchingIsbn}
        >
          <Text style={styles.isbnButtonText}>
            {fetchingIsbn ? 'BUSCANDO...' : 'BUSCAR LIVRO POR ISBN'}
          </Text>
        </TouchableOpacity>

        <Text style={formStyles.formLabel}>FORMA DE NEGOCIACAO</Text>
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

        <FormField label="AUTOR" placeholder="Paulo Coelho" value={author} onChangeText={setAuthor} />

        <FormField
          label="EDITORA"
          placeholder="Companhia das Letras"
          value={publisher}
          onChangeText={setPublisher}
        />

        <FormSelectField label="GENERO" value={genre} options={bookGenres} onChange={setGenre} />

        <FormField
          label="N DE PAGINAS"
          placeholder="208"
          value={pages}
          onChangeText={setPages}
          keyboardType="numeric"
        />

        <FormField
          label="BREVE RESUMO / SINOPSE"
          placeholder="Uma breve introducao a obra..."
          multiline
          height={95}
          value={synopsis}
          onChangeText={setSynopsis}
        />

        <FormField
          label="DESCRICAO DA UNIDADE"
          placeholder="Descreva o estado fisico, dedicatorias ou detalhes especificos do seu exemplar..."
          value={description}
          onChangeText={setDescription}
          multiline
          height={132}
        />

        <View style={formStyles.alignRight}>
          <TouchableOpacity
            style={formStyles.formSubmitButton}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={formStyles.formSubmitText}>
              {submitting ? 'SALVANDO...' : isEditing ? 'SALVAR ALTERACOES' : 'ANUNCIAR'}
            </Text>
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
  photoButton: {
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
  isbnButton: {
    backgroundColor: colors.greenDark,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    alignItems: 'center',
  },
  isbnButtonDisabled: {
    opacity: 0.7,
  },
  isbnButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
