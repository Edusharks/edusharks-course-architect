
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DashboardLayout = () => {
  const { user, signOut } = useAuth();
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
        .single();
        
      if (error) throw error;
      
      if (data && data.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-xl font-bold">
                  EduSharks LMS
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center">
                <Button variant="ghost" size="sm" className="flex items-center">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full object-cover mr-2" 
                    />
                  ) : (
                    <UserRound className="mr-2 h-4 w-4" />
                  )}
                  Profile
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
