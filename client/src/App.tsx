import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import { BottomNav } from "@/components/bottom-nav";
import DashboardList from "@/pages/dashboard-list";
import DashboardView from "@/pages/dashboard-view";
import DataSourcesPage from "@/pages/data-sources";
import TemplatesPage from "@/pages/templates";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardList} />
      <Route path="/dashboard/:id" component={DashboardView} />
      <Route path="/data-sources" component={DataSourcesPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block">
                <AppSidebar />
              </div>

              {/* Main Content */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Top Header */}
                <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-border bg-background">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger
                      data-testid="button-sidebar-toggle"
                      className="lg:hidden"
                    />
                  </div>
                  <ThemeToggle />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto pb-16 lg:pb-0">
                  <Router />
                </main>

                {/* Mobile Bottom Navigation */}
                <BottomNav />
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
