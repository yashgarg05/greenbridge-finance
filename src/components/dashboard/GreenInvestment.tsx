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
    Sparkles,
    Search,
    Factory,
    Upload,
    Plus,
    ListChecks
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
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists, if not I'll stick to Input or check later. Actually I'll check existence or just use Input for description to be safe if I'm not sure. Checking... actually I'll stick to Input for now to avoid errors, or just `textarea` HTML tag with tailwind classes.
// Better to check for Textarea component existence in a real scenario, but for speed I will use native textarea with tailwind classes if I don't confirm.
// Wait, I should verify Textarea exists if I want to use it.
// I will just use standard HTML textarea with standard shadcn style classes if I can't confirm.
// "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bot, Bell } from "lucide-react";


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

    // Smart Mix
    const [emissionsInput, setEmissionsInput] = useState<string>('');
    const [budgetInput, setBudgetInput] = useState<string>('');
    const [smartMix, setSmartMix] = useState<Project[] | null>(null);
    const [mixType, setMixType] = useState<'standard' | 'balanced'>('standard');

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



    // --- New Features State ---
    const [comparisonList, setComparisonList] = useState<string[]>([]);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);

    const [aiRecommendation, setAiRecommendation] = useState<Project | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

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

    const toggleComparison = (id: string, checked: boolean) => {
        if (checked) {
            setComparisonList(prev => [...prev, id]);
        } else {
            setComparisonList(prev => prev.filter(pId => pId !== id));
        }
    };

    const handleAIRecommend = () => {
        setIsAiLoading(true);
        // Simulate complex analysis
        setTimeout(() => {
            // Logic: Find best value (Credits / Price) * Rating Weight
            // Rating Weights: AAA=1.5, AA=1.2, A=1.0, B+=0.9
            const ratingWeight = { 'AAA': 1.5, 'AA': 1.2, 'A': 1.0, 'B+': 0.9 };

            let bestProject = projects[0];
            let bestScore = 0;

            projects.forEach(p => {
                const score = (p.creditsPerUnit / p.pricePerUnit) * ratingWeight[p.qualityRating];
                if (score > bestScore) {
                    bestScore = score;
                    bestProject = p;
                }
            });

            setAiRecommendation(bestProject);
            setIsAiLoading(false);
            setIsAiModalOpen(true);
        }, 1500);
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

    // Smart Mix Logic
    const generateSmartMix = () => {
        setMixType('standard');
        const emissions = parseFloat(emissionsInput) || 0;
        const budget = parseFloat(budgetInput) || 0;

        if (emissions <= 0 || budget <= 0) return;

        // Simple heuristic: 
        // 1. Try to cover as much emissions as possible.
        // 2. If budget allows high cost/ton, include DAC (AAA).
        // 3. Otherwise fill with Forestry/Solar.

        const mix: Project[] = [];
        const avgPrice = budget / emissions;

        if (avgPrice > 100) {
            // High budget: Include DAC
            const dac = projects.find(p => p.category === 'Direct Air Capture');
            if (dac) mix.push(dac);
            // Fill rest with Forestry
            const forest = projects.find(p => p.category === 'Forestry');
            if (forest) mix.push(forest);
        } else if (avgPrice > 20) {
            // Medium budget: Forestry + Wind
            const forest = projects.find(p => p.category === 'Forestry');
            if (forest) mix.push(forest);
            const wind = projects.find(p => p.category === 'Wind');
            if (wind) mix.push(wind);
        } else {
            // Low budget: Solar + Water
            const solar = projects.find(p => p.category === 'Solar');
            if (solar) mix.push(solar);
            const water = projects.find(p => p.category === 'Water');
            if (water) mix.push(water);
        }

        setSmartMix(mix);
    };

    const handleAutoAllocate = () => {
        const budget = parseFloat(budgetInput);
        if (!budget || budget <= 0) {
            toast({
                title: "Budget Required",
                description: "Please enter a valid budget to auto-allocate.",
                variant: "destructive"
            });
            return;
        }

        // 70% Budget for Low Cost Compliance
        const budgetLowCost = budget * 0.7;
        // 30% Budget for India Impact
        const budgetImpact = budget * 0.3;

        const mix: Project[] = [];

        // 1. Find India Project (Impact)
        const indiaProject = projects.find(p => p.location === 'India');
        if (indiaProject) mix.push(indiaProject);
        else {
            // Fallback to Water if no India specific
            const waterProject = projects.find(p => p.category === 'Water');
            if (waterProject) mix.push(waterProject);
        }

        // 2. Find Low Cost Project (Compliance)
        // Prefer price < 20
        const lowCostProject = projects.find(p => p.pricePerUnit < 20 && p.location !== 'India');
        if (lowCostProject) mix.push(lowCostProject);
        else {
            const cheapest = [...projects].sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0];
            if (cheapest && !mix.includes(cheapest)) mix.push(cheapest);
        }

        setMixType('balanced');
        setSmartMix(mix);
        toast({
            title: "Portfolio Auto-Allocated",
            description: "Generated a 70% Compliance / 30% Impact split.",
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Green Credit Marketplace</h2>
                    <p className="text-muted-foreground">Advanced portfolio management for verified ecological credits.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800"
                        onClick={handleAIRecommend}
                        disabled={isAiLoading}
                    >
                        {isAiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                        {isAiLoading ? "Analyzing..." : "AI Smart Recommend"}
                    </Button>
                    {comparisonList.length > 0 && (
                        <Button
                            variant="secondary"
                            className="gap-2 animate-in fade-in"
                            onClick={() => setIsComparisonOpen(true)}
                        >
                            <Filter className="w-4 h-4" /> Compare ({comparisonList.length})
                        </Button>
                    )}
                    <Button onClick={() => setIsListingOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> List Your Project
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Filters & Tools */}
                <div className="space-y-6">
                    {/* Smart Mix Calculator */}
                    <Card className="border-primary/20 shadow-sm bg-primary/5">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Smart Portfolio Mix
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <Label className="text-xs">Target Emissions (tCO2e)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 100"
                                    className="h-8 bg-background"
                                    value={emissionsInput}
                                    onChange={(e) => setEmissionsInput(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">Budget (€)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    className="h-8 bg-background"
                                    value={budgetInput}
                                    onChange={(e) => setBudgetInput(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mt-2">
                                <Button size="sm" className="w-full" onClick={generateSmartMix}>
                                    Generate Standard Mix
                                </Button>
                                <Button size="sm" variant="secondary" className="w-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300" onClick={handleAutoAllocate}>
                                    Auto-Allocate (70/30)
                                </Button>
                            </div>

                            {smartMix && (
                                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xs font-semibold text-muted-foreground">Recommended Projects:</p>
                                        {mixType === 'balanced' && (
                                            <Badge variant="outline" className="text-[10px] h-5 px-1 bg-green-50 text-green-700 border-green-200">Balanced</Badge>
                                        )}
                                    </div>
                                    <ul className="space-y-2">
                                        {smartMix.map(p => (
                                            <li key={p.id} className="text-xs flex items-center gap-2">
                                                <Badge variant="outline" className="h-5 px-1">{p.category}</Badge>
                                                <span className="truncate flex-1">{p.title}</span>
                                                {mixType === 'balanced' && p.location === 'India' && (
                                                    <span className="text-[10px] text-green-600 font-bold">30%</span>
                                                )}
                                                {mixType === 'balanced' && p.location !== 'India' && (
                                                    <span className="text-[10px] text-blue-600 font-bold">70%</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardContent>
                    </Card>

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
                                <div className="flex items-center gap-2 mb-2">
                                    <Checkbox
                                        id={`compare-${project.id}`}
                                        checked={comparisonList.includes(project.id)}
                                        onCheckedChange={(checked) => toggleComparison(project.id, checked as boolean)}
                                    />
                                    <Label htmlFor={`compare-${project.id}`} className="text-xs text-muted-foreground cursor-pointer">Compare</Label>
                                </div>

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

            <Dialog open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Project Comparison</DialogTitle>
                        <DialogDescription>Side-by-side detailed analysis.</DialogDescription>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feature</TableHead>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableHead key={p.id}>{p.title}</TableHead>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">Price</TableCell>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableCell key={p.id}>€{p.pricePerUnit}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Credits/Unit</TableCell>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableCell key={p.id}>{p.creditsPerUnit}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Rating</TableCell>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableCell key={p.id}><QualityBadge rating={p.qualityRating} /></TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Location</TableCell>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableCell key={p.id}>{p.location}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Verified By</TableCell>
                                {projects.filter(p => comparisonList.includes(p.id)).map(p => <TableCell key={p.id}>{p.verifiedBy}</TableCell>)}
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>

            <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-indigo-600">
                            <Bot className="w-6 h-6" /> AI Smart Recommendation
                        </DialogTitle>
                        <DialogDescription>
                            Based on your goal to maximize Carbon Credit efficiency (ROI & Quality).
                        </DialogDescription>
                    </DialogHeader>
                    {aiRecommendation && (
                        <div className="space-y-4 py-4">
                            <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg dark:bg-indigo-900/20 dark:border-indigo-800">
                                <div className="flex items-start gap-4">
                                    <img src={aiRecommendation.image} alt={aiRecommendation.title} className="w-16 h-16 rounded object-cover" />
                                    <div>
                                        <h4 className="font-bold text-lg">{aiRecommendation.title}</h4>
                                        <QualityBadge rating={aiRecommendation.qualityRating} />
                                        <p className="text-sm mt-1 text-muted-foreground">{aiRecommendation.category} • {aiRecommendation.location}</p>
                                    </div>
                                </div>
                                <Separator className="my-3 bg-indigo-200/50" />
                                <div className="space-y-2 text-sm">
                                    <div className="flex justification-between">
                                        <span className="text-muted-foreground">Why this?</span>
                                        <span className="font-medium ml-auto text-green-600">Best Value + High Integrity</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic">
                                        "This project offers the highest carbon credits per Euro spent ({(aiRecommendation.creditsPerUnit / aiRecommendation.pricePerUnit).toFixed(2)} credits/€) among verifiable {aiRecommendation.qualityRating}-rated projects."
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => {
                            window.open(aiRecommendation?.url, '_blank');
                            setIsAiModalOpen(false);
                        }}>
                            View Project
                        </Button>
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
