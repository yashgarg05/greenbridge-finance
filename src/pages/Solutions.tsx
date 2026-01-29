import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Leaf, Wind, Zap, Recycle, ArrowRight } from "lucide-react";

const Solutions = () => {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary w-fit mx-auto">
                            Sustainability Guide
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Sustainable Solutions for a <span className="text-primary">Greener Future</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Practical steps and technologies to reduce carbon footprints and build a more sustainable economy.
                        </p>
                    </div>

                    {/* The Problem (Configuration) */}
                    <div className="grid md:grid-cols-2 gap-12 items-center bg-muted/30 p-8 rounded-3xl border border-border/50">
                        <div className="space-y-4">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-red-200 bg-red-50 text-red-700 w-fit">
                                The Problem
                            </div>
                            <h2 className="text-3xl font-bold">Rising Emissions, Finite Carbon Budget</h2>
                            <p className="text-muted-foreground">
                                The world faces a critical implementation gap. To limit warming to 1.5°C, global emissions must peak immediately and halving by 2030. Current trajectories show a continued rise.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background p-4 rounded-xl border shadow-sm text-center">
                                <div className="text-3xl font-bold text-red-600 mb-1">50Gt</div>
                                <div className="text-xs text-muted-foreground">Annual CO₂e Emissions</div>
                            </div>
                            <div className="bg-background p-4 rounded-xl border shadow-sm text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-1">1.1°C</div>
                                <div className="text-xs text-muted-foreground">Current Warming</div>
                            </div>
                            <div className="bg-background p-4 rounded-xl border shadow-sm text-center">
                                <div className="text-3xl font-bold text-yellow-600 mb-1">7 Yrs</div>
                                <div className="text-xs text-muted-foreground">Carbon Budget Left</div>
                            </div>
                            <div className="bg-background p-4 rounded-xl border shadow-sm text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">$4T</div>
                                <div className="text-xs text-muted-foreground">Investment Gap</div>
                            </div>
                        </div>
                    </div>

                    {/* Solutions Grid (Optimized) */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Energy Efficiency */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Cost Optimization: High
                            </div>
                            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Energy Efficiency</h3>
                            <p className="text-muted-foreground mb-4">
                                Optimizing energy use is the fastest and most cost-effective way to reduce emissions.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Implement smart building management systems (BMS).
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Upgrade to LED lighting and high-efficiency HVAC.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Utilize industrial waste heat recovery.
                                </li>
                            </ul>
                        </div>

                        {/* Renewable Energy */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Impact Scale: Giga-ton
                            </div>
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                <Wind className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Renewable Energy</h3>
                            <p className="text-muted-foreground mb-4">
                                Transitioning to clean power sources to decarbonize operations and grids.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> On-site solar generation (Rooftop PV).
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Corporate Power Purchase Agreements (PPAs).
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Green hydrogen for industrial processes.
                                </li>
                            </ul>
                        </div>

                        {/* Sustainable Transport */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Logistics Optimization
                            </div>
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                                <Leaf className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Sustainable Transport</h3>
                            <p className="text-muted-foreground mb-4">
                                Lowering emissions from logistics, commuting, and supply chains.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Electrification of fleet vehicles (EVs).
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Optimizing logistics routes with AI.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Promoting public transit and cycling for employees.
                                </li>
                            </ul>
                        </div>

                        {/* Circular Economy */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                Resource Efficiency
                            </div>
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                                <Recycle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Circular Economy</h3>
                            <p className="text-muted-foreground mb-4">
                                Designing out waste and pollution, keeping products and materials in use.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Designing products for durability and repair.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Implementing recycling and upcycling programs.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> Reducing single-use plastics and packaging.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-primary/5 rounded-3xl p-12 text-center space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Ready to take action?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Start measuring, reducing, and offsetting your emissions today with GreenBridge's comprehensive platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/signup">
                                <Button size="lg" className="rounded-full px-8">
                                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button variant="outline" size="lg" className="rounded-full px-8">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Solutions;
