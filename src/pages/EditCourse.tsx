
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { useAuth } from "@/hooks/useAuth";

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const isLoading = adminLoading || authLoading;

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !isLoading && isAdmin,
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading || courseLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  if (!course) {
    return <div className="text-center mt-8">
      <h2 className="text-2xl font-bold">Course not found</h2>
      <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
        Back to Dashboard
      </Button>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Edit Course: {course.name}</h1>
        <Button onClick={() => navigate("/")} variant="outline">
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 mb-4">
            Edit course details and manage course content
          </p>
          <div className="space-y-4">
            <p>
              <strong>Course Name:</strong> {course.name}
            </p>
            <p>
              <strong>Description:</strong> {course.description || "No description provided"}
            </p>
            <Button className="w-full" disabled>
              Edit Feature Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCourse;
