import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowRight, Leaf, Scale, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, CURRENT_ETS_PRICE } from '@/lib/cbam-calculator';

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

const stats = [
  {
    label: 'Est. Annual CBAM Liability',
    value: '€127,420',
    change: '+12.4%',
    trend: 'up',
    description: 'Based on current import volumes',
  },
  {
    label: 'Credits Acquired',
    value: '2,450 tCO₂e',
    change: '-8.2%',
    trend: 'down',
    description: 'Offset coverage: 68%',
  },
  {
    label: 'Compliance Score',
    value: '72%',
    change: '+5%',
    trend: 'up',
    description: '3 items pending',
  },
  {
    label: 'Active Suppliers',
    value: '14',
    change: '+2',
    trend: 'up',
    description: '11 verified, 3 pending',
  },
];

const quickActions = [
  {
    id: 'calculator',
    title: 'Calculate CBAM Liability',
    description: 'Estimate costs for new imports',
    icon: Scale,
  },
  {
    id: 'marketplace',
    title: 'Browse Credits',
    description: 'Find verified carbon offsets',
    icon: Leaf,
  },
  {
    id: 'documents',
    title: 'Upload Documents',
    description: 'Complete your compliance file',
    icon: FileCheck,
  },
];

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, Sarah</h2>
            <p className="text-muted-foreground mt-1">
              Your CBAM dashboard • Last updated: Today at 09:42 CET
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card border border-border">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">EU ETS Price</p>
              <p className="text-lg font-bold financial-value">{formatCurrency(CURRENT_ETS_PRICE)}</p>
            </div>
            <div className="flex items-center gap-1 text-success text-sm">
              <TrendingUp className="h-4 w-4" />
              <span>+2.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="data-card">
            <CardContent className="pt-4">
              <p className="metric-label">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold font-mono">{stat.value}</p>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="data-card p-4 text-left group hover:border-primary/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  <ArrowRight className="h-4 w-4 text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <div className="space-y-3">
            <Card className="data-card border-warning/30 bg-warning/5">
              <CardContent className="pt-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Report Due Soon</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Q4 2024 CBAM report due in 18 days
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="data-card border-destructive/30 bg-destructive/5">
              <CardContent className="pt-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Missing Certificate</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supplier "Steel Co." hasn't submitted verification
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="data-card border-success/30 bg-success/5">
              <CardContent className="pt-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">New Credits Available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    5 new verified projects matching your criteria
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
