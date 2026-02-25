// Lists
export const getLists = () => {
  const data = localStorage.getItem('vc-lists');
  return data ? JSON.parse(data) : [];
};

export const saveLists = (lists) => {
  localStorage.setItem('vc-lists', JSON.stringify(lists));
};

// Saved searches
export const getSavedSearches = () => {
  const data = localStorage.getItem('vc-saved-searches');
  return data ? JSON.parse(data) : [];
};

export const saveSavedSearches = (searches) => {
  localStorage.setItem('vc-saved-searches', JSON.stringify(searches));
};

// Company notes
export const getCompanyNote = (companyId) => {
  const key = `vc-note-${companyId}`;
  return localStorage.getItem(key) || '';
};

export const setCompanyNote = (companyId, note) => {
  const key = `vc-note-${companyId}`;
  localStorage.setItem(key, note);
};