
import { Progress } from '@/components/ui/progress';
import { useProgress } from '@/hooks/useProgress';

interface ProgressTrackerProps {
  projectId: string;
  courseId: string;
  totalSections: number;
}

export const ProgressTracker = ({ projectId, courseId, totalSections }: ProgressTrackerProps) => {
  const { progress, isLoading } = useProgress(projectId, courseId);
  
  if (isLoading) return null;

  const completedSections = progress?.completed_sections?.filter(
    (section: any) => section.completed
  ).length ?? 0;

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
