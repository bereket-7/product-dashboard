import { MoreVertical, ArrowUpDown } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Widget, TableConfig } from "@shared/schema";

interface TableWidgetProps {
  widget: Widget;
  data?: any[];
}

export function TableWidget({ widget, data = [] }: TableWidgetProps) {
  const config = widget.config as TableConfig;
  
  // Mock data if none provided
  const tableData = data.length > 0 ? data : [
    { name: "Product A", users: 1234, revenue: "$45,678", growth: "+12%" },
    { name: "Product B", users: 987, revenue: "$32,456", growth: "+8%" },
    { name: "Product C", users: 756, revenue: "$28,901", growth: "-3%" },
    { name: "Product D", users: 654, revenue: "$21,345", growth: "+15%" },
  ];

  const columns = config.columns || [
    { key: "name", label: "Name", sortable: true },
    { key: "users", label: "Users", sortable: true },
    { key: "revenue", label: "Revenue", sortable: true },
    { key: "growth", label: "Growth", sortable: true },
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
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="text-left p-3 font-medium text-muted-foreground"
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-4 h-4 p-0"
                            data-testid={`button-sort-${column.key}`}
                          >
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-0 hover-elevate"
                    data-testid={`table-row-${index}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="p-3"
                        data-testid={`cell-${column.key}-${index}`}
                      >
                        {row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
