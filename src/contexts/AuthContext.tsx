import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string, mobile?: string) => Promise<{ error: AuthError | null }>;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, fullName: string, mobile?: string) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        mobile: mobile || null,
                    },
                },
            });

            if (error) {
                toast({
                    title: 'Signup failed',
                    description: error.message,
                    variant: 'destructive',
                });
                return { error };
            }

            if (data.user) {
                toast({
                    title: 'Account created!',
                    description: 'Welcome to GreenBridge Finance',
                });
            }

            return { error: null };
        } catch (error) {
            const authError = error as AuthError;
            toast({
                title: 'Signup failed',
                description: authError.message || 'An unexpected error occurred',
                variant: 'destructive',
            });
            return { error: authError };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast({
                    title: 'Login failed',
                    description: error.message,
                    variant: 'destructive',
                });
                return { error };
            }

            if (data.user) {
                toast({
                    title: 'Welcome back!',
                    description: `Logged in as ${data.user.email}`,
                });
            }

            return { error: null };
        } catch (error) {
            const authError = error as AuthError;
            toast({
                title: 'Login failed',
                description: authError.message || 'An unexpected error occurred',
                variant: 'destructive',
            });
            return { error: authError };
        }
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast({
                title: 'Signout failed',
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: 'Signed out',
                description: 'See you next time!',
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
