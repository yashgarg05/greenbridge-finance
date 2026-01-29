import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-8">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Live CBAM Reporting Available
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                    Automated Carbon <br />
                    Compliance for Steel
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    The all-in-one platform for CBAM reporting, carbon debt tracking, and verified offset procurement.
                    Built for modern industrial finance.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link to="/dashboard">
                        <Button size="lg" className="h-12 px-8 text-base">
                            Start Free Calculation <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                        Talk to an Expert
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>ISO 14064 Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Real-time API Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span>Bank-Grade Security</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
