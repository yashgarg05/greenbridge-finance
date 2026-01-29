import { supabase, CBAMCalculation } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { type CBAMResult } from '@/lib/cbam-calculator';

export function useCalculations() {
    const { user } = useAuth();
    const { toast } = useToast();

    const saveCalculation = async (
        commodityType: string,
        quantity: number,
        country: string,
        result: CBAMResult,
        status: 'draft' | 'verifying' | 'finalized' = 'draft'
    ) => {
        if (!user) {
            toast({
                title: 'Not authenticated',
                description: 'Please log in to save calculations',
                variant: 'destructive',
            });
            return null;
        }

        const calculationData = {
            user_id: user.id,
            commodity_type: commodityType,
            import_quantity: quantity,
            country_of_origin: country,
            emission_factor: result.emissionFactor,
            total_emissions: result.totalEmissions,
            gross_liability: result.grossLiability,
            estimated_liability: result.estimatedLiability,
            ets_price: result.etsPrice,
            status,
        };

        const { data, error } = await supabase
            .from('cbam_calculations')
            .insert(calculationData)
            .select()
            .single();

        if (error) {
            toast({
                title: 'Failed to save calculation',
                description: error.message,
                variant: 'destructive',
            });
            return null;
        }

        toast({
            title: 'Calculation saved',
            description: 'Your CBAM calculation has been saved successfully',
        });

        return data;
    };

    const getCalculations = async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('cbam_calculations')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching calculations:', error);
            return [];
        }

        return data || [];
    };

    const updateCalculationStatus = async (
        id: string,
        status: 'draft' | 'verifying' | 'finalized'
    ) => {
        const { error } = await supabase
            .from('cbam_calculations')
            .update({ status })
            .eq('id', id);

        if (error) {
            toast({
                title: 'Update failed',
                description: error.message,
                variant: 'destructive',
            });
            return false;
        }

        toast({
            title: 'Status updated',
            description: `Calculation status changed to ${status}`,
        });

        return true;
    };

    const deleteCalculation = async (id: string) => {
        const { error } = await supabase
            .from('cbam_calculations')
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
            title: 'Calculation deleted',
            description: 'The calculation has been removed',
        });

        return true;
    };

    return {
        saveCalculation,
        getCalculations,
        updateCalculationStatus,
        deleteCalculation,
    };
}
