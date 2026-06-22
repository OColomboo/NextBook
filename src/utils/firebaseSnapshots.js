export function snapshotToArray(snapshot) {
  const data = snapshot.val();

  if (!data) {
    return [];
  }

  return Object.entries(data).map(([id, item]) => ({ id, ...item }));
}

export function sortByNewest(field) {
  return (left, right) => (right[field] || 0) - (left[field] || 0);
}

export function sortByOldest(field) {
  return (left, right) => (left[field] || 0) - (right[field] || 0);
}
