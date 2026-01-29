import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Lock, User, Moon, Sun, Monitor, LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { seedDemoData } from "@/lib/demo-data";
import { useAuth } from "@/contexts/AuthContext";
import { Database, RotateCcw } from "lucide-react";

export const SettingsPanel = () => {
    const { profile, loading, updateProfile } = useProfile();
    const { user } = useAuth();
    const { toast } = useToast();
    const [isSeeding, setIsSeeding] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        mobile: ""
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || "",
                email: profile.email || "",
                company: profile.company || "",
                mobile: profile.mobile || ""
            });
        }
    }, [profile]);

    useEffect(() => {
        // Sync with current theme on mount
        const isDarkMode = document.documentElement.classList.contains('dark');
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = (checked: boolean) => {
        setIsDark(checked);
        if (checked) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        // Dispatch a custom event so AppSidebar can update if it listens (optional, or just rely on shared DOM state)
        window.dispatchEvent(new Event('storage'));
    };

    const handleSaveProfile = async () => {
        const success = await updateProfile({
            name: formData.name,
            company: formData.company,
            mobile: formData.mobile
        });

        if (!success) {
            toast({
                title: "Update failed",
                description: "Failed to save profile changes",
                variant: "destructive"
            });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto pb-12">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            {/* Profile Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>Update your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/placeholder-avatar.jpg" />
                            <AvatarFallback className="text-xl">{getInitials(formData.name || "U N")}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Avatar</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={formData.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input
                                id="mobile"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Preferences
                    </CardTitle>
                    <CardDescription>Customize your dashboard experience.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                Switch between light and dark themes.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sun className="h-4 w-4 text-muted-foreground" />
                            <Switch checked={isDark} onCheckedChange={toggleTheme} />
                            <Moon className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive updates about your carbon credits.
                            </p>
                        </div>
                        <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive news and special offers.
                            </p>
                        </div>
                        <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Security
                    </CardTitle>
                    <CardDescription>Manage password and authentication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                        </div>
                        <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">Add an extra layer of security.</p>
                        </div>
                        <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/20 bg-red-500/5">
                <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                        <LogOut className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Demo Data Zone */}
            <Card className="border-indigo-500/20 bg-indigo-500/5">
                <CardHeader>
                    <CardTitle className="text-indigo-600 flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Demo Data
                    </CardTitle>
                    <CardDescription>Actions for presentation and testing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Populate Demo Content</p>
                            <p className="text-sm text-muted-foreground">Injects realistic sample data into your Dashboard, Map, and Projects.</p>
                        </div>
                        <Button
                            variant="default"
                            className="bg-indigo-600 hover:bg-indigo-700"
                            disabled={isSeeding}
                            onClick={async () => {
                                if (!user) return;
                                setIsSeeding(true);
                                const success = await seedDemoData(user.id);
                                setIsSeeding(false);
                                if (success) {
                                    toast({
                                        title: "Demo Data Injected! 🚀",
                                        description: "Please refresh the dashboard to see lively content.",
                                    });
                                } else {
                                    toast({
                                        title: "Injection Failed",
                                        description: "Check if all tables (projects, cbam_calculations, compliance_deadlines) exist.",
                                        variant: "destructive"
                                    });
                                }
                            }}
                        >
                            {isSeeding ? <RotateCcw className="h-4 w-4 animate-spin mr-2" /> : <Database className="h-4 w-4 mr-2" />}
                            {isSeeding ? 'Injecting...' : 'Inject Real-time Data'}
                        </Button>
                    </div>
                </CardContent>
            </Card >
        </div >
    );
};
