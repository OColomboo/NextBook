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

export function getCommentsCount(review) {
  if (review?.comments && typeof review.comments === 'object') {
    return Object.keys(review.comments).length;
  }

  return typeof review?.comments === 'number' ? review.comments : 0;
}

async function assertReviewOwner(reviewId, userId) {
  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `reviews/${reviewId}`));

  if (!snapshot.exists()) {
    throw new Error('Avaliacao nao encontrada.');
  }

  const review = snapshot.val();

  if (review.userId !== userId) {
    throw new Error('Voce so pode alterar suas proprias avaliacoes.');
  }

  return review;
}

async function assertCommentOwner(reviewId, commentId, userId) {
  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `reviews/${reviewId}/comments/${commentId}`));

  if (!snapshot.exists()) {
    throw new Error('Comentario nao encontrado.');
  }

  const comment = snapshot.val();

  if (comment.userId !== userId) {
    throw new Error('Voce so pode alterar seus proprios comentarios.');
  }

  return comment;
}

export async function fetchReview(reviewId) {
  const db = getDatabase(firebase);
  const snapshot = await get(ref(db, `reviews/${reviewId}`));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: reviewId, ...snapshot.val() };
}

export async function createReview(user, payload) {
  const db = getDatabase(firebase);
  const userSnapshot = await get(ref(db, `usuarios/${user.uid}`));
  const userData = userSnapshot.val();
  const reviewRef = push(ref(db, 'reviews'));

  await set(reviewRef, {
    userId: user.uid,
    userName: userData?.nome || user.displayName || 'usuario',
    bookname: payload.bookname,
    author: payload.author,
    publisher: payload.publisher || '',
    genre: payload.genre,
    text: payload.text,
    rating: payload.rating,
    imageSource: payload.imageSource || '',
    criadoEm: serverTimestamp(),
  });

  return reviewRef.key;
}

export async function updateReview(reviewId, userId, payload) {
  await assertReviewOwner(reviewId, userId);

  const db = getDatabase(firebase);
  const patch = {
    bookname: payload.bookname,
    author: payload.author,
    publisher: payload.publisher || '',
    genre: payload.genre,
    text: payload.text,
    rating: payload.rating,
    atualizadoEm: serverTimestamp(),
  };

  if (payload.imageSource !== undefined) {
    patch.imageSource = payload.imageSource;
  }

  await update(ref(db, `reviews/${reviewId}`), patch);
}

export async function deleteReview(reviewId, userId) {
  await assertReviewOwner(reviewId, userId);

  const db = getDatabase(firebase);
  await remove(ref(db, `reviews/${reviewId}`));
}

export async function toggleLike(reviewId, userId) {
  const db = getDatabase(firebase);
  const likeRef = ref(db, `reviews/${reviewId}/likesByUser/${userId}`);
  const snapshot = await get(likeRef);

  if (snapshot.exists()) {
    await remove(likeRef);
  } else {
    await set(likeRef, true);
  }
}

export async function saveReview(userId, review) {
  if (!review?.id) {
    throw new Error('Nao foi possivel encontrar a avaliacao.');
  }

  const db = getDatabase(firebase);

  await set(ref(db, `savedReviews/${userId}/${review.id}`), {
    reviewId: review.id,
    userId: review.userId || '',
    userName: review.userName || '',
    bookname: review.bookname || '',
    author: review.author || '',
    publisher: review.publisher || '',
    genre: review.genre || '',
    text: review.text || '',
    rating: review.rating || 0,
    imageSource: review.imageSource || '',
    criadoEm: review.criadoEm || '',
    savedAt: serverTimestamp(),
  });
}

export async function unsaveReview(userId, reviewId) {
  const db = getDatabase(firebase);
  await remove(ref(db, `savedReviews/${userId}/${reviewId}`));
}

export async function toggleSavedReview(userId, review, isSaved) {
  if (isSaved) {
    await unsaveReview(userId, review.id);
  } else {
    await saveReview(userId, review);
  }
}

export async function addComment(reviewId, user, text) {
  const db = getDatabase(firebase);
  const userSnapshot = await get(ref(db, `usuarios/${user.uid}`));
  const userData = userSnapshot.val();
  const commentRef = push(ref(db, `reviews/${reviewId}/comments`));

  await set(commentRef, {
    userId: user.uid,
    userName: userData?.nome || user.displayName || 'usuario',
    text,
    criadoEm: serverTimestamp(),
  });
}

export async function updateComment(reviewId, commentId, userId, text) {
  await assertCommentOwner(reviewId, commentId, userId);

  const db = getDatabase(firebase);
  await update(ref(db, `reviews/${reviewId}/comments/${commentId}`), {
    text,
    atualizadoEm: serverTimestamp(),
  });
}

export async function deleteComment(reviewId, commentId, userId) {
  await assertCommentOwner(reviewId, commentId, userId);

  const db = getDatabase(firebase);
  await remove(ref(db, `reviews/${reviewId}/comments/${commentId}`));
}
