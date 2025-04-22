
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";
import { User, Settings, BookOpen, FileText, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProfileTabs = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="w-[200px] animate-fade-in">
      <div className="flex flex-col space-y-1">
        <DropdownMenuItem 
          className="flex items-center cursor-pointer" 
          onClick={() => navigate('/profile')}
        >
          <User className="mr-2 h-4 w-4" />
          <span>My Profile</span>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin Panel</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/teacher')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Teacher Tools</span>
        </DropdownMenuItem>

        <DropdownMenuItem 
          className="flex items-center cursor-pointer"
          onClick={() => navigate('/learning')}
        >
          <FileText className="mr-2 h-4 w-4" />
          <span>My Learning</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          className="flex items-center cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </div>
    </div>
  );
};
