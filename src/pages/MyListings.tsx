import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { AppSidebar } from "@/components/AppSidebar";

import { CreateListingDialog } from "@/components/CreateListingDialog";
import { listingService, Listing } from "@/services/listingService";

const MyListings = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setListings(listingService.getAll());
    }, []);

    const refreshListings = () => {
        setListings(listingService.getAll());
    };

    return (
        <div className="flex bg-background min-h-screen">
            <AppSidebar activeTab="listings" onTabChange={(tab) => {
                if (tab === 'listings') return; // Already here
                navigate('/dashboard', { state: { activeTab: tab } });
            }} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight glow-text text-foreground">My Listings</h1>
                            <p className="text-muted-foreground mt-1">
                                Track the status of your submitted projects.
                            </p>
                        </div>
                        <CreateListingDialog onListingCreated={refreshListings} />
                    </div>

                    <Card className="glass-panel">
                        <CardHeader>
                            <CardTitle>Submitted Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {listings.filter(l => l.status !== 'Rejected').length === 0 && listings.length > 0 ? (
                                // No active listings (all rejected?? or simplify check)
                                // Actually let's just show all
                                <></>
                            ) : null}

                            {listings.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>You haven't listed any projects yet.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Project Title</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price / Credits</TableHead>
                                            <TableHead>Date Submitted</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {listings.map((listing) => (
                                            <TableRow key={listing.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-medium">{listing.title}</TableCell>
                                                <TableCell>{listing.category}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span>₹{listing.price}</span>
                                                        <span className="text-muted-foreground">{listing.credits} Credits</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {new Date(listing.submittedAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {listing.status === 'Pending' && (
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                                                            Pending Review
                                                        </Badge>
                                                    )}
                                                    {listing.status === 'Verified' && (
                                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                                                            Live
                                                        </Badge>
                                                    )}
                                                    {listing.status === 'Rejected' && (
                                                        <Badge variant="destructive">
                                                            Rejected
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default MyListings;
