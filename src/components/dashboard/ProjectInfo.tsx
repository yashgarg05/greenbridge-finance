import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Globe, ShieldCheck, Zap } from "lucide-react";

export const ProjectInfo = () => {
    return (
        <div className="grid gap-6">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        About GreenBridge
                    </CardTitle>
                    <CardDescription>
                        Automated Carbon Compliance Ecosystem
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                    <p>
                        GreenBridge Finance helps EU importers and global manufacturers easily manage CBAM carbon regulations by turning complex compliance rules into simple, clear financial insights.
                    </p>
                </CardContent>
            </Card>

            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        Key Capabilities
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm"><strong>Automated Reporting:</strong> Streamline declarations for embedded emissions in imported goods.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm"><strong>Financial Forecasting:</strong> Project future carbon liabilities based on live ETS market data.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm"><strong>Audit-Ready Vault:</strong> Securely store and manage supplier certificates and verification documents.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                            <span className="text-sm"><strong>Supply Chain Transparency:</strong> Track emission intensity across global manufacturing inputs.</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};
