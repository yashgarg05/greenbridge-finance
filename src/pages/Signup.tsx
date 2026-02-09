import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, CheckCircle2, ShieldAlert, Mail } from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ALLOWED_DOMAINS } from "@/config/companies";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

const Signup = () => {
    const navigate = useNavigate();
    const { signUp } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<'form' | 'verify'>('form');

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        role: "",
    });

    // Derived State: Company based on Email Domain
    const companyInfo = useMemo(() => {
        if (!formData.email.includes('@')) return null;
        const domain = formData.email.split('@')[1].toLowerCase();
        const config = ALLOWED_DOMAINS[domain];

        if (config) {
            return {
                name: config.name,
                roles: config.roles,
                allowed: true
            };
        }
        return {
            name: "Unknown Domain",
            roles: [],
            allowed: false
        };
    }, [formData.email]);

    const handleSignup = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.role) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (companyInfo && !companyInfo.allowed) {
            toast.error("Unregistered Domain", {
                description: "We are currently invite-only for registered enterprise partners."
            });
            return;
        }

        setIsSubmitting(true);
        try {
            if (formData.password !== formData.confirmPassword) {
                // toast error?
                console.error("Passwords do not match");
                toast.error("Passwords do not match");
                return;
            }
            await signUp(formData.email, formData.password, {
                full_name: formData.name,
                mobile: formData.mobile,
                role: formData.role,
                company: companyInfo?.name
            });
            // If successful, move to verification step
            setStep('verify');
        } catch (error: any) {
            console.error(error);
            // DEMO HACK: If rate limit exceeded or other error, proceed anyway for demo
            if (error?.message?.includes('rate limit') || true) {
                toast.error("Demo Mode: Proceeding despite API error", {
                    description: "Supabase rate limit ignored for demo."
                });
                setStep('verify');
            } else {
                toast.error("Signup Failed", { description: "Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 'verify') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                <Card className="w-full max-w-md glass-panel border-emerald-500/20">
                    <CardContent className="pt-6 flex flex-col items-center text-center space-y-6">
                        <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-pulse">
                            <Mail className="h-10 w-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight">Check your inbox</h2>
                            <p className="text-muted-foreground">
                                We've sent a verification link to <span className="font-medium text-foreground">{formData.email}</span>.
                            </p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                Please confirm your email to access the {companyInfo?.name} dashboard.
                            </p>
                        </div>

                        <div className="w-full pt-4 space-y-3">
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                                onClick={() => navigate('/dashboard')}
                            >
                                Skip Verification (Demo)
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                                Back to Login
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Did not receive the email? <span className="underline cursor-pointer hover:text-primary">Resend</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

            <div className="w-full max-w-[450px] mx-auto z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <span className="font-semibold text-lg tracking-tight">GreenBridge</span>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-center">Create account</h1>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Enterprise Access for Approved Partners
                    </p>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    className="bg-background/50"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="bg-background/50"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-background/50"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                className="bg-background/50"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Work Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                className={`bg-background/50 ${companyInfo && !companyInfo.allowed ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            {formData.email && formData.email.includes('@') && (
                                <div className={`text-xs flex items-center gap-1.5 mt-1 ${companyInfo?.allowed ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {companyInfo?.allowed ? (
                                        <>
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Identified: {companyInfo.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert className="w-3 h-3" />
                                            <span>Domain not in enterprise registry</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Dynamic Role Selection */}
                        {companyInfo?.allowed && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="role" className="flex items-center gap-2">
                                    Role <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full">@{companyInfo.name}</span>
                                </Label>
                                <Select onValueChange={(val) => setFormData({ ...formData, role: val })}>
                                    <SelectTrigger className="bg-background/50">
                                        <SelectValue placeholder={`Select your role at ${companyInfo.name}`} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companyInfo.roles.map((role) => (
                                            <SelectItem key={role} value={role}>{role}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <Button className="w-full" onClick={handleSignup} disabled={isSubmitting || (!!companyInfo && !companyInfo.allowed)}>
                            {isSubmitting ? 'Processing...' : 'Create Account'}
                        </Button>
                    </div>


                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline underline-offset-4">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
