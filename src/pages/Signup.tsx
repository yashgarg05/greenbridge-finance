import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Apple } from "lucide-react";
import { useState } from "react";

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: ""
    });

    const handleSignup = () => {
        localStorage.setItem('user_name', formData.name || 'Yash Garg');
        localStorage.setItem('user_email', formData.email || 'yash@greenbridge.finance');
        if (formData.mobile) localStorage.setItem('user_mobile', formData.mobile);
        navigate('/dashboard');
    };

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
                    <h1 className="text-2xl font-bold tracking-tight text-center">Create an account</h1>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Enter your details to get started
                    </p>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="space-y-4">
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-background/50"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="bg-background/50"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" className="bg-background/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm</Label>
                                <Input id="confirmPassword" type="password" className="bg-background/50" />
                            </div>
                        </div>
                        <Button className="w-full" onClick={handleSignup}>Create account</Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/50" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or register with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Button variant="outline" className="w-full px-0">
                            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                            <span className="sr-only">Google</span>
                        </Button>
                        <Button variant="outline" className="w-full px-0">
                            <svg className="h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="microsoft" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"></path>
                            </svg>
                            <span className="sr-only">Microsoft</span>
                        </Button>
                        <Button variant="outline" className="w-full px-0">
                            <Apple className="h-4 w-4" />
                            <span className="sr-only">Apple</span>
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
