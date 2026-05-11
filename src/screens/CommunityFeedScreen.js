import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { UserAvatar } from '../components/community/UserAvatar';
import { CommunityPostCard } from '../components/community/CommunityPostCard';

export function CommunityFeedScreen({ navigate, openMenu }) {
  return (
    <MainScreenScaffold active="community" navigate={navigate} openMenu={openMenu}>
      <Text style={styles.pageTitle}>Comunidade</Text>
      <Text style={styles.pageSubtitle}>Explore as conversas literárias e trocas de hoje.</Text>

      <View style={styles.composerCard}>
        <View style={styles.composerContent}>
          <Text style={styles.pageBig}>Compartilhe com a comunidade o que você está lendo!</Text>
          <View style={styles.composerFooter}>
            <Text style={styles.pageText}>Escreva o que está achando</Text>
            <TouchableOpacity style={styles.smallBrownButton} onPress={() => navigate('review')}>
              <Text style={styles.smallBrownButtonText}>
              Escrever
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <CommunityPostCard
        avatar="BO"
        name="Beatriz Oliveira"
        meta="HÁ 15 MINUTOS • LENDO"
        text={'Finalmente comecei "Torto Arado" e estou completamente hipnotizada pela escrita do Itamar Vieira Junior. A conexão com a terra e a ancestralidade é palpável em cada frase. Alguém mais sentiu esse impacto logo nas primeiras páginas?'}
        imageType="openBook"
        likes="124"
        comments="32"
      />

      <CommunityPostCard
        avatar="ML"
        name="Mariana Lima"
        meta="HÁ 3 HORAS • PENSAMENTO"
        text={'"Ler é sonhar de olhos abertos e viajar sem sair do lugar. Qual foi o livro que mais te fez viajar este ano?"'}
        likes="89"
        comments="56"
        centered
      />
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    color: colors.ink,
    fontSize: 33,
    lineHeight: 40,
    marginTop: 28,
  },
  pageText:{
    color: colors.ink,
    fontSize: 17,
    marginRight: 10
  },
  pageBig:{
    color: colors.ink,
    fontSize: 23,
  },
  pageSubtitle: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 25,
    marginTop: 12,
    marginBottom: 34,
  },
  composerCard: {
    flexDirection: 'row',
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 14,
    marginBottom: 30,
  },
  composerContent: {
    flex: 1,
  },
  composerInput: {
    paddingLeft: 20,
    minHeight: 72,
    color: colors.ink,
    fontSize: 20,
    lineHeight: 29,
    borderBottomWidth: 1,
    borderBottomColor: '#e3d7c8',
  },
  composerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  composerTools: {
    flexDirection: 'row',
    gap: 20,
  },
  smallBrownButton: {

    backgroundColor: colors.brown,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  smallBrownButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});
