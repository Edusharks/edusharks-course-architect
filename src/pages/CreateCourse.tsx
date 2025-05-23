
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const CreateCourse = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseLink, setCourseLink] = useState('');
  const [startLink, setStartLink] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('courses')
        .insert([
          {
            name,
            description,
            owner_id: user.id,
            is_published: false,
            course_link: courseLink,
            start_link: startLink,
            duration: duration ? parseInt(duration) : null
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Course created successfully",
      });
      navigate('/dashboard');
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
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium">
            Course Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter course name"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="courseLink" className="block text-sm font-medium">
            Course Link
          </label>
          <Input
            id="courseLink"
            value={courseLink}
            onChange={(e) => setCourseLink(e.target.value)}
            placeholder="Enter course link (optional)"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="startLink" className="block text-sm font-medium">
            Start Link
          </label>
          <Input
            id="startLink"
            value={startLink}
            onChange={(e) => setStartLink(e.target.value)}
            placeholder="Enter start link (optional)"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="duration" className="block text-sm font-medium">
            Duration (in hours)
          </label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Enter course duration (optional)"
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </Button>
      </form>
    </div>
  );
};

export default CreateCourse;
