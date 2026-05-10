import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const colors = {
  background: '#fff8ef',
  library: '#fbfbe7',
  paper: '#f8efdf',
  paperStrong: '#efe6d6',
  cream: '#fffaf1',
  white: '#ffffff',
  line: '#eadfce',
  muted: '#88736a',
  softText: '#a78d82',
  ink: '#26231f',
  brown: '#754b38',
  brownDark: '#5d3b2d',
  caramel: '#e6c497',
  peach: '#ffd9a5',
  green: '#1fc36a',
  red: '#c72d2d',
};

const menuItems = [
  ['login', 'Login'],
  ['register', 'Cadastro'],
  ['discover', 'Descobrir'],
  ['community', 'Comunidade'],
  ['add', 'Anunciar Livro'],
  ['review', 'Avaliar Livro'],
  ['details', 'Detalhes do Livro'],
  ['chat', 'Chat'],
];

export default function App() {
  const [screen, setScreen] = useState('login');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (nextScreen) => {
    setScreen(nextScreen);
    setMenuOpen(false);
  };

  const sharedProps = {
    navigate,
    openMenu: () => setMenuOpen(true),
  };

  return (
    <View style={styles.appRoot}>
      <StatusBar style="dark" />
      {screen === 'login' && <LoginScreen {...sharedProps} />}
      {screen === 'register' && <RegisterScreen {...sharedProps} />}
      {screen === 'discover' && <DiscoverScreen {...sharedProps} />}
      {screen === 'community' && <CommunityScreen {...sharedProps} />}
      {screen === 'add' && <AddBookScreen {...sharedProps} />}
      {screen === 'review' && <ReviewScreen {...sharedProps} />}
      {screen === 'details' && <BookDetailsScreen {...sharedProps} />}
      {screen === 'chat' && <ChatScreen {...sharedProps} />}
      <ScreenMenu visible={menuOpen} navigate={navigate} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

function ScreenMenu({ visible, navigate, onClose }) {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuOverlay}>
      <TouchableOpacity style={styles.menuBackdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.menuPanel}>
        <Text style={styles.menuTitle}>Telas NextBook</Text>
        {menuItems.map(([key, label]) => (
          <TouchableOpacity key={key} style={styles.menuItem} onPress={() => navigate(key)}>
            <Text style={styles.menuItemText}>{label}</Text>
            <Feather name="chevron-right" size={18} color={colors.muted} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function AppHeader({ openMenu, navigate, showSearch = true, showProfile = true, library = false }) {
  return (
    <View style={[styles.header, library && styles.libraryHeader]}>
      <TouchableOpacity style={styles.headerIcon} onPress={openMenu} activeOpacity={0.75}>
        <Feather name="menu" size={24} color={colors.brownDark} />
      </TouchableOpacity>
      <Text style={styles.brand}>NextBook</Text>
      <View style={styles.headerActions}>
        {showSearch && (
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('discover')}>
            <Feather name="search" size={22} color={colors.brownDark} />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('login')}>
            <Feather name="user-circle" size={22} color={colors.brownDark} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function BottomNav({ active, navigate, library = false }) {
  const tabs = [
    { key: 'discover', label: 'DESCOBRIR', icon: <Feather name="compass" /> },
    { key: 'community', label: 'COMUNIDADE', icon: <MaterialCommunityIcons name="account-group-outline" /> },
    { key: 'add', label: 'ANUNCIAR', icon: <Ionicons name="add-circle" /> },
    { key: 'chat', label: 'CHAT', icon: <Ionicons name="chatbox-outline" /> },
    { key: 'details', label: 'ESTANTE', icon: <Ionicons name="bookmarks-outline" /> },
  ];

  return (
    <View style={[styles.bottomNav, library && styles.libraryBottomNav]}>
      {tabs.map((tab) => {
        const isActive =
          active === tab.key ||
          (active === 'review' && tab.key === 'add') ||
          (active === 'details' && tab.key === 'details');
        const tint = isActive ? colors.brown : colors.muted;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, isActive && styles.tabActive]}
            activeOpacity={0.75}
            onPress={() => navigate(tab.key)}
          >
            {React.cloneElement(tab.icon, { size: tab.key === 'add' ? 25 : 22, color: tint })}
            <Text style={[styles.tabLabel, { color: tint }]} numberOfLines={1}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainScaffold({ active, children, navigate, openMenu, library = false, headerSearch = true, headerProfile = true }) {
  return (
    <SafeAreaView style={[styles.screen, library && styles.libraryScreen]}>
      <AppHeader
        openMenu={openMenu}
        navigate={navigate}
        showSearch={headerSearch}
        showProfile={headerProfile}
        library={library}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <BottomNav active={active} navigate={navigate} library={library} />
    </SafeAreaView>
  );
}

function LoginScreen({ navigate }) {
  return (
    <SafeAreaView style={styles.authScreen}>
      <ScrollView contentContainerStyle={styles.loginContent} showsVerticalScrollIndicator={false}>
        <View style={styles.nextLogo}>
          <Text style={styles.logoText}>NEXT{'\n'}BOOK</Text>
          <View style={styles.logoOwl}>
            <MaterialCommunityIcons name="owl" size={68} color={colors.brownDark} />
          </View>
        </View>

        <Text style={styles.loginTitle}>Bem-vindo de volta</Text>
        <Text style={styles.loginSubtitle}>Insira suas credenciais para acessar seus arquivos.</Text>

        <AuthInput
          label="ENDEREÇO DE E-MAIL"
          placeholder="arquivista@nextbook.com"
          icon={<Feather name="mail" size={27} color="#e7dad4" />}
        />

        <AuthInput
          label="SENHA"
          rightLabel="ESQUECEU?"
          placeholder="••••••••••••"
          icon={<Feather name="lock" size={27} color="#e7dad4" />}
          secureTextEntry
        />

        <CheckLine label="Permanecer conectado por 30 dias" large />

        <PrimaryButton label="Entrar na Biblioteca" icon={<Feather name="arrow-right" size={28} color={colors.white} />} onPress={() => navigate('discover')} />

        <TouchableOpacity style={styles.authLink} onPress={() => navigate('register')}>
          <Text style={styles.authLinkText}>Não tem uma conta? <Text style={styles.authLinkStrong}>Cadastre-se</Text></Text>
        </TouchableOpacity>

        <DividerLabel label="OU CONTINUE COM" />

        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.googleMark} />
            <Text style={styles.socialText}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <MaterialCommunityIcons name="alpha-a-box-outline" size={40} color={colors.ink} />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.authFooter}>
          <Text style={styles.authFooterBrand}>NextBook</Text>
          <Text style={styles.authFooterCopy}>© 2024 COLETIVO ARCHIVIST</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function RegisterScreen({ navigate }) {
  return (
    <SafeAreaView style={styles.authScreenLight}>
      <ScrollView contentContainerStyle={styles.registerContent} showsVerticalScrollIndicator={false}>
        <MaterialCommunityIcons name="school" size={95} color={colors.brownDark} style={styles.registerIcon} />
        <Text style={styles.registerTitle}>Criar sua conta</Text>
        <Text style={styles.registerSubtitle}>Junte-se à nossa comunidade de curadores literários.</Text>

        <AuthInput compact label="NOME COMPLETO" placeholder="Como quer ser chamado?" />
        <AuthInput compact label="E-MAIL" placeholder="seu@email.com.br" />
        <AuthInput compact label="TELEFONE" placeholder="(11) 99999-9999" />
        <AuthInput compact label="CIDADE" placeholder="Ex: São Paulo" />
        <AuthInput compact label="SENHA" placeholder="••••••••" secureTextEntry />
        <AuthInput compact label="CONFIRMAR SENHA" placeholder="••••••••" secureTextEntry />

        <CheckLine>
          <Text style={styles.checkText}>
            Eu aceito os <Text style={styles.underlined}>termos de uso</Text> e política de privacidade.
          </Text>
        </CheckLine>

        <PrimaryButton label="CADASTRAR" onPress={() => navigate('discover')} />

        <TouchableOpacity style={styles.authLink} onPress={() => navigate('login')}>
          <Text style={styles.authLinkText}>Já possui uma estante? <Text style={styles.authLinkStrong}>ENTRAR</Text></Text>
        </TouchableOpacity>

        <DividerLabel label="LEITURA É CONEXÃO" />
      </ScrollView>
    </SafeAreaView>
  );
}

function DiscoverScreen({ navigate, openMenu }) {
  return (
    <MainScaffold active="discover" navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <View style={styles.discoverTopLine} />
      <Text style={styles.discoverTitle}>Descubra seu próximo capítulo.</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, autor ou ISBN..."
          placeholderTextColor="#89909e"
        />
        <Feather name="book-open" size={22} color={colors.muted} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        <Pill label="Todos os Gêneros" active />
        <Pill label="Ficção" />
        <Pill label="Filosofia" />
        <Pill label="História" />
      </ScrollView>

      <TouchableOpacity activeOpacity={0.82} onPress={() => navigate('details')}>
        <View style={styles.featureBookCard}>
          <View style={styles.secretCover}>
            <Text style={styles.coverRibbon}>TROCA DISPONÍVEL</Text>
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

      <TouchableOpacity style={styles.floatingAdd} onPress={() => navigate('add')}>
        <Feather name="plus" size={26} color={colors.white} />
      </TouchableOpacity>
    </MainScaffold>
  );
}

function CommunityScreen({ navigate, openMenu }) {
  return (
    <MainScaffold active="community" navigate={navigate} openMenu={openMenu}>
      <Text style={styles.pageTitle}>Comunidade</Text>
      <Text style={styles.pageSubtitle}>Explore as conversas literárias e trocas de hoje.</Text>

      <View style={styles.composerCard}>
        <Avatar initials="NB" color="#1d2935" />
        <View style={styles.composerContent}>
          <TextInput
            style={styles.composerInput}
            placeholder="O que você está lendo agora?"
            placeholderTextColor="#dccdc5"
            multiline
          />
          <View style={styles.composerFooter}>
            <View style={styles.composerTools}>
              <Feather name="image" size={22} color={colors.brownDark} />
              <Feather name="book" size={22} color={colors.brownDark} />
              <Feather name="map-pin" size={22} color={colors.brownDark} />
            </View>
            <TouchableOpacity style={styles.smallBrownButton}>
              <Text style={styles.smallBrownButtonText}>POSTAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <PostCard
        avatar="BO"
        name="Beatriz Oliveira"
        meta="HÁ 15 MINUTOS • LENDO"
        text={'Finalmente comecei "Torto Arado" e estou completamente hipnotizada pela escrita do Itamar Vieira Junior. A conexão com a terra e a ancestralidade é palpável em cada frase. Alguém mais sentiu esse impacto logo nas primeiras páginas?'}
        imageType="openBook"
        likes="124"
        comments="32"
      />

      <PostCard
        avatar="RS"
        name="Ricardo Santos"
        meta="HÁ 1 HORA • TROCA"
        text={'Tenho uma edição de luxo de "Grande Sertão: Veredas" em estado de novo. Procuro por edições raras da DarkSide ou clássicos da Cosac Naify. Alguém interessado em Belo Horizonte?'}
        badge="DISPONÍVEL"
        quote
        likes="45"
        comments="12"
        action="TENHO INTERESSE"
        accent
      />

      <PostCard
        avatar="ML"
        name="Mariana Lima"
        meta="HÁ 3 HORAS • PENSAMENTO"
        text={'"Ler é sonhar de olhos abertos e viajar sem sair do lugar. Qual foi o livro que mais te fez viajar este ano?"'}
        likes="89"
        comments="56"
        centered
      />
    </MainScaffold>
  );
}

function AddBookScreen({ navigate, openMenu }) {
  return (
    <MainScaffold active="add" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.addTitle}>Adicionar à Coleção</Text>
      <Text style={styles.addSubtitle}>
        Compartilhe sua jornada literária. Preencha os detalhes do manuscrito para que ele encontre seu próximo
        curador no ecossistema NextBook.
      </Text>

      <View style={styles.uploadCoverLarge}>
        <Feather name="camera" size={34} color={colors.muted} />
        <Text style={styles.uploadLabel}>CAPA DO LIVRO</Text>
      </View>

      <View style={styles.softPanel}>
        <Text style={styles.formLabel}>ESTADO DO LIVRO</Text>
        <View style={styles.segmented}>
          <TouchableOpacity style={[styles.segment, styles.segmentActive]}>
            <Text style={styles.segmentActiveText}>NOVO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.segment}>
            <Text style={styles.segmentText}>USADO</Text>
          </TouchableOpacity>
        </View>
        <SelectField label="FORMA DE NEGOCIAÇÃO" value="Venda" />
        <Field label="VALOR SUGERIDO (R$)" placeholder="0,00" />
      </View>

      <View style={styles.deepFormPanel}>
        <Field label="NOME DO LIVRO" placeholder="Ex: O Alquimista" />
        <Field label="AUTOR" placeholder="Paulo Coelho" />
        <Field label="EDITORA" placeholder="Companhia das Letras" />
        <SelectField label="GÊNERO" value="Ficção Literária" />
        <Field label="Nº DE PÁGINAS" placeholder="208" />
        <Field label="BREVE RESUMO / SINOPSE" placeholder="Uma breve introdução à obra..." multiline height={95} />
        <Field
          label="DESCRIÇÃO DA UNIDADE"
          placeholder="Descreva o estado físico, dedicatórias ou detalhes específicos do seu exemplar..."
          multiline
          height={132}
        />
        <View style={styles.alignRight}>
          <TouchableOpacity style={styles.formSubmitButton}>
            <Text style={styles.formSubmitText}>ANUNCIAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </MainScaffold>
  );
}

function ReviewScreen({ navigate, openMenu }) {
  return (
    <MainScaffold active="review" navigate={navigate} openMenu={openMenu} headerSearch={false}>
      <Text style={styles.reviewEyebrow}>CURADORIA LITERÁRIA</Text>
      <Text style={styles.reviewTitle}>Avaliar Nova Leitura</Text>
      <Text style={styles.reviewSubtitle}>
        Sua perspectiva enriquece nossa comunidade. Compartilhe suas impressões sobre a obra e ajude outros
        bibliófilos em suas escolhas.
      </Text>

      <View style={styles.reviewUpload}>
        <View style={styles.reviewBookCover}>
          <View style={styles.reviewBookShape} />
        </View>
        <Text style={styles.uploadLabelStrong}>CAPA DA OBRA</Text>
        <Text style={styles.uploadHint}>Formatos suportados: JPG, PNG</Text>
      </View>

      <View style={styles.softPanel}>
        <Text style={styles.panelHeading}>METADADOS</Text>
        <Field label="EDITORA" placeholder="Ex: Companhia das Letras" />
        <SelectField label="GÊNERO" value="Ficção Literária" />
      </View>

      <View style={styles.reviewFormPanel}>
        <OutlineField label="NOME DO LIVRO" placeholder="Título completo da obra" />
        <OutlineField label="AUTOR(A)" placeholder="Nome do autor" />
        <Text style={styles.ratingLabel}>SUA AVALIAÇÃO</Text>
        <View style={styles.starsRow}>
          {[0, 1, 2, 3].map((item) => (
            <FontAwesome key={item} name="star" size={37} color={colors.brownDark} />
          ))}
          <FontAwesome name="star-o" size={37} color="#d9c9c2" />
        </View>
        <OutlineField
          label="SUA OPINIÃO"
          placeholder="O que achou da narrativa? Como foi a experiência de leitura?"
          multiline
          height={278}
        />
        <TouchableOpacity style={[styles.formSubmitButton, styles.centerSubmit]}>
          <Text style={styles.formSubmitText}>PUBLICAR AVALIAÇÃO</Text>
        </TouchableOpacity>
      </View>
    </MainScaffold>
  );
}

function BookDetailsScreen({ navigate, openMenu }) {
  return (
    <MainScaffold active="details" navigate={navigate} openMenu={openMenu} library headerProfile={false}>
      <View style={styles.detailCoverFrame}>
        <View style={styles.detailCover}>
          <Text style={styles.detailCoverSmall}>TOM ENCONTRO CONJUNTO DE MANDE</Text>
          <Text style={styles.detailCoverTitle}>A SOMBRA DO{'\n'}ALQUIMISTA</Text>
          <View style={styles.detailCoverLines} />
        </View>
      </View>

      <View style={styles.badgesRow}>
        <Pill label="PRIMEIRA EDIÇÃO" />
        <Pill label="CAPA DURA" muted />
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
        <Pill label="Ficção Histórica" />
        <Pill label="Mistério" />
        <Pill label="Renascimento" />
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

      <View style={styles.sellerCard}>
        <Avatar initials="OA" color="#0c1d24" size={56} online />
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
        <TouchableOpacity style={styles.saveButton}>
          <Feather name="bookmark" size={22} color={colors.brown} />
          <Text style={styles.saveButtonText}>Salvar para depois</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Feather name="share-2" size={22} color={colors.brown} />
        </TouchableOpacity>
      </View>
    </MainScaffold>
  );
}

function ChatScreen({ navigate }) {
  return (
    <SafeAreaView style={styles.chatScreen}>
      <KeyboardAvoidingView style={styles.chatKeyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.chatHeader}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigate('community')}>
            <Feather name="arrow-left" size={33} color={colors.brownDark} />
          </TouchableOpacity>
          <Avatar initials="JT" color="#bf7a4e" size={58} online />
          <View style={styles.chatIdentity}>
            <Text style={styles.chatName}>Julian Thorne</Text>
            <Text style={styles.chatRole}>Especialista em Livros Raros</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="phone" size={28} color={colors.brownDark} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Entypo name="dots-three-vertical" size={23} color={colors.brownDark} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
          <View style={styles.chatListing}>
            <View style={styles.chatThumb}>
              <Text style={styles.chatThumbText}>1ª ED.</Text>
            </View>
            <View style={styles.chatListingText}>
              <Text style={styles.chatListingTitle}>O Alquimista (1ª Ed. 1988)</Text>
              <Text style={styles.chatListingMeta}>R$ 2.450,00 • Oferta Pendente</Text>
            </View>
            <TouchableOpacity style={styles.adButton} onPress={() => navigate('details')}>
              <Text style={styles.adButtonText}>Ver Anúncio</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.dateChip}>24 DE OUTUBRO DE 2023</Text>

          <Message incoming time="10:15">
            Olá! Vi seu interesse na primeira edição de O Alquimista. É um exemplar verdadeiramente notável, com
            oxidação mínima nas guardas.
          </Message>
          <Message time="10:18">
            Obrigado pelo contato, Julian. As fotos parecem excelentes. Notei uma pequena marca na lombada — é um
            rasgo ou apenas um desgaste superficial?
          </Message>
          <Message incoming time="10:20">
            Bem observado! Na verdade, é apenas um desgaste superficial bem pequeno no couro. Subi uma foto macro
            dessa área específica na galeria do anúncio, caso queira ver melhor. Não chegou a romper a pele.
          </Message>
          <Message time="10:22">
            Perfeito, isso tranquiliza. Estou disposto a pagar o valor pedido se você puder incluir o frete com seguro
            para São Paulo. O que acha?
          </Message>
        </ScrollView>

        <View style={styles.typingLine}>
          <View style={styles.typingDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.typingText}>Julian está digitando...</Text>
        </View>

        <View style={styles.messageBar}>
          <TouchableOpacity style={styles.addMessageButton}>
            <Feather name="plus" size={33} color={colors.brown} />
          </TouchableOpacity>
          <View style={styles.messageInputWrap}>
            <TextInput style={styles.messageInput} placeholder="Escreva sua mensagem..." placeholderTextColor="#b8aea9" />
            <Feather name="smile" size={30} color={colors.muted} />
          </View>
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function AuthInput({ label, rightLabel, placeholder, icon, compact, secureTextEntry }) {
  return (
    <View style={[styles.authInputGroup, compact && styles.authInputCompact]}>
      <View style={styles.authLabelRow}>
        <Text style={styles.authLabel}>{label}</Text>
        {rightLabel && <Text style={styles.authRightLabel}>{rightLabel}</Text>}
      </View>
      <View style={[styles.authInputBox, compact && styles.authInputBoxCompact]}>
        <TextInput
          style={[styles.authTextInput, compact && styles.authTextInputCompact]}
          placeholder={placeholder}
          placeholderTextColor="#918881"
          secureTextEntry={secureTextEntry}
        />
        {icon}
      </View>
    </View>
  );
}

function CheckLine({ label, children, large = false }) {
  return (
    <View style={styles.checkLine}>
      <View style={[styles.checkbox, large && styles.checkboxLarge]} />
      {children || <Text style={[styles.checkText, large && styles.checkTextLarge]}>{label}</Text>}
    </View>
  );
}

function DividerLabel({ label }) {
  return (
    <View style={styles.dividerWrap}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

function PrimaryButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      {icon && <View style={styles.primaryIcon}>{icon}</View>}
    </TouchableOpacity>
  );
}

function Pill({ label, active, muted }) {
  return (
    <View style={[styles.pill, active && styles.pillActive, muted && styles.pillMuted]}>
      <Text style={[styles.pillText, active && styles.pillActiveText]}>{label}</Text>
    </View>
  );
}

function Field({ label, placeholder, multiline, height }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldMultiline, height ? { height } : null]}
        placeholder={placeholder}
        placeholderTextColor="#8c96a3"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function SelectField({ label, value }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.formLabel}>{label}</Text>
      <View style={styles.selectInput}>
        <Text style={styles.selectText}>{value}</Text>
        <Feather name="chevron-down" size={20} color="#87909b" />
      </View>
    </View>
  );
}

function OutlineField({ label, placeholder, multiline, height }) {
  return (
    <View style={styles.outlineGroup}>
      <Text style={styles.outlineLabel}>{label}</Text>
      <TextInput
        style={[styles.outlineInput, multiline && styles.outlineMultiline, height ? { height } : null]}
        placeholder={placeholder}
        placeholderTextColor="#d7c7c1"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function Avatar({ initials, color, size = 48, online = false }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}>
      <Text style={[styles.avatarText, { fontSize: size > 54 ? 16 : 14 }]}>{initials}</Text>
      {online && <View style={styles.onlineDot} />}
    </View>
  );
}

function BookListCard({ title, author, description, badge, action, color, portrait }) {
  return (
    <View style={styles.listBookCard}>
      <View style={[styles.listBookImage, { backgroundColor: color }]}>
        {portrait === 'sea' ? <View style={styles.seaLine} /> : <View style={styles.sageFace} />}
      </View>
      <View style={styles.listBookHeader}>
        <View>
          <Text style={styles.listBookTitle}>{title}</Text>
          <Text style={styles.listBookAuthor}>{author}</Text>
        </View>
        <Feather name="bookmark" size={22} color={colors.muted} />
      </View>
      <Text style={styles.listDescription}>{description}</Text>
      <View style={styles.listBookFooter}>
        <View style={styles.badgeLine}>
          <View style={[styles.tinyDot, badge === 'VENDEDOR PREMIUM' && styles.redDot]} />
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
        <Text style={styles.actionText}>{action}</Text>
      </View>
    </View>
  );
}

function PostCard({ avatar, name, meta, text, imageType, badge, quote, likes, comments, action, accent, centered }) {
  return (
    <View style={[styles.postCard, accent && styles.postAccent]}>
      <View style={styles.postHeader}>
        <Avatar initials={avatar} color={avatar === 'BO' ? '#944d2e' : avatar === 'RS' ? '#77a568' : '#a06a52'} />
        <View style={styles.postIdentity}>
          <Text style={styles.postName}>{name}</Text>
          <Text style={styles.postMeta}>{meta}</Text>
        </View>
        {badge ? (
          <View style={styles.postBadge}>
            <Text style={styles.postBadgeText}>{badge}</Text>
          </View>
        ) : (
          <Entypo name="dots-three-horizontal" size={20} color={colors.muted} />
        )}
      </View>

      {quote ? (
        <View style={styles.quoteBox}>
          <Text style={styles.quoteLabel}>INTERESSE EM TROCA</Text>
          <Text style={styles.postText}>{text}</Text>
        </View>
      ) : (
        <Text style={[styles.postText, centered && styles.centeredPost]}>{text}</Text>
      )}

      {imageType === 'openBook' && (
        <View style={styles.postImage}>
          <View style={styles.openBook}>
            <View style={styles.pageLeft} />
            <View style={styles.pageRight} />
          </View>
          <View style={styles.coffeeCup} />
        </View>
      )}

      <View style={styles.postFooter}>
        <View style={styles.postStats}>
          <FontAwesome name={likes === '124' ? 'heart' : 'heart-o'} size={23} color={likes === '124' ? colors.brown : colors.muted} />
          <Text style={styles.statText}>{likes}</Text>
          <Feather name="message-square" size={24} color={colors.muted} />
          <Text style={styles.statText}>{comments}</Text>
        </View>
        {action ? (
          <TouchableOpacity style={styles.interestButton}>
            <Text style={styles.interestText}>{action}</Text>
          </TouchableOpacity>
        ) : (
          <Feather name={centered ? 'share-2' : 'bookmark'} size={23} color={colors.muted} />
        )}
      </View>
    </View>
  );
}

function Message({ incoming = false, time, children }) {
  return (
    <View style={[styles.messageWrap, incoming ? styles.incomingWrap : styles.outgoingWrap]}>
      <View style={[styles.messageBubble, incoming ? styles.incomingBubble : styles.outgoingBubble]}>
        <Text style={[styles.messageText, !incoming && styles.outgoingText]}>{children}</Text>
      </View>
      <Text style={[styles.messageTime, !incoming && styles.outgoingTime]}>{time}{!incoming ? '  ✓✓' : ''}</Text>
    </View>
  );
}

const shadow = {
  shadowColor: '#6b4935',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 14,
  elevation: 4,
};

const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  libraryScreen: {
    backgroundColor: colors.library,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingBottom: 112,
  },
  header: {
    height: 74,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0e6da',
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
  },
  libraryHeader: {
    backgroundColor: colors.library,
    borderBottomColor: '#e1d7aa',
  },
  headerIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    marginLeft: 14,
    color: colors.brownDark,
    fontSize: 21,
    fontWeight: '800',
  },
  headerActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    paddingTop: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: '#f0e6db',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  libraryBottomNav: {
    backgroundColor: '#fffde9',
    borderTopColor: '#e3dba7',
  },
  tabItem: {
    minWidth: 58,
    height: 57,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    gap: 4,
  },
  tabActive: {
    backgroundColor: '#f8eedc',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 20,
    justifyContent: 'flex-start',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35, 27, 22, 0.26)',
  },
  menuPanel: {
    marginTop: 58,
    marginLeft: 18,
    width: 246,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.white,
    ...shadow,
  },
  menuTitle: {
    color: colors.brownDark,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
  menuItem: {
    height: 42,
    borderBottomWidth: 1,
    borderBottomColor: '#f1e8dd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '600',
  },
  authScreen: {
    flex: 1,
    backgroundColor: colors.library,
  },
  authScreenLight: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginContent: {
    minHeight: '100%',
    paddingHorizontal: 24,
    paddingTop: 42,
    paddingBottom: 44,
  },
  registerContent: {
    minHeight: '100%',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 52,
  },
  nextLogo: {
    alignSelf: 'center',
    width: 260,
    height: 172,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: '#756150',
    fontSize: 58,
    lineHeight: 58,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(74, 55, 43, 0.28)',
    textShadowOffset: { width: 3, height: 5 },
    textShadowRadius: 6,
  },
  logoOwl: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  loginTitle: {
    color: colors.ink,
    fontSize: 34,
    lineHeight: 42,
    textAlign: 'center',
    marginTop: 14,
  },
  loginSubtitle: {
    color: '#5f5751',
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 44,
  },
  registerIcon: {
    alignSelf: 'center',
    marginBottom: 26,
  },
  registerTitle: {
    color: colors.ink,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    textAlign: 'center',
  },
  registerSubtitle: {
    color: colors.muted,
    fontSize: 21,
    lineHeight: 32,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 52,
  },
  authInputGroup: {
    marginBottom: 30,
  },
  authInputCompact: {
    marginBottom: 24,
  },
  authLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  authLabel: {
    color: '#7c716c',
    fontSize: 16,
    letterSpacing: 3,
  },
  authRightLabel: {
    color: colors.brownDark,
    fontSize: 16,
    letterSpacing: 3,
    fontWeight: '800',
  },
  authInputBox: {
    minHeight: 72,
    backgroundColor: colors.white,
    borderBottomWidth: 4,
    borderBottomColor: '#eee6df',
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authInputBoxCompact: {
    minHeight: 66,
    borderBottomWidth: 0,
    borderRadius: 7,
    backgroundColor: colors.paperStrong,
  },
  authTextInput: {
    flex: 1,
    minHeight: 60,
    color: colors.ink,
    fontSize: 24,
  },
  authTextInputCompact: {
    fontSize: 22,
  },
  checkLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginTop: 6,
    marginBottom: 30,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: colors.paperStrong,
  },
  checkboxLarge: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#d8c9c1',
  },
  checkText: {
    flex: 1,
    color: '#534b46',
    fontSize: 20,
    lineHeight: 30,
  },
  checkTextLarge: {
    fontSize: 19,
  },
  underlined: {
    color: colors.brownDark,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    minHeight: 74,
    borderRadius: 10,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 14,
    ...shadow,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 4,
  },
  primaryIcon: {
    marginTop: 3,
  },
  authLink: {
    alignItems: 'center',
    paddingVertical: 46,
  },
  authLinkText: {
    color: '#5c544f',
    fontSize: 20,
    textAlign: 'center',
  },
  authLinkStrong: {
    color: colors.brownDark,
    fontWeight: '700',
  },
  dividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ebe3d7',
  },
  dividerText: {
    color: '#a99d95',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 36,
  },
  socialButton: {
    flex: 1,
    minHeight: 76,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#f0ead7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    backgroundColor: '#ffffef',
  },
  googleMark: {
    width: 36,
    height: 36,
    backgroundColor: '#2d2d3a',
  },
  socialText: {
    color: colors.ink,
    fontSize: 22,
  },
  authFooter: {
    alignItems: 'center',
    marginTop: 78,
    gap: 18,
  },
  authFooterBrand: {
    color: '#c4b49f',
    fontSize: 26,
  },
  authFooterCopy: {
    color: '#b6ada0',
    fontSize: 15,
    letterSpacing: 3,
  },
  discoverTopLine: {
    width: 116,
    height: 3,
    backgroundColor: colors.brown,
    marginLeft: -28,
    marginBottom: 14,
  },
  discoverTitle: {
    color: colors.ink,
    fontSize: 31,
    lineHeight: 39,
    marginBottom: 24,
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
    paddingBottom: 30,
  },
  pill: {
    borderRadius: 23,
    backgroundColor: '#ecd3ab',
    paddingVertical: 9,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  pillActive: {
    backgroundColor: colors.brown,
  },
  pillMuted: {
    backgroundColor: '#e8e7ce',
  },
  pillText: {
    color: colors.brownDark,
    fontSize: 14,
    fontWeight: '800',
  },
  pillActiveText: {
    color: colors.white,
  },
  featureBookCard: {
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: '#ffffed',
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
    color: '#dfc58d',
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
    borderTopColor: '#efead7',
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
  listBookCard: {
    backgroundColor: colors.white,
    borderRadius: 7,
    padding: 14,
    marginBottom: 28,
  },
  listBookImage: {
    height: 196,
    marginBottom: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seaLine: {
    width: '120%',
    height: 76,
    borderTopWidth: 2,
    borderTopColor: '#5a6f73',
    borderBottomWidth: 2,
    borderBottomColor: '#5a6f73',
    transform: [{ rotate: '-5deg' }],
  },
  sageFace: {
    width: 98,
    height: 138,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#d0bea2',
    backgroundColor: '#6d5846',
  },
  listBookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  listBookTitle: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '800',
  },
  listBookAuthor: {
    color: '#6f6761',
    fontSize: 14,
    marginTop: 2,
  },
  listDescription: {
    color: '#6d645e',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  listBookFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  badgeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tinyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#836f48',
  },
  redDot: {
    backgroundColor: colors.red,
  },
  badgeText: {
    color: '#6d625c',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  actionText: {
    color: colors.brown,
    fontSize: 16,
    fontWeight: '900',
  },
  curatedCard: {
    borderRadius: 9,
    backgroundColor: '#ededcf',
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
    color: '#9b7a63',
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
    borderColor: '#d5c599',
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
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  pageTitle: {
    color: colors.ink,
    fontSize: 33,
    lineHeight: 40,
    marginTop: 28,
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
    gap: 18,
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 18,
    marginBottom: 34,
  },
  composerContent: {
    flex: 1,
  },
  composerInput: {
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
    justifyContent: 'space-between',
    marginTop: 18,
  },
  composerTools: {
    flexDirection: 'row',
    gap: 22,
  },
  smallBrownButton: {
    backgroundColor: colors.brown,
    borderRadius: 6,
    paddingHorizontal: 28,
    paddingVertical: 13,
  },
  smallBrownButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '900',
    letterSpacing: 1,
  },
  onlineDot: {
    position: 'absolute',
    right: -2,
    bottom: 1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.green,
    borderWidth: 2,
    borderColor: colors.white,
  },
  postCard: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 24,
    marginBottom: 30,
  },
  postAccent: {
    borderLeftWidth: 4,
    borderLeftColor: colors.brown,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  postIdentity: {
    flex: 1,
  },
  postName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  postMeta: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    marginTop: 3,
  },
  postBadge: {
    backgroundColor: '#f3cec7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 2,
  },
  postBadgeText: {
    color: colors.brown,
    fontSize: 10,
    fontWeight: '800',
  },
  postText: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 29,
  },
  centeredPost: {
    textAlign: 'center',
    fontSize: 22,
    lineHeight: 30,
    paddingVertical: 34,
  },
  quoteBox: {
    backgroundColor: colors.paperStrong,
    padding: 18,
    borderRadius: 4,
  },
  quoteLabel: {
    color: colors.brown,
    fontSize: 15,
    letterSpacing: 1,
    marginBottom: 8,
  },
  postImage: {
    height: 196,
    backgroundColor: '#815b38',
    marginTop: 22,
    borderRadius: 3,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  openBook: {
    width: 170,
    height: 120,
    backgroundColor: '#f4ead6',
    borderRadius: 3,
    flexDirection: 'row',
    padding: 10,
  },
  pageLeft: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#d2c5ad',
    backgroundColor: '#fff8e9',
  },
  pageRight: {
    flex: 1,
    backgroundColor: '#fff8e9',
  },
  coffeeCup: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#28251f',
    borderWidth: 12,
    borderColor: '#ece1d1',
  },
  postFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eadfcc',
    marginTop: 24,
    paddingTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    color: '#756b65',
    fontWeight: '800',
    marginRight: 10,
  },
  interestButton: {
    backgroundColor: colors.brown,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 3,
  },
  interestText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
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
  uploadCoverLarge: {
    height: 434,
    borderRadius: 7,
    backgroundColor: colors.paperStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  uploadLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 8,
  },
  uploadLabelStrong: {
    color: colors.brown,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 24,
  },
  uploadHint: {
    color: colors.softText,
    fontSize: 13,
    marginTop: 8,
  },
  softPanel: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 22,
    marginBottom: 40,
  },
  panelHeading: {
    color: colors.brown,
    fontSize: 18,
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  formLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 10,
  },
  segmented: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    height: 42,
    borderRadius: 5,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.brown,
  },
  segmentText: {
    color: colors.ink,
    fontWeight: '900',
  },
  segmentActiveText: {
    color: colors.white,
    fontWeight: '900',
  },
  deepFormPanel: {
    backgroundColor: colors.paper,
    borderRadius: 8,
    padding: 30,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldInput: {
    minHeight: 46,
    borderRadius: 6,
    backgroundColor: colors.paperStrong,
    color: colors.ink,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  fieldMultiline: {
    paddingTop: 15,
    lineHeight: 22,
  },
  selectInput: {
    minHeight: 47,
    borderRadius: 6,
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: colors.ink,
    fontSize: 16,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  formSubmitButton: {
    minHeight: 54,
    minWidth: 156,
    borderRadius: 6,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    ...shadow,
  },
  formSubmitText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
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
  reviewFormPanel: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: '#eee4d8',
    borderRadius: 8,
    padding: 34,
    marginBottom: 10,
  },
  outlineGroup: {
    marginBottom: 28,
  },
  outlineLabel: {
    color: colors.brown,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  outlineInput: {
    minHeight: 51,
    borderWidth: 1,
    borderColor: '#eadfce',
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 20,
    paddingHorizontal: 14,
  },
  outlineMultiline: {
    backgroundColor: '#fff9ef',
    paddingTop: 28,
    lineHeight: 27,
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
  centerSubmit: {
    alignSelf: 'center',
    minWidth: 220,
    marginTop: 26,
  },
  detailCoverFrame: {
    backgroundColor: colors.white,
    padding: 36,
    marginTop: 36,
    marginBottom: 26,
  },
  detailCover: {
    height: 374,
    backgroundColor: '#0d6064',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  detailCoverSmall: {
    color: '#afcbc8',
    fontSize: 9,
    letterSpacing: 2,
    position: 'absolute',
    top: 35,
  },
  detailCoverTitle: {
    color: '#a9d3d1',
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
    backgroundColor: '#78a8a7',
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
    backgroundColor: '#f0f1d5',
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
    ...shadow,
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
    borderColor: '#ebe5ca',
    backgroundColor: '#ffffed',
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
    borderColor: '#ebe5ca',
    backgroundColor: '#ffffed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScreen: {
    flex: 1,
    backgroundColor: colors.library,
  },
  chatKeyboard: {
    flex: 1,
  },
  chatHeader: {
    height: 86,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e4dec6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatIdentity: {
    flex: 1,
  },
  chatName: {
    color: colors.brownDark,
    fontSize: 27,
    fontWeight: '900',
  },
  chatRole: {
    color: '#665b55',
    fontSize: 19,
    lineHeight: 25,
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 28,
    paddingBottom: 32,
  },
  chatListing: {
    backgroundColor: '#fbfbdf',
    borderRadius: 20,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 68,
    ...shadow,
  },
  chatThumb: {
    width: 88,
    height: 82,
    borderRadius: 4,
    backgroundColor: '#6b3b24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatThumbText: {
    color: '#e7c291',
    fontSize: 13,
    fontWeight: '900',
  },
  chatListingText: {
    flex: 1,
  },
  chatListingTitle: {
    color: colors.brownDark,
    fontSize: 18,
    lineHeight: 25,
  },
  chatListingMeta: {
    color: '#5f5751',
    fontSize: 16,
    lineHeight: 22,
  },
  adButton: {
    borderRadius: 30,
    backgroundColor: colors.peach,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  adButtonText: {
    color: colors.brown,
    fontSize: 17,
    fontWeight: '900',
  },
  dateChip: {
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#e7e5cb',
    color: '#5d5550',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    paddingHorizontal: 28,
    paddingVertical: 9,
    marginBottom: 58,
  },
  messageWrap: {
    marginBottom: 42,
    maxWidth: '86%',
  },
  incomingWrap: {
    alignSelf: 'flex-start',
  },
  outgoingWrap: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingVertical: 26,
  },
  incomingBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 0,
  },
  outgoingBubble: {
    backgroundColor: colors.brown,
    borderBottomRightRadius: 0,
  },
  messageText: {
    color: colors.ink,
    fontSize: 23,
    lineHeight: 36,
  },
  outgoingText: {
    color: colors.white,
  },
  messageTime: {
    color: '#695f59',
    fontSize: 16,
    marginTop: 8,
    marginLeft: 14,
  },
  outgoingTime: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  typingLine: {
    height: 34,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 7,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c6bda6',
  },
  typingText: {
    color: '#5b534d',
    fontSize: 15,
    fontWeight: '800',
  },
  messageBar: {
    minHeight: 96,
    borderTopWidth: 1,
    borderTopColor: '#e7dfc5',
    paddingHorizontal: 28,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  addMessageButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eeedd3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInputWrap: {
    flex: 1,
    minHeight: 60,
    borderRadius: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  messageInput: {
    flex: 1,
    color: colors.ink,
    fontSize: 20,
  },
  sendButton: {
    width: 72,
    height: 72,
    borderRadius: 15,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
