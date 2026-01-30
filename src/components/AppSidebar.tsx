import { Home, Calculator, ShoppingCart, FileText, Sprout, ShieldCheck, Trees, BookOpen, Settings, ListChecks, TrendingUp } from 'lucide-react';
import { GreenBridgeLogo } from './GreenBridgeLogo';
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
    <aside className="w-16 border-r border-border bg-card flex flex-col items-center py-4 shrink-0 sticky top-0 h-screen z-40">
      {/* Logo */}
      <Link to="/" className="w-12 h-12 flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
        <GreenBridgeLogo showText={false} size="md" />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
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
      {/* Theme Toggle */}
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </aside>
  );
}