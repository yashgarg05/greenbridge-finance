import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, Globe } from "lucide-react";

export const VerifiedCreditsInfo = () => {
    return (
        <Card className="h-full border-blue-500/20 bg-blue-50/10 dark:bg-blue-900/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <ShieldCheck className="h-5 w-5" />
                    Verified Carbon Credits
                </CardTitle>
                <CardDescription>
                    High-Integrity Offsets for Compliance
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                    Verified Verified Carbon Credits (VCCs) are tradable certificates representing one tonne of CO₂ removed or reduced from the atmosphere.
                </p>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                            <Lock className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">Blockchain Verified</h4>
                            <p className="text-xs text-muted-foreground">Every credit is tokenized on-chain to prevent double-counting and ensure immutable ownership history.</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                            <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">Global Standards</h4>
                            <p className="text-xs text-muted-foreground">All projects listed meet rigorous Gold Standard or Verra methodologies for addtionality and permanence.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
