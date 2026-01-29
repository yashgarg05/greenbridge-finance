import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, Check, X, Scale } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CREDITS_DATA, getTypeLabel, getQualityLabel, type GreenCredit, type CreditType } from '@/lib/credits-data';
import { formatCurrency } from '@/lib/cbam-calculator';

export function CreditMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<CreditType | 'all'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'price' | 'quality' | 'name'>('quality');

  const filteredCredits = useMemo(() => {
    return CREDITS_DATA
      .filter((credit) => {
        const matchesSearch = credit.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          credit.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || credit.type === typeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'price') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'quality') return b.qualityScore - a.qualityScore;
        return a.projectName.localeCompare(b.projectName);
      });
  }, [searchTerm, typeFilter, sortBy]);

  const selectedCredits = useMemo(() => {
    return CREDITS_DATA.filter((c) => selectedIds.has(c.id));
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else if (newSet.size < 3) {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const clearSelection = () => setSelectedIds(new Set());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Verified Credit Marketplace</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Browse and compare carbon and green credit projects
          </p>
        </div>
        {selectedIds.size > 0 && (
          <Button variant="outline" size="sm" onClick={clearSelection}>
            <X className="h-4 w-4 mr-1" />
            Clear ({selectedIds.size})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects or countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as CreditType | 'all')}>
          <SelectTrigger className="w-[160px] bg-background">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="carbon">Carbon Credits</SelectItem>
            <SelectItem value="india-gcp">India GCP</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'price' | 'quality' | 'name')}>
          <SelectTrigger className="w-[160px] bg-background">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quality">Quality Score</SelectItem>
            <SelectItem value="price">Price (Low-High)</SelectItem>
            <SelectItem value="name">Project Name</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Comparison Panel */}
      {selectedCredits.length >= 2 && (
        <Card className="data-card glow-accent border-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Scale className="h-4 w-4 text-accent" />
              Cost Comparison (1 Tonne Offset)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {selectedCredits.map((credit) => (
                <div key={credit.id} className="text-center p-3 rounded-lg bg-muted/30">
                  <p className="text-xs text-muted-foreground truncate">{credit.projectName}</p>
                  <p className="text-2xl font-bold financial-value mt-1">
                    {formatCurrency(credit.pricePerUnit)}
                  </p>
                  <p className="text-xs text-muted-foreground">per tCO₂e</p>
                </div>
              ))}
            </div>
            {selectedCredits.length === 2 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Savings:{' '}
                <span className="font-mono text-success">
                  {formatCurrency(Math.abs(selectedCredits[0].pricePerUnit - selectedCredits[1].pricePerUnit))}
                </span>{' '}
                per tonne choosing the lower-cost option
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Credits Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="w-[50px]">Compare</th>
                <th>Project Name</th>
                <th className="w-[120px]">Type</th>
                <th className="w-[100px] text-right">Price/Unit</th>
                <th className="w-[100px] text-center">Quality</th>
                <th className="w-[100px]">Country</th>
                <th className="w-[80px] text-center">Vintage</th>
              </tr>
            </thead>
            <tbody>
              {filteredCredits.map((credit) => {
                const isSelected = selectedIds.has(credit.id);
                const quality = getQualityLabel(credit.qualityScore);
                
                return (
                  <tr
                    key={credit.id}
                    className={isSelected ? 'bg-primary/5' : ''}
                  >
                    <td>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(credit.id)}
                        disabled={!isSelected && selectedIds.size >= 3}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {credit.verified && (
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                        )}
                        <span className="font-medium">{credit.projectName}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${credit.type === 'carbon' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                        {getTypeLabel(credit.type)}
                      </span>
                    </td>
                    <td className="text-right font-mono">
                      {formatCurrency(credit.pricePerUnit)}
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`status-badge status-badge-${quality.variant}`}>
                          {credit.qualityScore}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{credit.country}</td>
                    <td className="text-center font-mono text-muted-foreground">
                      {credit.vintage}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Select up to 3 projects to compare offset costs • All credits verified by independent registries
      </p>
    </div>
  );
}
