
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookPlus, Settings } from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { CourseCard } from '@/components/dashboard/CourseCard';
import { EmptyState } from '@/components/dashboard/EmptyState';

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

  const completedCourses = courses?.filter(course => 
    course.projects?.every(project => project.completed)
  )?.length ?? 0;

  if (isLoading || adminLoading) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <DashboardStats
          isLoading={true}
          totalCourses={0}
          completedCourses={0}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
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

      <DashboardStats
        isLoading={isLoading}
        totalCourses={courses?.length ?? 0}
        completedCourses={completedCourses}
      />

      {courses?.length === 0 ? (
        <EmptyState isAdmin={isAdmin} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
