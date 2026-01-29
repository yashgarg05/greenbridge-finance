import { Button } from '@/components/ui/button';
import { CREDITS_DATA } from '@/lib/credits-data';

function getRating(score: number): { label: string; className: string } {
  if (score >= 90) return { label: 'A', className: 'rating-badge rating-a' };
  if (score >= 80) return { label: 'BBB', className: 'rating-badge rating-b' };
  return { label: 'BB', className: 'rating-badge rating-c' };
}

export function VerifiedSupplyGrid() {
  return (
    <div className="data-card p-0 overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold">Verified Supply</h2>
        <span className="text-xs text-muted-foreground">{CREDITS_DATA.length} projects</span>
      </div>

      <div className="overflow-x-auto">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Project</th>
              <th className="text-right">Price/t</th>
              <th className="text-center">Rating</th>
              <th className="w-20"></th>
            </tr>
          </thead>
          <tbody>
            {CREDITS_DATA.map((credit) => {
              const rating = getRating(credit.qualityScore);
              return (
                <tr key={credit.id}>
                  <td>
                    <div>
                      <p className="font-medium text-sm">{credit.projectName}</p>
                      <p className="text-xs text-muted-foreground">{credit.country}</p>
                    </div>
                  </td>
                  <td className="text-right font-medium">
                    €{credit.pricePerUnit.toFixed(2)}
                  </td>
                  <td className="text-center">
                    <span className={rating.className}>{rating.label}</span>
                  </td>
                  <td>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Buy
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}