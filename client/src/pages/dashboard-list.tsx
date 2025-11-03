import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, MoreVertical, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { DashboardDialog } from "@/components/dashboard-dialog";
import { EmptyDashboards } from "@/components/empty-dashboards";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Dashboard } from "@shared/schema";

export default function DashboardList() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingDashboard, setEditingDashboard] = useState<Dashboard | undefined>();
  const [deletingDashboard, setDeletingDashboard] = useState<Dashboard | undefined>();
  const { toast } = useToast();

  const { data: dashboards, isLoading } = useQuery<Dashboard[]>({
    queryKey: ["/api/dashboards"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/dashboards/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      toast({
        title: "Success",
        description: "Dashboard deleted successfully",
      });
      setDeletingDashboard(undefined);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete dashboard",
        variant: "destructive",
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (dashboard: Dashboard) => {
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

  const handleCreateDashboard = () => {
    setEditingDashboard(undefined);
    setShowDialog(true);
  };

  const handleEdit = (dashboard: Dashboard, e: React.MouseEvent) => {
    e.preventDefault();
    setEditingDashboard(dashboard);
    setShowDialog(true);
  };

  const handleDelete = (dashboard: Dashboard, e: React.MouseEvent) => {
    e.preventDefault();
    setDeletingDashboard(dashboard);
  };

  const handleDuplicate = (dashboard: Dashboard, e: React.MouseEvent) => {
    e.preventDefault();
    duplicateMutation.mutate(dashboard);
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboards || dashboards.length === 0) {
    return (
      <>
        <EmptyDashboards onCreateDashboard={handleCreateDashboard} />
        <DashboardDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          mode="create"
        />
      </>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Dashboards</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view your data dashboards
            </p>
          </div>
          <Button onClick={handleCreateDashboard} data-testid="button-create-dashboard">
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Dashboard</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => (
            <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
              <Card
                className="hover-elevate active-elevate-2 transition-all cursor-pointer h-full"
                data-testid={`dashboard-card-${dashboard.id}`}
              >
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary flex-shrink-0">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{dashboard.name}</h3>
                      {dashboard.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {dashboard.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 flex-shrink-0"
                        data-testid={`button-dashboard-menu-${dashboard.id}`}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => handleEdit(dashboard, e)} data-testid="menu-edit">
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleDuplicate(dashboard, e)} data-testid="menu-duplicate">
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => handleDelete(dashboard, e)}
                        data-testid="menu-delete"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>0 widgets</span>
                    <span>•</span>
                    <span>Last edited today</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <DashboardDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        initialData={editingDashboard}
        mode={editingDashboard ? "edit" : "create"}
      />

      <AlertDialog open={!!deletingDashboard} onOpenChange={() => setDeletingDashboard(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Dashboard</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDashboard?.name}"? This action cannot be undone and will also delete all widgets in this dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingDashboard && deleteMutation.mutate(deletingDashboard.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
