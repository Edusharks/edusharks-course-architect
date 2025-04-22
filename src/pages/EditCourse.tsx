
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";

const EditCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, adminLoading, navigate]);

  if (isLoading || adminLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
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
