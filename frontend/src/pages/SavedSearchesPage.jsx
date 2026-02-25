import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedSearches, deleteSavedSearch, saveSavedSearches } from '../lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Search, Trash2 } from 'lucide-react';

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState([]);
  const [newName, setNewName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchToDelete, setSearchToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const createSearch = () => {
    if (!newName.trim()) return;
    const newSearch = {
      id: Date.now().toString(),
      name: newName,
      query: '',
      filters: {},
    };
    const updated = [...searches, newSearch];
    setSearches(updated);
    saveSavedSearches(updated);
    setNewName('');
  };

  const runSearch = (search) => {
    navigate(`/companies?search=${encodeURIComponent(search.name)}`);
  };

  const handleDeleteClick = (search) => {
    setSearchToDelete(search);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (searchToDelete) {
      const updated = deleteSavedSearch(searchToDelete.id);
      setSearches(updated);
      setDeleteDialogOpen(false);
      setSearchToDelete(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-text-primary">Saved Searches</h1>
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="New search name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={createSearch} className="bg-primary-600 hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-dark">
          Save Current Search
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {searches.map((search) => (
          <div
            key={search.id}
            className="border rounded-lg p-4 bg-white dark:bg-surface border-gray-200 dark:border-border shadow-sm"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-text-primary">{search.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteClick(search)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-accent-red dark:hover:bg-red-950/30"
              >
                <Trash2 size={16} />
              </Button>
            </div>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => runSearch(search)}
                className="flex items-center"
              >
                <Search size={16} className="mr-2" /> Run Search
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Search?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{searchToDelete?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 dark:bg-accent-red dark:hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}