import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormOutlineField, FormSelectField, formStyles } from '../components/forms/FormFields';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { createReview, fetchReview, updateReview } from '../components/community/ReviewService';
import { pickCoverImageFromLibrary, takeCoverPhoto, uploadImageUri } from '../services/MediaUploadService';

export const bookGenres = [
  'Ficção Literária',
  'Romance',
  'Fantasia',
  'Ficção Científica',
  'Mistério',
  'Suspense',
  'Terror',
  'Biografia',
  'História',
  'Poesia',
  'Autoajuda',
  'Não Ficção',
  'Infantojuvenil',
  'Clássicos',
  'HQ / Mangá',
  'Internacional',
];

const DEFAULT_REVIEW_FORM = {
  bookname: '',
  author: '',
  publisher: '',
  rating: 0,
  reviewText: '',
  genre: 'Ficção Literária',
};

function createReviewPayload(form, imageSource) {
  return {
    bookname: form.bookname.trim(),
    author: form.author.trim(),
    publisher: form.publisher.trim(),
    genre: form.genre,
    text: form.reviewText.trim(),
    rating: form.rating,
    imageSource,
  };
}

function validateReviewForm(form) {
  if (!form.bookname.trim() || !form.reviewText.trim() || form.rating === 0) {
    return 'Voce precisa preencher todos os campos para postar sua review!';
  }

  return '';
}

export function BookReviewScreen({ navigate, openMenu, routeParams }) {
  const reviewId = routeParams?.reviewId;
  const isEditing = Boolean(reviewId);

  const [form, setForm] = useState(DEFAULT_REVIEW_FORM);
  const [coverImage, setCoverImage] = useState(null);
  const [existingImageSource, setExistingImageSource] = useState('');
  const [coverImageChanged, setCoverImageChanged] = useState(false);
  const [loadingReview, setLoadingReview] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const auth = getAuth(firebase);
  const updateForm = (field) => (value) => setForm((current) => ({ ...current, [field]: value }));

  useEffect(() => {
    if (!reviewId) {
      return;
    }

    let active = true;

    async function loadReview() {
      setLoadingReview(true);

      try {
        const review = await fetchReview(reviewId);

        if (!review) {
          alert('Avaliacao nao encontrada.');
          navigate('community');
          return;
        }

        if (!active) {
          return;
        }

        setForm({
          bookname: review.bookname || '',
          author: review.author || '',
          publisher: review.publisher || '',
          rating: review.rating || 0,
          reviewText: review.text || '',
          genre: review.genre || 'Ficção Literária',
        });
        setExistingImageSource(review.imageSource || '');
        setCoverImage(review.imageSource || null);
        setCoverImageChanged(false);
      } catch (error) {
        alert(error.message || 'Nao foi possivel carregar a avaliacao.');
        navigate('community');
      } finally {
        if (active) {
          setLoadingReview(false);
        }
      }
    }

    loadReview();

    return () => {
      active = false;
    };
  }, [reviewId]);

  async function handleSubmit() {
    const user = auth.currentUser;

    if (!user) {
      alert('Voce precisa estar logado para publicar!');
      return;
    }

    const validationMessage = validateReviewForm(form);

    if (validationMessage) {
      alert(validationMessage);
      return;
    }

    setSubmitting(true);

    try {
      let imageSource = existingImageSource;

      if (coverImageChanged && coverImage) {
        imageSource = await uploadImageUri(coverImage, `review-covers/${user.uid}/${Date.now()}.jpg`);
      }

      const payload = createReviewPayload(form, imageSource);

      if (isEditing) {
        await updateReview(reviewId, user.uid, payload);
      } else {
        await createReview(user, payload);
      }

      navigate('community');
    } catch (error) {
      alert(error.message || 'Nao foi possivel salvar a avaliacao.');
    } finally {
      setSubmitting(false);
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

  if (loadingReview) {
    return (
      <MainScreenScaffold active="review" navigate={navigate} openMenu={openMenu} headerSearch={false}>
        <Text style={styles.reviewTitle}>Carregando avaliacao...</Text>
      </MainScreenScaffold>
    );
  }

  return (
    <MainScreenScaffold active="review" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.reviewEyebrow}>CURADORIA LITERARIA</Text>
      <Text style={styles.reviewTitle}>{isEditing ? 'Editar avaliacao' : 'Avaliar Nova Leitura'}</Text>
      <Text style={styles.reviewSubtitle}>
        {isEditing
          ? 'Atualize sua opiniao sobre esta obra.'
          : 'Leu um livro e gostou? Compartilhe com a comunidade!'}
      </Text>

      <View style={styles.reviewUpload}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.coverPreview} />
        ) : (
          <View style={styles.reviewBookCover}>
            <View style={styles.reviewBookShape} />
          </View>
        )}

        <Text style={formStyles.uploadLabelStrong}> CAPA DO LIVRO </Text>
        <Text style={formStyles.uploadHint}>Formatos suportados: JPG, PNG, JPEG</Text>

        <View style={styles.photoButtons}>
          <TouchableOpacity style={styles.photoButton} onPress={tirarFoto}>
            <Text style={styles.photoButtonText}>Tirar foto</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.photoButton} onPress={escolherImagem}>
            <Text style={styles.photoButtonText}>Escolher da galeria</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={formStyles.softPanel}>
        <Text style={formStyles.panelHeading}>METADADOS</Text>
        <FormField
          label="EDITORA"
          placeholder="Ex: Companhia das Letras"
          value={form.publisher}
          onChangeText={updateForm('publisher')}
        />
        <FormSelectField label="GENERO" value={form.genre} options={bookGenres} onChange={updateForm('genre')} />
      </View>

      <View style={formStyles.reviewFormPanel}>
        <FormOutlineField
          label="NOME DO LIVRO"
          placeholder="Titulo completo da obra"
          value={form.bookname}
          onChangeText={updateForm('bookname')}
        />

        <FormOutlineField
          label="AUTOR(A)"
          placeholder="Nome do autor"
          value={form.author}
          onChangeText={updateForm('author')}
        />

        <Text style={styles.ratingLabel}>SUA AVALIACAO</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => updateForm('rating')(star)}>
              <FontAwesome
                name={star <= form.rating ? 'star' : 'star-o'}
                size={37}
                color={colors.brownDark}
              />
            </TouchableOpacity>
          ))}
        </View>

        <FormOutlineField
          label="SUA OPINIAO"
          placeholder="O que achou da narrativa? Como foi a experiencia de leitura?"
          multiline
          height={278}
          value={form.reviewText}
          onChangeText={updateForm('reviewText')}
        />

        <TouchableOpacity
          style={[formStyles.formSubmitButton, formStyles.centerSubmit]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={formStyles.formSubmitText}>
            {submitting ? 'SALVANDO...' : isEditing ? 'SALVAR ALTERACOES' : 'PUBLICAR AVALIACAO'}
          </Text>
        </TouchableOpacity>
      </View>
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  reviewEyebrow: {
    color: colors.softText,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 44,
    marginBottom: 14,
  },
  reviewTitle: {
    color: colors.ink,
    fontSize: 36,
    lineHeight: 43,
  },
  reviewSubtitle: {
    color: '#6f6661',
    fontSize: 20,
    lineHeight: 31,
    marginTop: 22,
    marginBottom: 54,
  },
  reviewUpload: {
    borderRadius: 8,
    backgroundColor: colors.paper,
    minHeight: 366,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  reviewBookCover: {
    width: 174,
    height: 242,
    borderRadius: 5,
    backgroundColor: '#102832',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBookShape: {
    width: 118,
    height: 144,
    backgroundColor: '#17899a',
    transform: [{ skewX: '-10deg' }],
  },
  ratingLabel: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 26,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 42,
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
  photoButtonText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
});
