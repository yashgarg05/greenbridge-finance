import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Globe, Leaf } from "lucide-react";

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
                    Verified Carbon Credits (VCCs) are tradable certificates representing one tonne of CO₂ removed or reduced from the atmosphere.
                </p>

                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                            <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">Global Standards</h4>
                            <p className="text-xs text-muted-foreground">All projects listed meet rigorous Gold Standard or Verra methodologies for addtionality and permanence.</p>
                        </div>
                    </div>

                    <Separator className="bg-blue-200 dark:bg-blue-800/50" />

                    <div className="flex gap-3 pt-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                            <Leaf className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold">What is a Carbon Credit?</h4>
                            <p className="text-xs text-muted-foreground">A credit represents 1 tonne of carbon removed or avoided. Purchasing them allows businesses to offset their unavoidable emissions.</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
