import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormSelectField, formStyles } from '../components/forms/FormFields';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { bookGenres } from './BookReviewScreen';
import {
  createListing,
  fetchListing,
  updateListing,
} from '../components/books/ListingService';
import { fetchBookByIsbn } from '../services/BookApiService';
import { pickCoverImageFromLibrary, takeCoverPhoto, uploadImageUri } from '../services/MediaUploadService';

const DEFAULT_LISTING_FORM = {
  condition: 'novo',
  dealType: 'venda',
  price: '',
  title: '',
  author: '',
  publisher: '',
  pages: '',
  genre: '',
  synopsis: '',
  description: '',
  isbn: '',
};

function createListingPayload(form, imageSource) {
  return {
    condition: form.condition,
    dealType: form.dealType,
    price: form.price,
    title: form.title.trim(),
    author: form.author.trim(),
    publisher: form.publisher.trim(),
    genre: form.genre,
    pages: form.pages,
    synopsis: form.synopsis,
    description: form.description.trim(),
    imageSource,
    isbn: form.isbn.trim(),
  };
}

function validateListingForm(form) {
  if (!form.title.trim()) return 'Voce precisa informar o nome do livro!';
  if (!form.author.trim()) return 'Voce precisa informar o nome do autor!';
  if (!form.description.trim()) return 'Voce precisa informar a descricao do livro!';
  if (form.dealType === 'venda' && !form.price.trim()) return 'Voce precisa informar o preco do livro!';

  return '';
}

export function AddBookListingScreen({ navigate, openMenu, routeParams }) {
  const listingId = routeParams?.listingId;
  const isEditing = Boolean(listingId);

  const [form, setForm] = useState(DEFAULT_LISTING_FORM);
  const [coverImage, setCoverImage] = useState('');
  const [existingImageSource, setExistingImageSource] = useState('');
  const [coverImageChanged, setCoverImageChanged] = useState(false);
  const [loadingListing, setLoadingListing] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingIsbn, setFetchingIsbn] = useState(false);

  const auth = getAuth(firebase);
  const updateForm = (field) => (value) => setForm((current) => ({ ...current, [field]: value }));

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

        setForm({
          condition: String(listing.condition || 'novo').toLowerCase(),
          dealType: String(listing.dealType || 'venda').toLowerCase(),
          price: listing.price || '',
          title: listing.title || '',
          author: listing.author || '',
          publisher: listing.publisher || '',
          pages: listing.pages ? String(listing.pages) : '',
          genre: listing.genre || '',
          synopsis: listing.synopsis || '',
          description: listing.description || '',
          isbn: listing.isbn || '',
        });
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

    const validationMessage = validateListingForm(form);

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      let imageSource = existingImageSource;

      if (coverImageChanged && coverImage) {
        imageSource = await uploadImageUri(coverImage, `listing-covers/${user.uid}/${Date.now()}.jpg`);
      } else if (!coverImageChanged && coverImage) {
        imageSource = coverImage;
      }

      const payload = createListingPayload(form, imageSource);

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
      const bookData = await fetchBookByIsbn(form.isbn);

      setForm((current) => ({
        ...current,
        title: bookData.title || current.title,
        author: bookData.author || current.author,
        publisher: bookData.publisher || current.publisher,
        pages: bookData.pages || current.pages,
        synopsis: bookData.synopsis || current.synopsis,
        genre: bookData.genre || current.genre,
        isbn: bookData.isbn || current.isbn,
      }));

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
    try {
      const imageUri = await pickCoverImageFromLibrary();

      if (!imageUri) {
        return;
      }

      setCoverImage(imageUri);
      setCoverImageChanged(true);
    } catch (error) {
      alert(error.message || 'Nao foi possivel escolher a imagem.');
    }
  }

  async function tirarFoto() {
    try {
      const imageUri = await takeCoverPhoto();

      if (!imageUri) {
        return;
      }

      setCoverImage(imageUri);
      setCoverImageChanged(true);
    } catch (error) {
      alert(error.message || 'Nao foi possivel tirar a foto.');
    }
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
          value={form.isbn}
          onChangeText={updateForm('isbn')}
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
            style={[formStyles.segment, form.dealType === 'venda' && formStyles.segmentActive]}
            onPress={() => updateForm('dealType')('venda')}
          >
            <Text style={form.dealType === 'venda' ? formStyles.segmentActiveText : formStyles.segmentText}>
              VENDA
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.segment, form.dealType === 'troca' && formStyles.segmentActive]}
            onPress={() => updateForm('dealType')('troca')}
          >
            <Text style={form.dealType === 'troca' ? formStyles.segmentActiveText : formStyles.segmentText}>
              TROCA
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={formStyles.formLabel}>ESTADO DO LIVRO</Text>
        <View style={formStyles.segmented}>
          <TouchableOpacity
            style={[formStyles.segment, form.condition === 'novo' && formStyles.segmentActive]}
            onPress={() => updateForm('condition')('novo')}
          >
            <Text style={form.condition === 'novo' ? formStyles.segmentActiveText : formStyles.segmentText}>
              NOVO
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[formStyles.segment, form.condition === 'usado' && formStyles.segmentActive]}
            onPress={() => updateForm('condition')('usado')}
          >
            <Text style={form.condition === 'usado' ? formStyles.segmentActiveText : formStyles.segmentText}>
              USADO
            </Text>
          </TouchableOpacity>
        </View>

        {form.dealType === 'venda' && (
          <FormField
            label="Valor (R$)"
            placeholder="0,00"
            value={form.price}
            onChangeText={updateForm('price')}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={formStyles.deepFormPanel}>
        <FormField
          label="NOME DO LIVRO"
          placeholder="Ex: O Alquimista"
          value={form.title}
          onChangeText={updateForm('title')}
        />

        <FormField label="AUTOR" placeholder="Paulo Coelho" value={form.author} onChangeText={updateForm('author')} />

        <FormField
          label="EDITORA"
          placeholder="Companhia das Letras"
          value={form.publisher}
          onChangeText={updateForm('publisher')}
        />

        <FormSelectField label="GENERO" value={form.genre} options={bookGenres} onChange={updateForm('genre')} />

        <FormField
          label="N DE PAGINAS"
          placeholder="208"
          value={form.pages}
          onChangeText={updateForm('pages')}
          keyboardType="numeric"
        />

        <FormField
          label="BREVE RESUMO / SINOPSE"
          placeholder="Uma breve introducao a obra..."
          multiline
          height={95}
          value={form.synopsis}
          onChangeText={updateForm('synopsis')}
        />

        <FormField
          label="DESCRICAO DA UNIDADE"
          placeholder="Descreva o estado fisico, dedicatorias ou detalhes especificos do seu exemplar..."
          value={form.description}
          onChangeText={updateForm('description')}
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
