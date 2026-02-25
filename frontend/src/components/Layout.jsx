import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Building2, List, Save, User } from 'lucide-react';
import Header from './Header';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function Layout() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/companies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white dark:bg-surface border-r border-gray-200 dark:border-border flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary">VC Intelligence</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <Link to="/companies" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
            <Building2 size={20} /> Companies
          </Link>
          <Link to="/lists" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
            <List size={20} /> Lists
          </Link>
          <Link to="/saved" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
            <Save size={20} /> Saved Searches
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-dark rounded-full flex items-center justify-center">
              <User size={18} className="text-primary-600 dark:text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-text-secondary">VC User</span>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white dark:bg-surface border-r border-gray-200 dark:border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-600 dark:text-primary">VC Intel</h2>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-surface-light">
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              <Link to="/companies" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
                <Building2 size={20} /> Companies
              </Link>
              <Link to="/lists" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
                <List size={20} /> Lists
              </Link>
              <Link to="/saved" className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-text-secondary hover:bg-gray-100 dark:hover:bg-surface-light rounded-lg transition-colors">
                <Save size={20} /> Saved Searches
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}