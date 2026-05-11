import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/appColors';
import { MainScreenScaffold } from '../components/layout/MainScreenScaffold';
import { FormField, FormSelectField, formStyles } from '../components/forms/FormFields';

export function AddBookListingScreen({ navigate, openMenu }) {
  return (
    <MainScreenScaffold active="add" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.addTitle}>Adicionar à Coleção</Text>
      <Text style={styles.addSubtitle}>
        Compartilhe sua jornada literária. Preencha os detalhes do manuscrito para que ele encontre seu próximo
        curador no ecossistema NextBook.
      </Text>

      <View style={formStyles.uploadCoverLarge}>
        <Feather name="camera" size={34} color={colors.muted} />
        <Text style={formStyles.uploadLabel}>CAPA DO LIVRO</Text>
      </View>

      <View style={formStyles.softPanel}>
        <Text style={formStyles.formLabel}>ESTADO DO LIVRO</Text>
        <View style={formStyles.segmented}>
          <TouchableOpacity style={[formStyles.segment, formStyles.segmentActive]}>
            <Text style={formStyles.segmentActiveText}>NOVO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={formStyles.segment}>
            <Text style={formStyles.segmentText}>USADO</Text>
          </TouchableOpacity>
        </View>
        <FormSelectField label="FORMA DE NEGOCIAÇÃO" value="Venda" />
        <FormField label="VALOR SUGERIDO (R$)" placeholder="0,00" />
      </View>

      <View style={formStyles.deepFormPanel}>
        <FormField label="NOME DO LIVRO" placeholder="Ex: O Alquimista" />
        <FormField label="AUTOR" placeholder="Paulo Coelho" />
        <FormField label="EDITORA" placeholder="Companhia das Letras" />
        <FormSelectField label="GÊNERO" value="Ficção Literária" />
        <FormField label="Nº DE PÁGINAS" placeholder="208" />
        <FormField label="BREVE RESUMO / SINOPSE" placeholder="Uma breve introdução à obra..." multiline height={95} />
        <FormField
          label="DESCRIÇÃO DA UNIDADE"
          placeholder="Descreva o estado físico, dedicatórias ou detalhes específicos do seu exemplar..."
          multiline
          height={132}
        />
        <View style={formStyles.alignRight}>
          <TouchableOpacity style={formStyles.formSubmitButton}>
            <Text style={formStyles.formSubmitText}>ANUNCIAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainScreenScaffold>
  );
}

const styles = StyleSheet.create({
  addTitle: {
    color: colors.brown,
    fontSize: 28,
    lineHeight: 34,
    marginTop: 28,
  },
  addSubtitle: {
    color: '#756b65',
    fontSize: 16,
    lineHeight: 25,
    marginTop: 16,
    marginBottom: 44,
  },
});
