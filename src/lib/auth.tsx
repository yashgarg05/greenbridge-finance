
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, mockApi } from '@/services/mockApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UseMutateFunction } from '@tanstack/react-query';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: UseMutateFunction<User, Error, any, unknown>;
    signup: UseMutateFunction<User, Error, any, unknown>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial session check
    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await mockApi.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Session check failed', error);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const loginMutation = useMutation({
        mutationFn: (data: any) => mockApi.login(data.email, data.password),
        onSuccess: (data) => {
            setUser(data);
            toast.success('Welcome back!');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const signupMutation = useMutation({
        mutationFn: (data: any) => mockApi.signup(data),
        onSuccess: (data) => {
            setUser(data);
            toast.success('Account created successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const logout = () => {
        mockApi.logout();
        setUser(null);
        queryClient.clear();
        toast.info('Logged out');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            login: loginMutation.mutate,
            signup: signupMutation.mutate,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
