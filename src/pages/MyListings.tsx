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

interface Listing {
    id: string;
    title: string;
    category: string;
    price: string;
    credits: string;
    submittedAt: string;
    status: 'Pending' | 'Verified' | 'Rejected';
}

const MyListings = () => {
    const [listings, setListings] = useState<Listing[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedListings = localStorage.getItem('user_listings');
        if (savedListings) {
            setListings(JSON.parse(savedListings));
        }
    }, []);

    const [activeTab, setActiveTab] = useState('listings'); // Dummy state for sidebar

    return (
        <div className="flex bg-background min-h-screen">
            <AppSidebar activeTab="listings" onTabChange={(tab) => {
                if (tab === 'listings') return; // Already here
                navigate('/dashboard', { state: { activeTab: tab } });
            }} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground text-sm flex items-center gap-1 mb-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
                            <p className="text-muted-foreground mt-1">
                                Track the status of your submitted projects.
                            </p>
                        </div>
                        <Button onClick={() => navigate('/dashboard', { state: { activeTab: 'invest', openListingModal: true } })} className="gap-2">
                            <Plus className="w-4 h-4" /> Submit New Project
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Submitted Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {listings.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>You haven't listed any projects yet.</p>
                                    <Button variant="link" onClick={() => navigate('/dashboard')} className="mt-2">
                                        Go to Marketplace to list a project
                                    </Button>
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
                                            <TableRow key={listing.id}>
                                                <TableCell className="font-medium">{listing.title}</TableCell>
                                                <TableCell>{listing.category}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span>€{listing.price}</span>
                                                        <span className="text-muted-foreground">{listing.credits} Credits</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-xs">
                                                    {new Date(listing.submittedAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    {listing.status === 'Pending' && (
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
                                                            Pending Verification
                                                        </Badge>
                                                    )}
                                                    {listing.status === 'Verified' && (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                                                            Verified
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
