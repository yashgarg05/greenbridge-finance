import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GreenBridgeLogo } from "../GreenBridgeLogo";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/10">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <GreenBridgeLogo size="sm" />
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link to="/solutions" className="hover:text-foreground transition-colors">Solutions</Link>
                    <Link to="/methodology" className="hover:text-foreground transition-colors">Methodology</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                        Login
                    </Link>
                    <Link to="/signup">
                        <Button size="sm" className="font-medium">
                            Start Compliance
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
