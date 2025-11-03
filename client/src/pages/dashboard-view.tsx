import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Plus, Settings, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MetricCard } from "@/components/widgets/metric-card";
import { ChartWidget } from "@/components/widgets/chart-widget";
import { TableWidget } from "@/components/widgets/table-widget";
import { ListWidget } from "@/components/widgets/list-widget";
import { WidgetLibrary } from "@/components/widget-library";
import { EmptyDashboard } from "@/components/empty-dashboard";
import { DashboardDialog } from "@/components/dashboard-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Dashboard, Widget } from "@shared/schema";

export default function DashboardView() {
  const [, params] = useRoute("/dashboard/:id");
  const [, setLocation] = useLocation();
  const dashboardId = params?.id;
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const { data: dashboard, isLoading: loadingDashboard } = useQuery<Dashboard>({
    queryKey: ["/api/dashboards", dashboardId],
    enabled: !!dashboardId,
  });

  const { data: widgets, isLoading: loadingWidgets } = useQuery<Widget[]>({
    queryKey: ["/api/widgets", dashboardId],
    enabled: !!dashboardId,
  });

  const deleteDashboardMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/dashboards/${dashboardId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      toast({
        title: "Success",
        description: "Dashboard deleted successfully",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete dashboard",
        variant: "destructive",
      });
    },
  });

  const duplicateDashboardMutation = useMutation({
    mutationFn: async () => {
      if (!dashboard) return;
      return await apiRequest("POST", "/api/dashboards", {
        name: `${dashboard.name} (Copy)`,
        description: dashboard.description,
        layout: dashboard.layout,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      toast({
        title: "Success",
        description: "Dashboard duplicated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate dashboard",
        variant: "destructive",
      });
    },
  });

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "metric":
        return <MetricCard key={widget.id} widget={widget} />;
      case "chart":
        return <ChartWidget key={widget.id} widget={widget} />;
      case "table":
        return <TableWidget key={widget.id} widget={widget} />;
      case "list":
        return <ListWidget key={widget.id} widget={widget} />;
      default:
        return null;
    }
  };

  if (loadingDashboard || loadingWidgets) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Dashboard not found</h2>
          <p className="text-muted-foreground">This dashboard may have been deleted</p>
        </div>
      </div>
    );
  }

  const hasWidgets = widgets && widgets.length > 0;

  return (
    <>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-semibold truncate">{dashboard.name}</h1>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      data-testid="button-dashboard-menu"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)} data-testid="menu-edit-dashboard">
                      Edit Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => duplicateDashboardMutation.mutate()} data-testid="menu-duplicate-dashboard">
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="text-destructive" data-testid="menu-delete-dashboard">
                      Delete Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {dashboard.description && (
                <p className="text-sm text-muted-foreground">{dashboard.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-9 h-9"
                data-testid="button-dashboard-settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setShowWidgetLibrary(true)}
                data-testid="button-add-widget"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Add Widget</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Widget Grid */}
          {!hasWidgets ? (
            <EmptyDashboard onAddWidget={() => setShowWidgetLibrary(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {widgets.map((widget) => renderWidget(widget))}
            </div>
          )}
        </div>
      </div>

      {/* Widget Library Sheet */}
      {dashboardId && (
        <WidgetLibrary
          open={showWidgetLibrary}
          onOpenChange={setShowWidgetLibrary}
          dashboardId={dashboardId}
        />
      )}

      {/* Edit Dashboard Dialog */}
      <DashboardDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        initialData={dashboard}
        mode="edit"
      />

      {/* Delete Dashboard Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{dashboard?.name}"? This action cannot be undone and will also delete all widgets in this dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDashboardMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
