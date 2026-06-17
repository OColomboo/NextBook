import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, ref } from 'firebase/database';
import firebase from '../firebaseConfig';
import { colors } from '../theme/appColors';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { BookListCard } from '../components/books/BookListCard';
import { toggleSavedListing } from '../components/books/ListingService';
import { listingMatchesSearch } from '../utils/listingFilters';

function mapFirebaseList(value) {
  if (!value) return [];

  return Object.entries(value)
    .map(([id, item]) => ({ id, ...item }))
    .sort((a, b) => getTimestamp(b) - getTimestamp(a));
}

function getTimestamp(item) {
  return item?.criadoEm || item?.savedAt || item?.negotiatedAt || 0;
}

function isTradeListing(book) {
  return String(book?.dealType || '').toLowerCase() === 'troca';
}

function isSaleListing(book) {
  return String(book?.dealType || '').toLowerCase() === 'venda';
}

function getInitials(name) {
  const fallback = 'US';
  if (!name) return fallback;

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return initials || fallback;
}

function getActionLabel(book) {
  if (book?.status) return String(book.status).toUpperCase();
  if (isTradeListing(book)) return 'TROCA';
  if (!book?.price) return 'R$ --';

  const price = String(book.price);
  return price.includes('R$') ? price : `R$ ${price}`;
}

function EmptySection({ text }) {
  return (
    <View style={styles.emptyCard}>
      <Feather name="book-open" size={22} color={colors.muted} />
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

function ListingSection({
  title,
  hint,
  items,
  emptyText,
  actionLabel,
  onAction,
  onOpenBook,
  onSavePress,
  saved = false,
  showEditAction = false,
  onEditBook,
}) {
  return (
    <View style={styles.sectionBlock}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionEyebrow}>{title}</Text>
        {actionLabel ? (
          <TouchableOpacity onPress={onAction} activeOpacity={0.8}>
            <Text style={styles.sectionLink}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.sectionHint}>{hint}</Text>

      {items.length > 0 ? (
        items.map((book) => (
          <View key={book.id}>
            <BookListCard
              title={book.title || 'Livro sem titulo'}
              author={book.author || 'Autor nao informado'}
              description={book.description || book.synopsis || 'Sem descricao informada.'}
              badge={book.condition?.toUpperCase() || 'ANUNCIO'}
              action={getActionLabel(book)}
              color={colors.greenDark}
              avatar={getInitials(book.userName)}
              name={book.userName || 'Usuario'}
              imageSource={book.imageSource}
              onPress={onOpenBook ? () => onOpenBook(book) : undefined}
              saved={saved}
              onSavePress={onSavePress ? () => onSavePress(book) : undefined}
            />
            {showEditAction && onEditBook ? (
              <TouchableOpacity style={styles.editLink} onPress={() => onEditBook(book)}>
                <Text style={styles.sectionLink}>Editar anuncio</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))
      ) : (
        <EmptySection text={emptyText} />
      )}
    </View>
  );
}

export function BookDetailsScreen({ navigate, openMenu }) {
  const { isCompact } = useResponsiveLayout();
  const [filter, setFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [myListings, setMyListings] = useState([]);
  const [savedListings, setSavedListings] = useState([]);
  const [negotiatedListings, setNegotiatedListings] = useState([]);
  const titleSize = isCompact ? 26 : 31;

  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user?.uid) {
      setMyListings([]);
      return undefined;
    }

    const listingsRef = ref(db, 'bookListings');
    const unsubscribe = onValue(listingsRef, (snapshot) => {
      const listings = mapFirebaseList(snapshot.val()).filter((book) => book.userId === user.uid);
      setMyListings(listings);
    });

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setSavedListings([]);
      return undefined;
    }

    const savedRef = ref(db, `savedListings/${user.uid}`);
    const unsubscribe = onValue(savedRef, (snapshot) => {
      setSavedListings(mapFirebaseList(snapshot.val()));
    });

    return unsubscribe;
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) {
      setNegotiatedListings([]);
      return undefined;
    }

    const negotiatedRef = ref(db, `negotiatedListings/${user.uid}`);
    const unsubscribe = onValue(negotiatedRef, (snapshot) => {
      setNegotiatedListings(mapFirebaseList(snapshot.val()));
    });

    return unsubscribe;
  }, [user?.uid]);

  const saleListings = useMemo(() => myListings.filter(isSaleListing), [myListings]);
  const tradeListings = useMemo(() => myListings.filter(isTradeListing), [myListings]);

  const filteredSaleListings = saleListings.filter((book) => listingMatchesSearch(book, searchTerm));
  const filteredTradeListings = tradeListings.filter((book) => listingMatchesSearch(book, searchTerm));
  const filteredSavedListings = savedListings.filter((book) => listingMatchesSearch(book, searchTerm));
  const filteredNegotiatedListings = negotiatedListings.filter((book) => listingMatchesSearch(book, searchTerm));

  const stats = [
    { key: 'venda', label: 'A VENDA', value: saleListings.length },
    { key: 'troca', label: 'PARA TROCA', value: tradeListings.length },
    { key: 'salvos', label: 'SALVOS', value: savedListings.length },
    { key: 'negociados', label: 'NEGOCIADOS', value: negotiatedListings.length },
  ];

  function openBook(book) {
    navigate('bookDetail', { book });
  }

  async function handleUnsave(book) {
    if (!user?.uid || !book?.id) {
      return;
    }

    try {
      await toggleSavedListing(user.uid, book, true);
    } catch (error) {
      alert(error.message || 'Nao foi possivel remover o anuncio salvo.');
    }
  }

  function handleEditListing(book) {
    navigate('add', { listingId: book.id });
  }

  return (
    <MainScreenScaffold active="details" navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <Text style={[styles.pageTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>Sua estante</Text>
      <Text style={styles.pageSubtitle}>
        Livros que voce anunciou, salvou e ja negociou em um so lugar.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar na sua estante..."
          placeholderTextColor="#89909e"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Feather name="search" size={22} color={colors.muted} />
      </View>

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <View key={s.key} style={styles.statCell}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.pillRow}>
        <TouchableOpacity onPress={() => setFilter('todos')} activeOpacity={0.8}>
          <GenrePillTag label="Todos" active={filter === 'todos'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('venda')} activeOpacity={0.8}>
          <GenrePillTag label="A venda" active={filter === 'venda'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('troca')} activeOpacity={0.8}>
          <GenrePillTag label="Para troca" active={filter === 'troca'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('salvos')} activeOpacity={0.8}>
          <GenrePillTag label="Salvos" active={filter === 'salvos'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('negociados')} activeOpacity={0.8}>
          <GenrePillTag label="Negociados" active={filter === 'negociados'} />
        </TouchableOpacity>
      </View>

      {(filter === 'todos' || filter === 'venda') && (
        <ListingSection
          title="LIVROS ANUNCIADOS"
          hint="Livros que voce anunciou para venda."
          items={filteredSaleListings}
          emptyText="Voce ainda nao tem livros anunciados para venda."
          actionLabel="+ Anunciar"
          onAction={() => navigate('add')}
          onOpenBook={openBook}
          showEditAction
          onEditBook={handleEditListing}
        />
      )}

      {(filter === 'todos' || filter === 'troca') && (
        <ListingSection
          title="LIVROS PARA TROCA"
          hint="Livros que voce anunciou para trocar com outros leitores."
          items={filteredTradeListings}
          emptyText="Voce ainda nao tem livros anunciados para troca."
          actionLabel="+ Anunciar"
          onAction={() => navigate('add')}
          onOpenBook={openBook}
          showEditAction
          onEditBook={handleEditListing}
        />
      )}

      {(filter === 'todos' || filter === 'salvos') && (
        <ListingSection
          title="SALVOS"
          hint="Anuncios que voce salvou para ver depois."
          items={filteredSavedListings}
          emptyText="Voce ainda nao salvou nenhum anuncio."
          onOpenBook={openBook}
          saved
          onSavePress={handleUnsave}
        />
      )}

      {(filter === 'todos' || filter === 'negociados') && (
        <ListingSection
          title="NEGOCIADOS"
          hint="Livros que ja foram vendidos ou trocados."
          items={filteredNegotiatedListings}
          emptyText="Nenhum livro negociado por enquanto."
          onOpenBook={openBook}
        />
      )}
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: colors.ink,
    marginBottom: 12,
    marginTop: 10,
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 22,
  },
  searchBox: {
    minHeight: 53,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },
  statCell: {
    flexGrow: 1,
    flexBasis: '22%',
    minWidth: 72,
    backgroundColor: colors.surfaceWarm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 26,
  },
  sectionBlock: {
    marginBottom: 28,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionEyebrow: {
    color: colors.greenDark,
    fontSize: 12,
    letterSpacing: 2.4,
    fontWeight: '800',
  },
  sectionLink: {
    color: colors.brown,
    fontSize: 13,
    fontWeight: '900',
  },
  sectionHint: {
    color: '#6e655e',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 16,
  },
  emptyCard: {
    minHeight: 92,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    backgroundColor: colors.surfaceWarm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    gap: 8,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  editLink: {
    alignSelf: 'flex-end',
    marginTop: -18,
    marginBottom: 18,
  },
});
