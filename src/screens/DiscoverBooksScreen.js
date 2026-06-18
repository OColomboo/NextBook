import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { BookListCard } from '../components/books/BookListCard';
import { toggleSavedListing } from '../components/books/ListingService';
import firebase from '../firebaseConfig';
import { getDatabase, onValue, ref } from 'firebase/database';
import {
  discoverGenreFilters,
  listingMatchesGenre,
  listingMatchesSearch,
} from '../utils/listingFilters';

export function DiscoverBooksScreen({ navigate, openMenu }) {
  const { isCompact } = useResponsiveLayout();
  const titleSize = isCompact ? 26 : 31;
  const [bookListings, setBookListings] = useState([]);
  const [savedListingIds, setSavedListingIds] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
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
          ...listing,
        }))
        .sort((a, b) => (b.criadoEm || 0) - (a.criadoEm || 0));

      setBookListings(listingsArray);
    });

    return () => unsubscribe();
  }, [db]);

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

  const filteredListings = useMemo(
    () =>
      bookListings.filter(
        (book) => listingMatchesSearch(book, searchTerm) && listingMatchesGenre(book, genreFilter),
      ),
    [bookListings, searchTerm, genreFilter],
  );

  async function handleToggleSave(book) {
    try {
      if (!user) {
        alert('Voce precisa estar logado para salvar anuncios.');
        return;
      }

      if (!book?.id) {
        alert('Nao foi possivel encontrar o codigo do anuncio.');
        return;
      }

      const isSaved = Boolean(savedListingIds[book.id]);
      await toggleSavedListing(user.uid, book, isSaved);

      setSavedListingIds((current) => {
        const next = { ...current };

        if (isSaved) {
          delete next[book.id];
        } else {
          next[book.id] = true;
        }

        return next;
      });
    } catch (error) {
      alert(error.message || 'Nao foi possivel atualizar a estante.');
    }
  }

  return (
    <MainScreenScaffold active="discover" navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <Text style={[styles.discoverTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>
        Descubra seu proximo capitulo.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por titulo, autor ou ISBN..."
          placeholderTextColor="#89909e"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Feather name="book-open" size={22} color={colors.muted} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {discoverGenreFilters.map((filter) => (
          <GenrePillTag
            key={filter.key}
            label={filter.label}
            active={genreFilter === filter.key}
            onPress={() => setGenreFilter(filter.key)}
          />
        ))}
      </ScrollView>

      {filteredListings.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="search" size={24} color={colors.muted} />
          <Text style={styles.emptyText}>Nenhum anuncio encontrado com esses filtros.</Text>
        </View>
      ) : (
        filteredListings.map((book) => (
          <BookListCard
            key={book.id}
            avatar={book.userName?.slice(0, 2).toUpperCase() || 'US'}
            name={book.userName}
            title={book.title}
            author={book.author}
            description={book.description || book.synopsis}
            badge={book.condition?.toUpperCase() || 'ANUNCIO'}
            action={book.dealType === 'troca' ? 'TROCA' : `R$ ${book.price}`}
            imageSource={book.imageSource}
            onPress={() => navigate('bookDetail', { book })}
            saved={Boolean(savedListingIds[book.id])}
            onSavePress={() => handleToggleSave(book)}
          />
        ))
      )}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '700',
  },
});
