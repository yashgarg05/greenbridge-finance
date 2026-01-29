import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { FileText, ShieldCheck, Cpu, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Methodology = () => {
    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/10 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto space-y-16">

                    {/* Header */}
                    <div className="text-center space-y-4 max-w-3xl mx-auto">
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary w-fit mx-auto">
                            Technical Approach
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Our <span className="text-primary">Methodology</span>
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Rigorous verification standards combining global protocols with cutting-edge technology.
                        </p>
                    </div>

                    {/* Methodology Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* ISO & GHG */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Global Standards Compliance</h3>
                            <p className="text-muted-foreground mb-4">
                                Our platform is built upon internationally recognized frameworks to ensure audit-readiness and credibility.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>ISO 14064</strong>: Organization-level quantification and reporting.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>GHG Protocol</strong>: Corporate Standard for Scope 1, 2, and 3.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Science Based Targets (SBTi)</strong>: Alignment with 1.5°C pathways.
                                </li>
                            </ul>
                        </div>

                        {/* AI Verification */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                                <Cpu className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">AI & Satellite Verification</h3>
                            <p className="text-muted-foreground mb-4">
                                Reducing greenwashing through automated monitoring and validation of project claims.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Remote Sensing</strong>: Satellite analysis of forestry and land-use changes.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Anomaly Detection</strong>: AI flagging of inconsistent reporting data.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Predictive Modeling</strong>: Forecasting emissions and reduction potential.
                                </li>
                            </ul>
                        </div>

                        {/* Security */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Data Integrity & Security</h3>
                            <p className="text-muted-foreground mb-4">
                                Protecting proprietary data while ensuring transparent audit trails.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Immutable Logs</strong>: Critical verification milestones are cryptographically sealed.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Enterprise Encryption</strong>: End-to-end encryption for all sensitive sustainability data.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Access Control</strong>: Granular permission settings for multi-stakeholder teams.
                                </li>
                            </ul>
                        </div>

                        {/* Ecosystem */}
                        <div className="p-8 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all duration-300">
                            <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                                <Globe className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Holistic Ecosystem</h3>
                            <p className="text-muted-foreground mb-4">
                                Connecting effective capital allocation with real-world impact.
                            </p>
                            <ul className="space-y-2 text-sm text-foreground/80">
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Dynamic Marketplace</strong>: Real-time pricing based on project quality and verification status.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-primary">•</span> <strong>Double-Counting Prevention</strong>: Rigorous serial number tracking for all credits.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-primary/5 rounded-3xl p-12 text-center space-y-6">
                        <h2 className="text-3xl font-bold tracking-tight">Trust in your climate action</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Join the platform standardizing sustainability with transparency and technology.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/signup">
                                <Button size="lg" className="rounded-full px-8">
                                    Start Verifying <ArrowRight className="ml-2 h-4 w-4" />
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

export default Methodology;
