export const discoverGenreFilters = [
  { key: 'all', label: 'Todos os Generos' },
  { key: 'ficcao', label: 'Ficcao' },
  { key: 'filosofia', label: 'Filosofia' },
  { key: 'historia', label: 'Historia' },
  { key: 'fantasia', label: 'Fantasia' },
  { key: 'romance', label: 'Romance' },
  { key: 'infantojuvenil', label: 'Infanto-juvenil' },
];

function normalizeGenre(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function listingMatchesSearch(book, searchTerm) {
  if (!searchTerm.trim()) {
    return true;
  }

  const query = searchTerm.trim().toLowerCase();
  const searchableText = [
    book?.title,
    book?.author,
    book?.description,
    book?.synopsis,
    book?.userName,
    book?.publisher,
    book?.genre,
    book?.isbn,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(query);
}

export function listingMatchesGenre(book, genreFilter) {
  if (!genreFilter || genreFilter === 'all') {
    return true;
  }

  const genre = normalizeGenre(book?.genre);

  if (!genre) {
    return false;
  }

  switch (genreFilter) {
    case 'ficcao':
      return genre.includes('ficcao');
    case 'filosofia':
      return genre.includes('filosofia') || genre.includes('nao ficcao');
    case 'historia':
      return genre.includes('historia');
    case 'fantasia':
      return genre === 'fantasia' || genre.includes('fantasia');
    case 'romance':
      return genre === 'romance' || genre.includes('romance');
    case 'infantojuvenil':
      return genre.includes('infantojuvenil');
    default:
      return true;
  }
}
