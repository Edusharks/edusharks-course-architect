
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/useProgress';
import { Database } from '@/integrations/supabase/types';

// Define a proper type for the section object
interface Section {
  id: string;
  completed: boolean;
  title?: string;
}

interface ProgressTrackerProps {
  projectId: string;
  courseId: string;
  totalSections: number;
}

export const ProgressTracker = ({ projectId, courseId, totalSections }: ProgressTrackerProps) => {
  const { progress, isLoading } = useProgress(projectId, courseId);
  
  if (isLoading) return null;

  // Safely check if completed_sections exists and is an array
  const completedSectionsArray = Array.isArray(progress?.completed_sections) 
    ? progress.completed_sections 
    : [];
  
  const completedSections = completedSectionsArray.filter(section => section.completed).length;

  const progressPercentage = (completedSections / totalSections) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Course Progress</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <Progress value={progressPercentage} />
      {progress?.project_completed && (
        <p className="text-sm text-green-600">Project Completed! 🎉</p>
      )}
    </div>
  );
};
