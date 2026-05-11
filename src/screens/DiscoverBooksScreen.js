import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { BookListCard } from '../components/books/BookListCard';

export function DiscoverBooksScreen({ navigate, openMenu }) {
  const { gutterContent, isCompact } = useResponsiveLayout();
  const titleSize = isCompact ? 26 : 31;

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

      <TouchableOpacity activeOpacity={0.82} onPress={() => navigate('details')}>
        <View style={styles.featureBookCard}>
          <View style={styles.secretCover}>
            <Text style={styles.secretCoverText}>THE{'\n'}SECRET{'\n'}HISTORY</Text>
          </View>
          <View style={styles.bookCardBody}>
            <View>
              <Text style={styles.bookTitle}>The Secret History</Text>
              <Text style={styles.bookAuthor}>Donna Tartt</Text>
            </View>
            <Text style={styles.priceText}>R$ 102,00</Text>
          </View>
          <View style={styles.bookCardFooter}>
            <View style={styles.sellerHandle}>
              <Ionicons name="person-outline" size={14} color={colors.brown} />
              <Text style={styles.handleText}>@o_arquivista</Text>
            </View>
            <Text style={styles.detailsLink}>Ver Detalhes →</Text>
          </View>
        </View>
      </TouchableOpacity>

      <BookListCard
        title="Kafka à Beira-Mar"
        author="Haruki Murakami"
        description="Excelente estado, capa original. Procuro trocas por ficção contemporânea."
        badge="VENDEDOR PREMIUM"
        action="Apenas Troca"
        color="#ded6a7"
        portrait="sea"
      />

      <BookListCard
        title="O Alquimista"
        author="Paulo Coelho"
        description="Primeira edição em brochura. Desgaste leve na lombada. Envio de São Paulo."
        badge="VERIFICADO"
        action="R$ 65,00"
        color="#142236"
        portrait="sage"
      />

      <View style={styles.curatedCard}>
        <View style={styles.curatedImage}>
          <View style={styles.portraitFace} />
        </View>
        <Text style={styles.curatedEyebrow}>SELEÇÃO CURADA</Text>
        <Text style={styles.curatedTitle}>Coleção do Arquivista Moderno</Text>
        <Text style={styles.curatedText}>
          Explore uma seleção escolhida a dedo de poesias clássicas e textos de filosofia em primeira edição,
          atualmente disponíveis para troca.
        </Text>
        <View style={styles.curatedActions}>
          <TouchableOpacity style={styles.curatedPrimary}>
            <Text style={styles.curatedPrimaryText}>Explorar Galeria</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.curatedSecondary}>
            <Text style={styles.curatedSecondaryText}>Saiba Mais</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.floatingAdd, { bottom: isCompact ? 18 : 24 }]}
        onPress={() => navigate('add')}
      >
        <Feather name="plus" size={26} color={colors.white} />
      </TouchableOpacity>
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
  secretCover: {
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
  secretCoverText: {
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
  curatedCard: {
    borderRadius: 9,
    backgroundColor: colors.greenWash,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    padding: 28,
    marginBottom: 22,
  },
  curatedImage: {
    height: 310,
    backgroundColor: '#111815',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-3deg' }],
    marginBottom: 34,
  },
  portraitFace: {
    width: 140,
    height: 220,
    borderRadius: 70,
    backgroundColor: '#d9d1bf',
    borderWidth: 12,
    borderColor: '#25261f',
  },
  curatedEyebrow: {
    color: colors.greenDark,
    fontSize: 12,
    letterSpacing: 4,
    fontWeight: '700',
    marginBottom: 12,
  },
  curatedTitle: {
    color: colors.ink,
    fontSize: 31,
    lineHeight: 36,
    marginBottom: 16,
  },
  curatedText: {
    color: '#6e655e',
    fontSize: 15,
    lineHeight: 23,
  },
  curatedActions: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 28,
  },
  curatedPrimary: {
    flex: 1,
    backgroundColor: colors.brown,
    borderRadius: 7,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curatedPrimaryText: {
    color: colors.white,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '900',
  },
  curatedSecondary: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.greenSoft,
    borderRadius: 7,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curatedSecondaryText: {
    color: colors.brown,
    fontWeight: '900',
  },
  floatingAdd: {
    position: 'absolute',
    right: 0,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 11,
    backgroundColor: colors.greenDark,
    alignItems: 'center',
    justifyContent: 'center',
    ...cardShadow,
  },
});
