import { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { DashboardNav } from '@/components/DashboardNav';
import { DashboardOverview } from '@/components/DashboardOverview';
import { CBAMCalculator } from '@/components/CBAMCalculator';
import { CreditMarketplace } from '@/components/CreditMarketplace';
import { DocumentVault } from '@/components/DocumentVault';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <CBAMCalculator />;
      case 'marketplace':
        return <CreditMarketplace />;
      case 'documents':
        return <DocumentVault />;
      default:
        return <DashboardOverview onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container py-6">
        <div className="animate-slide-up">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2024 GreenFlux. CBAM Compliance Platform.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Documentation</a>
            <a href="#" className="hover:text-foreground transition-colors">API</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
