# NextBook

NextBook e um aplicativo mobile/web feito com Expo e React Native para compra, troca, descoberta e avaliacao de livros. O app usa Firebase Authentication, Realtime Database e Firebase Storage para usuarios, anuncios, reviews, comentarios, chats e imagens.

## Sumario

- [Stack](#stack)
- [Requisitos](#requisitos)
- [Instalacao](#instalacao)
- [Firebase](#firebase)
- [Como rodar localmente](#como-rodar-localmente)
- [Builds com Expo EAS](#builds-com-expo-eas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

## Stack

- Expo `^55`
- React `19`
- React Native `0.83`
- React Native Web
- Firebase JS SDK
- Firebase Authentication
- Firebase Realtime Database
- Firebase Storage
- Expo Image Picker

## Requisitos

Instale antes de rodar o projeto:

- [Node.js LTS](https://nodejs.org/) 20 ou superior
- npm, instalado junto com o Node
- Git
- App Expo Go no celular, ou emulador Android/iOS configurado
- Conta Expo, caso queira gerar builds com EAS

Para Android local:

- Android Studio
- Android SDK
- Um emulador Android ou dispositivo fisico com depuracao USB

Para iOS local:

- macOS
- Xcode
- Simulador iOS ou dispositivo fisico

## Instalacao

Clone o repositorio:

```bash
git clone https://github.com/OColomboo/NextBook.git
cd NextBook
```

Instale as dependencias:

```bash
npm ci
```

Use `npm install` apenas se voce precisar atualizar o `package-lock.json`.

## Firebase

O projeto ja vem apontando para a configuracao Firebase usada pelo app em:

```text
src/firebaseConfig.js
```

Nao e necessario criar outro projeto Firebase para rodar o app. Basta instalar as dependencias e iniciar o Expo.

O app usa os seguintes servicos Firebase:

- login com `signInWithEmailAndPassword`;
- cadastro com `createUserWithEmailAndPassword`;
- nome do usuario com `updateProfile`.
- Realtime Database para usuarios, anuncios, reviews, comentarios, chats, salvos, bloqueios e denuncias.
- Storage para capas de livros, capas de reviews e anexos do chat.

O app usa estes caminhos:

```text
usuarios/{uid}
bookListings/{listingId}
savedListings/{uid}/{listingId}
negotiatedListings/{uid}/{listingId}
reviews/{reviewId}
savedReviews/{uid}/{reviewId}
chats/{chatId}
userChats/{uid}/{chatId}
blockedUsers/{uid}/{otherUid}
reports/{reportId}
```

O app envia arquivos para:

```text
listing-covers/{userId}/{timestamp}.jpg
review-covers/{userId}/{timestamp}.jpg
chat-attachments/{chatId}/{userId}/{timestamp}.jpg
```

## Como rodar localmente

### Iniciar Metro/Expo

```bash
npm start
```

Isso abre o painel do Expo no terminal. A partir dele voce pode:

- escanear o QR Code com Expo Go;
- abrir no Android;
- abrir no iOS;
- abrir no navegador.

### Rodar no Android

Com emulador aberto ou dispositivo conectado:

```bash
npm run android
```

### Rodar no iOS

Em macOS com Xcode instalado:

```bash
npm run ios
```

### Rodar no navegador

```bash
npm run web
```

O app usa React Native Web e o layout limita a largura no desktop para simular uma tela mobile.

## Builds com Expo EAS

O projeto ainda nao possui `eas.json`. Para gerar builds instalaveis, configure o EAS primeiro.

### 1. Instalar e autenticar EAS CLI

```bash
npm install -g eas-cli
eas login
```

Tambem e possivel usar `npx eas-cli` se voce nao quiser instalacao global.

### 2. Configurar EAS no projeto

```bash
eas build:configure
```

Esse comando cria/ajusta os arquivos necessarios para builds EAS, incluindo `eas.json`.

Um exemplo de `eas.json` para este projeto:

```json
{
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Build Android para testes internos

Gera um APK instalavel:

```bash
eas build --platform android --profile preview
```

### 4. Build Android de producao

Gera build de producao para distribuicao:

```bash
eas build --platform android --profile production
```

### 5. Build iOS

Requer conta Apple Developer para builds de dispositivo/distribuicao:

```bash
eas build --platform ios --profile production
```

### 6. Build para todas as plataformas nativas

```bash
eas build --platform all --profile production
```

### 7. Submissao para lojas

Depois de gerar builds de producao:

```bash
eas submit --platform android
eas submit --platform ios
```

O EAS Build e o servico oficial da Expo para gerar binarios Android/iOS. A documentacao oficial recomenda `eas build --platform all` para gerar binarios instalaveis e tambem permite `--platform android` ou `--platform ios`.

## Build web

Para testar web localmente:

```bash
npm run web
```

Para exportar uma versao estatica web com Expo:

```bash
npx expo export --platform web
```

O resultado fica normalmente em `dist/`. O deploy pode ser feito em hospedagens estaticas como Firebase Hosting, Vercel, Netlify ou equivalente.

## Estrutura do projeto

```text
.
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
```

Principais areas:

- `src/AppRoot.js`: navegacao manual por estado.
- `src/screens`: telas do app.
- `src/components/books/ListingService.js`: servico de anuncios.
- `src/components/community/ReviewService.js`: servico de reviews e comentarios.
- `src/components/chat/ChatService.js`: servico de chat, anexos, bloqueios e denuncias.
- `src/services/BookApiService.js`: consulta Google Books e Open Library por ISBN.
- `src/firebaseConfig.js`: inicializacao Firebase.

## Scripts

```bash
npm start
```

Inicia o Expo.

```bash
npm run android
```

Abre no Android.

```bash
npm run ios
```

Abre no iOS.

```bash
npm run web
```

Abre no navegador.

## Troubleshooting

### Limpar cache do Expo

```bash
npx expo start -c
```

### Reinstalar dependencias

```bash
rm -rf node_modules
npm ci
```

### Firebase retorna erro de permissao

Verifique:

- usuario esta autenticado;
- email e senha estao corretos;
- a conexao com internet esta ativa;
- o backend Firebase configurado no projeto esta disponivel.

### Imagens nao aparecem

Verifique:

- regras do Storage permitem leitura;
- URL salva em `imageSource` e valida;
- dispositivo tem permissao de camera/galeria;
- a conexao com internet esta ativa.

### ISBN nao busca dados

O app tenta Google Books primeiro e Open Library como fallback. Se ambas falharem:

- confira conexao com internet;
- confira se o ISBN esta correto;
- tente sem hifens ou espacos.

### Android nao abre

Verifique:

- emulador esta rodando;
- Android SDK esta instalado;
- `adb devices` lista o dispositivo;
- Expo CLI consegue enxergar o projeto.

### iOS nao abre

Verifique:

- esta em macOS;
- Xcode esta instalado;
- simulador esta aberto;
- dependencias foram instaladas com `npm ci`.

## Referencias

- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo Application Services](https://docs.expo.dev/eas/)
