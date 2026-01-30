import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isMockMode } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signIn: (email: string) => Promise<void>;
    signUp: (email: string, password: string, meta?: any) => Promise<void>;
    signOut: () => Promise<void>;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Init Logic
        const initAuth = async () => {
            if (isMockMode) {
                // Check localStorage for fake session
                const fakeUser = localStorage.getItem('sb-mock-user');
                if (fakeUser) {
                    const u = JSON.parse(fakeUser);
                    setUser(u);
                    setSession({ user: u, access_token: 'mock-token' } as Session);
                }
            } else {
                // Real Supabase
                const { data: { session } } = await supabase.auth.getSession();
                setSession(session);
                setUser(session?.user ?? null);

                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    setSession(session);
                    setUser(session?.user ?? null);
                });

                return () => subscription.unsubscribe();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const signIn = async (email: string) => {
        setLoading(true);
        try {
            if (isMockMode) {
                // Mock Login
                await new Promise(resolve => setTimeout(resolve, 800));
                const mockUser = { id: 'mock-user-id', email, user_metadata: { full_name: 'Demo User' } } as any;
                localStorage.setItem('sb-mock-user', JSON.stringify(mockUser));
                setUser(mockUser);
                setSession({ user: mockUser, access_token: 'mock-token' } as Session);
                toast.success('Logged in (Demo Mode)');
            } else {
                // Real Login
                const { error } = await supabase.auth.signInWithOtp({ email });
                if (error) throw error;
                toast.success('Check your email for the login link!');
            }
        } catch (error) {
            console.error(error);
            toast.error("Login Failed");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, _password: string, meta?: any) => {
        setLoading(true);
        try {
            if (isMockMode) {
                // Mock Signup
                await new Promise(resolve => setTimeout(resolve, 800));
                const mockUser = { id: 'mock-user-id', email, user_metadata: meta } as any;
                localStorage.setItem('sb-mock-user', JSON.stringify(mockUser));
                setUser(mockUser);
                setSession({ user: mockUser, access_token: 'mock-token' } as Session);
                toast.success('Account created (Demo Mode)');
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password: _password,
                    options: { data: meta }
                });
                if (error) throw error;
                toast.success('Check your email to verify your account!');
            }
        } catch (error) {
            console.error(error);
            toast.error("Signup Failed");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (isMockMode) {
            localStorage.removeItem('sb-mock-user');
            setSession(null);
            setUser(null);
            toast.success('Logged out');
        } else {
            await supabase.auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut, isMock: isMockMode }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
