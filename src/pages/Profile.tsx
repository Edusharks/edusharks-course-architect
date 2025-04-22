
import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { UserRound, Mail, Upload, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error fetching profile information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadLoading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploadLoading(true);
      
      if (!user || !avatarUrl) return;
      
      // Extract file path from URL
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Remove file from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName]);
        
      if (deleteError) throw deleteError;
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      setAvatarUrl(null);
      
      toast({
        title: "Success",
        description: "Avatar removed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="h-24 w-24 rounded-full object-cover" 
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserRound className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                
                <div className="mt-4 flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={uploadLoading}
                    className="relative"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploadLoading}
                    />
                  </Button>
                  
                  {avatarUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={removeAvatar}
                      disabled={uploadLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <div className="w-full">
                <p className="text-sm text-gray-500">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
