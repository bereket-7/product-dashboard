import { MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { Widget, ChartConfig } from "@shared/schema";

interface ChartWidgetProps {
  widget: Widget;
  data?: any[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function ChartWidget({ widget, data = [] }: ChartWidgetProps) {
  const config = widget.config as ChartConfig;
  
  // Mock data if none provided
  const chartData = data.length > 0 ? data : [
    { name: "Jan", value1: 400, value2: 240 },
    { name: "Feb", value1: 300, value2: 139 },
    { name: "Mar", value1: 200, value2: 980 },
    { name: "Apr", value1: 278, value2: 390 },
    { name: "May", value1: 189, value2: 480 },
    { name: "Jun", value1: 239, value2: 380 },
  ];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 10, left: 10, bottom: 5 },
    };

    switch (widget.chartType) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
            <XAxis dataKey={config.xAxisKey || "name"} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--popover-border))",
                borderRadius: "0.5rem",
              }}
            />
            {config.showLegend && <Legend />}
            {(config.yAxisKeys || ["value1"]).map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
            <XAxis dataKey={config.xAxisKey || "name"} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--popover-border))",
                borderRadius: "0.5rem",
              }}
            />
            {config.showLegend && <Legend />}
            {(config.yAxisKeys || ["value1"]).map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case "pie":
      case "donut":
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={widget.chartType === "donut" ? 50 : 0}
              fill="#8884d8"
              dataKey="value1"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--popover-border))",
                borderRadius: "0.5rem",
              }}
            />
            {config.showLegend && <Legend />}
          </PieChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            {config.showGrid && <CartesianGrid strokeDasharray="3 3" opacity={0.2} />}
            <XAxis dataKey={config.xAxisKey || "name"} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--popover-border))",
                borderRadius: "0.5rem",
              }}
            />
            {config.showLegend && <Legend />}
            {(config.yAxisKeys || ["value1"]).map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <Card className="hover-elevate transition-shadow h-full" data-testid={`widget-${widget.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <h3 className="text-lg font-medium truncate">{widget.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 flex-shrink-0"
          data-testid={`button-widget-menu-${widget.id}`}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300} className="md:h-[350px]">
          {renderChart()}
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
}
