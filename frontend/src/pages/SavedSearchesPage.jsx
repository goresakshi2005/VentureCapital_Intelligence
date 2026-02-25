import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedSearches, saveSavedSearches } from '../lib/storage';
// Use simple HTML + Tailwind instead of unavailable UI components
import { Search } from 'lucide-react';

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState([]);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const createSearch = () => {
    // In a real app, you'd capture current search params from context or URL
    // For simplicity, we'll prompt for query/filters later; here just a placeholder
    if (!newName.trim()) return;
    const newSearch = {
      id: Date.now().toString(),
      name: newName,
      query: '', // would be actual query
      filters: {},
    };
    const updated = [...searches, newSearch];
    setSearches(updated);
    saveSavedSearches(updated);
    setNewName('');
  };

  const runSearch = (search) => {
    // For now, navigate to companies with a dummy query
    navigate(`/companies?search=${encodeURIComponent(search.name)}`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Saved Searches</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="New search name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="bg-blue-600 text-white rounded px-3 py-1" onClick={createSearch}>
          Save Current Search
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searches.map((search) => (
          <div key={search.id} className="border rounded p-4">
            <div className="font-semibold text-lg mb-2">{search.name}</div>
            <div>
              <button
                className="border rounded px-2 py-1 text-sm flex items-center"
                onClick={() => runSearch(search)}
              >
                <Search size={16} className="mr-2" /> Run Search
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}