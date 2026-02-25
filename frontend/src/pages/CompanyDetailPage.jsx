import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompany, enrichCompany, deleteCompany } from '../lib/api';
import { getCompanyNote, setCompanyNote, getLists, saveLists } from '../lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Trash2 } from 'lucide-react';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [note, setNote] = useState('');
  const [enrichment, setEnrichment] = useState(null);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    getCompany(id).then(setCompany);
    setNote(getCompanyNote(parseInt(id)));
    setLists(getLists());
  }, [id]);

  const handleNoteChange = (e) => {
    setNote(e.target.value);
    setCompanyNote(parseInt(id), e.target.value);
  };

  const handleEnrich = async () => {
    setEnrichLoading(true);
    try {
      const data = await enrichCompany(company.website);
      setEnrichment(data);
    } catch (error) {
      console.error(error);
    } finally {
      setEnrichLoading(false);
    }
  };

  const handleSaveToList = () => {
    const updatedLists = lists.map((list) => {
      if (selectedLists[list.id]) {
        if (!list.companyIds.includes(parseInt(id))) {
          list.companyIds.push(parseInt(id));
        }
      } else {
        list.companyIds = list.companyIds.filter((cid) => cid !== parseInt(id));
      }
      return list;
    });
    setLists(updatedLists);
    saveLists(updatedLists);
    setDialogOpen(false);
  };

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      description: '',
      companyIds: [parseInt(id)],
    };
    const updated = [...lists, newList];
    setLists(updated);
    saveLists(updated);
    setNewListName('');
  };

  const handleDelete = async () => {
    try {
      await deleteCompany(parseInt(id));
      navigate('/companies');
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (!company) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 dark:text-secondary dark:hover:text-primary"
        >
          <ArrowLeft size={20} className="mr-1" /> Back
        </button>
        <Button
          variant="ghost"
          onClick={() => setDeleteDialogOpen(true)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-accent-red dark:hover:bg-red-950/30"
        >
          <Trash2 size={18} className="mr-2" /> Delete Company
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-primary">{company.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><span className="font-medium">Website:</span> <a href={company.website} target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary hover:underline">{company.website}</a></p>
              <p><span className="font-medium">Industry:</span> {company.industry}</p>
              <p><span className="font-medium">Location:</span> {company.location}</p>
              <p><span className="font-medium">Founded:</span> {company.founded || 'N/A'}</p>
              <p><span className="font-medium">Total Funding:</span> {company.total_funding || 'N/A'}</p>
              <p><span className="font-medium">Description:</span> {company.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signals Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{company.last_signal || 'No recent signals'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={note}
                onChange={handleNoteChange}
                placeholder="Add your notes here..."
                rows={4}
              />
            </CardContent>
          </Card>

          {enrichment && (
            <Card>
              <CardHeader>
                <CardTitle>Enriched Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p><span className="font-medium">Summary:</span> {enrichment.summary}</p>
                <div className="mt-2">
                  <span className="font-medium">What they do:</span>
                  <ul className="list-disc pl-5 mt-1">
                    {enrichment.what_they_do.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <span className="font-medium">Keywords:</span> {enrichment.keywords.join(', ')}
                </div>
                <div className="mt-2">
                  <span className="font-medium">Derived Signals:</span> {enrichment.derived_signals.join(', ')}
                </div>
                <p className="text-sm text-gray-500 dark:text-muted mt-2">Source: {enrichment.sources[0]}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={handleEnrich} disabled={enrichLoading} className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-dark">
            {enrichLoading ? 'Enriching...' : 'Enrich Company'}
          </Button>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">Save to List</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Lists</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {lists.map((list) => (
                  <div key={list.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={list.id}
                      checked={selectedLists[list.id] || false}
                      onCheckedChange={(checked) =>
                        setSelectedLists({ ...selectedLists, [list.id]: checked })
                      }
                    />
                    <Label htmlFor={list.id}>{list.name}</Label>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="New list name"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <Button onClick={handleCreateList} variant="outline">Create</Button>
                </div>
                <Button onClick={handleSaveToList} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {company.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 dark:bg-accent-red dark:hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}