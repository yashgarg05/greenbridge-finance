import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Lock, User, Moon, Sun, Monitor, LogOut } from "lucide-react";

export const SettingsPanel = () => {
    const [isDark, setIsDark] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);


    const { user } = useAuth();

    // Initialize state from auth
    const [userData, setUserData] = useState({
        name: user?.user_metadata?.full_name || "Guest User",
        email: user?.email || "",
        company: user?.user_metadata?.company || "Unregistered",
        role: user?.user_metadata?.role || "Observer"
    });

    useEffect(() => {
        if (user) {
            setUserData({
                name: user.user_metadata?.full_name || userData.name,
                email: user.email || userData.email,
                company: user.user_metadata?.company || userData.company,
                role: user.user_metadata?.role || userData.role
            });
        }
    }, [user]);

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

    const handleSave = async () => {
        try {
            if (!user) return;
            // Update auth metadata
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: userData.name,
                    company: userData.company
                }
            });

            if (error) throw error;
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
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
                            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder-avatar.jpg"} />
                            <AvatarFallback className="text-xl">
                                {userData.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Avatar</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={userData.name}
                                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                value={userData.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input
                                id="company"
                                value={userData.company}
                                onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" value={userData.role} disabled className="bg-muted" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSave}>Save Changes</Button>
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

            {/* Developer Zone */}
            <Card className="border-indigo-500/20 bg-indigo-500/5">
                <CardHeader>
                    <CardTitle className="text-indigo-600 flex items-center gap-2">
                        <Monitor className="h-5 w-5" />
                        Developer Tools
                    </CardTitle>
                    <CardDescription>Tools for testing and demo purposes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Seed Demo Data</p>
                            <p className="text-sm text-muted-foreground">Populate your account with sample investments and IoT data.</p>
                        </div>
                        <Button
                            variant="outline"
                            className="border-indigo-200 hover:bg-indigo-50 text-indigo-700"
                            onClick={async () => {
                                toast.loading("Seeding data...");
                                try {
                                    // Static import preferred if dynamic causes issues, but keeping dynamic for now to match pattern
                                    const { dataService } = await import("@/services/dataService");
                                    const success = await dataService.seedDemoData();

                                    toast.dismiss();
                                    if (success) {
                                        toast.success("Account populated!", { description: "Refresh the dashboard to see changes." });
                                        // Force reload to ensure data visible
                                        setTimeout(() => window.location.reload(), 1500);
                                    } else {
                                        toast.error("Seeding incomplete", { description: "User not logged in or existing data found." });
                                    }
                                } catch (e: any) {
                                    console.error("Seeding Error:", e);
                                    toast.dismiss();
                                    toast.error("Seeding failed", { description: e.message || "Unknown network error" });
                                }
                            }}
                        >
                            Populate Account
                        </Button>
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
        </div>
    );
};
