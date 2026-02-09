import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Apple } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
                        <span className="font-semibold text-lg tracking-tight">GreenBridge</span>
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
                    </div>


                </div>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline underline-offset-4">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
