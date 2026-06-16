import firebase from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getDatabase, get, push, ref, serverTimestamp, set } from 'firebase/database';

export async function abrirChat(book) {
  const auth = getAuth(firebase);
  const db = getDatabase(firebase);
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Voce precisa estar logado para conversar.');
  }

  if (user.uid === book.userId) {
    throw new Error('Esse anuncio e seu.');
  }

  const chatId = `${book.id}_${user.uid}_${book.userId}`;
  const chatRef = ref(db, `chats/${chatId}`);
  const chatSnapshot = await get(chatRef);

  if (!chatSnapshot.exists()) {
    const userSnapshot = await get(ref(db, `usuarios/${user.uid}`));
    const userData = userSnapshot.val();

    const buyerName = userData?.nome || user.displayName || 'Usuario';
    const sellerName = book.userName || 'Usuario';
    const listingTitle = book.title || 'Anuncio sem titulo';
    const listingImage = book.imageSource || '';
    const initialMessage = `Ola! Tenho interesse no anuncio "${listingTitle}".`;

    await set(chatRef, {
      listingId: book.id,
      listingTitle,
      listingImage,
      sellerId: book.userId,
      sellerName,
      buyerId: user.uid,
      buyerName,
      participants: {
        [user.uid]: true,
        [book.userId]: true,
      },
      lastMessage: initialMessage,
      lastSenderId: user.uid,
      updatedAt: serverTimestamp(),
    });

    const firstMessageRef = push(ref(db, `chats/${chatId}/messages`));

    await set(firstMessageRef, {
      senderId: user.uid,
      text: initialMessage,
      criadoEm: serverTimestamp(),
    });

    await set(ref(db, `userChats/${user.uid}/${chatId}`), {
      otherUserName: sellerName,
      listingTitle,
      listingImage,
      lastMessage: initialMessage,
      lastSenderId: user.uid,
      unread: false,
      updatedAt: serverTimestamp(),
    });

    await set(ref(db, `userChats/${book.userId}/${chatId}`), {
      otherUserName: buyerName,
      listingTitle,
      listingImage,
      lastMessage: initialMessage,
      lastSenderId: user.uid,
      unread: true,
      updatedAt: serverTimestamp(),
    });
  }

  return chatId;
}
