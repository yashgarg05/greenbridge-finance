import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function SupplierSummary() {
    const stats = {
        total: 12,
        verified: 5,
        pending: 4,
        highRisk: 3
    };

    const verificationProgress = Math.round((stats.verified / stats.total) * 100);

    // --- Request Data Logic ---
    const { toast } = useToast();
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [requestForm, setRequestForm] = useState({
        supplier: '',
        type: '',
        message: ''
    });

    const handleRequestSubmit = () => {
        if (!requestForm.supplier || !requestForm.type) {
            toast({
                title: "Missing Fields",
                description: "Please select a supplier and data type.",
                variant: "destructive"
            });
            return;
        }

        // Simulate API call
        setTimeout(() => {
            toast({
                title: "Request Sent Successfully",
                description: `We've asked ${requestForm.supplier} for ${requestForm.type}.`,
            });
            setIsRequestOpen(false);
            setRequestForm({ supplier: '', type: '', message: '' });
        }, 500);
    };

    return (
        <Card className="data-card h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Supplier Verification
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7">Manage</Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Verification Progress</span>
                        <span>{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className="h-2" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center">
                        <CheckCircle2 className="h-4 w-4 mx-auto text-green-600 mb-1" />
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">{stats.verified}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Verified</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg text-center">
                        <Clock className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{stats.pending}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Pending</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center">
                        <AlertCircle className="h-4 w-4 mx-auto text-red-600 mb-1" />
                        <p className="text-lg font-bold text-red-700 dark:text-red-400">{stats.highRisk}</p>
                        <p className="text-[10px] text-muted-foreground uppercase">Action Req</p>
                    </div>
                </div>

                <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full text-xs">
                            Request Missing Data
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Request Supplier Data</DialogTitle>
                            <DialogDescription>
                                Send a formal request for missing compliance documentation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier" className="text-right">
                                    Supplier
                                </Label>
                                <Select
                                    value={requestForm.supplier}
                                    onValueChange={(val) => setRequestForm({ ...requestForm, supplier: val })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Supplier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Global Steel Corp">Global Steel Corp</SelectItem>
                                        <SelectItem value="EcoLogistics Ltd">EcoLogistics Ltd</SelectItem>
                                        <SelectItem value="Nordic Aluminum">Nordic Aluminum</SelectItem>
                                        <SelectItem value="Polymers Int.">Polymers Int.</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dtype" className="text-right">
                                    Data Type
                                </Label>
                                <Select
                                    value={requestForm.type}
                                    onValueChange={(val) => setRequestForm({ ...requestForm, type: val })}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Data Needed" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Q4 Emissions Report">Q4 Emissions Report</SelectItem>
                                        <SelectItem value="ISO 14064 Certification">ISO 14064 Certification</SelectItem>
                                        <SelectItem value="Production Volume Data">Production Volume Data</SelectItem>
                                        <SelectItem value="Grid Mix Evidence">Grid Mix Evidence</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-right">
                                    Message (Optional)
                                </Label>
                                <Textarea
                                    id="message"
                                    placeholder="Please provide this by EOM..."
                                    value={requestForm.message}
                                    onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleRequestSubmit}>Send Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
