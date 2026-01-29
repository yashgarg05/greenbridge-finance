import { BarChart3, Globe, ShieldCheck, Zap, FileJson, Building2 } from "lucide-react";

const features = [
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Global Compliance",
        description: "Automated CBAM reporting for EU importers and non-EU manufacturers.",
        className: "lg:col-span-2",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Real-time Tracking",
        description: "Live carbon intensity monitoring.",
    },
    {
        icon: <BarChart3 className="h-6 w-6" />,
        title: "Carbon Debt Analysis",
        description: "Financial forecasting relative to ETS prices.",
    },
    {
        icon: <FileJson className="h-6 w-6" />,
        title: "API Integration",
        description: "Seamless connection with your ERP.",
        className: "lg:col-span-2",
    },
    {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: "Verified Offsets",
        description: "Blockchain-backed supply chain verification.",
        className: "lg:col-span-3",
    },
];

export const Features = () => {
    return (
        <section id="features" className="py-24 bg-background border-t border-border/50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                        Built for the Future of <br /> Industrial Finance
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        A complete suite of tools to manage your carbon liabilities and ensure seamless cross-border trade.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`group relative p-8 rounded-3xl border border-border/50 bg-card hover:border-border transition-colors ${feature.className || ""}`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />

                            <div className="relative z-10">
                                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
