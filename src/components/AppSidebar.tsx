import { Home, Calculator, ShoppingCart, FileText, Sprout, ShieldCheck, Trees, BookOpen, Settings, ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'overview', icon: Home, label: 'Home' },
  { id: 'invest', icon: Sprout, label: 'Invest' },
  { id: 'listings', icon: ListChecks, label: 'My Listings' },
  { id: 'compliance', icon: ShieldCheck, label: 'Compliance' },
  { id: 'calculator', icon: Calculator, label: 'Calculator' },
  { id: 'documents', icon: FileText, label: 'Docs' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function AppSidebar({ activeTab, onTabChange }: AppSidebarProps) {
  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <aside className="w-16 border-r border-border/40 bg-background/50 backdrop-blur-xl flex flex-col items-center py-4 shrink-0 sticky top-0 h-screen z-40 transition-colors duration-300">
      {/* Logo */}
      <Link to="/" className="w-10 h-10 flex items-center justify-center mb-8 bg-primary/10 rounded-xl border border-primary/20 shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6">
          <path d="M12 22V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
          <path d="M12 13C16.4183 13 20 9.41828 20 5C20 3.89543 19.1046 3 18 3C16.8954 3 16 3.89543 16 5C16 6.10457 15.1046 7 14 7C12.8954 7 12 6.10457 12 5C12 3.89543 11.1046 3 10 3C8.89543 3 8 3.89543 8 5C8 6.10457 7.10457 7 6 7C4.89543 7 4 6.10457 4 5C4 9.41828 7.58172 13 12 13Z" fill="currentColor" className="text-primary fill-primary/20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-2 flex-1 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:scale-105'
              )}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}