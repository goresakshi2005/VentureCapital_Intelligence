import { useState, useEffect } from 'react';
import { getLists, saveLists } from '../lib/storage';
import { getCompany } from '../lib/api';
// Using simple HTML + Tailwind instead of unavailable UI components
import { Link } from 'react-router-dom';

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [companyMap, setCompanyMap] = useState({});

  useEffect(() => {
    const stored = getLists();
    setLists(stored);

    // Fetch company details for all companies in lists
    const companyIds = [...new Set(stored.flatMap((l) => l.companyIds))];
    Promise.all(companyIds.map((id) => getCompany(id))).then((companies) => {
      const map = {};
      companies.forEach((c) => (map[c.id] = c));
      setCompanyMap(map);
    });
  }, []);

  const createList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      description: '',
      companyIds: [],
    };
    const updated = [...lists, newList];
    setLists(updated);
    saveLists(updated);
    setNewListName('');
  };

  const exportList = (list) => {
    const companies = list.companyIds.map((id) => companyMap[id]).filter(Boolean);
    const csv = [
      ['Name', 'Website', 'Industry', 'Location', 'Funding'],
      ...companies.map((c) => [c.name, c.website, c.industry, c.location, c.total_funding]),
    ]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${list.name}.csv`;
    a.click();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lists</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded px-3 py-1"
          onClick={createList}
        >
          Create List
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => (
          <div key={list.id} className="border rounded p-4">
            <div className="font-semibold text-lg mb-2">{list.name}</div>
            <p className="text-sm text-gray-500 mb-2">{list.companyIds.length} companies</p>
            <div className="space-y-1 max-h-40 overflow-auto mb-2">
              {list.companyIds.map((id) => {
                const company = companyMap[id];
                return company ? (
                  <div key={id}>
                    <Link to={`/companies/${id}`} className="text-blue-600 hover:underline">
                      {company.name}
                    </Link>
                  </div>
                ) : null;
              })}
            </div>
            <button
              className="mt-2 border rounded px-2 py-1 text-sm"
              onClick={() => exportList(list)}
            >
              Export CSV
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}