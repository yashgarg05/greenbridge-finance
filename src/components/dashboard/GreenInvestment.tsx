import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    Filter,
    Sparkles,
    Search,
    Factory,
    Plus,
    Bot,
    Lock,
    ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { listingService, Listing } from "@/services/listingService";
import { CreateListingDialog } from "@/components/CreateListingDialog";
import { useNavigate } from 'react-router-dom';

// --- Components ---

const CategoryBadge = ({ category }: { category: string }) => {
    const styles: Record<string, any> = {
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

export const GreenInvestment = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Listing[]>([]);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    // Initial Load
    useEffect(() => {
        // Load verified listings
        const verified = listingService.getVerified();
        setProjects(verified);

        // POLL for updates (simulating realtime marketplace)
        const interval = setInterval(() => {
            setProjects(listingService.getVerified());
        }, 2000);

        // Get Current User
        const email = localStorage.getItem('user_email');
        setCurrentUserEmail(email);

        return () => clearInterval(interval);
    }, []);


    // --- New Features State ---
    const [comparisonList, setComparisonList] = useState<string[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);



    // Filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [minRating, setMinRating] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('featured');

    // Smart Mix
    const [emissionsInput, setEmissionsInput] = useState<string>('');
    const [budgetInput, setBudgetInput] = useState<string>('');
    const [smartMix, setSmartMix] = useState<Listing[] | null>(null);

    const toggleComparison = (id: string, checked: boolean) => {
        if (checked) {
            setComparisonList(prev => [...prev, id]);
        } else {
            setComparisonList(prev => prev.filter(pId => pId !== id));
        }
    };



    // Filter & Sort Logic
    const filteredProjects = useMemo(() => {
        const result = projects.filter(p => {
            const price = p.pricePerUnit || 0;
            if (price < priceRange[0] || price > priceRange[1]) return false;
            if (selectedType !== 'all' && p.category !== selectedType) return false;
            return true;
        });

        switch (sortBy) {
            case 'price-asc':
                return [...result].sort((a, b) => (a.pricePerUnit || 0) - (b.pricePerUnit || 0));
            case 'price-desc':
                return [...result].sort((a, b) => (b.pricePerUnit || 0) - (a.pricePerUnit || 0));
            default:
                return result;
        }
    }, [projects, priceRange, selectedType, sortBy]);

    const handleInvest = (project: Listing) => {
        if (currentUserEmail && project.ownerId === currentUserEmail) {
            toast({
                title: "Action Restricted",
                description: "You cannot invest in your own listing.",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: "Investment Intent",
            description: `Opening investment portal for ${project.title}...`
        });
    };

    const refreshListings = () => {
        setProjects(listingService.getVerified());
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Green Credit Marketplace</h2>
                    <p className="text-muted-foreground">Advanced portfolio management for verified ecological credits.</p>
                </div>
                <div className="flex gap-2">

                    <CreateListingDialog onListingCreated={refreshListings} />
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
                        </CardContent>
                    </Card>
                </div>

                {/* Project Grid */}
                <div className="lg:col-span-3 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p>No verified projects match your filters.</p>
                            <Button variant="link" onClick={() => { setPriceRange([0, 200]); setSelectedType('all'); }}>Clear Filters</Button>
                        </div>
                    ) : filteredProjects.map((project) => {
                        const isOwner = currentUserEmail && project.ownerId === currentUserEmail;

                        return (
                            <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                                <div className="relative h-40 overflow-hidden bg-muted">
                                    {project.image && <img
                                        src={project.image}
                                        alt={project.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />}
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                        <Badge variant="secondary" className="backdrop-blur-md bg-black/40 text-white border-0 text-[10px] h-5">
                                            <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                                            {project.verifiedBy || "Verified"}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader className="pb-2 px-4 pt-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <CategoryBadge category={project.category} />
                                        {isOwner && (
                                            <Badge variant="outline" className="border-amber-500 text-amber-500 text-[10px]">Your Listing</Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-base leading-tight mt-1">{project.title}</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">{project.location}</p>
                                </CardHeader>

                                <CardContent className="px-4 pb-4 space-y-3 flex-1">
                                    <div className="grid grid-cols-2 gap-2 py-2">
                                        <div className="bg-muted/50 p-2 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Price / Unit</p>
                                            <p className="font-mono font-semibold text-sm">€{project.pricePerUnit?.toFixed(2)}</p>
                                        </div>
                                        <div className="bg-muted/50 p-2 rounded-lg">
                                            <p className="text-[10px] text-muted-foreground uppercase">Available</p>
                                            <p className="font-mono font-semibold text-sm">{project.credits}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                                </CardContent>

                                <div className="p-4 pt-0 mt-auto">
                                    <Button
                                        className={`w-full ${isOwner ? 'opacity-80' : 'bg-primary hover:bg-primary/90'}`}
                                        variant={isOwner ? "secondary" : "default"}
                                        onClick={() => handleInvest(project)}
                                        disabled={!!isOwner}
                                    >
                                        {isOwner ? (
                                            <>
                                                <Lock className="w-3 h-3 mr-2" /> Owner Restricted
                                            </>
                                        ) : (
                                            "Invest Now"
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
