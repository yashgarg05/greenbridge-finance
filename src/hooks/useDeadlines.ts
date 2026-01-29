import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Deadline {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    due_date: string;
    status: 'urgent' | 'pending' | 'upcoming' | 'completed';
    created_at: string;
    updated_at: string;
}

export function useDeadlines() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [deadlines, setDeadlines] = useState<Deadline[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadDeadlines();
        } else {
            setDeadlines([]);
            setLoading(false);
        }
    }, [user]);

    const loadDeadlines = async () => {
        if (!user) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('compliance_deadlines')
            .select('*')
            .eq('user_id', user.id)
            .order('due_date', { ascending: true });

        if (error) {
            console.error('Error loading deadlines:', error);
            setDeadlines([]);
        } else {
            setDeadlines(data || []);
        }
        setLoading(false);
    };

    const addDeadline = async (deadline: Omit<Deadline, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
        if (!user) return null;

        const { data, error } = await supabase
            .from('compliance_deadlines')
            .insert({ ...deadline, user_id: user.id })
            .select()
            .single();

        if (error) {
            toast({
                title: 'Failed to add deadline',
                description: error.message,
                variant: 'destructive',
            });
            return null;
        }

        toast({
            title: 'Deadline added',
            description: 'New deadline has been added successfully',
        });

        await loadDeadlines();
        return data;
    };

    const updateDeadline = async (id: string, updates: Partial<Deadline>) => {
        const { error } = await supabase
            .from('compliance_deadlines')
            .update(updates)
            .eq('id', id);

        if (error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }

        await loadDeadlines();
        return true;
    };

    const deleteDeadline = async (id: string) => {
        const { error } = await supabase
            .from('compliance_deadlines')
            .delete()
            .eq('id', id);

        if (error) {
            toast({
                title: 'Delete failed',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }

        toast({
            title: 'Deadline deleted',
            description: 'The deadline has been removed',
        });

        await loadDeadlines();
        return true;
    };

    return {
        deadlines,
        loading,
        addDeadline,
        updateDeadline,
        deleteDeadline,
        refreshDeadlines: loadDeadlines,
    };
}
