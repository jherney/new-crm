import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, TrendingUp, Calendar,
  Mail, Activity, Menu, X, Sun, Moon, Search, RotateCcw
} from 'lucide-react';
import { store } from '../store';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/contacts', icon: Users, label: 'Contacts' },
  { path: '/companies', icon: Building2, label: 'Companies' },
  { path: '/deals', icon: TrendingUp, label: 'Deals' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/templates', icon: Mail, label: 'Templates' },
  { path: '/events', icon: Calendar, label: 'Events' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('crm_dark') === 'true';
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('crm_dark', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  const handleReset = () => {
    if (confirm('Reset all data to defaults?')) {
      store.resetData();
    }
  };

  // Search across all entities
  const searchResults = searchQuery.length > 1 ? [
    ...store.getContacts().filter(c =>
      `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3).map(c => ({ type: 'Contact' as const, label: `${c.first_name} ${c.last_name}`, sub: c.email, path: `/contacts/${c.id}` })),
    ...store.getCompanies().filter(c =>
      `${c.name} ${c.industry}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3).map(c => ({ type: 'Company' as const, label: c.name, sub: c.industry, path: `/companies/${c.id}` })),
    ...store.getDeals().filter(d =>
      `${d.name} ${d.owner}`.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 3).map(d => ({ type: 'Deal' as const, label: d.name, sub: `$${d.value.toLocaleString()}`, path: `/deals/${d.id}` })),
  ] : [];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">CRM Pro</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Demo Data
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6 gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <Menu className="w-6 h-6" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <span className="ml-auto text-xs bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
            </button>
            {showSearch && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search contacts, companies, deals..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none"
                />
                {searchResults.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {searchResults.map((r, i) => (
                      <a
                        key={i}
                        href={r.path}
                        onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 w-16">{r.type}</span>
                        <div>
                          <div className="text-sm text-gray-900 dark:text-white">{r.label}</div>
                          <div className="text-xs text-gray-500">{r.sub}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleDark} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
