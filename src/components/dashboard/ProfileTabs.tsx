
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Settings } from "lucide-react";

export const ProfileTabs = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="w-[300px] animate-fade-in">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="profile" onClick={() => setActiveTab("profile")} className="w-full">
            Profile
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => setActiveTab("settings")} className="w-full">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/profile')}
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
        </TabsContent>

        <TabsContent value="settings" className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start" 
            onClick={() => navigate('/admin/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </TabsContent>

        <Button 
          variant="destructive" 
          className="w-full mt-4" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </Tabs>
    </div>
  );
};
