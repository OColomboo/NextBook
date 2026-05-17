import React, {useState} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormOutlineField, FormSelectField, formStyles } from '../components/forms/FormFields';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref as dbRef, push, set, get, serverTimestamp} from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL} from  'firebase/storage';
import * as ImagePicker from 'expo-image-picker';


export function BookReviewScreen({ navigate, openMenu }) {
  const [bookname, setBookname] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('')
  const [coverImage, setCoverImage] = useState(null);
  
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const storage = getStorage(firebase);

  async function publicarAvaliacao(){
    const user = auth.currentUser;
    
    if(!user){
      alert('Você precisa estar logado para publicar!');
      return;
    }
    
    const imageSource = await uploadCoverImage(user.uid);

    if(!bookname.trim() || !reviewText.trim() || rating === 0){
      alert('Você precisa preencher todos os campos para postar sua review!');
      return;
    }
    const userSnapshot = await get(dbRef(db,'usuarios/' + user.uid))
    const userData = userSnapshot.val();

    const novaReviewRef = push(dbRef(db, 'reviews'));

    await set(novaReviewRef, {
      userId: user.uid,
      userName: userData?.nome || user.displayName || 'usuario',
      bookname,
      author,
      text: reviewText,
      rating,
      likes: 0,
      imageSource,
      comments: 0,
      criadoEm: serverTimestamp(),
    })
    navigate ('community');
  }
  
  async function escolherImagem(){
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(!permission.granted){
      alert('Permita acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if(!result.canceled){
      setCoverImage(result.assets[0].uri);
    }
  }

  async function tirarFoto(){
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if(!permission.granted){
      alert('Permita acesso à câmera para tirar uma foto');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    
    if (!result.canceled){
      setCoverImage(result.assets[0].uri);
    }
  }

  async function uploadCoverImage(userId) {
    if (!coverImage){
      return '';
    }
    const response = await fetch(coverImage);
    const blob = await response.blob();

    const fileRef = storageRef(storage, `review-covers/${userId}/${Date.now()}.jpg`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  }

  return (
    <MainScreenScaffold active="review" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.reviewEyebrow}>CURADORIA LITERÁRIA</Text>
      <Text style={styles.reviewTitle}>Avaliar Nova Leitura</Text>
      <Text style={styles.reviewSubtitle}>
        Leu um livro e gostou? Compartilhe com a comunidade!
      </Text>

      <View style={styles.reviewUpload}>
        {coverImage ? (
          <Image source={{ uri: coverImage}} style={styles.coverPreview}/>
          ) : (
          <View style={styles.reviewBookCover}>
            <View style={styles.reviewBookShape}/>
          </View>
          )
        }

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
        <FormField label="EDITORA" placeholder="Ex: Companhia das Letras" />
        <FormSelectField label="GÊNERO" value="Ficção Literária" />
      </View>

      <View style={formStyles.reviewFormPanel}>
        <FormOutlineField 
        label="NOME DO LIVRO" 
        placeholder="Título completo da obra" 
        value={bookname}
        onChangeText={setBookname}
        />

        <FormOutlineField
        label="AUTOR(A)" 
        placeholder="Nome do autor" 
        value={author}
        onChangeText={setAuthor}
        />

        {/* avaliação com estrelas */}
        <Text style={styles.ratingLabel}>SUA AVALIAÇÃO</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <FontAwesome
                name = {star <= rating ? 'star' : 'star-o'}
                size={37}
                color={colors.brownDark}
              />
            </TouchableOpacity>
          ))}
        </View>

        <FormOutlineField
          label="SUA OPINIÃO"
          placeholder="O que achou da narrativa? Como foi a experiência de leitura?"
          multiline
          height={278}
          value={reviewText}
          onChangeText={setReviewText}
        />
        
        <TouchableOpacity 
          style={[formStyles.formSubmitButton, formStyles.centerSubmit]}
          onPress={publicarAvaliacao}
          >
          <Text style={formStyles.formSubmitText}>PUBLICAR AVALIAÇÃO</Text>
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
  photoButtons:{
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  photoButton:{
    backgroundColor: colors.brown,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  photoButtonText:{
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
  },
});
