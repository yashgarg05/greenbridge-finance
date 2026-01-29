import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sections = [
    {
        title: "Global Compliance Engine",
        description: "Navigate the complex landscape of cross-border carbon regulations with ease. Our automated system handles CBAM reporting requirements for EU importers and non-EU manufacturers, ensuring you stay ahead of regulatory changes.",
        image: "/images/logistics_trade.png",
        alt: "Global Trade and Logistics",
        reverse: false,
    },
    {
        title: "Carbon Liability Management",
        description: "visualize and forecast your financial exposure. By tracking carbon debt relative to ETS prices, we provide the insights needed to make strategic procurement decisions and optimize your bottom line.",
        image: "/images/industrial_finance.png",
        alt: "Industrial Finance Data",
        reverse: true,
    },
    {
        title: "Sustainable Future",
        description: "Transition confidently towards Net Zero. Access a curated marketplace of high-quality, verified offsets and green credits to neutralize your unavoidable emissions and demonstrate leadership in sustainability.",
        image: "/images/sustainable_industry.png",
        alt: "Sustainable Industry",
        reverse: false,
    },
];

export const ContentSections = () => {
    return (
        <div className="flex flex-col gap-0">
            {sections.map((section, index) => (
                <section key={index} className="py-24 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${section.reverse ? 'md:flex-row-reverse' : ''}`}>

                            {/* Text Content */}
                            <div className="flex-1">
                                <ScrollReveal>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                        {section.title}
                                    </h2>
                                </ScrollReveal>
                                <ScrollReveal delay={200}>
                                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                        {section.description}
                                    </p>
                                </ScrollReveal>
                                <ScrollReveal delay={300}>
                                    <Link to="/dashboard">
                                        <Button variant="outline" className="group">
                                            Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </ScrollReveal>
                            </div>

                            {/* Image */}
                            <div className="flex-1 w-full">
                                <ScrollReveal delay={200} className="h-full">
                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted/20">
                                        <img
                                            src={section.image}
                                            alt={section.alt}
                                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                                        />
                                        <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                                    </div>
                                </ScrollReveal>
                            </div>

                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
};
