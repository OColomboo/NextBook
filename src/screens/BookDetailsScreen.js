import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { BookListCard } from '../components/books/BookListCard';

const STATS = [
  { key: 'owned', label: 'NA ESTANTE', value: '12' },
  { key: 'wish', label: 'A VENDA', value: '8' },
  { key: 'trade', label: 'PARA TROCA', value: '3' },
  { key: 'saved', label: 'SALVOS', value: '5' },
];

const OWNED_ITEMS = [
  { title: 'Torto Arado', author: 'Itamar Vieira Junior', color: '#2d4a3e' },
  { title: 'Grande Sertão', author: 'Guimarães Rosa', color: '#3d2918' },
  { title: 'Onde mora o Slime', author: 'Fusion', color: '#4a3d6b' },
];

const SAVED_ITEMS = [
  { title: 'The Secret History', author: 'Donna Tartt', color: '#0a1210' },
  { title: 'Sapiens', author: 'Yuval Harari', color: '#6b5344' },
];

const WISH_ITEMS = [
  { title: 'Cem Anos', author: 'García Márquez', color: '#8b6914' },
  { title: 'Duna', author: 'Frank Herbert', color: '#c4a574' },
  { title: 'Lavoura Arcaica', author: 'Raduan Nassar', color: '#5c4033' },
];

function ShelfThumb({ title, author, color }) {
  return (
    <TouchableOpacity style={styles.thumbCard} activeOpacity={0.85}>
      <View style={[styles.thumbCover, { backgroundColor: color }]}>
        <View style={styles.thumbSpine} />
      </View>
      <Text style={styles.thumbTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.thumbAuthor} numberOfLines={1}>
        {author}
      </Text>
    </TouchableOpacity>
  );
}

export function BookDetailsScreen({ navigate, openMenu }) {
  const { gutterContent, isCompact } = useResponsiveLayout();
  const [filter, setFilter] = useState('todos');
  const titleSize = isCompact ? 26 : 31;

  return (
    <MainScreenScaffold active="details" navigate={navigate} openMenu={openMenu} library headerProfile={false}>

      <Text style={[styles.pageTitle, { fontSize: titleSize, lineHeight: titleSize + 8 }]}>Sua estante</Text>
      <Text style={styles.pageSubtitle}>
        Livros que você tem, oferece em troca, salvou para depois e quer ler — tudo em um só lugar.
      </Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar na sua estante..."
          placeholderTextColor="#89909e"
        />
        <Feather name="search" size={22} color={colors.muted} />
      </View>

      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.key} style={styles.statCell}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
      >
        <TouchableOpacity onPress={() => setFilter('todos')} activeOpacity={0.8}>
          <GenrePillTag label="Todos" active={filter === 'todos'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('coleção')} activeOpacity={0.8}>
          <GenrePillTag label="Minha coleção" active={filter === 'coleção'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('quero')} activeOpacity={0.8}>
          <GenrePillTag label="A venda" active={filter === 'quero'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('troca')} activeOpacity={0.8}>
          <GenrePillTag label="Para troca" active={filter === 'troca'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('salvos')} activeOpacity={0.8}>
          <GenrePillTag label="Salvos" active={filter === 'salvos'} />
        </TouchableOpacity>
      </ScrollView>

      {(filter === 'todos' || filter === 'coleção') && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionEyebrow}>MINHA COLEÇÃO</Text>
            <TouchableOpacity onPress={() => setFilter('coleção')}>
              <Text style={styles.sectionLink}>Filtrar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionHint}>Livros que você possui fisicamente ou marcou como na estante.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
            {OWNED_ITEMS.map((b) => (
              <ShelfThumb key={b.title} {...b} />
            ))}
          </ScrollView>
        </View>
      )}

      {(filter === 'todos' || filter === 'troca') && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionEyebrow}>OFERTAS DE TROCA</Text>
            <TouchableOpacity onPress={() => navigate('add')}>
              <Text style={styles.sectionLink}>+ Anunciar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionHint}>Títulos disponíveis para negociar com outros arquivistas.</Text>

          <TouchableOpacity activeOpacity={0.9} onPress={() => navigate('bookDetail')}>
            <BookListCard
              title="Kafka à Beira-Mar"
              author="Haruki Murakami"
              description="Excelente estado, capa original. Procuro ficção contemporânea ou dark fantasy."
              badge="DISPONÍVEL"
              action="Ver anúncio"
              color="#ded6a7"
              portrait="sea"
            />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigate('bookDetail')}>
            <BookListCard
              title="Breve tratado sobre a camaradagem"
              author="Carolina Maria de Jesus"
              description="Marcas de uso na capa; miolo íntegro. Preferência por trocas em Curitiba."
              badge="VERIFICADO"
              action="Editar troca"
              color="#253028"
              portrait="sage"
            />
          </TouchableOpacity>
        </View>
      )}

      {(filter === 'todos' || filter === 'salvos') && (
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionEyebrow}>SALVOS PARA DEPOIS</Text>
          </View>
          <Text style={styles.sectionHint}>Inspirações e leituras que você marcou enquanto explorava o app.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
            {SAVED_ITEMS.map((b) => (
              <ShelfThumb key={b.title} {...b} />
            ))}
          </ScrollView>
        </View>
      )}

      {(filter === 'todos' || filter === 'quero') && (
        <View style={[styles.sectionBlock, styles.sectionLast]}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionEyebrow}>LIVROS ANUNCIADOS</Text>
          </View>
          <Text style={styles.sectionHint}>Confira os livros que você anunciou para venda.</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
            {WISH_ITEMS.map((b) => (
              <ShelfThumb key={b.title} {...b} />
            ))}
          </ScrollView>
        </View>
      )}

      <TouchableOpacity style={styles.promoCard} activeOpacity={0.9} onPress={() => navigate('discover')}>
        <View style={styles.promoCopy}>
          <Text style={styles.promoEyebrow}>ORGANIZE & TROQUE</Text>
          <Text style={styles.promoTitle}>Encontre o próximo volume da sua estante</Text>
          <Text style={styles.promoText}>
            Explore anúncios, salve favoritos e negocie com a comunidade — sem sair do fluxo de leitura.
          </Text>
        </View>
        <Feather name="arrow-right" size={22} color={colors.brown} />
      </TouchableOpacity>
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  topLine: {
    width: 116,
    height: 3,
    backgroundColor: colors.greenDark,
    marginBottom: 14,
  },
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
    gap: 12,
    paddingBottom: 26,
  },
  sectionBlock: {
    marginBottom: 28,
  },
  sectionLast: {
    marginBottom: 18,
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
  thumbRow: {
    gap: 14,
    paddingRight: 8,
  },
  thumbCard: {
    width: 128,
  },
  thumbCover: {
    height: 168,
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    ...cardShadow,
  },
  thumbSpine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  thumbTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
  thumbAuthor: {
    color: '#6f6761',
    fontSize: 12,
    marginTop: 2,
  },
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.greenWash,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    padding: 22,
    marginBottom: 12,
  },
  promoCopy: {
    flex: 1,
  },
  promoEyebrow: {
    color: colors.greenDark,
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '800',
    marginBottom: 8,
  },
  promoTitle: {
    color: colors.ink,
    fontSize: 19,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
  },
  promoText: {
    color: '#6e655e',
    fontSize: 14,
    lineHeight: 20,
  },
});
