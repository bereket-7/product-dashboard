import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Dashboard } from "@shared/schema";

interface DashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Dashboard;
  mode?: "create" | "edit";
}

export function DashboardDialog({
  open,
  onOpenChange,
  initialData,
  mode = "create",
}: DashboardDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(initialData?.name || "");
      setDescription(initialData?.description || "");
    }
  }, [open, initialData]);

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string | null; layout: any }) => {
      return await apiRequest("POST", "/api/dashboards", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      toast({
        title: "Success",
        description: "Dashboard created successfully",
      });
      setName("");
      setDescription("");
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create dashboard",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; description: string | null }) => {
      return await apiRequest("PUT", `/api/dashboards/${initialData?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboards", initialData?.id] });
      toast({
        title: "Success",
        description: "Dashboard updated successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update dashboard",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const data = {
      name: name.trim(),
      description: description.trim() || null,
      layout: [],
    };

    if (mode === "create") {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ name: data.name, description: data.description });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-dashboard">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Dashboard" : "Edit Dashboard"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new dashboard to track your metrics"
              : "Update your dashboard details"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Dashboard Name</Label>
            <Input
              id="name"
              placeholder="e.g., Product Metrics Q4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-dashboard-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this dashboard tracks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-testid="input-dashboard-description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || createMutation.isPending || updateMutation.isPending}
            data-testid="button-save-dashboard"
          >
            {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : mode === "create" ? "Create" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
