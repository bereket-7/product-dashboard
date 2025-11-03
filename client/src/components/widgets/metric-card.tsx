import { TrendingUp, TrendingDown, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { Widget, MetricConfig } from "@shared/schema";

interface MetricCardProps {
  widget: Widget;
  data?: any[];
}

export function MetricCard({ widget, data = [] }: MetricCardProps) {
  const config = widget.config as MetricConfig;
  
  // Mock data for sparkline
  const sparklineData = data.length > 0 ? data : [
    { value: 45 }, { value: 52 }, { value: 48 }, { value: 61 },
    { value: 55 }, { value: 67 }, { value: 72 }
  ];

  const currentValue = sparklineData[sparklineData.length - 1]?.value || 0;
  const previousValue = sparklineData[sparklineData.length - 2]?.value || 0;
  const trend = currentValue - previousValue;
  const trendPercent = previousValue ? ((trend / previousValue) * 100).toFixed(1) : "0.0";
  const isPositive = trend >= 0;

  const formatValue = (value: number) => {
    if (config.format === 'percentage') return `${value}%`;
    if (config.format === 'currency') return `$${value.toLocaleString()}`;
    return value.toLocaleString();
  };

  return (
    <Card className="hover-elevate transition-shadow h-full" data-testid={`widget-${widget.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground truncate">
            {widget.title}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 flex-shrink-0"
          data-testid={`button-widget-menu-${widget.id}`}
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono" data-testid={`metric-value-${widget.id}`}>
              {formatValue(currentValue)}
            </span>
            {config.showTrend && (
              <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-chart-2' : 'text-destructive'}`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{Math.abs(Number(trendPercent))}%</span>
              </div>
            )}
          </div>
          {config.comparisonKey && (
            <p className="text-sm text-muted-foreground">
              vs. previous period
            </p>
          )}
        </div>
        {config.showSparkline && (
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </CardFooter>
    </Card>
  );
}
