
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      return data;
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (completedSections: any[]) => {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          project_id: projectId,
          course_id: courseId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          completed_sections: completedSections,
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
