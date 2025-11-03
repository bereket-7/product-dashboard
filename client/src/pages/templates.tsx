import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, TrendingUp, Users, DollarSign, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const templateIcons: Record<string, any> = {
  "user-growth": Users,
  "retention": Target,
  "conversion-funnel": TrendingUp,
  "revenue": DollarSign,
  "feature-usage": BarChart3,
};

export default function TemplatesPage() {
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<Array<{ id: string; name: string; description: string }>>({
    queryKey: ["/api/templates"],
  });

  const generateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      return await apiRequest("POST", `/api/templates/${templateId}/generate`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-sources"] });
      toast({
        title: "Success",
        description: "Template data generated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate template data",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generate sample data for common product metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template) => {
            const Icon = templateIcons[template.id] || FileText;
            return (
              <Card key={template.id} data-testid={`template-${template.id}`}>
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => generateMutation.mutate(template.id)}
                    disabled={generateMutation.isPending}
                    className="w-full"
                    data-testid={`button-generate-${template.id}`}
                  >
                    {generateMutation.isPending ? "Generating..." : "Generate Data"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
