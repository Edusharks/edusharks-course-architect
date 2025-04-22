
import { Button } from "@/components/ui/button";
import { BookPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  isAdmin: boolean;
}

export const EmptyState = ({ isAdmin }: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
      <BookPlus className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
      <p className="text-muted-foreground mb-4">
        {isAdmin
          ? "Start by creating your first course!"
          : "Check back later for available courses."}
      </p>
      {isAdmin && (
        <Button onClick={() => navigate("/create-course")}>
          <BookPlus className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      )}
    </div>
  );
};
