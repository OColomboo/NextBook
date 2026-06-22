import { Share } from 'react-native';

function getDealLabel(book) {
  if (String(book?.dealType || '').toLowerCase() === 'troca') {
    return 'Troca';
  }

  if (!book?.price) {
    return 'Venda';
  }

  const price = String(book.price);
  return price.includes('R$') ? price : `R$ ${price}`;
}

export function buildListingShareMessage(book) {
  const lines = [
    `NextBook — ${book.title}`,
    `Autor: ${book.author}`,
    book.genre ? `Genero: ${book.genre}` : null,
    book.publisher ? `Editora: ${book.publisher}` : null,
    book.isbn ? `ISBN: ${book.isbn}` : null,
    `Negociacao: ${getDealLabel(book)}`,
    book.condition ? `Estado: ${book.condition}` : null,
  ].filter(Boolean);

  if (book.synopsis?.trim()) {
    lines.push('', book.synopsis.trim());
  } else if (book.description?.trim()) {
    lines.push('', book.description.trim());
  }

  return lines.join('\n');
}

export function getListingMetaTags(book) {
  const tags = [];

  if (book?.genre) {
    tags.push({ key: 'genre', label: book.genre });
  }

  if (book?.publisher) {
    tags.push({ key: 'publisher', label: book.publisher, muted: true });
  }

  if (book?.pages) {
    tags.push({ key: 'pages', label: `${book.pages} paginas`, muted: true });
  }

  if (book?.isbn) {
    tags.push({ key: 'isbn', label: `ISBN ${book.isbn}`, muted: true });
  }

  return tags;
}

export async function shareListing(book) {
  const message = buildListingShareMessage(book);

  await Share.share({
    message,
    title: book.title,
  });
}

export function getListingNegotiatedStatus(book) {
  return String(book?.dealType || '').toLowerCase() === 'troca' ? 'trocado' : 'vendido';
}
