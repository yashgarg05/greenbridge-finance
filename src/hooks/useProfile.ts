import { useState, useEffect } from 'react';
import { supabase, Profile } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useProfile() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error loading profile:', error);
        } else {
            setProfile(data);
        }
        setLoading(false);
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return false;

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }

        toast({
            title: 'Profile updated',
            description: 'Your profile has been updated successfully',
        });

        await loadProfile();
        return true;
    };

    return {
        profile,
        loading,
        updateProfile,
        refreshProfile: loadProfile,
    };
}
