import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sprout,
    Wind,
    Droplets,
    Sun,
    CheckCircle2,
    ArrowRight,
    Filter,
    Search,
    Factory,
    Upload,
    Plus
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell } from "lucide-react";


import { projects, Project, ProjectType, QualityRating } from '@/data/projects';

// --- Types ---
type ListingStatus = 'Pending' | 'Verified' | 'Rejected';

interface UserListing {
    id: string;
    title: string;
    category: string;
    description: string;
    price: string;
    credits: string;
    status: ListingStatus;
    submittedAt: string;
}

// --- Data ---
// Imported from @/data/projects

// --- Components ---

// --- Components ---

const CategoryBadge = ({ category }: { category: ProjectType }) => {
    const styles = {
        'Solar': {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-700 dark:text-amber-400',
            border: 'border-amber-200 dark:border-amber-800',
            icon: Sun
        },
        'Forestry': {
            bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            text: 'text-emerald-700 dark:text-emerald-400',
            border: 'border-emerald-200 dark:border-emerald-800',
            icon: Sprout
        },
        'Wind': {
            bg: 'bg-sky-50 dark:bg-sky-900/20',
            text: 'text-sky-700 dark:text-sky-400',
            border: 'border-sky-200 dark:border-sky-800',
            icon: Wind
        },
        'Water': {
            bg: 'bg-cyan-50 dark:bg-cyan-900/20',
            text: 'text-cyan-700 dark:text-cyan-400',
            border: 'border-cyan-200 dark:border-cyan-800',
            icon: Droplets
        },
        'Direct Air Capture': {
            bg: 'bg-slate-50 dark:bg-slate-900/20',
            text: 'text-slate-700 dark:text-slate-400',
            border: 'border-slate-200 dark:border-slate-800',
            icon: Factory
        }
    };

    const style = styles[category] || styles['Forestry'];
    const Icon = style.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${style.bg} ${style.text} ${style.border}`}>
            <Icon className="w-3.5 h-3.5" />
            {category}
        </span>
    );
};

const QualityBadge = ({ rating }: { rating: QualityRating }) => {
    const colors = {
        'AAA': 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
        'AA': 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800',
        'A': 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800',
        'B+': 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800',
    };

    return (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${colors[rating]}`}>
            {rating}
        </span>
    );
};

export const GreenInvestment = ({ initialOpenListing = false }: { initialOpenListing?: boolean }) => {
    // User Listings State
    const [myListings, setMyListings] = useState<UserListing[]>(() => {
        const saved = localStorage.getItem('user_listings');
        return saved ? JSON.parse(saved) : [];
    });
    const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('user_listings', JSON.stringify(myListings));
    }, [myListings]);

    const simulateVerification = (id: string, newStatus: ListingStatus) => {
        toast({
            title: "Processing Verification...",
            description: "Simulating admin review process.",
        });

        setTimeout(() => {
            setMyListings(prev => prev.map(item =>
                item.id === id ? { ...item, status: newStatus } : item
            ));

            toast({
                title: `Project ${newStatus}`,
                description: `The project has been marked as ${newStatus}.`,
                variant: newStatus === 'Verified' ? 'default' : 'destructive'
            });
        }, 1500);
    };

    // Filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [minRating, setMinRating] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');



    const { toast } = useToast();

    // State
    const [isListingOpen, setIsListingOpen] = useState(false);

    useEffect(() => {
        if (initialOpenListing) {
            setIsListingOpen(true);
        }
    }, [initialOpenListing]);
    const [listingForm, setListingForm] = useState({
        title: '',
        description: '',
        location: '',
        category: '',
        price: '',
        credits: '',
        contactName: '',
        contactEmail: ''
    });

    const handleListingSubmit = () => {
        if (!listingForm.title || !listingForm.contactEmail) {
            toast({
                title: "Missing Information",
                description: "Please provide at least a project title and contact email.",
                variant: "destructive"
            });
            return;
        }

        // Create new listing
        const newListing: UserListing = {
            id: Date.now().toString(),
            title: listingForm.title,
            category: listingForm.category,
            description: listingForm.description,
            price: listingForm.price,
            credits: listingForm.credits,
            status: 'Pending',
            submittedAt: new Date().toLocaleDateString()
        };

        setMyListings(prev => [newListing, ...prev]);

        toast({
            title: "Request Submitted Successfully",
            description: "Your project has been submitted for verification. Tracking ID: " + newListing.id,
        });

        setIsListingOpen(false);
        setListingForm({
            title: '',
            description: '',
            location: '',
            category: '',
            price: '',
            credits: '',
            contactName: '',
            contactEmail: ''
        });
    };







    // --- Investment Modal State ---
    const [investProject, setInvestProject] = useState<Project | null>(null);
    const [isInvestOpen, setIsInvestOpen] = useState(false);
    const [investCredits, setInvestCredits] = useState<string>('');
    const [investAmount, setInvestAmount] = useState<string>('');
    const [isNegotiating, setIsNegotiating] = useState(false);
    const [negotiationPrice, setNegotiationPrice] = useState<string>('');
    const [negotiationMessage, setNegotiationMessage] = useState<string>('');

    // --- Price Alert State ---
    const [subscribedProjects, setSubscribedProjects] = useState<string[]>([]);

    const toggleSubscription = (e: React.MouseEvent, project: Project) => {
        e.stopPropagation(); // Prevent card click if necessary
        if (subscribedProjects.includes(project.id)) {
            setSubscribedProjects(prev => prev.filter(id => id !== project.id));
            toast({
                title: "Unsubscribed",
                description: `You will no longer receive price alerts for ${project.title}.`,
            });
        } else {
            setSubscribedProjects(prev => [...prev, project.id]);
            toast({
                title: "Subscribed to Price Alerts",
                description: `We'll notify you when the price drops for ${project.title}.`,
            });
        }
    };

    const openInvestModal = (project: Project) => {
        setInvestProject(project);
        setInvestCredits('10'); // Default
        setInvestAmount((10 * project.pricePerUnit).toFixed(2));
        setIsNegotiating(false);
        setNegotiationPrice('');
        setNegotiationMessage('');
        setIsInvestOpen(true);
    };

    const handleCreditChange = (val: string) => {
        setInvestCredits(val);
        if (investProject && val) {
            const num = parseFloat(val);
            if (!isNaN(num)) {
                setInvestAmount((num * investProject.pricePerUnit).toFixed(2));
            }
        }
    };

    const handleAmountChange = (val: string) => {
        setInvestAmount(val);
        if (investProject && val) {
            const num = parseFloat(val);
            if (!isNaN(num)) {
                setInvestCredits((num / investProject.pricePerUnit).toFixed(2));
            }
        }
    };

    const handleInvestSubmit = () => {
        if (isNegotiating) {
            toast({
                title: "Negotiation Request Sent",
                description: `We have sent your offer of €${negotiationPrice}/unit to the seller. We will notify you via email shortly.`,
            });
        } else {
            toast({
                title: "Investment Processed Successfully",
                description: `You have purchased ${investCredits} tonnes of carbon credits from ${investProject?.title}.`,
            });
        }
        setIsInvestOpen(false);
    };





    // Filter & Sort Logic
    const filteredProjects = useMemo(() => {
        const result = projects.filter(p => {
            if (p.pricePerUnit < priceRange[0] || p.pricePerUnit > priceRange[1]) return false;
            if (selectedType !== 'all' && p.category !== selectedType) return false;
            // Simplified rating filter logic for demo
            if (minRating === 'AAA' && p.qualityRating !== 'AAA') return false;
            if (minRating === 'AA' && (p.qualityRating === 'A' || p.qualityRating === 'B+')) return false;
            return true;
        });

        switch (sortBy) {
            case 'price-asc':
                return [...result].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
            case 'price-desc':
                return [...result].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
            case 'credits-desc':
                return [...result].sort((a, b) => b.creditsPerUnit - a.creditsPerUnit);
            case 'funding-desc':
                return [...result].sort((a, b) => b.fundingPercentage - a.fundingPercentage);
            default:
                return result;
        }
    }, [priceRange, selectedType, minRating, sortBy]);



    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Green Credit Marketplace</h2>
                    <p className="text-muted-foreground">Advanced portfolio management for verified ecological credits.</p>
                </div>
                <div className="flex gap-2">


                    <Button onClick={() => setIsListingOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> List Your Project
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filters & Tools */}
                <div className="space-y-6">


                    {/* Filters */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs">Sort By</Label>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="featured">Featured</SelectItem>
                                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                                        <SelectItem value="credits-desc">Best Credit Yield</SelectItem>
                                        <SelectItem value="funding-desc">Most Funded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Project Type</Label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="Solar">Solar</SelectItem>
                                        <SelectItem value="Forestry">Forestry</SelectItem>
                                        <SelectItem value="Wind">Wind</SelectItem>
                                        <SelectItem value="Direct Air Capture">Direct Air Capture</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs">Min Quality Rating</Label>
                                <Select value={minRating} onValueChange={setMinRating}>
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Any" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Any</SelectItem>
                                        <SelectItem value="AAA">AAA (Highest Integrity)</SelectItem>
                                        <SelectItem value="AA">AA+ (High Integrity)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <Label className="text-xs">Max Price: €{priceRange[1]}</Label>
                                </div>
                                <Slider
                                    defaultValue={[0, 200]}
                                    max={200}
                                    step={5}
                                    value={priceRange}
                                    onValueChange={(val) => setPriceRange([val[0], val[1]])}
                                    className="py-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Project Grid */}
                <div className="lg:col-span-3 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p>No projects match your filters</p>
                            <Button variant="link" onClick={() => { setPriceRange([0, 200]); setSelectedType('all'); }}>Clear Filters</Button>
                        </div>
                    ) : filteredProjects.map((project) => (
                        <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-black/40 text-white border-0 text-[10px] h-5">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                                        {project.verifiedBy}
                                    </Badge>
                                    {project.article6 && (
                                        <Badge variant="secondary" className="backdrop-blur-md bg-indigo-600/90 text-white border-0 text-[10px] h-5 shadow-lg">
                                            Article 6 Compliant
                                        </Badge>
                                    )}
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-black border-0 text-[10px] shadow-sm">
                                        SDG: {project.sdgGoals.join(', ')}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2 px-4 pt-4">
                                <div className="flex justify-between items-start mb-1">
                                    <CategoryBadge category={project.category} />
                                    <QualityBadge rating={project.qualityRating} />
                                </div>
                                <CardTitle className="text-base leading-tight mt-1">{project.title}</CardTitle>
                                <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{project.location}</p>
                            </CardHeader>

                            <CardContent className="px-4 pb-4 space-y-3 flex-1">


                                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{project.description}</p>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[10px] font-medium text-muted-foreground">
                                        <span>Funded</span>
                                        <span>{project.fundingPercentage}%</span>
                                    </div>
                                    <Progress value={project.fundingPercentage} className="h-1.5" />
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center pt-1">
                                    <div>
                                        <p className="font-bold text-base">€{project.pricePerUnit.toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground">per unit</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-green-600">+{project.creditsPerUnit}</p>
                                        <p className="text-[10px] text-muted-foreground">Credits</p>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className={`shrink-0 ${subscribedProjects.includes(project.id) ? "bg-primary text-primary-foreground hover:bg-primary/90" : "text-muted-foreground"}`}
                                    onClick={(e) => toggleSubscription(e, project)}
                                >
                                    <Bell className={`w-4 h-4 ${subscribedProjects.includes(project.id) ? "fill-current" : ""}`} />
                                </Button>
                                <Button size="sm" className="w-full" onClick={() => openInvestModal(project)}>
                                    Invest Now <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Listing Request Modal */}
            <Dialog open={isListingOpen} onOpenChange={setIsListingOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>List Your Project</DialogTitle>
                        <DialogDescription>
                            Submit your green credit project for verification and listing on the GreenBridge Marketplace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title</Label>
                                <Input id="title" placeholder="e.g. Amazon Restoration Phase 2" value={listingForm.title} onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={listingForm.category} onValueChange={(val) => setListingForm({ ...listingForm, category: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Solar">Solar</SelectItem>
                                        <SelectItem value="Forestry">Forestry</SelectItem>
                                        <SelectItem value="Wind">Wind</SelectItem>
                                        <SelectItem value="Water">Water</SelectItem>
                                        <SelectItem value="Direct Air Capture">Direct Air Capture</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea id="desc" placeholder="Describe your project impact, methodology, and goals..." value={listingForm.description} onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" placeholder="e.g. Manaus, Brazil" value={listingForm.location} onChange={(e) => setListingForm({ ...listingForm, location: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assets">Project Images/Docs</Label>
                                <div className="border-2 border-dashed rounded-md p-3 flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors h-10">
                                    <div className="text-center flex items-center gap-2">
                                        <Upload className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Upload Files</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Asking Price (€/unit)</Label>
                                <Input id="price" type="number" placeholder="25.00" value={listingForm.price} onChange={(e) => setListingForm({ ...listingForm, price: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credits">Est. Credits (Tonnes)</Label>
                                <Input id="credits" type="number" placeholder="1000" value={listingForm.credits} onChange={(e) => setListingForm({ ...listingForm, credits: e.target.value })} />
                            </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="contactName">Contact Name</Label>
                                <Input id="contactName" placeholder="John Doe" value={listingForm.contactName} onChange={(e) => setListingForm({ ...listingForm, contactName: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact Email</Label>
                                <Input id="contactEmail" type="email" placeholder="john@example.com" value={listingForm.contactEmail} onChange={(e) => setListingForm({ ...listingForm, contactEmail: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsListingOpen(false)}>Cancel</Button>
                        <Button onClick={handleListingSubmit}>Submit for Verification</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>





            <Dialog open={isInvestOpen} onOpenChange={setIsInvestOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Invest in {investProject?.title}</DialogTitle>
                        <DialogDescription>
                            Configure your investment or request a custom negotiation.
                            <br />
                            <span className="font-semibold text-green-600">Current Price: €{investProject?.pricePerUnit.toFixed(2)} / Tonne</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="flex items-center space-x-2 border p-3 rounded-md bg-muted/20">
                            <Checkbox
                                id="negotiate"
                                checked={isNegotiating}
                                onCheckedChange={(checked) => setIsNegotiating(checked as boolean)}
                            />
                            <label
                                htmlFor="negotiate"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Request Negotiation (Bulk / Custom Price)
                            </label>
                        </div>

                        {!isNegotiating ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Credits (Tonnes)</Label>
                                    <Input
                                        type="number"
                                        value={investCredits}
                                        onChange={(e) => handleCreditChange(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Amount (€)</Label>
                                    <Input
                                        type="number"
                                        value={investAmount}
                                        onChange={(e) => handleAmountChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <Label>Target Price per Unit (€)</Label>
                                    <Input
                                        type="number"
                                        placeholder={`Current: €${investProject?.pricePerUnit}`}
                                        value={negotiationPrice}
                                        onChange={(e) => setNegotiationPrice(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantity (Tonnes)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={investCredits}
                                        onChange={(e) => setInvestCredits(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Message to Seller</Label>
                                    <Textarea
                                        placeholder="We are interested in a long-term offtake agreement..."
                                        value={negotiationMessage}
                                        onChange={(e) => setNegotiationMessage(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsInvestOpen(false)}>Cancel</Button>
                        <Button onClick={handleInvestSubmit} className={isNegotiating ? "bg-amber-600 hover:bg-amber-700" : ""}>
                            {isNegotiating ? "Submit Proposal" : "Proceed to Payment"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
