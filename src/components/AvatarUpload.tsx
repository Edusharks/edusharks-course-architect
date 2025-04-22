
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound, Upload, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  userId: string;
  onAvatarUpdate: (url: string | null) => void;
}

export const AvatarUpload = ({ currentAvatarUrl, userId, onAvatarUpdate }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}.${fileExt}`;
      
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
          id: userId,
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      onAvatarUpdate(data.publicUrl);
      
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
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      setUploading(true);
      
      if (!currentAvatarUrl) return;
      
      // Extract file path from URL
      const urlParts = currentAvatarUrl.split('/');
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
          id: userId,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        });
        
      if (updateError) throw updateError;
      
      onAvatarUpdate(null);
      
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
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        {currentAvatarUrl ? (
          <AvatarImage src={currentAvatarUrl} alt="Profile" />
        ) : (
          <AvatarFallback>
            <UserRound className="h-12 w-12" />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          disabled={uploading}
          className="relative"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </Button>
        
        {currentAvatarUrl && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={removeAvatar}
            disabled={uploading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
