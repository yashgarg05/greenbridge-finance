import { Calculator, ShoppingCart, FileText, LayoutDashboard, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'calculator', label: 'CBAM Calculator', icon: Calculator },
  { id: 'marketplace', label: 'Credit Marketplace', icon: ShoppingCart },
  { id: 'documents', label: 'Document Vault', icon: FileText },
];

export function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  return (
    <nav className="border-b border-border bg-card/50">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange(item.id)}
                className={cn(
                  'flex items-center gap-2 px-4 whitespace-nowrap transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary border-b-2 border-primary rounded-b-none'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
          
          <div className="flex-1" />
          
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>Acme Corp Ltd.</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
