import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useChecklist() {
    const { user } = useAuth();
    const { toast } = useToast();

    const getChecklistItems = async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('checklist_items')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching checklist:', error);
            return [];
        }

        return data || [];
    };

    const initializeChecklist = async (defaultItems: any[]) => {
        if (!user) return [];

        // Check if user already has checklist items
        const existing = await getChecklistItems();
        if (existing.length > 0) return existing;

        // Create checklist items for new user
        const items = defaultItems.map((item) => ({
            user_id: user.id,
            item_key: item.id,
            title: item.title,
            description: item.description,
            completed: item.completed,
            required: item.required,
        }));

        const { data, error } = await supabase
            .from('checklist_items')
            .insert(items)
            .select();

        if (error) {
            console.error('Error initializing checklist:', error);
            return [];
        }

        return data || [];
    };

    const toggleChecklistItem = async (itemKey: string, completed: boolean) => {
        if (!user) return false;

        const { error } = await supabase
            .from('checklist_items')
            .update({ completed })
            .eq('user_id', user.id)
            .eq('item_key', itemKey);

        if (error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }

        return true;
    };

    return {
        getChecklistItems,
        initializeChecklist,
        toggleChecklistItem,
    };
}
