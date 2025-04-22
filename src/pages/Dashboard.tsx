
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookPlus, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { ProgressTracker } from '@/components/ProgressTracker';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useAdmin();
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          projects (
            id,
            name
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          {isAdmin && (
            <>
              <Button onClick={() => navigate('/create-course')} variant="default">
                <BookPlus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
              <Button onClick={() => navigate('/admin/settings')} variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              {course.projects?.map((project) => (
                <ProgressTracker
                  key={project.id}
                  projectId={project.id}
                  courseId={course.id}
                  totalSections={5}
                />
              ))}
              {isAdmin && (
                <Button 
                  onClick={() => navigate(`/courses/${course.id}/edit`)} 
                  variant="outline" 
                  className="mt-4 w-full"
                >
                  Edit Course
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
