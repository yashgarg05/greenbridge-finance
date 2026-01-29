import { Leaf, Moon, Sun, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function DashboardHeader() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Default to dark mode
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Green<span className="text-primary">Flux</span>
            </h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">EU ETS:</span>
            <span className="text-foreground">€85.50</span>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
