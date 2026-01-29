import { Calculator, Sprout, ShieldCheck, BookOpen, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FeatureShortcutsProps {
    onTabChange: (tab: string) => void;
}

export const FeatureShortcuts = ({ onTabChange }: FeatureShortcutsProps) => {
    const navigate = useNavigate();

    const shortcuts = [
        {
            id: 'calculator',
            title: "CBAM Calculator",
            description: "Estimate your carbon liability.",
            icon: Calculator,
            action: () => onTabChange('calculator'),
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            id: 'invest',
            title: "Green Investment",
            description: "Offset emissions with verified projects.",
            icon: Sprout,
            action: () => onTabChange('invest'),
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            id: 'compliance',
            title: "Compliance Panel",
            description: "Manage reports and audit trails.",
            icon: ShieldCheck,
            action: () => onTabChange('compliance'),
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shortcuts.map((item) => (
                <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={item.action}
                >
                    <div className="p-4 flex flex-col h-full justify-between gap-4">
                        <div className="flex items-start justify-between">
                            <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        </div>

                        <div>
                            <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
