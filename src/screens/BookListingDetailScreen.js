import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { cardShadow } from '../theme/cardShadow';
import { useResponsiveLayout } from '../theme/ResponsiveLayoutContext';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { GenrePillTag } from '../components/books/GenrePillTag';
import { UserAvatar } from '../components/community/UserAvatar';

/** Detalhe de um livro/anúncio (acessível a partir do Descobrir e do Chat). */
export function BookListingDetailScreen({ navigate, openMenu }) {
  const { gutterContent, isCompact, width } = useResponsiveLayout();
  const framePad = Math.max(16, Math.min(36, Math.round(gutterContent * 1.15)));
  const scrollInnerW = width - 2 * gutterContent;
  const coverInnerW = Math.max(160, scrollInnerW - 2 * framePad);
  const coverH = Math.min(374, Math.max(220, Math.round(coverInnerW * 1.06)));

  return (
    <MainScreenScaffold navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <View style={[styles.detailCoverFrame, { padding: framePad, marginTop: isCompact ? 24 : 36 }]}>
        <View style={[styles.detailCover, { height: Math.max(220, coverH) }]}>
          <Text style={styles.detailCoverSmall}>TOM ENCONTRO CONJUNTO DE MANDE</Text>
          <Text style={styles.detailCoverTitle}>A SOMBRA DO{'\n'}ALQUIMISTA</Text>
          <View style={styles.detailCoverLines} />
        </View>
      </View>

      <View style={styles.badgesRow}>
        <GenrePillTag label="USADO" />
        <GenrePillTag label="CAPA DURA" muted />
      </View>

      <Text style={styles.detailTitle}>A Sombra do Alquimista</Text>
      <Text style={styles.detailAuthor}>por Julian Thorne</Text>

      <View style={styles.ratingRow}>
        {[0, 1, 2, 3].map((item) => (
          <FontAwesome key={item} name="star" size={18} color={colors.caramel} />
        ))}
        <FontAwesome name="star-half-o" size={18} color={colors.caramel} />
        <Text style={styles.ratingText}>4.8 (124 avaliações)</Text>
      </View>

      <View style={styles.genreWrap}>
        <GenrePillTag label="Ficção Histórica" />
        <GenrePillTag label="Mistério" />
        <GenrePillTag label="Renascimento" />
      </View>

      <View style={styles.synopsisCard}>
        <Text style={styles.synopsisTitle}>Sinopse</Text>
        <Text style={styles.synopsisText}>
          No coração da Veneza do século XV, um mestre artesão descobre um manuscrito oculto que promete os segredos
          da própria luz. Mas à medida que ele se aprofunda nas sombras da guilda, percebe que algumas verdades devem
          permanecer enterradas sob a superfície dos canais. Uma história envolvente de ambição, alquimia e o preço da
          imortalidade.
        </Text>
      </View>

       <View style={styles.synopsisCard}>
        <Text style={styles.synopsisTitle}>Detalhes</Text>
        <Text style={styles.synopsisText}>
          Livro usado em condições de uso rasoáveis, primeira edição ITEM DE COLECIONADOR. Para mais fotos e informações inbox.
        </Text>
      </View>

      <View style={styles.sellerCard}>
        <UserAvatar initials="OA" color="#0c1d24" size={56} online />
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerEyebrow}>VENDEDOR CONFIÁVEL</Text>
          <Text style={styles.sellerName}>O Arquivista</Text>
          <Text style={styles.sellerMeta}>⊙ Vendedor de Elite</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.chatSellerButton} onPress={() => navigate('chat')}>
        <Ionicons name="chatbox" size={23} color={colors.white} />
        <Text style={styles.chatSellerText}>Conversar com o vendedor</Text>
      </TouchableOpacity>

      <View style={styles.detailActions}>
        <TouchableOpacity style={styles.saveButton} onPress={() => navigate('details')}>
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
