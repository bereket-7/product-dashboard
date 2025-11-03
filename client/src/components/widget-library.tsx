import { BarChart3, LineChart, PieChart, Table, List, TrendingUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WidgetType, ChartType } from "@shared/schema";

interface WidgetLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardId: string;
}

const widgetTemplates = [
  {
    type: "metric" as WidgetType,
    icon: TrendingUp,
    title: "Metric Card",
    description: "Display a single KPI with trend",
  },
  {
    type: "chart" as WidgetType,
    chartType: "line" as ChartType,
    icon: LineChart,
    title: "Line Chart",
    description: "Show trends over time",
  },
  {
    type: "chart" as WidgetType,
    chartType: "bar" as ChartType,
    icon: BarChart3,
    title: "Bar Chart",
    description: "Compare values across categories",
  },
  {
    type: "chart" as WidgetType,
    chartType: "area" as ChartType,
    icon: LineChart,
    title: "Area Chart",
    description: "Visualize cumulative data",
  },
  {
    type: "chart" as WidgetType,
    chartType: "pie" as ChartType,
    icon: PieChart,
    title: "Pie Chart",
    description: "Show proportions and percentages",
  },
  {
    type: "table" as WidgetType,
    icon: Table,
    title: "Data Table",
    description: "Display detailed tabular data",
  },
  {
    type: "list" as WidgetType,
    icon: List,
    title: "List",
    description: "Show a list of metrics",
  },
];

export function WidgetLibrary({ open, onOpenChange, dashboardId }: WidgetLibraryProps) {
  const { toast } = useToast();

  const createWidgetMutation = useMutation({
    mutationFn: async (data: { type: WidgetType; chartType?: ChartType }) => {
      const widgetData = {
        dashboardId,
        type: data.type,
        title: `New ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`,
        chartType: data.chartType || null,
        dataSourceId: null,
        config: data.type === "metric"
          ? { metricKey: "value", showTrend: true, showSparkline: true, format: "number" }
          : data.type === "chart"
          ? { xAxisKey: "name", yAxisKeys: ["value1", "value2"], showGrid: true, showLegend: true }
          : data.type === "table"
          ? { columns: [], pageSize: 10 }
          : {},
        position: { x: 0, y: 0, w: 1, h: 1 },
      };
      return await apiRequest("POST", "/api/widgets", widgetData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/widgets", dashboardId] });
      toast({
        title: "Success",
        description: "Widget added successfully",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add widget",
        variant: "destructive",
      });
    },
  });

  const handleAddWidget = (type: WidgetType, chartType?: ChartType) => {
    createWidgetMutation.mutate({ type, chartType });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md" data-testid="sheet-widget-library">
        <SheetHeader>
          <SheetTitle>Add Widget</SheetTitle>
          <SheetDescription>
            Choose a widget type to add to your dashboard
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {widgetTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={`${template.type}-${template.chartType || ""}`}
                  className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                  onClick={() => handleAddWidget(template.type, template.chartType)}
                  data-testid={`widget-template-${template.type}-${template.chartType || "default"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{template.title}</h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
