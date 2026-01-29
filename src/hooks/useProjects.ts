import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    price_per_unit: number;
    credits_per_unit: number;
    image_url: string;
    category: 'Solar' | 'Forestry' | 'Wind' | 'Water' | 'Direct Air Capture';
    funding_percentage: number;
    verified_by: string;
    quality_rating: 'AAA' | 'AA' | 'A' | 'B+';
    sdg_goals: number[];
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*');

        if (error) {
            console.error('Error loading projects:', error);
            // Fallback for demo purposes if table doesn't exist yet
            // In production this would just show error state
        } else {
            setProjects(data || []);
        }
        setLoading(false);
    };

    const addProject = async (project: Omit<Project, 'id'>) => {
        const { data, error } = await supabase
            .from('projects')
            .insert(project)
            .select()
            .single();

        if (error) {
            toast({
                title: 'Failed to add project',
                description: error.message,
                variant: 'destructive',
            });
            return null;
        }

        toast({
            title: 'Project listed',
            description: 'Your project has been submitted for verification.',
        });

        await loadProjects();
        return data;
    };

    return {
        projects,
        loading,
        addProject,
        refreshProjects: loadProjects
    };
}
