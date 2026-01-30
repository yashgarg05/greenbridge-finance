import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Info } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { listingService } from "@/services/listingService";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingStatus, QualityRating } from "@/services/listingService";

import { useAuth } from "@/contexts/AuthContext";

interface CreateListingDialogProps {
    onListingCreated: () => void;
}

export function CreateListingDialog({ onListingCreated }: CreateListingDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        credits: "",
        description: "",
        location: "",
        verifiedBy: "Pending Audit",
        qualityRating: "B+" as QualityRating,
        sdgGoals: "13",
        article6: false,
        image: ""
    });

    const handleSubmit = async () => {
        if (!formData.title || !formData.price || !formData.category) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!user) {
            toast.error("Authentication Required", { description: "You must be logged in to submit a project." });
            return;
        }

        const ownerId = user.id; // Must be UUID

        // Parse SDGs
        const sdgArray = formData.sdgGoals.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

        try {
            await listingService.addListing({
                title: formData.title,
                category: formData.category,
                price: formData.price,
                credits: formData.credits || 'Pending Calculation',
                description: formData.description,
                location: formData.location,
                verifiedBy: formData.verifiedBy,
                qualityRating: formData.qualityRating,
                sdgGoals: sdgArray.length > 0 ? sdgArray : [13],
                article6: formData.article6,
                image: formData.image || undefined,
                ownerId: ownerId
            }, ownerId);

            toast.success("Listing Submitted", {
                description: "Your project has been sent to the Admin queue for approval."
            });

            setOpen(false);
            setFormData({
                title: "",
                category: "",
                price: "",
                credits: "",
                description: "",
                location: "",
                verifiedBy: "Pending Audit",
                qualityRating: "B+",
                sdgGoals: "13",
                article6: false,
                image: ""
            });
            onListingCreated();

        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Submission Failed", { description: "Could not save listing to database." });
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
                    <Plus className="h-4 w-4" /> New Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] glass-panel border-emerald-500/20 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>List Your Green Project</DialogTitle>
                    <DialogDescription>
                        Submit your project details for administrative verification and listing on the marketplace.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-emerald-500 flex items-center gap-2">
                            Basic Information
                            <div className="h-px bg-emerald-500/20 flex-1"></div>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Project Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="bg-white/5"
                                    placeholder="e.g. Sahara Solar Farm"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger className="bg-white/5">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Solar">Solar</SelectItem>
                                        <SelectItem value="Wind">Wind</SelectItem>
                                        <SelectItem value="Forestry">Forestry</SelectItem>
                                        <SelectItem value="Water">Water</SelectItem>
                                        <SelectItem value="Direct Air Capture">Direct Air Capture</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="bg-white/5"
                                placeholder="City, Country"
                            />
                        </div>
                    </div>

                    {/* Financials */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-emerald-500 flex items-center gap-2">
                            Financials & Credits
                            <div className="h-px bg-emerald-500/20 flex-1"></div>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Target Funding (₹) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="bg-white/5"
                                    placeholder="1000000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="credits">Estimated Credits (tCO2e)</Label>
                                <Input
                                    id="credits"
                                    type="number"
                                    value={formData.credits}
                                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                                    className="bg-white/5"
                                    placeholder="500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Verification & Impact */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-emerald-500 flex items-center gap-2">
                            Verification & Impact
                            <div className="h-px bg-emerald-500/20 flex-1"></div>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="verifier">Verification Standard</Label>
                                <Select
                                    value={formData.verifiedBy}
                                    onValueChange={(val) => setFormData({ ...formData, verifiedBy: val })}
                                >
                                    <SelectTrigger className="bg-white/5">
                                        <SelectValue placeholder="Select Standard" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pending Audit">Pending Audit</SelectItem>
                                        <SelectItem value="Gold Standard">Gold Standard</SelectItem>
                                        <SelectItem value="Verra">Verra</SelectItem>
                                        <SelectItem value="Puro.earth">Puro.earth</SelectItem>
                                        <SelectItem value="UN CDM">UN CDM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Self-Assessed Rating</Label>
                                <Select
                                    value={formData.qualityRating}
                                    onValueChange={(val) => setFormData({ ...formData, qualityRating: val as QualityRating })}
                                >
                                    <SelectTrigger className="bg-white/5">
                                        <SelectValue placeholder="Select Rating" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AAA">AAA (High Integrity)</SelectItem>
                                        <SelectItem value="AA">AA</SelectItem>
                                        <SelectItem value="A">A</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sdgs">SDG Goals (Comma separated)</Label>
                            <Input
                                id="sdgs"
                                value={formData.sdgGoals}
                                onChange={(e) => setFormData({ ...formData, sdgGoals: e.target.value })}
                                className="bg-white/5"
                                placeholder="e.g. 7, 13, 15"
                            />
                            <p className="text-[10px] text-muted-foreground">e.g. 13 (Climate Action), 7 (Clean Energy), 6 (Clean Water)</p>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Checkbox
                                id="article6"
                                checked={formData.article6}
                                onCheckedChange={(checked) => setFormData({ ...formData, article6: checked as boolean })}
                            />
                            <Label htmlFor="article6" className="text-sm font-normal cursor-pointer">
                                Compliant with Article 6 (Paris Agreement)
                            </Label>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-sm text-emerald-500 flex items-center gap-2">
                            Media & Details
                            <div className="h-px bg-emerald-500/20 flex-1"></div>
                        </h4>
                        <div className="space-y-2">
                            <Label htmlFor="image">Image URL (Optional)</Label>
                            <Input
                                id="image"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="bg-white/5"
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Project Description</Label>
                            <Textarea
                                id="desc"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="bg-white/5"
                                placeholder="Detailed description of the project impact..."
                            />
                        </div>
                    </div>

                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20">
                        Submit for Admin Verification
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
