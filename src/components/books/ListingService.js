import firebase from '../../firebaseConfig';
import {
  get,
  getDatabase,
  push,
  ref,
  remove,
  serverTimestamp,
  set,
  update,
} from 'firebase/database';

async function assertListingOwner(listingId, userId) {
  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `bookListings/${listingId}`));

  if (!snapshot.exists()) {
    throw new Error('Anuncio nao encontrado.');
  }

  const listing = snapshot.val();

  if (listing.userId !== userId) {
    throw new Error('Voce so pode alterar seus proprios anuncios.');
  }

  return listing;
}

export async function fetchListing(listingId) {
  if (!listingId) {
    return null;
  }

  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `bookListings/${listingId}`));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: listingId, ...snapshot.val() };
}

export async function createListing(user, payload) {
  const db = getDatabase(firebase);
  const userSnapshot = await get(ref(db, `usuarios/${user.uid}`));
  const userData = userSnapshot.val();
  const listingRef = push(ref(db, 'bookListings'));

  await set(listingRef, {
    userId: user.uid,
    userName: userData?.nome || user.displayName || 'usuario',
    condition: payload.condition,
    dealType: payload.dealType,
    price: payload.price || '',
    title: payload.title,
    author: payload.author,
    publisher: payload.publisher || '',
    genre: payload.genre || '',
    pages: payload.pages || '',
    synopsis: payload.synopsis || '',
    description: payload.description,
    imageSource: payload.imageSource || '',
    isbn: payload.isbn || '',
    criadoEm: serverTimestamp(),
  });

  return listingRef.key;
}

export async function updateListing(listingId, userId, payload) {
  await assertListingOwner(listingId, userId);

  const db = getDatabase(firebase);
  const patch = {
    condition: payload.condition,
    dealType: payload.dealType,
    price: payload.price || '',
    title: payload.title,
    author: payload.author,
    publisher: payload.publisher || '',
    genre: payload.genre || '',
    pages: payload.pages || '',
    synopsis: payload.synopsis || '',
    description: payload.description,
    isbn: payload.isbn || '',
    atualizadoEm: serverTimestamp(),
  };

  if (payload.imageSource !== undefined) {
    patch.imageSource = payload.imageSource;
  }

  await update(ref(db, `bookListings/${listingId}`), patch);
}

export async function saveListing(userId, book) {
  const db = getDatabase(firebase);

  await set(ref(db, `savedListings/${userId}/${book.id}`), {
    ...book,
    savedAt: serverTimestamp(),
  });
}

export async function unsaveListing(userId, listingId) {
  const db = getDatabase(firebase);
  await remove(ref(db, `savedListings/${userId}/${listingId}`));
}

export async function toggleSavedListing(userId, book, isSaved) {
  if (isSaved) {
    await unsaveListing(userId, book.id);
  } else {
    await saveListing(userId, book);
  }
}
