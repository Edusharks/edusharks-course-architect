
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserRound } from 'lucide-react';

const DashboardLayout = () => {
  const { user, signOut } = useAuth();

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
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <UserRound className="mr-2 h-4 w-4" />
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
