import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { BookListCard } from '../components/books/BookListCard';
import firebase from '../firebaseConfig';
import { getDatabase, ref, onValue, serverTimestamp, set } from 'firebase/database';

export function DiscoverBooksScreen({ navigate, openMenu }) {
  const { isCompact } = useResponsiveLayout();
  const titleSize = isCompact ? 26 : 31;
  const [bookListings, setBookListings] = useState([]);
  const [savedListingIds, setSavedListingIds] = useState({});
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;

  useEffect(() => {
    const listingRef = ref(db, 'bookListings');

    const unsubscribe = onValue(listingRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setBookListings([]);
        return;
      }

      const listingsArray = Object.entries(data)
      .map(([id, listing]) => ({
        id,
        ...listing
      }))
      .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));
    
      setBookListings(listingsArray);
    });

    return () => unsubscribe();
    
  },[db]);

  useEffect(() => {
    if (!user?.uid) {
      setSavedListingIds({});
      return undefined;
    }

    const savedRef = ref(db, `savedListings/${user.uid}`);
    const unsubscribe = onValue(savedRef, (snapshot) => {
      const savedListings = snapshot.val() || {};
      const savedIds = Object.keys(savedListings).reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});

      setSavedListingIds(savedIds);
    });

    return () => unsubscribe();
  }, [db, user?.uid]);

  async function handleSaveListing(book) {
    try {
      if (!user) {
        alert('Voce precisa estar logado para salvar anuncios.');
        return;
      }

      if (!book?.id) {
        alert('Nao foi possivel encontrar o codigo do anuncio.');
        return;
      }

      await set(ref(db, `savedListings/${user.uid}/${book.id}`), {
        ...book,
        savedAt: serverTimestamp(),
      });

      setSavedListingIds((current) => ({
        ...current,
        [book.id]: true,
      }));
    } catch (error) {
      alert(error.message || 'Nao foi possivel salvar o anuncio.');
    }
  }

  return (
    <MainScreenScaffold active="discover" navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <Text style={[styles.discoverTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>Descubra seu próximo capítulo.</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, autor ou ISBN..."
          placeholderTextColor="#89909e"
        />
        <Feather name="book-open" size={22} color={colors.muted} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        <GenrePillTag label="Todos os Gêneros" active />
        <GenrePillTag label="Ficção" />
        <GenrePillTag label="Filosofia" />
        <GenrePillTag label="História" />
        <GenrePillTag label="Fantasia" />
        <GenrePillTag label="Romance" />
        <GenrePillTag label="Infanto-juvenil"/>
      </ScrollView>

      {bookListings.map((book) => (
        <BookListCard
        key={book.id}
        avatar={book.userName?.slice(0, 2).toUpperCase() || 'US'}
        name={book.userName}
        title={book.title}
        author={book.author}
        description={book.description || book.synopsis}
        badge={book.condition?.toUpperCase()|| 'ANÚNCIO'}
        action={book.dealType === 'troca' ? 'TROCA' : `R$ ${book.price}`}
        imageSource={book.imageSource}
        onPress={() => navigate('bookDetail', { book })}
        saved={Boolean(savedListingIds[book.id])}
        onSavePress={() => handleSaveListing(book)}
        />
      ))}

    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  discoverTitle: {
    color: colors.ink,
    marginBottom: 20,
    marginTop: 10,
  },
  searchBox: {
    minHeight: 53,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
  },
  pillRow: {
    gap: 12,
    paddingBottom: 20,
  },
  featureBookCard: {
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: colors.surfaceWarm,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    marginBottom: 28,
  },
  Cover: {
    height: 220,
    backgroundColor: '#08100d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverRibbon: {
    position: 'absolute',
    top: 14,
    left: 14,
    color: colors.white,
    backgroundColor: colors.brown,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  CoverText: {
    color: colors.caramel,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  bookCardBody: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '800',
  },
  bookAuthor: {
    color: '#6f665f',
    fontSize: 14,
    marginTop: 3,
  },
  priceText: {
    color: colors.brownDark,
    fontSize: 16,
    fontWeight: '900',
  },
  bookCardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerHandle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  handleText: {
    color: '#706863',
    fontSize: 12,
    fontWeight: '700',
  },
  detailsLink: {
    color: colors.brown,
    fontWeight: '900',
  },
});
