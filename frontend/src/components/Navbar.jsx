import { Link, NavLink } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') setIsDark(true);
    else if (stored === 'light') setIsDark(false);
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/companies', label: 'Companies' },
    { to: '/lists', label: 'Lists' },
    { to: '/saved', label: 'Saved Searches' },
  ];

  return (
    <nav className="sticky top-[46px] z-30 bg-navy-800/50 backdrop-blur-md border-b border-white/10 py-3 px-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-white font-bold">
            VI
          </div>
          <span className="text-xl font-semibold text-white">VC Intel</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-neon-purple ${
                  isActive ? 'text-neon-purple' : 'text-gray-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={toggleTheme} className="text-gray-300 hover:text-white">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <div className="hidden md:block w-8 h-8 bg-neon-purple/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-neon-purple">U</span>
          </div>
          <button
            className="md:hidden p-2 rounded hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-2 pb-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 text-sm transition hover:text-neon-purple ${
                  isActive ? 'text-neon-purple' : 'text-gray-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}