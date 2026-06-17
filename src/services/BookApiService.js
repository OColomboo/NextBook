import { bookGenres } from '../screens/BookReviewScreen';

function normalizeIsbn(value) {
  return String(value || '').replace(/[^\dXx]/g, '');
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchGenreFromCategories(categories = []) {
  if (!categories.length) {
    return '';
  }

  const normalizedCategories = categories.map((category) => normalizeText(category));

  return (
    bookGenres.find((genre) => {
      const normalizedGenre = normalizeText(genre);
      return normalizedCategories.some(
        (category) => category.includes(normalizedGenre) || normalizedGenre.includes(category),
      );
    }) || ''
  );
}

function pickIsbn(identifiers = []) {
  const isbn13 = identifiers.find((item) => item.type === 'ISBN_13');
  const isbn10 = identifiers.find((item) => item.type === 'ISBN_10');

  return normalizeIsbn(isbn13?.identifier || isbn10?.identifier || '');
}

function pickCoverUrl(imageLinks = {}) {
  const rawUrl = imageLinks.thumbnail || imageLinks.smallThumbnail || '';

  if (!rawUrl) {
    return '';
  }

  return rawUrl.replace(/^http:/, 'https:');
}

export async function fetchBookByIsbn(isbnInput) {
  const isbn = normalizeIsbn(isbnInput);

  if (!isbn) {
    throw new Error('Informe um ISBN valido.');
  }

  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar o Google Books.');
  }

  const data = await response.json();
  const volume = data.items?.[0];

  if (!volume) {
    throw new Error('Nenhum livro encontrado para este ISBN.');
  }

  const info = volume.volumeInfo || {};

  return {
    title: info.title || '',
    author: info.authors?.[0] || '',
    publisher: info.publisher || '',
    pages: info.pageCount ? String(info.pageCount) : '',
    synopsis: info.description || '',
    genre: matchGenreFromCategories(info.categories || []),
    imageSource: pickCoverUrl(info.imageLinks || {}),
    isbn: pickIsbn(info.industryIdentifiers || []) || isbn,
  };
}
