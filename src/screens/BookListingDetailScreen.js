import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { UserAvatar } from '../components/community/UserAvatar';
import { abrirChat } from '../components/chat/ChatService';
import firebase from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, remove, serverTimestamp, set } from 'firebase/database';

export function BookListingDetailScreen({ navigate, openMenu, routeParams}) {
  const { gutterContent, isCompact, width } = useResponsiveLayout();
  const framePad = Math.max(16, Math.min(36, Math.round(gutterContent * 1.15)));
  const scrollInnerW = width - 2 * gutterContent;
  const coverInnerW = Math.max(160, scrollInnerW - 2 * framePad);
  const coverH = Math.min(374, Math.max(220, Math.round(coverInnerW * 1.06)));
  const book = routeParams?.book;
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;
  const isOwner = user?.uid === book?.userId;
  const ownerActionText = book?.dealType === 'troca' ? 'Marcar como trocado' : 'Marcar como vendido';
  const isNegotiated = Boolean(book?.status);
  const negotiatedText = book?.status === 'trocado' ? 'Anuncio trocado' : 'Anuncio vendido';

  if (!book) {
    return (
      <MainScreenScaffold navigate={navigate} openMenu={openMenu} library headerProfile={false}>
        <Text style={styles.detailTitle}>Anúncio não encontrado!</Text>
      </MainScreenScaffold>
    )
  }  

  async function handleConversar() {
    try {
      const chatId = await abrirChat(book);
      navigate('chatConversation', { chatId });
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSalvarNaEstante() {
    try {
      if (!user) {
        alert('Voce precisa estar logado para salvar esse anuncio.');
        return;
      }

      if (!book.id) {
        alert('Nao foi possivel encontrar o codigo do anuncio.');
        return;
      }

      await set(ref(db, `savedListings/${user.uid}/${book.id}`), {
        ...book,
        savedAt: serverTimestamp(),
      });

      alert('Anuncio salvo na estante.');
    } catch (error) {
      alert(error.message || 'Nao foi possivel salvar o anuncio.');
    }
  }

  async function handleMarcarComoVendido() {
    try {
      if (!user) {
        alert('Voce precisa estar logado para alterar esse anuncio.');
        return;
      }

      if (!isOwner) {
        alert('Apenas o dono do anuncio pode marcar como negociado.');
        return;
      }

      if (!book.id) {
        alert('Nao foi possivel encontrar o codigo do anuncio.');
        return;
      }

      const status = book.dealType === 'troca' ? 'trocado' : 'vendido';

      await set(ref(db, `negotiatedListings/${user.uid}/${book.id}`), {
        ...book,
        status,
        negotiatedAt: serverTimestamp(),
      });

      await remove(ref(db, `bookListings/${book.id}`));
      alert('Anuncio movido para negociados.');
      navigate('discover');
    } catch (error) {
      alert(error.message || 'Nao foi possivel remover o anuncio.');
    }
  }

  return (
    <MainScreenScaffold navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <View style={[styles.detailCoverFrame, { padding: framePad, marginTop: isCompact ? 24 : 36 }]}>
        <View style={[styles.detailCover, { height: Math.max(220, coverH) }]}>
          {book.imageSource ? (
            <Image source={{uri: book.imageSource}} style={styles.detailCoverImage} />
          ) : (
            <Text style={styles.detailCoverTitle}>{book.title}</Text>
          )}
        </View>
      </View>

      <View style={styles.badgesRow}>
        <GenrePillTag label={book.condition?.toUpperCase() || 'ANÚNCIO'}/>
        <GenrePillTag
          label={book.status ? book.status.toUpperCase() : book.dealType === 'troca' ? 'TROCA' : `R$ ${book.price}`}
          muted
        />
      </View>

      <Text style={styles.detailTitle}>{book.title}</Text>
      <Text style={styles.detailAuthor}>por {book.author}</Text>

      <View style={styles.genreWrap}>
        <GenrePillTag label="Ficção Histórica" />
        <GenrePillTag label="Mistério" />
        <GenrePillTag label="Renascimento" />
      </View>

      <View style={styles.synopsisCard}>
        <Text style={styles.synopsisTitle}>Sinopse</Text>
        <Text style={styles.synopsisText}>
          {book.synopsis || 'Sem sinopse informada.'}
        </Text>
      </View>

       <View style={styles.synopsisCard}>
        <Text style={styles.synopsisTitle}>Detalhes</Text>
        <Text style={styles.synopsisText}>
          {book.description}
        </Text>
      </View>

      <View style={styles.sellerCard}>
        <UserAvatar initials={book.userName?.slice(0, 2).toUpperCase()} color="#0c1d24" size={56} online />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerEyebrow}>VENDEDOR CONFIÁVEL</Text>
          <Text style={styles.sellerName}>{book.userName}</Text>
          <Text style={styles.sellerMeta}>⊙ Vendedor de Elite</Text>
        </View>
      </View>

      {isNegotiated ? (
        <TouchableOpacity style={[styles.chatSellerButton, styles.soldButton]} activeOpacity={1} disabled>
          <Feather name="check-circle" size={23} color={colors.white} />
          <Text style={styles.chatSellerText}>{negotiatedText}</Text>
        </TouchableOpacity>
      ) : isOwner ? (
        <TouchableOpacity style={[styles.chatSellerButton, styles.soldButton]} onPress={handleMarcarComoVendido}>
          <Feather name="check-circle" size={23} color={colors.white} />
          <Text style={styles.chatSellerText}>{ownerActionText}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.chatSellerButton} onPress={handleConversar}>
          <Ionicons name="chatbox" size={23} color={colors.white} />
          <Text style={styles.chatSellerText}>Conversar com o vendedor</Text>
        </TouchableOpacity>
      )}

      <View style={styles.detailActions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarNaEstante}>
          <Feather name="bookmark" size={22} color={colors.brown} />
          <Text style={styles.saveButtonText}>Salvar na estante</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={22} color={colors.brown} />
        </TouchableOpacity>
      </View>
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  detailCoverFrame: {
    backgroundColor: colors.white,
    marginBottom: 26,
  },
  detailCover: {
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
  detailCoverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailCoverSmall: {
    color: colors.greenSoft,
    fontSize: 9,
    letterSpacing: 2,
    position: 'absolute',
    top: 35,
  },
  detailCoverTitle: {
    color: colors.greenWash,
    fontSize: 28,
    lineHeight: 34,
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 1.2,
  },
  detailCoverLines: {
    position: 'absolute',
    bottom: 70,
    width: 180,
    height: 1,
    backgroundColor: colors.greenSoft,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'center',
    marginBottom: 34,
  },
  detailTitle: {
    color: colors.ink,
    fontSize: 35,
    lineHeight: 41,
    marginBottom: 10,
  },
  detailAuthor: {
    color: colors.brown,
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 24,
  },
  ratingText: {
    color: '#5f5952',
    fontWeight: '800',
    marginLeft: 10,
  },
  genreWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 34,
  },
  synopsisCard: {
    backgroundColor: colors.greenWash,
    borderLeftWidth: 4,
    borderLeftColor: colors.greenDark,
    borderRadius: 8,
    padding: 32,
    marginBottom: 34,
  },
  synopsisTitle: {
    color: colors.brown,
    fontSize: 20,
    marginBottom: 18,
  },
  synopsisText: {
    color: '#69625d',
    fontSize: 17,
    lineHeight: 29,
    fontStyle: 'italic',
  },
  sellerCard: {
    backgroundColor: colors.white,
    borderRadius: 9,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 30,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerEyebrow: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.6,
  },
  sellerName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 5,
  },
  sellerMeta: {
    color: '#625b56',
    fontSize: 14,
    marginTop: 4,
  },
  chatSellerButton: {
    minHeight: 92,
    borderRadius: 9,
    backgroundColor: colors.brown,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
    paddingHorizontal: 30,
    marginBottom: 18,
    ...cardShadow,
  },
  soldButton: {
    backgroundColor: colors.greenDark,
  },
  chatSellerText: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 14,
  },
  saveButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    backgroundColor: colors.surfaceWarm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '800',
  },
  shareButton: {
    width: 66,
    minHeight: 58,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    backgroundColor: colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
