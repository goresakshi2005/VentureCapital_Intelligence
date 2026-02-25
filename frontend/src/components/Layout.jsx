import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Building2, List, Search, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/companies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-6">VC Intel</h1>
        <nav className="space-y-2">
          <Link to="/companies" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
            <Building2 size={18} /> Companies
          </Link>
          <Link to="/lists" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
            <List size={18} /> Lists
          </Link>
          <Link to="/saved" className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded">
            <Save size={18} /> Saved Searches
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar with global search */}
        <header className="border-b p-4 flex items-center gap-4">
          <form onSubmit={handleSearch} className="flex-1 max-w-md flex gap-2">
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="sm">
              <Search size={16} />
            </Button>
          </form>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}