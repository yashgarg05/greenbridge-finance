import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-primary rounded-md" />
                    <span className="font-semibold text-lg tracking-tight">GreenBridge</span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" className="hover:text-foreground transition-colors">Solutions</a>
                    <a href="#about" className="hover:text-foreground transition-colors">Methodology</a>
                    <a href="#pricing" className="hover:text-foreground transition-colors">Enterprise</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
                        Login
                    </Link>
                    <Link to="/dashboard">
                        <Button size="sm" className="font-medium">
                            Start Compliance
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
