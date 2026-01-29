import { supabase, Document } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function useDocuments() {
    const { user } = useAuth();
    const { toast } = useToast();

    const uploadDocument = async (file: File) => {
        if (!user) {
            toast({
                title: 'Not authenticated',
                description: 'Please log in to upload documents',
                variant: 'destructive',
            });
            return null;
        }

        // Create a unique file path with user ID folder
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) {
            toast({
                title: 'Upload failed',
                description: uploadError.message,
                variant: 'destructive',
            });
            return null;
        }

        // Save metadata to database
        const { data, error: dbError } = await supabase
            .from('documents')
            .insert({
                user_id: user.id,
                name: file.name,
                size_bytes: file.size,
                file_type: fileExt || 'unknown',
                storage_path: filePath,
            })
            .select()
            .single();

        if (dbError) {
            // Clean up uploaded file if database insert fails
            await supabase.storage.from('documents').remove([filePath]);

            toast({
                title: 'Failed to save document',
                description: dbError.message,
                variant: 'destructive',
            });
            return null;
        }

        toast({
            title: 'Document uploaded',
            description: `${file.name} has been uploaded successfully`,
        });

        return data;
    };

    const getDocuments = async () => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching documents:', error);
            return [];
        }

        return data || [];
    };

    const downloadDocument = async (document: Document) => {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(document.storage_path);

        if (error) {
            toast({
                title: 'Download failed',
                description: error.message,
                variant: 'destructive',
            });
            return null;
        }

        // Create a download link
        const url = URL.createObjectURL(data);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.name;
        window.document.body.appendChild(a);
        a.click();
        window.document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
    };

    const deleteDocument = async (document: Document) => {
        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([document.storage_path]);

        if (storageError) {
            toast({
                title: 'Delete failed',
                description: storageError.message,
                variant: 'destructive',
            });
            return false;
        }

        // Delete from database
        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', document.id);

        if (dbError) {
            toast({
                title: 'Delete failed',
                description: dbError.message,
                variant: 'destructive',
            });
            return false;
        }

        toast({
            title: 'Document deleted',
            description: `${document.name} has been removed`,
        });

        return true;
    };

    return {
        uploadDocument,
        getDocuments,
        downloadDocument,
        deleteDocument,
    };
}
