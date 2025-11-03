import { BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyDashboardProps {
  onAddWidget?: () => void;
}

export function EmptyDashboard({ onAddWidget }: EmptyDashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-muted">
        <BarChart3 className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">No widgets yet</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Start building your dashboard by adding widgets to track your metrics and visualize data
      </p>
      <Button onClick={onAddWidget} size="lg" data-testid="button-add-first-widget">
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Widget
      </Button>
    </div>
  );
}
