
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

  // Change this section to check for project_completed in user_progress instead of 'completed' on projects
  const completedCourses = 0; // We'll properly implement this later with user_progress data

  if (isLoading || adminLoading) {
    return (
      <div className="space-y-6 p-6 lg:p-8 animate-fade-in">
        <DashboardStats
          isLoading={true}
          totalCourses={0}
          completedCourses={0}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <div className="flex gap-4">
          {isAdmin && (
            <>
              <Button 
                onClick={() => navigate('/create-course')} 
                variant="default"
                className="bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity duration-200"
              >
                <BookPlus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
              <Button 
                onClick={() => navigate('/admin/settings')} 
                variant="outline"
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.01]">
        <DashboardStats
          isLoading={isLoading}
          totalCourses={courses?.length ?? 0}
          completedCourses={completedCourses}
        />
      </div>

      {courses?.length === 0 ? (
        <div className="transform transition-all duration-300 hover:scale-[1.01]">
          <EmptyState isAdmin={isAdmin} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses?.map((course, index) => (
            <div 
              key={course.id}
              className="transform transition-all duration-300 hover:scale-[1.02]"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in-up 0.5s ease-out forwards'
              }}
            >
              <CourseCard
                course={course}
                isAdmin={isAdmin}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
