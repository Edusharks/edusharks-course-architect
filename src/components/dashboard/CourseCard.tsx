
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookPlus } from "lucide-react";
import { ProgressTracker } from "@/components/ProgressTracker";

interface CourseCardProps {
  course: {
    id: string;
    name: string;
    description: string;
    projects?: { id: string; name: string }[];
  };
  isAdmin: boolean;
}

export const CourseCard = ({ course, isAdmin }: CourseCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span className="text-xl font-semibold">{course.name}</span>
          {isAdmin && (
            <Button 
              onClick={() => navigate(`/courses/${course.id}/edit`)} 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              <BookPlus className="h-4 w-4" />
              <span className="sr-only">Edit Course</span>
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 flex-grow">
          {course.description}
        </p>
        <div className="space-y-4">
          {course.projects?.map((project) => (
            <ProgressTracker
              key={project.id}
              projectId={project.id}
              courseId={course.id}
              totalSections={5}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
