# NextBook - Rotas, telas e fluxos do app

Este documento mapeia onde cada tela esta, como e acessada e quais funcoes principais executa.

## Mapa de telas

| Chave interna | Arquivo | Funcao/tela |
| --- | --- | --- |
| `login` | `src/screens/LoginScreen.js` | Login com email e senha |
| `register` | `src/screens/RegisterScreen.js` | Cadastro de usuario |
| `discover` | `src/screens/DiscoverBooksScreen.js` | Feed de anuncios |
| `community` | `src/screens/CommunityFeedScreen.js` | Feed de reviews |
| `add` | `src/screens/AddBookListingScreen.js` | Criar/editar anuncio |
| `review` | `src/screens/BookReviewScreen.js` | Criar/editar review |
| `details` | `src/screens/BookDetailsScreen.js` | Estante do usuario |
| `bookDetail` | `src/screens/BookListingDetailScreen.js` | Detalhe de anuncio |
| `chat` | `src/screens/ChatListScreen.js` | Lista de conversas |
| `chatConversation` | `src/screens/ChatConversationScreen.js` | Conversa individual |

## Navegacao

A navegacao acontece em `src/AppRoot.js` por estado local:

- `screen`: nome da tela atual.
- `routeParams`: parametros da tela atual.
- `navigate(nextScreen, params = {})`: troca a tela e substitui parametros.

Nao existe historico de navegacao nem pilha. O botao "voltar" precisa chamar explicitamente `navigate(...)`.

## `LoginScreen`

Arquivo: `src/screens/LoginScreen.js`.

Responsabilidade: autenticar usuario existente.

Estado local:

- `email`
- `senha`

Funcao principal:

- `login()`
  - chama `signInWithEmailAndPassword(auth, email, senha)`;
  - em sucesso navega para `discover`;
  - em erro valida campos vazios e codigos Firebase como `auth/invalid-email` e `auth/invalid-credential`;
  - mostra mensagens por `alert`.

Observacoes:

- Os botoes Google/Facebook aparecem na UI, mas nao possuem fluxo de OAuth implementado.
- O link de cadastro chama `navigate('register')`.

## `RegisterScreen`

Arquivo: `src/screens/RegisterScreen.js`.

Responsabilidade: criar conta de usuario e gravar perfil basico.

Estado local:

- `nome`
- `email`
- `telefone`
- `cidade`
- `senha`

Funcao principal:

- `cadastrar()`
  - valida nome, senha e email;
  - cria conta via `createUserWithEmailAndPassword`;
  - atualiza `displayName` com `updateProfile`;
  - grava `usuarios/{uid}` no Realtime Database;
  - em sucesso alerta e volta para `login`.

Dados gravados em `usuarios/{uid}`:

```js
{
  nome,
  email,
  telefone,
  cidade,
  criadoEm: serverTimestamp()
}
```

Observacao: o checkbox de termos e visual; ele nao bloqueia o cadastro se nao estiver marcado.

## `DiscoverBooksScreen`

Arquivo: `src/screens/DiscoverBooksScreen.js`.

Responsabilidade: listar anuncios ativos e permitir busca/filtro/salvar.

Estado local:

- `bookListings`: anuncios carregados de `bookListings`.
- `savedListingIds`: mapa de anuncios salvos pelo usuario atual.
- `searchTerm`: busca textual.
- `genreFilter`: filtro de genero.

Listeners:

- `bookListings`: escuta `bookListings` com `onValue`, converte objeto em array e ordena por `criadoEm` desc.
- `savedListings/{uid}`: escuta salvos do usuario e transforma em mapa `{ [id]: true }`.

Funcoes principais:

- `handleToggleSave(book)`
  - exige usuario logado;
  - usa `toggleSavedListing(user.uid, book, isSaved)`;
  - atualiza estado local otimisticamente.

Filtros:

- `listingMatchesSearch(book, searchTerm)` busca em titulo, autor, descricao, sinopse, usuario, editora, genero e ISBN.
- `listingMatchesGenre(book, genreFilter)` compara genero normalizado.

Ao tocar em um card:

```js
navigate('bookDetail', { book })
```

## `AddBookListingScreen`

Arquivo: `src/screens/AddBookListingScreen.js`.

Responsabilidade: criar ou editar anuncio de livro.

Modo:

- criacao: sem `routeParams.listingId`;
- edicao: com `routeParams.listingId`.

Estado local relevante:

- `condition`: `novo` ou `usado`;
- `dealType`: `venda` ou `troca`;
- `price`;
- `title`;
- `author`;
- `publisher`;
- `pages`;
- `genre`;
- `synopsis`;
- `description`;
- `isbn`;
- `coverImage`;
- `existingImageSource`;
- `coverImageChanged`;
- `loadingListing`;
- `submitting`;
- `fetchingIsbn`.

Funcoes principais:

- `loadListing()`
  - executada no modo edicao;
  - chama `fetchListing(listingId)`;
  - preenche o formulario;
  - se nao encontrar, alerta e volta para `discover`.

- `handleSubmit()`
  - exige usuario logado;
  - valida titulo, autor, descricao e preco quando `dealType === 'venda'`;
  - faz upload de capa se a imagem local foi alterada;
  - monta `payload`;
  - chama `updateListing` em edicao ou `createListing` em criacao;
  - volta para `discover`.

- `handleFetchByIsbn()`
  - chama `fetchBookByIsbn(isbn)`;
  - preenche titulo, autor, editora, paginas, sinopse, genero, ISBN e capa quando retornados.

- `escolherImagem()`
  - pede permissao de galeria;
  - abre `ImagePicker.launchImageLibraryAsync`;
  - salva URI local em `coverImage`.

- `tirarFoto()`
  - pede permissao de camera;
  - abre `ImagePicker.launchCameraAsync`;
  - salva URI local em `coverImage`.

- `uploadCoverImage(userId)`
  - se a imagem ja e URL remota, normaliza `http` para `https`;
  - se e arquivo local, converte para `blob`;
  - envia para `listing-covers/{userId}/{Date.now()}.jpg`;
  - retorna URL publica via `getDownloadURL`.

## `BookListingDetailScreen`

Arquivo: `src/screens/BookListingDetailScreen.js`.

Responsabilidade: mostrar todos os dados de um anuncio, iniciar chat, salvar, compartilhar e marcar como vendido/trocado.

Parametro esperado:

```js
routeParams.book
```

Estado local:

- `isSaved`: se o anuncio esta salvo pelo usuario atual.

Derivados importantes:

- `isOwner`: `user.uid === book.userId`;
- `ownerActionText`: "Marcar como trocado" ou "Marcar como vendido";
- `isNegotiated`: true quando `book.status` existe;
- `metaTags`: geradas por `getListingMetaTags(book)`.

Funcoes principais:

- `handleConversar()`
  - chama `abrirChat(book)`;
  - navega para `chatConversation` com `{ chatId }`.

- `handleToggleSave()`
  - exige usuario logado;
  - chama `toggleSavedListing(user.uid, book, isSaved)`;
  - inverte `isSaved`.

- `handleShare()`
  - chama `shareListing(book)`, que usa `Share.share`.

- `handleMarcarComoVendido()`
  - exige usuario logado e dono do anuncio;
  - define status `trocado` para troca ou `vendido` para venda;
  - grava copia em `negotiatedListings/{uid}/{book.id}`;
  - remove `bookListings/{book.id}`;
  - volta para `discover`.

Comportamento de botoes:

- dono e nao negociado: mostra "Editar anuncio" e "Marcar como vendido/trocado";
- negociado: mostra status desabilitado;
- outro usuario: mostra "Conversar com o vendedor".

## `BookDetailsScreen`

Arquivo: `src/screens/BookDetailsScreen.js`.

Responsabilidade: area "Sua estante", agregando anuncios proprios, salvos, reviews salvas e negociados.

Estado local:

- `filter`: `todos`, `venda`, `troca`, `salvos`, `negociados`;
- `searchTerm`;
- `myListings`;
- `savedListings`;
- `savedReviews`;
- `negotiatedListings`.

Listeners:

- `bookListings`: filtra anuncios cujo `userId` e do usuario atual;
- `savedListings/{uid}`;
- `negotiatedListings/{uid}`;
- `savedReviews/{uid}`.

Funcoes auxiliares internas:

- `mapFirebaseList(value)`: transforma objeto Firebase em array e ordena.
- `getTimestamp(item)`: usa `criadoEm`, `savedAt` ou `negotiatedAt`.
- `isTradeListing(book)`: verifica `dealType === 'troca'`.
- `isSaleListing(book)`: verifica `dealType === 'venda'`.
- `getInitials(name)`: gera iniciais.
- `getActionLabel(book)`: mostra status, TROCA ou preco.
- `reviewMatchesSearch(review, searchTerm)`: busca em campos da review.

Funcoes principais:

- `openBook(book)`: navega para `bookDetail`.
- `handleUnsave(book)`: remove anuncio salvo via `toggleSavedListing(..., true)`.
- `handleUnsaveReview(review)`: remove review salva via `toggleSavedReview(..., true)`.

Secoes exibidas:

- livros anunciados para venda;
- livros para troca;
- anuncios salvos;
- reviews salvas;
- negociados.

## `CommunityFeedScreen`

Arquivo: `src/screens/CommunityFeedScreen.js`.

Responsabilidade: feed de avaliacoes da comunidade.

Estado local:

- `reviews`;
- `savedReviewIds`;
- `commentsModalReview`;
- `menuReview`.

Listeners:

- `reviews`: escuta todas as reviews, transforma em array e ordena por `criadoEm` desc.
- `savedReviews/{uid}`: monta mapa de salvos.

Funcoes principais:

- `handleToggleLike(reviewId)`
  - exige login;
  - chama `toggleLike(reviewId, user.uid)`.

- `handleToggleSaveReview(review)`
  - exige login;
  - chama `toggleSavedReview(user.uid, review, isSaved)`;
  - atualiza mapa local.

- `handleDeleteReview(review)`
  - confirma em `Alert`;
  - chama `deleteReview(review.id, user.uid)`.

Menu de review:

- aparece somente ao selecionar uma review do usuario;
- permite editar (`navigate('review', { reviewId })`) ou excluir.

Comentarios:

- abre `ReviewCommentsModal` com `reviewId` e titulo.

## `BookReviewScreen`

Arquivo: `src/screens/BookReviewScreen.js`.

Responsabilidade: criar ou editar review.

Export relevante:

- `bookGenres`: lista de generos usada tambem pelo formulario de anuncios e pelo servico de ISBN.

Modo:

- criacao: sem `routeParams.reviewId`;
- edicao: com `routeParams.reviewId`.

Estado local:

- `bookname`;
- `author`;
- `publisher`;
- `rating`;
- `reviewText`;
- `coverImage`;
- `existingImageSource`;
- `coverImageChanged`;
- `genre`;
- `loadingReview`;
- `submitting`.

Funcoes principais:

- `loadReview()`
  - busca `fetchReview(reviewId)`;
  - preenche formulario;
  - se nao encontrar, volta para `community`.

- `handleSubmit()`
  - exige usuario logado;
  - valida livro, texto e nota;
  - se imagem mudou, faz upload para Storage;
  - monta payload;
  - chama `updateReview` ou `createReview`;
  - volta para `community`.

- `escolherImagem()` e `tirarFoto()`
  - usam `expo-image-picker` para galeria/camera.

- `uploadCoverImage(userId)`
  - envia para `review-covers/{userId}/{Date.now()}.jpg`;
  - retorna URL via `getDownloadURL`.

## `ReviewCommentsModal`

Arquivo: `src/components/community/ReviewCommentsModal.js`.

Responsabilidade: listar, criar, editar e excluir comentarios de uma review.

Props:

- `visible`;
- `onClose`;
- `reviewId`;
- `reviewTitle`;
- `currentUser`.

Listener:

- `reviews/{reviewId}/comments`: carrega comentarios em tempo real.

Funcoes principais:

- `handleAddComment()`: exige login, chama `addComment`.
- `startEditing(comment)`: entra em modo edicao local.
- `handleSaveEdit()`: chama `updateComment`.
- `handleDeleteComment(commentId)`: confirma e chama `deleteComment`.

## `ChatListScreen`

Arquivo: `src/screens/ChatListScreen.js`.

Responsabilidade: listar conversas do usuario atual.

Estado local:

- `chats`;
- `searchTerm`.

Listener:

- `userChats/{uid}`: escuta preview de conversas do usuario.

Funcoes/derivados:

- `formatChatDate(value)`: mostra hora se for hoje, ou dia/mes se for outro dia.
- `filteredChats`: filtra por nome da pessoa, titulo do anuncio ou ultima mensagem.

Ao tocar em uma conversa:

```js
navigate('chatConversation', { chatId: chat.id })
```

Indicador de nao lida:

- `hasUnread` e verdadeiro quando `chat.unread` existe e `lastSenderId !== user.uid`.

## `ChatConversationScreen`

Arquivo: `src/screens/ChatConversationScreen.js`.

Responsabilidade: conversa individual, anexos, indicador de digitacao e acoes de seguranca.

Parametro esperado:

```js
routeParams.chatId
```

Constantes:

- `TYPING_STALE_MS = 3000`: tempo para considerar digitacao recente.
- `TYPING_DEBOUNCE_MS = 2500`: tempo para limpar digitacao apos parar de escrever.

Estado local:

- `chat`;
- `messages`;
- `messageText`;
- `otherUserTyping`;
- `menuVisible`;
- `profileVisible`;
- `profileLoading`;
- `profileData`;
- `sendingAttachment`;
- `loadingListing`;
- `listingDetails`.

Listeners:

- `chats/{chatId}`: dados principais da conversa.
- `chats/{chatId}/messages`: mensagens ordenadas por `criadoEm`.
- `chats/{chatId}/typing/{otherUserId}`: indicador de digitacao do outro usuario.

Efeitos importantes:

- ao abrir a conversa, atualiza `userChats/{uid}/{chatId}/unread` para `false`;
- ao desmontar, limpa timeout e remove `typing` do usuario atual;
- carrega detalhes atuais do anuncio via `fetchListingForChat`.

Funcoes principais:

- `scheduleClearTyping()`: agenda remocao do indicador de digitacao.
- `handleMessageChange(text)`: atualiza input e escreve/remove `typing`.
- `enviarMensagem()`: limpa typing, chama `sendTextMessage` e limpa input.
- `handleVerAnuncio()`: busca anuncio ativo ou negociado e navega para `bookDetail`.
- `handleDeleteChat()`: remove apenas `userChats/{uid}/{chatId}`.
- `handleBlockUser()`: grava bloqueio e volta para lista.
- `handleReportUser()`: grava denuncia com motivo.
- `handleViewProfile()`: busca `usuarios/{otherUserId}` e mostra modal.
- `handlePickImage()`: seleciona imagem da galeria e chama `sendImageMessage`.
- `handleAttachmentPress()`: abre Alert com opcao de anexar imagem.

Menu da conversa:

- Ver anuncio;
- Ver perfil;
- Denunciar usuario;
- Bloquear usuario;
- Excluir conversa.

## Servico de ISBN

Arquivo: `src/services/BookApiService.js`.

Responsabilidade: buscar metadados de livro por ISBN.

Fluxo:

1. `fetchBookByIsbn(isbnInput)` normaliza ISBN removendo caracteres que nao sejam digitos/X.
2. Tenta Google Books:
   - URL: `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}`;
   - extrai titulo, primeiro autor, editora, paginas, sinopse, genero, capa e ISBN.
3. Se Google falhar, tenta Open Library:
   - URL: `https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&jscmd=data&format=json`;
   - extrai titulo, autores, editora, paginas, excerto, genero, capa e ISBN.

Funcoes auxiliares:

- `normalizeIsbn(value)`;
- `normalizeText(value)`;
- `matchGenreFromCategories(categories)`;
- `pickIsbn(identifiers)`;
- `pickCoverUrl(imageLinks)`;
- `pickOpenLibraryCover(cover)`;
- `normalizeOpenLibrarySubjects(subjects)`;
- `pickOpenLibraryIsbn(identifiers, fallbackIsbn)`.

## Utilitarios

### `listingFilters.js`

Exporta:

- `discoverGenreFilters`: lista de filtros da tela Descobrir.
- `listingMatchesSearch(book, searchTerm)`: busca textual.
- `listingMatchesGenre(book, genreFilter)`: filtro por genero normalizado.

### `listingShare.js`

Exporta:

- `buildListingShareMessage(book)`: monta texto do compartilhamento.
- `getListingMetaTags(book)`: gera tags para detalhe do anuncio.
- `shareListing(book)`: chama `Share.share`.
