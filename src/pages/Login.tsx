import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { GreenBridgeLogo } from "@/components/GreenBridgeLogo";

const Login = () => {
    const navigate = useNavigate();
    const { signIn, loading } = useAuth();
    const [email, setEmail] = useState("");

    const handleLogin = async () => {
        try {
            await signIn(email);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />

            <div className="w-full max-w-[400px] mx-auto z-10">
                <div className="flex flex-col items-center mb-8">
                    <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <GreenBridgeLogo size="lg" />
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-center">Welcome back</h1>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Enter your credentials to access your account
                    </p>
                </div>

                <div className="bg-card border border-border/50 rounded-2xl shadow-sm p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-background/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" className="bg-background/50" />
                        </div>
                        <Button className="w-full" onClick={handleLogin}>Sign in</Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/5 text-primary"
                            onClick={async () => {
                                const { supabase } = await import("@/integrations/supabase/client");
                                const { dataService } = await import("@/services/dataService");

                                // 1. Try Login
                                const { error } = await supabase.auth.signInWithPassword({
                                    email: 'demo@greenbridge.com',
                                    password: 'demoUser123!'
                                });

                                // 2. If fail, Signup
                                if (error) {
                                    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                                        email: 'demo@greenbridge.com',
                                        password: 'demoUser123!',
                                        options: {
                                            data: {
                                                full_name: 'Demo User',
                                                company_name: 'GreenBridge Demo Ltd.'
                                            }
                                        }
                                    });
                                    if (signUpError) {
                                        console.error(signUpError);
                                        return;
                                    }
                                }

                                // 3. Seed Data & Redirect
                                // Wait a moment for session to establish
                                setTimeout(async () => {
                                    const user = (await supabase.auth.getUser()).data.user;
                                    if (user) {
                                        await dataService.seedDemoData(user.id);
                                        navigate('/dashboard');
                                    }
                                }, 1000);
                            }}
                        >
                            <Play className="mr-2 h-4 w-4" /> {/* Reusing icon or replace with Zap/Play */}
                            Try Demo Account
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-8">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-primary hover:underline underline-offset-4">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
