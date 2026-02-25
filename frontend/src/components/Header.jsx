import { Search, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

export default function Header({ searchQuery, setSearchQuery, onSearch, mobileOpen, setMobileOpen }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') setIsDark(true);
      else if (stored === 'light') setIsDark(false);
      else setIsDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (e) {}
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 -ml-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setMobileOpen && setMobileOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">VI</div>
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">VC Intel</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Deal intelligence & lists</div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-6">
        <form onSubmit={onSearch} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button type="submit" size="sm">
            <Search size={16} />
          </Button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-primary-600 dark:text-primary-300">U</span>
        </div>
      </div>
    </header>
  );
}
