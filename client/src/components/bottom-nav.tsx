import { useState } from "react";
import { BarChart3, Database, LayoutDashboard, Plus, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardDialog } from "@/components/dashboard-dialog";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboards", path: "/", testId: "nav-dashboards" },
  { icon: Database, label: "Data", path: "/data-sources", testId: "nav-data" },
  { icon: null, label: "Add", path: "/add", testId: "nav-add" }, // FAB placeholder
  { icon: BarChart3, label: "Templates", path: "/templates", testId: "nav-templates" },
  { icon: User, label: "Profile", path: "/profile", testId: "nav-profile" },
];

export function BottomNav() {
  const [location] = useLocation();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          if (index === 2) {
            // FAB in center
            return (
              <Button
                key="fab"
                size="icon"
                className="w-14 h-14 rounded-full shadow-lg"
                onClick={() => setShowDialog(true)}
                data-testid="button-add-widget"
              >
                <Plus className="w-6 h-6" />
              </Button>
            );
          }

          const isActive = location === item.path;
          const Icon = item.icon!;

          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] rounded-md transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover-elevate"
                )}
                data-testid={item.testId}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
      <DashboardDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode="create"
      />
    </nav>
  );
}
