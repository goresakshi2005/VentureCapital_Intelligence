import { useState, useEffect } from 'react';
import { getLists, deleteList } from '../lib/storage';
import { getCompany } from '../lib/api';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export default function ListsPage() {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [companyMap, setCompanyMap] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);

  const fetchLists = () => {
    const stored = getLists();
    setLists(stored);

    const companyIds = [...new Set(stored.flatMap((l) => l.companyIds))];
    Promise.all(companyIds.map((id) => getCompany(id).catch(() => null))).then((companies) => {
      const map = {};
      companies.forEach((c) => {
        if (c) map[c.id] = c;
      });
      setCompanyMap(map);
    });
  };

  useEffect(() => {
    fetchLists();
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

  const handleDeleteClick = (list) => {
    setListToDelete(list);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (listToDelete) {
      const updated = deleteList(listToDelete.id);
      setLists(updated);
      setDeleteDialogOpen(false);
      setListToDelete(null);
    }
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
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Lists</h1>
      <div className="flex gap-2 mb-6">
        <input
          className="border rounded-lg px-3 py-2 flex-1 dark:bg-gray-800 dark:border-gray-700"
          placeholder="New list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <Button onClick={createList} className="bg-primary-600 hover:bg-primary-700">
          Create List
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists.map((list) => (
          <div key={list.id} className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{list.name}</h3>
                <p className="text-sm text-gray-500">{list.companyIds.length} companies</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(list)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="mt-3 space-y-1 max-h-40 overflow-auto">
              {list.companyIds.map((id) => {
                const company = companyMap[id];
                return company ? (
                  <div key={id}>
                    <Link to={`/companies/${id}`} className="text-primary-600 hover:underline text-sm">
                      {company.name}
                    </Link>
                  </div>
                ) : null;
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportList(list)}
              className="mt-3"
            >
              Export CSV
            </Button>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete List?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{listToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}