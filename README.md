# NextBook

Aplicativo de **livros e trocas** em desenvolvimento com **React Native** e **Expo**. O projeto explora um fluxo de comunidade de leitores: descobrir títulos, conversar, anunciar livros, ver a estante pessoal e navegar entre telas de protótipo com visual coeso (paleta acastanhada e acentos em verde escuro).

> **Este projeto está em construção.** Telas e dados são principalmente fictícios ou estáticos, para demonstração da interface e da navegação. Não há backend nem autenticação real integradas nesta versão.

## O que já existe no protótipo

- Fluxo inicial de **login** e **cadastro** (navegação local).
- **Descobrir** livros com busca e cartões de exemplo.
- **Comunidade** com feed estilo redes sociais.
- **Anunciar livro** e **avaliação de livro** (telas de formulário exemplo).
- **Estante** (área do usuário: coleção, troca, salvos e “quero ler”, com filtros ilustrativos).
- **Detalhe de anúncio** de um livro (sinopse, vendedor, ação para ir ao chat).
- **Chat** de conversação de exemplo.

A navegação entre telas é feita por **estado na raiz da aplicação** e por **abas inferiores** e **menu lateral**, adequado para prototipação.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS recomendada).
- [npm](https://www.npmjs.com/) (vem com o Node).
- Para rodar em **dispositivo físico**: app [Expo Go](https://expo.dev/go) no celular.
- Para **iOS** no simulador: Xcode (macOS).
- Para **Android** no emulador: Android Studio com emulador configurado.

## Como usar (instalação e execução)

1. **Clone o repositório** (se ainda não tiver a pasta do projeto).

2. **Instale as dependências** na raiz do projeto:

   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm start
   ```

   Isso executa `expo start`. No terminal aparece um QR Code e comandos rápidos.

4. **Escolha a plataforma**:

   - **Navegador (web):** `npm run web` ou pressione `w` no terminal do Expo.
   - **Simulador iOS:** `npm run ios` ou pressione `i` (macOS).
   - **Emulador Android:** `npm run android` ou pressione `a`.
   - **Celular com Expo Go:** escaneie o QR Code exibido no terminal (Android no Expo Go; iOS pela Câmera abrindo o Expo Go quando solicitado).

Os logs na web aparecem no console do navegador conforme mensagem do Expo.

## Scripts disponíveis

| Comando        | Descrição                          |
| --------------- | ---------------------------------- |
| `npm start`     | Inicia o Expo (Metro + interface) |
| `npm run web`   | Abre/app em modo web              |
| `npm run ios`   | Abre no simulador iOS             |
| `npm run android` | Abre no emulador Android       |

## Estrutura geral do código

- `App.js` — ponto que exporta a raiz do app.
- `src/AppRoot.js` — estado global das telas e composição principal.
- `src/screens/` — telas por fluxo (login, comunidade, estante etc.).
- `src/components/` — componentes reutilizáveis (layout, formulários, chat, livros).
- `src/theme/` — cores e contexto de layout responsivo.
- `src/constants/` — itens do menu lateral, entre outros.

## Licença e contribuições

Este repositório é **privado** conforme `package.json`. Para contribuir ou alinhar o escopo da disciplina/projeto UTFPR, combine com os mantenedores do repositório.

---

**Resumo:** o NextBook é um **protótipo de app** para leitores e trocas de livros; use `npm install` e `npm start` para desenvolver ou testar. Espere mudanças frequentes até a versão considerada estável.
