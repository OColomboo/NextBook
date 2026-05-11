import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormOutlineField, FormSelectField, formStyles } from '../components/forms/FormFields';

export function BookReviewScreen({ navigate, openMenu }) {
  return (
    <MainScreenScaffold active="review" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.reviewEyebrow}>CURADORIA LITERÁRIA</Text>
      <Text style={styles.reviewTitle}>Avaliar Nova Leitura</Text>
      <Text style={styles.reviewSubtitle}>
        O que você achou dessa leitura? Compartilhe com a comunidade!
      </Text>

      <View style={styles.reviewUpload}>
        <View style={styles.reviewBookCover}>
          <View style={styles.reviewBookShape} />
        </View>
        <Text style={formStyles.uploadLabelStrong}>CAPA DA OBRA</Text>
        <Text style={formStyles.uploadHint}>Formatos suportados: JPG, PNG</Text>
      </View>

      <View style={formStyles.softPanel}>
        <Text style={formStyles.panelHeading}>METADADOS</Text>
        <FormField label="EDITORA" placeholder="Ex: Companhia das Letras" />
        <FormSelectField label="GÊNERO" value="Ficção Literária" />
      </View>

      <View style={formStyles.reviewFormPanel}>
        <FormOutlineField label="NOME DO LIVRO" placeholder="Título completo da obra" />
        <FormOutlineField label="AUTOR(A)" placeholder="Nome do autor" />
        <Text style={styles.ratingLabel}>SUA AVALIAÇÃO</Text>
        <View style={styles.starsRow}>
          {[0, 1, 2, 3].map((item) => (
            <FontAwesome key={item} name="star" size={37} color={colors.brownDark} />
          ))}
          <FontAwesome name="star-o" size={37} color="#d9c9c2" />
        </View>
        <FormOutlineField
          label="SUA OPINIÃO"
          placeholder="O que achou da narrativa? Como foi a experiência de leitura?"
          multiline
          height={278}
        />
        <TouchableOpacity style={[formStyles.formSubmitButton, formStyles.centerSubmit]}>
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
});
