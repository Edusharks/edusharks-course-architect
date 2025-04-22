
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

// Define a proper type for the section object
interface Section {
  id: string;
  completed: boolean;
  title?: string;
}

interface UserProgress {
  id: string;
  user_id: string;
  project_id: string;
  course_id: string;
  completed_sections: Section[] | null;
  project_completed: boolean | null;
  last_accessed_at: string | null;
  updated_at: string | null;
}

export const useProgress = (projectId: string, courseId: string) => {
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (error) throw error;
      // Safely cast the data from Json to our UserProgress type
      return {
        ...data,
        completed_sections: data?.completed_sections as unknown as Section[] | null
      } as UserProgress;
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (completedSections: Section[]) => {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          project_id: projectId,
          course_id: courseId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          completed_sections: completedSections as unknown as Database['public']['Tables']['user_progress']['Insert']['completed_sections'],
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', projectId] });
      toast({
        title: "Progress Updated",
        description: "Your progress has been saved",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress: updateProgress.mutate,
    isUpdating: updateProgress.isPending,
  };
};
