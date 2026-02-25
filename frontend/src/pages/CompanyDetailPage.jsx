import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompany, enrichCompany } from '../lib/api';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [note, setNote] = useState('');
  const [enrichment, setEnrichment] = useState(null);
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [lists, setLists] = useState([]);
  const [selectedLists, setSelectedLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

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

  if (!company) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{company.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noreferrer">{company.website}</a></p>
              <p><strong>Industry:</strong> {company.industry}</p>
              <p><strong>Location:</strong> {company.location}</p>
              <p><strong>Founded:</strong> {company.founded}</p>
              <p><strong>Total Funding:</strong> {company.total_funding}</p>
              <p><strong>Description:</strong> {company.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Signals Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{company.last_signal || 'No recent signals'}</p>
              {/* Placeholder for more signals */}
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
                <p><strong>Summary:</strong> {enrichment.summary}</p>
                <div className="mt-2">
                  <strong>What they do:</strong>
                  <ul className="list-disc pl-5">
                    {enrichment.what_they_do.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <strong>Keywords:</strong> {enrichment.keywords.join(', ')}
                </div>
                <div className="mt-2">
                  <strong>Derived Signals:</strong> {enrichment.derived_signals.join(', ')}
                </div>
                <p className="text-sm text-gray-500 mt-2">Source: {enrichment.sources[0]}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Button onClick={handleEnrich} disabled={enrichLoading} className="w-full">
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
                  <Button onClick={handleCreateList}>Create</Button>
                </div>
                <Button onClick={handleSaveToList} className="w-full">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}