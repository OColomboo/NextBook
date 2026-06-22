# NextBook - Firebase, banco de dados e integracoes

Este documento detalha como o projeto conecta no Firebase, quais caminhos do Realtime Database usa, onde faz upload no Storage e quais integracoes externas existem.

## Configuracao Firebase

Arquivo: `src/firebaseConfig.js`.

O app importa:

- `initializeApp`, `getApp`, `getApps` de `firebase/app`;
- side effects de `firebase/database` e `firebase/auth`.

Configuracao hardcoded:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "nextbook-c69c0.firebaseapp.com",
  projectId: "nextbook-c69c0",
  storageBucket: "nextbook-c69c0.firebasestorage.app",
  messagingSenderId: "860378848409",
  appId: "1:860378848409:web:c244031c19712b3f11ec08"
};
```

Inicializacao:

- se `getApps().length === 0`, chama `initializeApp(firebaseConfig)`;
- caso contrario, reutiliza `getApp()`;
- exporta a instancia como default.

Observacoes:

- Nao ha `.env`; as chaves estao no codigo.
- Nao ha arquivos de regras do Realtime Database ou Storage.
- O projeto usa Realtime Database, nao Firestore.

## Firebase Authentication

Usado em:

- `LoginScreen.js`
- `RegisterScreen.js`
- telas que precisam do usuario atual via `getAuth(firebase).currentUser`

Fluxos:

- Login: `signInWithEmailAndPassword(auth, email, senha)`.
- Cadastro: `createUserWithEmailAndPassword(auth, email, senha)`.
- Perfil auth: `updateProfile(user, { displayName: nome })`.

O app depende de `auth.currentUser` para:

- saber se pode salvar anuncio/review;
- criar anuncio;
- criar review;
- filtrar estante;
- abrir/enviar chat;
- identificar dono de anuncio/review/comentario.

## Firebase Realtime Database

Todos os dados de negocio ficam no Realtime Database.

### `usuarios/{uid}`

Criado em `RegisterScreen.js`.

Formato:

```js
{
  nome: string,
  email: string,
  telefone: string,
  cidade: string,
  criadoEm: serverTimestamp()
}
```

Usos:

- `ListingService.createListing`: busca nome do dono do anuncio.
- `ReviewService.createReview`: busca nome do autor da review.
- `ReviewService.addComment`: busca nome do comentarista.
- `ChatService.abrirChat`: busca nome do comprador.
- `ChatService.fetchUserProfile`: carrega perfil para modal do chat.

### `bookListings/{listingId}`

Colecao de anuncios ativos.

Criado em `ListingService.createListing`.

Formato:

```js
{
  userId: string,
  userName: string,
  condition: "novo" | "usado",
  dealType: "venda" | "troca",
  price: string,
  title: string,
  author: string,
  publisher: string,
  genre: string,
  pages: string,
  synopsis: string,
  description: string,
  imageSource: string,
  isbn: string,
  criadoEm: serverTimestamp(),
  atualizadoEm?: serverTimestamp()
}
```

Leituras:

- `DiscoverBooksScreen`: lista todos os anuncios ativos.
- `BookDetailsScreen`: lista anuncios do usuario atual.
- `ListingService.fetchListing`: busca anuncio por id para edicao.
- `ChatService.fetchListingForChat`: busca anuncio relacionado a chat.

Escritas:

- `createListing(user, payload)`: cria com `push(ref(db, 'bookListings'))`.
- `updateListing(listingId, userId, payload)`: atualiza apos validar dono no client.
- `BookListingDetailScreen.handleMarcarComoVendido`: remove quando vira negociado.

### `savedListings/{uid}/{listingId}`

Anuncios salvos por usuario.

Gravado em `ListingService.saveListing`.

Formato:

```js
{
  ...book,
  savedAt: serverTimestamp()
}
```

Usos:

- `DiscoverBooksScreen`: saber quais anuncios estao salvos.
- `BookListingDetailScreen`: estado de salvo do detalhe.
- `BookDetailsScreen`: secao "Anuncios salvos".

Funcoes:

- `saveListing(userId, book)`;
- `unsaveListing(userId, listingId)`;
- `toggleSavedListing(userId, book, isSaved)`.

Observacao: salva uma copia completa do objeto `book`. Se o anuncio original mudar depois, a copia salva pode ficar defasada.

### `negotiatedListings/{uid}/{listingId}`

Anuncios do usuario marcados como vendidos/trocados.

Criado em `BookListingDetailScreen.handleMarcarComoVendido`.

Formato:

```js
{
  ...book,
  status: "vendido" | "trocado",
  negotiatedAt: serverTimestamp()
}
```

Depois de gravar aqui, o app remove `bookListings/{listingId}`.

Usos:

- `BookDetailsScreen`: secao "Negociados".
- `ChatService.fetchListingForChat`: fallback quando anuncio nao esta mais ativo.

### `reviews/{reviewId}`

Reviews publicadas na comunidade.

Criado em `ReviewService.createReview`.

Formato:

```js
{
  userId: string,
  userName: string,
  bookname: string,
  author: string,
  publisher: string,
  genre: string,
  text: string,
  rating: number,
  imageSource: string,
  criadoEm: serverTimestamp(),
  atualizadoEm?: serverTimestamp(),
  likesByUser?: {
    [uid]: true
  },
  comments?: {
    [commentId]: {
      userId: string,
      userName: string,
      text: string,
      criadoEm: serverTimestamp(),
      atualizadoEm?: serverTimestamp()
    }
  }
}
```

Leituras:

- `CommunityFeedScreen`: lista todas as reviews.
- `ReviewService.fetchReview`: busca review para edicao.
- `ReviewCommentsModal`: escuta comentarios.

Escritas:

- `createReview(user, payload)`;
- `updateReview(reviewId, userId, payload)`;
- `deleteReview(reviewId, userId)`;
- `toggleLike(reviewId, userId)`;
- `addComment(reviewId, user, text)`;
- `updateComment(reviewId, commentId, userId, text)`;
- `deleteComment(reviewId, commentId, userId)`.

Validacoes no client:

- `assertReviewOwner`: busca review e confere `review.userId === userId`.
- `assertCommentOwner`: busca comentario e confere `comment.userId === userId`.

### `savedReviews/{uid}/{reviewId}`

Reviews salvas por usuario.

Gravado em `ReviewService.saveReview`.

Formato:

```js
{
  reviewId: string,
  userId: string,
  userName: string,
  bookname: string,
  author: string,
  publisher: string,
  genre: string,
  text: string,
  rating: number,
  imageSource: string,
  criadoEm: number | string,
  savedAt: serverTimestamp()
}
```

Usos:

- `CommunityFeedScreen`: mapa de reviews salvas.
- `BookDetailsScreen`: secao "Reviews salvas".

Observacao: tambem salva uma copia dos campos da review.

### `chats/{chatId}`

Dados completos da conversa.

Criado em `ChatService.abrirChat(book)`.

`chatId` e montado assim:

```js
`${book.id}_${buyerUid}_${sellerUid}`
```

Formato principal:

```js
{
  listingId: string,
  listingTitle: string,
  listingImage: string,
  listingPrice: string,
  listingDealType: string,
  listingStatus: string,
  sellerId: string,
  sellerName: string,
  buyerId: string,
  buyerName: string,
  participants: {
    [buyerUid]: true,
    [sellerUid]: true
  },
  lastMessage: string,
  lastSenderId: string,
  updatedAt: serverTimestamp(),
  typing?: {
    [uid]: serverTimestamp()
  },
  messages?: {
    [messageId]: Message
  }
}
```

Mensagens de texto:

```js
{
  senderId: string,
  text: string,
  criadoEm: serverTimestamp()
}
```

Mensagens de imagem:

```js
{
  senderId: string,
  type: "image",
  imageUrl: string,
  text: "",
  criadoEm: serverTimestamp()
}
```

Leituras:

- `ChatConversationScreen`: escuta `chats/{chatId}` e `chats/{chatId}/messages`.
- `ChatConversationScreen`: escuta `chats/{chatId}/typing/{otherUserId}`.

Escritas:

- `abrirChat(book)`: cria conversa e primeira mensagem.
- `sendTextMessage(chatId, chat, user, text)`: cria mensagem de texto.
- `sendImageMessage(chatId, chat, user, localUri)`: faz upload e cria mensagem de imagem.
- `setTyping(chatId, uid)`: grava indicador de digitacao.
- `clearTyping(chatId, uid)`: remove indicador.

### `userChats/{uid}/{chatId}`

Indice/preview de conversas por usuario.

Criado/atualizado em:

- `ChatService.abrirChat`;
- `updateChatPreview`.

Formato:

```js
{
  otherUserName: string,
  listingTitle: string,
  listingImage: string,
  listingPrice: string,
  listingDealType: string,
  listingStatus: string,
  lastMessage: string,
  lastSenderId: string,
  unread: boolean,
  updatedAt: serverTimestamp()
}
```

Usos:

- `ChatListScreen`: lista conversas do usuario.
- `ChatConversationScreen`: marca `unread: false` ao abrir conversa.
- `deleteChatForUser(userId, chatId)`: remove apenas o preview do usuario atual.

Observacao: excluir conversa nao remove `chats/{chatId}` nem o preview do outro participante.

### `blockedUsers/{currentUserId}/{otherUserId}`

Bloqueios.

Criado em `ChatService.blockUser`.

Formato:

```js
true
```

Uso:

- `ChatService.isUserBlocked(uidA, uidB)` verifica os dois sentidos:
  - `blockedUsers/{uidA}/{uidB}`;
  - `blockedUsers/{uidB}/{uidA}`.

Se qualquer lado bloqueou, `abrirChat` impede iniciar conversa.

Observacao: o envio de mensagem em conversa existente nao chama `isUserBlocked`; isso precisa ser protegido por regras ou validacao adicional se for requisito.

### `reports/{reportId}`

Denuncias de usuarios.

Criado em `ChatService.reportUser`.

Formato:

```js
{
  reporterId: string,
  reportedId: string,
  chatId: string,
  reason: string,
  criadoEm: serverTimestamp()
}
```

Motivos usados na UI:

- Assedio;
- Golpe/fraude;
- Spam;
- Outro.

## Firebase Storage

O app usa Storage para imagens enviadas pelo usuario.

### Capas de anuncios

Arquivo: `src/screens/AddBookListingScreen.js`.

Caminho:

```text
listing-covers/{userId}/{Date.now()}.jpg
```

Fluxo:

1. Usuario escolhe/tira foto.
2. O app guarda URI local.
3. No submit, `uploadCoverImage(user.uid)` converte URI para `blob`.
4. Faz `uploadBytes`.
5. Usa `getDownloadURL`.
6. Salva a URL em `bookListings/{listingId}/imageSource`.

Se a capa veio da API de ISBN e ja e URL remota, o app nao faz upload; apenas salva a URL.

### Capas de reviews

Arquivo: `src/screens/BookReviewScreen.js`.

Caminho:

```text
review-covers/{userId}/{Date.now()}.jpg
```

Fluxo igual ao de anuncios, mas a URL e salva em `reviews/{reviewId}/imageSource`.

### Anexos de chat

Arquivo: `src/components/chat/ChatService.js`.

Caminho:

```text
chat-attachments/{chatId}/{senderUid}/{Date.now()}.jpg
```

Depois do upload:

- a URL e salva em `chats/{chatId}/messages/{messageId}/imageUrl`;
- `lastMessage` do chat vira `"Imagem"`.

## Servicos de dominio

### `ListingService.js`

Arquivo: `src/components/books/ListingService.js`.

Funcoes:

- `assertListingOwner(listingId, userId)`
  - busca `bookListings/{listingId}`;
  - falha se nao existir;
  - falha se `listing.userId !== userId`;
  - retorna o anuncio.

- `fetchListing(listingId)`
  - retorna `null` se `listingId` vazio ou se nao existir;
  - retorna `{ id, ...snapshot.val() }`.

- `createListing(user, payload)`
  - busca `usuarios/{user.uid}`;
  - cria novo id com `push`;
  - grava dados do anuncio com `criadoEm`;
  - retorna `listingRef.key`.

- `updateListing(listingId, userId, payload)`
  - valida dono via `assertListingOwner`;
  - atualiza campos editaveis;
  - inclui `atualizadoEm`;
  - so altera `imageSource` quando `payload.imageSource !== undefined`.

- `saveListing(userId, book)`
  - grava copia do anuncio em `savedListings/{userId}/{book.id}`.

- `unsaveListing(userId, listingId)`
  - remove salvo.

- `toggleSavedListing(userId, book, isSaved)`
  - remove se ja estava salvo;
  - salva se nao estava.

### `ReviewService.js`

Arquivo: `src/components/community/ReviewService.js`.

Funcoes:

- `getCommentsCount(review)`
  - se `review.comments` e objeto, conta as chaves;
  - se e numero, retorna o numero;
  - fallback `0`.

- `assertReviewOwner(reviewId, userId)`
  - valida que a review existe e pertence ao usuario.

- `assertCommentOwner(reviewId, commentId, userId)`
  - valida que o comentario existe e pertence ao usuario.

- `fetchReview(reviewId)`
  - retorna `{ id, ...dados }` ou `null`.

- `createReview(user, payload)`
  - busca nome em `usuarios/{uid}`;
  - cria review em `reviews`;
  - retorna id.

- `updateReview(reviewId, userId, payload)`
  - valida dono;
  - atualiza campos e `atualizadoEm`;
  - altera imagem apenas quando enviada.

- `deleteReview(reviewId, userId)`
  - valida dono;
  - remove `reviews/{reviewId}`.

- `toggleLike(reviewId, userId)`
  - alterna `reviews/{reviewId}/likesByUser/{userId}`.

- `saveReview(userId, review)`
  - valida `review.id`;
  - grava copia em `savedReviews/{userId}/{review.id}`.

- `unsaveReview(userId, reviewId)`
  - remove review salva.

- `toggleSavedReview(userId, review, isSaved)`
  - alterna salvo.

- `addComment(reviewId, user, text)`
  - busca nome do usuario;
  - cria comentario.

- `updateComment(reviewId, commentId, userId, text)`
  - valida dono;
  - atualiza texto e `atualizadoEm`.

- `deleteComment(reviewId, commentId, userId)`
  - valida dono;
  - remove comentario.

### `ChatService.js`

Arquivo: `src/components/chat/ChatService.js`.

Funcoes:

- `isUserBlocked(uidA, uidB)`
  - verifica bloqueio nos dois sentidos.

- `updateChatPreview(db, chatId, chat, senderId, previewText)`
  - atualiza `chats/{chatId}` com ultima mensagem;
  - atualiza/cria `userChats/{sellerId}/{chatId}` e `userChats/{buyerId}/{chatId}`;
  - define `unread: senderId !== participantId`.

- `fetchListingForChat(listingId, sellerId)`
  - tenta `bookListings/{listingId}`;
  - se nao existir e houver vendedor, tenta `negotiatedListings/{sellerId}/{listingId}`;
  - retorna `null` se nao achar.

- `fetchUserProfile(userId)`
  - busca `usuarios/{userId}`.

- `setTyping(chatId, uid)`
  - grava timestamp em `chats/{chatId}/typing/{uid}`;
  - configura `onDisconnect(...).remove()`.

- `clearTyping(chatId, uid)`
  - remove `typing`.

- `sendTextMessage(chatId, chat, user, text)`
  - cria mensagem em `chats/{chatId}/messages`;
  - atualiza previews com o texto.

- `sendImageMessage(chatId, chat, user, localUri)`
  - faz upload para Storage;
  - cria mensagem tipo `image`;
  - atualiza previews com `"Imagem"`.

- `deleteChatForUser(userId, chatId)`
  - remove somente `userChats/{userId}/{chatId}`.

- `blockUser(currentUserId, otherUserId)`
  - grava `blockedUsers/{currentUserId}/{otherUserId} = true`.

- `reportUser({ reporterId, reportedId, chatId, reason })`
  - cria denuncia em `reports`.

- `abrirChat(book)`
  - exige usuario autenticado;
  - impede conversar consigo mesmo;
  - impede abrir se houver bloqueio em qualquer sentido;
  - monta `chatId`;
  - se chat nao existe:
    - busca dados do comprador;
    - cria `chats/{chatId}`;
    - cria primeira mensagem;
    - cria preview para comprador e vendedor;
  - retorna `chatId`.

## Integracoes externas

### Google Books API

Arquivo: `src/services/BookApiService.js`.

URL:

```text
https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}
```

Campos aproveitados:

- `title`;
- primeiro item de `authors`;
- `publisher`;
- `pageCount`;
- `description`;
- `categories`;
- `imageLinks.thumbnail` ou `smallThumbnail`;
- `industryIdentifiers`.

### Open Library API

Fallback quando Google Books falha.

URL:

```text
https://openlibrary.org/api/books?bibkeys=ISBN:{isbn}&jscmd=data&format=json
```

Campos aproveitados:

- `title`;
- `authors[].name`;
- `publishers[0].name`;
- `number_of_pages`;
- `excerpts[0].text`;
- `subjects`;
- `cover.large|medium|small`;
- `identifiers.isbn_13` ou `isbn_10`.

### React Native Share

Arquivo: `src/utils/listingShare.js`.

`shareListing(book)` monta uma mensagem textual e chama:

```js
Share.share({
  message,
  title: book.title,
});
```

## Pontos de atencao para manutencao

1. Seguranca depende das regras Firebase
   - O codigo valida dono no client, mas um client adulterado poderia chamar o banco diretamente se as regras permitirem.
   - Regras devem restringir `bookListings`, `reviews`, `comments`, `saved*`, `userChats`, `chats`, `blockedUsers` e `reports`.

2. Dados duplicados podem ficar defasados
   - `savedListings` salva copia completa do anuncio.
   - `savedReviews` salva copia da review.
   - `userChats` salva dados do anuncio e nomes para preview.

3. Exclusao de chat e local
   - `deleteChatForUser` remove so o indice do usuario.
   - O registro completo em `chats` continua existindo.

4. Bloqueio nao impede envio em chat existente pelo servico
   - `abrirChat` verifica bloqueios.
   - `sendTextMessage` e `sendImageMessage` nao verificam bloqueio.

5. Credenciais no codigo
   - Para producao, mover configuracao para variaveis/segredos de ambiente compatíveis com Expo.

6. Uploads nao removem arquivos antigos
   - Ao trocar capa de anuncio/review, o arquivo antigo no Storage nao e deletado.

7. Falta de regras e indices versionados
   - O repositorio nao inclui `database.rules.json`, `storage.rules`, `firebase.json` ou documentacao de deploy Firebase.

8. Sem testes automatizados
   - Mudancas nos fluxos devem ser testadas manualmente ou cobertas por testes a adicionar.
