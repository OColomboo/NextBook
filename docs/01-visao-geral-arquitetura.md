# NextBook - Visao geral e arquitetura

Este documento descreve a estrutura geral do projeto clonado de `https://github.com/OColomboo/NextBook`.

## Resumo do app

NextBook e um aplicativo React Native com Expo para uma comunidade literaria. O app permite:

- cadastrar e autenticar usuarios com Firebase Authentication;
- anunciar livros para venda ou troca;
- descobrir anuncios de outros usuarios;
- salvar anuncios na estante;
- publicar avaliacoes/reviews de livros;
- curtir, salvar e comentar reviews;
- abrir chats entre comprador/interessado e vendedor;
- enviar mensagens de texto e imagens no chat;
- marcar anuncios proprios como vendidos/trocados;
- bloquear ou denunciar usuarios.

Apesar do nome do repositorio, o projeto nao e Next.js. Ele e um app Expo/React Native.

## Stack

Arquivo principal: `package.json`.

- Runtime/app: Expo `^55.0.23`
- UI: React `19.2.0`, React Native `0.83.6`, React Native Web `^0.21.0`
- Icones: `@expo/vector-icons`
- Imagens/camera/galeria: `expo-image-picker`
- Firebase: `firebase ^12.13.0`
- Entrada configurada: `index.js` -> `App.js` -> `src/AppRoot.js`

Scripts disponiveis:

```bash
npm start
npm run android
npm run ios
npm run web
```

## Estrutura de pastas

```text
NextBook/
  App.js
  index.js
  app.json
  package.json
  assets/
  src/
    AppRoot.js
    firebaseConfig.js
    screens/
    components/
    services/
    utils/
    theme/
    constants/
  docs/
```

Responsabilidades principais:

- `src/AppRoot.js`: controla a navegacao manual entre telas e injeta props compartilhadas.
- `src/firebaseConfig.js`: inicializa o app Firebase.
- `src/screens/`: telas completas do aplicativo.
- `src/components/`: componentes reutilizaveis e servicos de dominio.
- `src/services/BookApiService.js`: consulta metadados de livros por ISBN em APIs externas.
- `src/utils/`: filtros e compartilhamento de anuncios.
- `src/theme/`: cores, sombras e metricas responsivas.
- `src/constants/`: itens do menu lateral.

## Entrada da aplicacao

`App.js` apenas reexporta o App principal:

```js
export { default } from './src/AppRoot';
```

`src/AppRoot.js` contem:

- `ResponsiveLayoutProvider`: envolve toda a aplicacao com metricas responsivas.
- `AppContent`: guarda o estado da tela ativa em `screen`.
- `routeParams`: objeto usado para passar parametros entre telas.
- `menuOpen`: controla o menu lateral.
- `navigate(nextScreen, params)`: troca a tela, troca parametros e fecha o menu.

A navegacao e manual. Nao ha React Navigation. Cada tela e renderizada condicionalmente:

```text
login              -> LoginScreen
register           -> RegisterScreen
discover           -> DiscoverBooksScreen
community          -> CommunityFeedScreen
add                -> AddBookListingScreen
review             -> BookReviewScreen
details            -> BookDetailsScreen
bookDetail         -> BookListingDetailScreen
chat               -> ChatListScreen
chatConversation   -> ChatConversationScreen
```

## Props compartilhadas entre telas

`AppRoot` passa para praticamente todas as telas:

- `navigate(screen, params)`: troca a tela atual.
- `openMenu()`: abre o menu lateral.
- `routeParams`: parametros da tela atual.

Exemplos:

- `navigate('bookDetail', { book })` abre o detalhe de um anuncio.
- `navigate('add', { listingId })` abre a tela de anuncio em modo edicao.
- `navigate('review', { reviewId })` abre review em modo edicao.
- `navigate('chatConversation', { chatId })` abre uma conversa.

## Layout base

O layout comum das telas autenticadas fica em `src/components/layout/MainScreenScaffold.js`.

Ele monta:

- `SafeAreaView` como raiz;
- `AppHeaderBar` no topo;
- `ScrollView` com padding responsivo;
- `overlay`, usado por modais/menus;
- `BottomTabBar` fixa no rodape.

### `AppHeaderBar`

Arquivo: `src/components/layout/AppHeaderBar.js`

Mostra:

- botao de menu lateral;
- texto da marca `NextBook`;
- botao de busca, quando `showSearch` e verdadeiro.

O botao de busca navega para `discover`.

### `BottomTabBar`

Arquivo: `src/components/layout/BottomTabBar.js`

Abas:

- `discover`: Descobrir
- `community`: Comunidade
- `add`: Anunciar
- `chat`: Chat
- `details`: Estante

O estado ativo vem pela prop `active`. A tela `review` tambem destaca a aba `add`.

### `NavigationDrawerMenu`

Arquivo: `src/components/navigation/NavigationDrawerMenu.js`

E um menu lateral simples usado como atalho para telas. Os itens vem de `src/constants/screenDrawerMenuItems.js`.

Observacao: como o menu e de prototipo, ele permite ir para telas como `bookDetail` sem parametros. Essa tela lida com esse caso mostrando "Anuncio nao encontrado".

## Responsividade

Arquivo: `src/theme/ResponsiveLayoutContext.js`.

O provider calcula metricas com base em `useWindowDimensions()`:

- `isCompact`: largura menor que 360;
- `isTablet`: largura maior ou igual a 720;
- `gutter` e `gutterContent`;
- `headerHorizontalPadding`;
- `bottomTabBarHeight`;
- `bottomScrollPadding`;
- tamanhos de icones de abas;
- `webContainerMaxWidth`: 480.

No web, `AppRoot` aplica um frame maximo de 480px quando a tela e mais larga, simulando uma largura de telefone.

## Tema visual

Arquivos:

- `src/theme/appColors.js`
- `src/theme/cardShadow.js`

`appColors.js` centraliza a paleta usada por praticamente todos os componentes. `cardShadow.js` concentra sombra/elevacao para cards, botoes e paineis.

## Componentes principais

### Autenticacao

Arquivo: `src/components/auth/AuthFormControls.js`

Componentes:

- `AuthInputField`: campo com label, placeholder, icone opcional e suporte a senha.
- `AuthCheckboxRow`: linha de checkbox visual.
- `AuthDividerLabel`: divisor com texto central.
- `AuthPrimaryButton`: botao principal.

### Formularios

Arquivo: `src/components/forms/FormFields.js`

Componentes:

- `FormField`: input padrao, inclusive multiline.
- `FormSelectField`: seletor simples por lista de opcoes.
- `FormOutlineField`: input com borda/estilo alternativo.
- `formStyles`: estilos compartilhados entre formularios de anuncio e review.

### Livros/anuncios

Arquivos:

- `src/components/books/BookListCard.js`: card usado em listas horizontais/verticais de anuncios.
- `src/components/books/GenrePillTag.js`: etiqueta visual para genero, status, preco, condicao etc.
- `src/components/books/ListingService.js`: operacoes de banco para anuncios e salvos.

### Comunidade

Arquivos:

- `src/components/community/CommunityPostCard.js`: card de review.
- `src/components/community/ReviewCommentsModal.js`: modal de comentarios.
- `src/components/community/ReviewService.js`: operacoes de banco para reviews, likes, salvos e comentarios.
- `src/components/community/UserAvatar.js`: avatar por iniciais.

### Chat

Arquivos:

- `src/components/chat/ChatService.js`: operacoes de banco, mensagens, anexos, bloqueio e denuncia.
- `src/components/chat/ChatMessageBubble.js`: bolha de mensagem de texto ou imagem.
- `src/components/chat/ChatActionsMenu.js`: menu inferior de acoes.
- `src/components/chat/ChatUserProfileModal.js`: modal com dados basicos do outro usuario.

## Configuracao Expo

Arquivo: `app.json`.

Pontos relevantes:

- nome e slug: `NextBook`;
- orientacao: portrait;
- tema claro;
- Android: `softwareKeyboardLayoutMode: resize`, `edgeToEdgeEnabled: true`;
- iOS: suporta tablet;
- web: favicon em `assets/favicon.png`;
- plugin `expo-font`.

## Observacoes importantes

- Nao ha arquivo `.env` no projeto.
- As credenciais de Firebase estao hardcoded em `src/firebaseConfig.js`.
- Nao ha regras de Firebase Database/Storage versionadas no repositorio.
- Nao ha testes automatizados no repositorio.
- A autorizacao de edicao/exclusao e checada no client em varios fluxos, mas a protecao real precisa existir nas regras do Firebase.
