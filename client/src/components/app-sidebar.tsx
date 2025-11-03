import { useState } from "react";
import { BarChart3, Database, FileText, LayoutDashboard, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DashboardDialog } from "@/components/dashboard-dialog";

const menuItems = [
  {
    title: "Dashboards",
    url: "/",
    icon: LayoutDashboard,
    testId: "link-dashboards",
  },
  {
    title: "Data Sources",
    url: "/data-sources",
    icon: Database,
    testId: "link-data-sources",
  },
  {
    title: "Templates",
    url: "/templates",
    icon: FileText,
    testId: "link-templates",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const [showDialog, setShowDialog] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <BarChart3 className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">DataHub</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="flex items-center justify-between mb-2">
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <Button
              size="icon"
              variant="ghost"
              className="w-7 h-7"
              onClick={() => setShowDialog(true)}
              data-testid="button-new-dashboard"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location === item.url ? "bg-sidebar-accent" : ""}
                  >
                    <Link href={item.url} data-testid={item.testId}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <DashboardDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        mode="create"
      />
    </Sidebar>
  );
}
