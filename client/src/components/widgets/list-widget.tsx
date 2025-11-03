import { MoreVertical } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Widget } from "@shared/schema";

interface ListWidgetProps {
  widget: Widget;
  data?: any[];
}

export function ListWidget({ widget, data = [] }: ListWidgetProps) {
  // Mock data if none provided
  const listData = data.length > 0 ? data : [
    { label: "Active Users", value: "12,345", change: "+5.2%", positive: true },
    { label: "New Signups", value: "1,234", change: "+12.8%", positive: true },
    { label: "Churn Rate", value: "2.3%", change: "-0.5%", positive: true },
    { label: "Revenue", value: "$45,678", change: "+8.1%", positive: true },
    { label: "Conversion Rate", value: "3.2%", change: "-1.2%", positive: false },
  ];

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
      <CardContent className="space-y-0">
        {listData.map((item, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between py-3 hover-elevate rounded-md px-2 -mx-2"
              data-testid={`list-item-${index}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.label}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-base font-semibold font-mono" data-testid={`value-${index}`}>
                  {item.value}
                </span>
                <Badge
                  variant={item.positive ? "default" : "destructive"}
                  className="min-w-[60px] justify-center"
                >
                  {item.change}
                </Badge>
              </div>
            </div>
            {index < listData.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
