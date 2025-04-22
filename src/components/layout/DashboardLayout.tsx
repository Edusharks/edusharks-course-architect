
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileTabs } from '@/components/dashboard/ProfileTabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserAvatar();
    }
  }, [user]);

  const fetchUserAvatar = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) throw error;
      
      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="bg-white dark:bg-gray-900 shadow-sm animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex-shrink-0 flex items-center"
              >
                <img 
                  src="/lovable-uploads/29f87b55-a32d-4548-9c0a-316d44401bf2.png" 
                  alt="Edusharks Academy" 
                  className="h-12 w-auto object-contain" 
                />
              </Link>
            </div>
            <div className="flex items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-800">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Profile" 
                        className="h-8 w-8 rounded-full object-cover mr-2 ring-2 ring-primary/20" 
                      />
                    ) : (
                      <UserRound className="mr-2 h-6 w-6" />
                    )}
                    <span className="ml-2">{user.email}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <ProfileTabs />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
