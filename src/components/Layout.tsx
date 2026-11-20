import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Activity, Building2, Calendar, LayoutDashboard, Mail, Menu, Moon, RotateCcw, Search, Sun, TrendingUp, Users, X } from 'lucide-react';
import { store, useStore } from '../store';

const navItems = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/contacts', label: 'Contacts', Icon: Users },
  { to: '/companies', label: 'Companies', Icon: Building2 },
  { to: '/deals', label: 'Deals', Icon: TrendingUp },
  { to: '/activities', label: 'Activities', Icon: Activity },
  { to: '/templates', label: 'Templates', Icon: Mail },
  { to: '/events', label: 'Events', Icon: Calendar },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem('crm_dark') === 'true'; }
    catch { return false; }
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchButton = useRef<HTMLButtonElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const contacts = useStore(store.getContacts);
  const companies = useStore(store.getCompanies);
  const deals = useStore(store.getDeals);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    try { localStorage.setItem('crm_dark', String(darkMode)); }
    catch { /* Keep the current theme even if preferences cannot be persisted. */ }
  }, [darkMode]);

  useEffect(() => {
    setShowSearch(false);
    setSearchQuery('');
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    if (showSearch) searchInput.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setShowSearch(true);
        searchInput.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const matches = (text: string) => text.toLowerCase().includes(query);
  const results = query.length < 2 ? [] : [
    ...contacts.filter(c => matches(`${c.first_name} ${c.last_name} ${c.email}`)).slice(0, 3)
      .map(c => ({ type: 'Contact', text: `${c.first_name} ${c.last_name}`, detail: c.email, to: `/contacts/${c.id}` })),
    ...companies.filter(c => matches(`${c.name} ${c.industry}`)).slice(0, 3)
      .map(c => ({ type: 'Company', text: c.name, detail: c.industry, to: `/companies/${c.id}` })),
    ...deals.filter(d => matches(`${d.name} ${d.owner}`)).slice(0, 3)
      .map(d => ({ type: 'Deal', text: d.name, detail: d.owner, to: `/deals/${d.id}` })),
  ];

  return (
    <div className="min-h-screen flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 lg:static lg:visible ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6 dark:border-gray-700">
          <span className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white"><TrendingUp className="h-5 w-5" />CRM Pro</span>
          <button type="button" onClick={() => setSidebarOpen(false)} aria-label="Close menu" className="lg:hidden text-gray-500"><X className="h-5 w-5" /></button>
        </div>
        <nav className="space-y-1 p-4" aria-label="Main navigation">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
              <Icon className="h-5 w-5" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button type="button" onClick={() => { if (confirm('Reset all data to defaults?')) store.resetData(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
            <RotateCcw className="h-4 w-4" />Reset Demo Data
          </button>
        </div>
      </aside>
      {sidebarOpen && <div aria-hidden="true" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80 lg:px-6">
          <button type="button" onClick={() => setSidebarOpen(true)} aria-label="Open menu" aria-expanded={sidebarOpen} className="text-gray-500 lg:hidden"><Menu className="h-6 w-6" /></button>
          <div className="relative max-w-md flex-1" onKeyDown={event => {
            if (event.key === 'Escape' && showSearch) {
              event.preventDefault();
              setShowSearch(false);
              setSearchQuery('');
              searchButton.current?.focus();
            }
          }}>
            <button ref={searchButton} type="button" onClick={() => setShowSearch(open => !open)} aria-expanded={showSearch} className="flex w-full items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
              <Search className="h-4 w-4" />Search...<kbd className="ml-auto text-xs">Ctrl/⌘ K</kbd>
            </button>
            {showSearch && (
              <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                <input ref={searchInput} value={searchQuery} onChange={event => setSearchQuery(event.target.value)} aria-label="Search contacts, companies and deals" placeholder="Search contacts, companies, deals..." className="w-full rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900 dark:bg-gray-900 dark:text-white" />
                {query.length >= 2 && results.length === 0 && <p role="status" className="p-2 text-sm text-gray-500">No results found</p>}
                {results.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {results.map(result => (
                      <li key={result.to}>
                        <Link to={result.to} onClick={() => { setShowSearch(false); setSearchQuery(''); }} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <span className="w-16 shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400">{result.type}</span>
                          <span className="min-w-0"><span className="block truncate text-sm text-gray-900 dark:text-white">{result.text}</span><span className="block truncate text-xs text-gray-500">{result.detail}</span></span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setDarkMode(mode => !mode)} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} className="rounded-lg p-2 text-gray-500 dark:text-gray-400">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </header>
        <main className="flex-1 bg-gray-50 p-4 dark:bg-gray-950 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
