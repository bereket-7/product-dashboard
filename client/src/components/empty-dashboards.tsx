import { LayoutDashboard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDashboardsProps {
  onCreateDashboard?: () => void;
}

export function EmptyDashboards({ onCreateDashboard }: EmptyDashboardsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-muted">
        <LayoutDashboard className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Create your first dashboard</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Dashboards help you organize and visualize your data. Get started by creating your first one.
      </p>
      <Button onClick={onCreateDashboard} size="lg" data-testid="button-create-first-dashboard">
        <Plus className="w-4 h-4 mr-2" />
        Create Dashboard
      </Button>
    </div>
  );
}
