import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { listingService, Listing } from "@/services/listingService";
import { Check, X, Trash2, AlertCircle, Search, Filter, Database } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { dataService } from "@/services/dataService";

const AdminDashboard = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const [filter, setFilter] = useState<'All' | 'Pending' | 'Verified'>('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadListings();
        // Poll for updates (simulate real-time)
        const interval = setInterval(loadListings, 2000);
        return () => clearInterval(interval);
    }, []);

    const loadListings = () => {
        setListings(listingService.getAll());
    };

    const handleApprove = (id: string) => {
        listingService.updateStatus(id, 'Verified');
        toast.success("Project Approved", { description: "The listing is now live on the marketplace." });
        loadListings();
    };

    const handleReject = (id: string) => {
        listingService.updateStatus(id, 'Rejected');
        toast.error("Project Rejected", { description: "The submitter has been notified." });
        loadListings();
    };

    const handleDelete = (id: string) => {
        listingService.deleteListing(id);
        toast.info("Project Deleted");
        loadListings();
    };

    const filteredListings = listings.filter(l => {
        const matchesFilter = filter === 'All' || l.status === filter;
        const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) ||
            l.location.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="flex bg-background min-h-screen font-sans">
            <AppSidebar activeTab="admin" onTabChange={() => { }} />

            <main className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-end mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Admin Command Center</h1>
                        <p className="text-muted-foreground mt-1">Manage project approvals and marketplace compliance.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 rounded-full glass-card flex items-center gap-2 text-sm font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            Live Mode
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="glass-card border-amber-500/20 bg-amber-500/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-amber-600 dark:text-amber-400">Pending Approvals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold glow-text">{listings.filter(l => l.status === 'Pending').length}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{listings.length}</div>
                        </CardContent>
                    </Card>
                    <Card className="glass-card">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Market Volume (Est.)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-emerald-500">₹2.4Cr</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Control Panel */}
                <Card className="glass-panel flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-border/40 flex gap-4 items-center">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                className="pl-9 bg-background/50 border-border/40 focus:border-amber-500/50"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            {(['All', 'Pending', 'Verified'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filter === tab
                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                        : 'text-muted-foreground hover:bg-muted'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    No projects found matching your filters.
                                </div>
                            ) : (
                                filteredListings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-semibold text-lg">{listing.title}</h3>
                                                <Badge variant={
                                                    listing.status === 'Verified' ? 'default' :
                                                        listing.status === 'Rejected' ? 'destructive' : 'secondary'
                                                } className={
                                                    listing.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30' :
                                                        listing.status === 'Pending' ? 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/30' : ''
                                                }>
                                                    {listing.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">📍 {listing.location}</span>
                                                <span className="flex items-center gap-1">💰 ₹{listing.price}</span>
                                                <span className="flex items-center gap-1">🌱 {listing.credits} Credits</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-2xl">{listing.description}</p>
                                        </div>

                                        <div className="flex items-center gap-2 mt-4 md:mt-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                            {listing.status === 'Pending' && (
                                                <>
                                                    <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => handleApprove(listing.id)}>
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleReject(listing.id)}>
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-red-500" onClick={() => handleDelete(listing.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;
