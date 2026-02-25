import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { getCompanies, addCompany, deleteCompany } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Plus, Trash2 } from 'lucide-react';

export default function CompaniesPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCompanyUrl, setNewCompanyUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const globalFilter = searchParams.get('search') || '';

  const fetchCompanies = () => {
    setLoading(true);
    setError('');
    getCompanies()
      .then((companies) => {
        setData(companies);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch companies', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load companies');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!newCompanyUrl.trim()) return;
    setIsAdding(true);
    setAddError('');
    try {
      await addCompany(newCompanyUrl);
      await fetchCompanies();
      setIsAddDialogOpen(false);
      setNewCompanyUrl('');
    } catch (error) {
      setAddError(error.response?.data?.error || 'Failed to add company');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    try {
      await deleteCompany(companyToDelete.id);
      await fetchCompanies();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <button
            className="text-primary-600 dark:text-primary hover:underline font-medium"
            onClick={() => navigate(`/companies/${row.original.id}`)}
          >
            {row.original.name}
          </button>
        ),
      },
      { accessorKey: 'industry', header: 'Industry' },
      { accessorKey: 'location', header: 'Location' },
      { accessorKey: 'total_funding', header: 'Total Funding' },
      { accessorKey: 'last_signal', header: 'Last Signal' },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(row.original)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-accent-red dark:hover:bg-red-950/30"
          >
            <Trash2 size={16} />
          </Button>
        ),
      },
    ],
    [navigate]
  );

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-text-secondary">Loading...</div>;
  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-600 dark:text-accent-red">
        Error: {error}
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-text-primary">Companies</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700 dark:bg-primary dark:hover:bg-primary-dark">
              <Plus size={16} className="mr-2" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-text-secondary">Company Website URL</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={newCompanyUrl}
                  onChange={(e) => setNewCompanyUrl(e.target.value)}
                  required
                />
              </div>
              {addError && <p className="text-red-500 dark:text-accent-red text-sm">{addError}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Company'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-surface shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-500 dark:text-text-muted">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {companyToDelete?.name}. This action cannot be undone.
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