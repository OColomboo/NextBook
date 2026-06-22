import firebase from '../../firebaseConfig';
import { getAuth } from 'firebase/auth';
import {
  get,
  getDatabase,
  onDisconnect,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';
import { uploadImageUri } from '../../services/MediaUploadService';

async function isUserBlocked(uidA, uidB) {
  const db = getDatabase(firebase);
  const [aBlocksB, bBlocksA] = await Promise.all([
    get(ref(db, `blockedUsers/${uidA}/${uidB}`)),
    get(ref(db, `blockedUsers/${uidB}/${uidA}`)),
  ]);

  return aBlocksB.exists() || bBlocksA.exists();
}

function getChatParticipants(chat) {
  return [chat.sellerId, chat.buyerId].filter(Boolean);
}

function buildListingMetadata(book) {
  return {
    listingTitle: book.title || 'Anuncio sem titulo',
    listingImage: book.imageSource || '',
    listingPrice: book.price || '',
    listingDealType: book.dealType || '',
    listingStatus: book.status || '',
  };
}

function buildUserChatEntry(chat, participantId, senderId, previewText) {
  return {
    otherUserName: participantId === chat.sellerId ? chat.buyerName : chat.sellerName,
    listingTitle: chat.listingTitle,
    listingImage: chat.listingImage,
    listingPrice: chat.listingPrice || '',
    listingDealType: chat.listingDealType || '',
    listingStatus: chat.listingStatus || '',
    lastMessage: previewText,
    lastSenderId: senderId,
    unread: senderId !== participantId,
    updatedAt: serverTimestamp(),
  };
}

async function updateChatPreview(db, chatId, chat, senderId, previewText) {
  const updates = {
    [`chats/${chatId}/lastMessage`]: previewText,
    [`chats/${chatId}/lastSenderId`]: senderId,
    [`chats/${chatId}/updatedAt`]: serverTimestamp(),
  };

  for (const participantId of getChatParticipants(chat)) {
    updates[`userChats/${participantId}/${chatId}`] = buildUserChatEntry(
      chat,
      participantId,
      senderId,
      previewText,
    );
  }

  await update(ref(db), updates);
}

export async function fetchListingForChat(listingId, sellerId) {
  if (!listingId) {
    return null;
  }

  const db = getDatabase(firebase);
  const activeSnapshot = await get(ref(db, `bookListings/${listingId}`));

  if (activeSnapshot.exists()) {
    return { id: listingId, ...activeSnapshot.val() };
  }

  if (sellerId) {
    const negotiatedSnapshot = await get(ref(db, `negotiatedListings/${sellerId}/${listingId}`));

    if (negotiatedSnapshot.exists()) {
      return { id: listingId, ...negotiatedSnapshot.val() };
    }
  }

  return null;
}

export async function fetchUserProfile(userId) {
  if (!userId) {
    return null;
  }

  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `usuarios/${userId}`));

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.val();
}

export async function setTyping(chatId, uid) {
  const db = getDatabase(firebase);
  const typingRef = ref(db, `chats/${chatId}/typing/${uid}`);

  await set(typingRef, serverTimestamp());
  onDisconnect(typingRef).remove();
}

export async function clearTyping(chatId, uid) {
  const db = getDatabase(firebase);
  await remove(ref(db, `chats/${chatId}/typing/${uid}`));
}

export async function sendTextMessage(chatId, chat, user, text) {
  const db = getDatabase(firebase);
  const messageRef = push(ref(db, `chats/${chatId}/messages`));

  await set(messageRef, {
    senderId: user.uid,
    text,
    criadoEm: serverTimestamp(),
  });

  await updateChatPreview(db, chatId, chat, user.uid, text);
}

export async function sendImageMessage(chatId, chat, user, localUri) {
  const db = getDatabase(firebase);
  const imageUrl = await uploadImageUri(localUri, `chat-attachments/${chatId}/${user.uid}/${Date.now()}.jpg`);

  const messageRef = push(ref(db, `chats/${chatId}/messages`));

  await set(messageRef, {
    senderId: user.uid,
    type: 'image',
    imageUrl,
    text: '',
    criadoEm: serverTimestamp(),
  });

  await updateChatPreview(db, chatId, chat, user.uid, 'Imagem');
}

export async function deleteChatForUser(userId, chatId) {
  const db = getDatabase(firebase);
  await remove(ref(db, `userChats/${userId}/${chatId}`));
}

export async function blockUser(currentUserId, otherUserId) {
  const db = getDatabase(firebase);
  await set(ref(db, `blockedUsers/${currentUserId}/${otherUserId}`), true);
}

export async function reportUser({ reporterId, reportedId, chatId, reason }) {
  const db = getDatabase(firebase);
  const reportRef = push(ref(db, 'reports'));

  await set(reportRef, {
    reporterId,
    reportedId,
    chatId,
    reason,
    criadoEm: serverTimestamp(),
  });
}

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

  if (await isUserBlocked(user.uid, book.userId)) {
    throw new Error('Nao e possivel conversar com este usuario.');
  }

  const chatId = `${book.id}_${user.uid}_${book.userId}`;
  const chatRef = ref(db, `chats/${chatId}`);
  const chatSnapshot = await get(chatRef);

  if (!chatSnapshot.exists()) {
    const userSnapshot = await get(ref(db, `usuarios/${user.uid}`));
    const userData = userSnapshot.val();

    const buyerName = userData?.nome || user.displayName || 'Usuario';
    const sellerName = book.userName || 'Usuario';
    const listingMetadata = buildListingMetadata(book);
    const initialMessage = `Ola! Tenho interesse no anuncio "${listingMetadata.listingTitle}".`;

    await set(chatRef, {
      listingId: book.id,
      ...listingMetadata,
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
      ...listingMetadata,
      lastMessage: initialMessage,
      lastSenderId: user.uid,
      unread: false,
      updatedAt: serverTimestamp(),
    });

    await set(ref(db, `userChats/${book.userId}/${chatId}`), {
      otherUserName: buyerName,
      ...listingMetadata,
      lastMessage: initialMessage,
      lastSenderId: user.uid,
      unread: true,
      updatedAt: serverTimestamp(),
    });
  }

  return chatId;
}
