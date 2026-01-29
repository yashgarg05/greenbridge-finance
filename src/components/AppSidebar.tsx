import { Home, Calculator, Sprout, Settings, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'overview', icon: Home, label: 'Home' },
  { id: 'invest', icon: Sprout, label: 'Invest' },
  { id: 'listings', icon: ListChecks, label: 'My Listings', path: '/my-listings' },
  { id: 'calculator', icon: Calculator, label: 'Calculator' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleNavigation = (id: string, path?: string) => {
    if (path) {
      if (location.pathname !== path) {
        navigate(path);
      }
      return;
    }
    // If we are not on dashboard (e.g. on MyListings page) and clicking a dashboard tab (e.g. Overview)
    // The parent's onTabChange handler needs to handle the navigation to dashboard.
    onTabChange(id);
  };

  return (
    <aside className="w-16 border-r border-border bg-card flex flex-col items-center py-4 shrink-0 sticky top-0 h-screen z-40">
      {/* Logo */}
      <Link to="/" className="w-10 h-10 flex items-center justify-center mb-8">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
          <path d="M12 22V13" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 13C16.4183 13 20 9.41828 20 5C20 3.89543 19.1046 3 18 3C16.8954 3 16 3.89543 16 5C16 6.10457 15.1046 7 14 7C12.8954 7 12 6.10457 12 5C12 3.89543 11.1046 3 10 3C8.89543 3 8 3.89543 8 5C8 6.10457 7.10457 7 6 7C4.89543 7 4 6.10457 4 5C4 9.41828 7.58172 13 12 13Z" fill="#22C55E" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id, item.path)}
              title={item.label}
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}