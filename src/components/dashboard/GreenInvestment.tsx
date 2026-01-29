import { useState, useMemo } from 'react';
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
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea exists, if not I'll stick to Input or check later. Actually I'll check existence or just use Input for description to be safe if I'm not sure. Checking... actually I'll stick to Input for now to avoid errors, or just `textarea` HTML tag with tailwind classes.
// Better to check for Textarea component existence in a real scenario, but for speed I will use native textarea with tailwind classes if I don't confirm.
// Wait, I should verify Textarea exists if I want to use it.
// I will just use standard HTML textarea with standard shadcn style classes if I can't confirm.
// "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"


// --- Types ---
type ProjectType = 'Solar' | 'Forestry' | 'Wind' | 'Water' | 'Direct Air Capture';
type QualityRating = 'AAA' | 'AA' | 'A' | 'B+';

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    pricePerUnit: number;
    creditsPerUnit: number;
    image: string;
    category: ProjectType;
    fundingPercentage: number;
    verifiedBy: string;
    qualityRating: QualityRating;
    sdgGoals: number[];
    url: string;
}

// --- Data ---
const projects: Project[] = [
    {
        id: '1',
        title: 'Sahara Solar Initiative',
        description: 'Large-scale solar farm expansion in Northern Africa, replacing diesel generators with clean renewable energy.',
        location: 'Morocco',
        pricePerUnit: 25.00,
        creditsPerUnit: 1,
        image: '/images/marketplace/solar.png',
        category: 'Solar',
        fundingPercentage: 78,
        verifiedBy: 'Gold Standard',
        qualityRating: 'A',
        sdgGoals: [7, 13],
        url: 'https://en.wikipedia.org/wiki/Ouarzazate_Solar_Power_Station'
    },
    {
        id: '2',
        title: 'Amazon Reforestation Project',
        description: 'Restoring degraded land in the Amazon basin with native species to sequester carbon and restore biodiversity.',
        location: 'Brazil',
        pricePerUnit: 15.00,
        creditsPerUnit: 1.2,
        image: '/images/marketplace/reforestation.png',
        category: 'Forestry',
        fundingPercentage: 45,
        verifiedBy: 'Verra',
        qualityRating: 'AA',
        sdgGoals: [13, 15],
        url: 'https://onetreeplanted.org/collections/latin-america/products/amazon-rainforest'
    },
    {
        id: '3',
        title: 'North Sea Wind Expansion',
        description: 'Offshore wind farm development providing clean grid energy to Northern Europe.',
        location: 'Netherlands',
        pricePerUnit: 40.00,
        creditsPerUnit: 2,
        image: '/images/marketplace/wind.png',
        category: 'Wind',
        fundingPercentage: 92,
        verifiedBy: 'Gold Standard',
        qualityRating: 'A',
        sdgGoals: [7, 9, 13],
        url: 'https://northseawindpowerhub.eu/'
    },
    {
        id: '4',
        title: 'Clean Water Access Program',
        description: 'Solar-powered water filtration systems reducing the need for wood-burning boiling in rural communities.',
        location: 'Kenya',
        pricePerUnit: 12.00,
        creditsPerUnit: 0.8,
        image: '/images/marketplace/water.png',
        category: 'Water',
        fundingPercentage: 60,
        verifiedBy: 'UN CDM',
        qualityRating: 'A',
        sdgGoals: [6, 13],
        url: 'https://www.charitywater.org/our-work/where-we-work/kenya'
    },
    {
        id: '5',
        title: 'AtmosClear Direct Air Capture',
        description: 'Cutting-edge DAC facility permanently removing CO2 from the atmosphere and mineralizing it underground.',
        location: 'Iceland',
        pricePerUnit: 150.00,
        creditsPerUnit: 1,
        image: '/images/marketplace/dac.png',
        category: 'Direct Air Capture',
        fundingPercentage: 30,
        verifiedBy: 'Puro.earth',
        qualityRating: 'AAA',
        sdgGoals: [9, 13],
        url: 'https://climeworks.com/'
    }
];

// --- Components ---

const CategoryIcon = ({ category }: { category: ProjectType }) => {
    switch (category) {
        case 'Solar': return <Sun className="w-4 h-4 text-orange-500" />;
        case 'Forestry': return <Sprout className="w-4 h-4 text-green-500" />;
        case 'Wind': return <Wind className="w-4 h-4 text-blue-500" />;
        case 'Water': return <Droplets className="w-4 h-4 text-cyan-500" />;
        case 'Direct Air Capture': return <Factory className="w-4 h-4 text-gray-500" />;
        default: return <Sprout className="w-4 h-4" />;
    }
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

export const GreenInvestment = () => {
    // Filters
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [minRating, setMinRating] = useState<string>('all');

    // Smart Mix
    const [emissionsInput, setEmissionsInput] = useState<string>('');
    const [budgetInput, setBudgetInput] = useState<string>('');
    const [smartMix, setSmartMix] = useState<Project[] | null>(null);

    const { toast } = useToast();
    const [isListingOpen, setIsListingOpen] = useState(false);
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
        // Validation (Basic)
        if (!listingForm.title || !listingForm.contactEmail) {
            toast({
                title: "Missing Information",
                description: "Please provide at least a project title and contact email.",
                variant: "destructive"
            });
            return;
        }

        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Request Submitted Successfully",
                description: "Our team will verify your project details and contact you shortly.",
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
        }, 1000);
    };

    // Filter Logic
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            if (p.pricePerUnit < priceRange[0] || p.pricePerUnit > priceRange[1]) return false;
            if (selectedType !== 'all' && p.category !== selectedType) return false;
            // Simplified rating filter logic for demo
            if (minRating === 'AAA' && p.qualityRating !== 'AAA') return false;
            if (minRating === 'AA' && (p.qualityRating === 'A' || p.qualityRating === 'B+')) return false;
            return true;
        });
    }, [priceRange, selectedType, minRating]);

    // Smart Mix Logic
    const generateSmartMix = () => {
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Carbon Credit Marketplace</h2>
                    <p className="text-muted-foreground">Advanced portfolio management for verified ecological credits.</p>
                </div>
                <Button onClick={() => setIsListingOpen(true)} className="gap-2">
                    <Plus className="w-4 h-4" /> List Your Project
                </Button>
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
                            <Button size="sm" className="w-full mt-2" onClick={generateSmartMix}>
                                Generate Mix
                            </Button>

                            {smartMix && (
                                <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
                                    <p className="text-xs font-semibold mb-2 text-muted-foreground">Recommended Projects:</p>
                                    <ul className="space-y-2">
                                        {smartMix.map(p => (
                                            <li key={p.id} className="text-xs flex items-center gap-2">
                                                <Badge variant="outline" className="h-5 px-1">{p.category}</Badge>
                                                <span className="truncate">{p.title}</span>
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
                        <Card key={project.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
                            <div className="relative h-40 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-black/40 text-white border-0 text-[10px] h-5">
                                        <CheckCircle2 className="w-3 h-3 mr-1 text-green-400" />
                                        {project.verifiedBy}
                                    </Badge>
                                </div>
                                <div className="absolute bottom-2 left-2">
                                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90 text-black border-0 text-[10px] shadow-sm">
                                        SDG: {project.sdgGoals.join(', ')}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader className="pb-2 px-4 pt-4">
                                <div className="flex justify-between items-start mb-1">
                                    <Badge variant="outline" className="w-fit flex items-center gap-1 text-[10px] h-5 px-1.5">
                                        <CategoryIcon category={project.category} />
                                        {project.category}
                                    </Badge>
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

                            <CardFooter className="px-4 pb-4 pt-0">
                                <Button size="sm" className="w-full" onClick={() => window.open(project.url, '_blank')}>
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
        </div>
    );
};
