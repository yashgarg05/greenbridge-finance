import { useState, useEffect } from "react";
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
    const [marketingEmails, setMarketingEmails] = useState(false);

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
                            <AvatarFallback className="text-xl">YG</AvatarFallback>
                        </Avatar>
                        <Button variant="outline">Change Avatar</Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue="Yash Garg" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="yash@greenbridge.finance" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" defaultValue="GreenFlux Inc." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Input id="role" defaultValue="Sustainability Manager" disabled className="bg-muted" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button>Save Changes</Button>
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
        </div>
    );
};
