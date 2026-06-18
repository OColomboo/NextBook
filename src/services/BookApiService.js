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

function pickOpenLibraryCover(cover = {}) {
  const rawUrl = cover.large || cover.medium || cover.small || '';

  if (!rawUrl) {
    return '';
  }

  return rawUrl.replace(/^http:/, 'https:');
}

function normalizeOpenLibrarySubjects(subjects = []) {
  return subjects
    .map((subject) => (typeof subject === 'string' ? subject : subject?.name))
    .filter(Boolean);
}

function pickOpenLibraryIsbn(identifiers = {}, fallbackIsbn) {
  return normalizeIsbn(identifiers.isbn_13?.[0] || identifiers.isbn_10?.[0] || fallbackIsbn);
}

async function fetchBookByIsbnFromGoogle(isbn) {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(`isbn:${isbn}`)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Nao foi possivel consultar o Google Books. Status: ${response.status}`);
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

async function fetchBookByIsbnFromOpenLibrary(isbn) {
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Nao foi possivel consultar a Open Library. Status: ${response.status}`);
  }

  const data = await response.json();
  const book = data[`ISBN:${isbn}`];

  if (!book) {
    throw new Error('Nenhum livro encontrado para este ISBN.');
  }

  const subjects = normalizeOpenLibrarySubjects(book.subjects || []);

  return {
    title: book.title || '',
    author: book.authors?.map((author) => author.name).filter(Boolean).join(', ') || '',
    publisher: book.publishers?.[0]?.name || '',
    pages: book.number_of_pages ? String(book.number_of_pages) : '',
    synopsis: book.excerpts?.[0]?.text || '',
    genre: matchGenreFromCategories(subjects),
    imageSource: pickOpenLibraryCover(book.cover || {}),
    isbn: pickOpenLibraryIsbn(book.identifiers || {}, isbn),
  };
}

export async function fetchBookByIsbn(isbnInput) {
  const isbn = normalizeIsbn(isbnInput);

  if (!isbn) {
    throw new Error('Informe um ISBN valido.');
  }

  try {
    return await fetchBookByIsbnFromGoogle(isbn);
  } catch {
    // Tenta uma segunda fonte quando o Google Books falha por limite ou indisponibilidade.
  }

  return await fetchBookByIsbnFromOpenLibrary(isbn);
}
