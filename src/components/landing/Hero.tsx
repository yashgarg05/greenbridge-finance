import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">

                <ScrollReveal>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-foreground">
                        Automated Carbon <br />
                        Compliance Ecosystem
                    </h1>
                </ScrollReveal>

                <ScrollReveal delay={200}>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        The all-in-one platform for CBAM reporting, carbon debt tracking, and verified offset procurement.
                        Built for modern industrial finance.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={300}>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/signup">
                            <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                                Start Free Calculation <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
};
