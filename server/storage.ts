import {
  type Dashboard,
  type InsertDashboard,
  type Widget,
  type InsertWidget,
  type DataSource,
  type InsertDataSource,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Dashboard operations
  getDashboards(): Promise<Dashboard[]>;
  getDashboard(id: string): Promise<Dashboard | undefined>;
  createDashboard(dashboard: InsertDashboard): Promise<Dashboard>;
  updateDashboard(id: string, dashboard: Partial<InsertDashboard>): Promise<Dashboard | undefined>;
  deleteDashboard(id: string): Promise<boolean>;

  // Widget operations
  getWidgets(dashboardId: string): Promise<Widget[]>;
  getWidget(id: string): Promise<Widget | undefined>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: string, widget: Partial<InsertWidget>): Promise<Widget | undefined>;
  deleteWidget(id: string): Promise<boolean>;

  // Data source operations
  getDataSources(): Promise<DataSource[]>;
  getDataSource(id: string): Promise<DataSource | undefined>;
  createDataSource(dataSource: InsertDataSource): Promise<DataSource>;
  deleteDataSource(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private dashboards: Map<string, Dashboard>;
  private widgets: Map<string, Widget>;
  private dataSources: Map<string, DataSource>;

  constructor() {
    this.dashboards = new Map();
    this.widgets = new Map();
    this.dataSources = new Map();
  }

  // Dashboard operations
  async getDashboards(): Promise<Dashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async getDashboard(id: string): Promise<Dashboard | undefined> {
    return this.dashboards.get(id);
  }

  async createDashboard(insertDashboard: InsertDashboard): Promise<Dashboard> {
    const id = randomUUID();
    const dashboard: Dashboard = {
      id,
      ...insertDashboard,
    };
    this.dashboards.set(id, dashboard);
    return dashboard;
  }

  async updateDashboard(
    id: string,
    updates: Partial<InsertDashboard>
  ): Promise<Dashboard | undefined> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) return undefined;

    const updated = { ...dashboard, ...updates };
    this.dashboards.set(id, updated);
    return updated;
  }

  async deleteDashboard(id: string): Promise<boolean> {
    // Also delete all widgets associated with this dashboard
    const widgets = Array.from(this.widgets.values());
    widgets.forEach((widget) => {
      if (widget.dashboardId === id) {
        this.widgets.delete(widget.id);
      }
    });

    return this.dashboards.delete(id);
  }

  // Widget operations
  async getWidgets(dashboardId: string): Promise<Widget[]> {
    return Array.from(this.widgets.values()).filter(
      (widget) => widget.dashboardId === dashboardId
    );
  }

  async getWidget(id: string): Promise<Widget | undefined> {
    return this.widgets.get(id);
  }

  async createWidget(insertWidget: InsertWidget): Promise<Widget> {
    const id = randomUUID();
    const widget: Widget = {
      id,
      ...insertWidget,
    };
    this.widgets.set(id, widget);
    return widget;
  }

  async updateWidget(
    id: string,
    updates: Partial<InsertWidget>
  ): Promise<Widget | undefined> {
    const widget = this.widgets.get(id);
    if (!widget) return undefined;

    const updated = { ...widget, ...updates };
    this.widgets.set(id, updated);
    return updated;
  }

  async deleteWidget(id: string): Promise<boolean> {
    return this.widgets.delete(id);
  }

  // Data source operations
  async getDataSources(): Promise<DataSource[]> {
    return Array.from(this.dataSources.values());
  }

  async getDataSource(id: string): Promise<DataSource | undefined> {
    return this.dataSources.get(id);
  }

  async createDataSource(insertDataSource: InsertDataSource): Promise<DataSource> {
    const id = randomUUID();
    const dataSource: DataSource = {
      id,
      ...insertDataSource,
      createdAt: new Date(),
    };
    this.dataSources.set(id, dataSource);
    return dataSource;
  }

  async deleteDataSource(id: string): Promise<boolean> {
    return this.dataSources.delete(id);
  }
}

export const storage = new MemStorage();
