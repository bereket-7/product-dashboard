import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Dashboard schema
export const dashboards = pgTable("dashboards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  layout: jsonb("layout").notNull().default('[]'),
});

export const insertDashboardSchema = createInsertSchema(dashboards).omit({
  id: true,
});

export type InsertDashboard = z.infer<typeof insertDashboardSchema>;
export type Dashboard = typeof dashboards.$inferSelect;

// Widget schema
export const widgets = pgTable("widgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  dashboardId: varchar("dashboard_id").notNull(),
  type: text("type").notNull(), // 'metric', 'chart', 'table', 'list'
  title: text("title").notNull(),
  chartType: text("chart_type"), // 'line', 'bar', 'area', 'pie', 'donut', 'funnel'
  dataSourceId: varchar("data_source_id"),
  config: jsonb("config").notNull().default('{}'),
  position: jsonb("position").notNull().default('{"x":0,"y":0,"w":1,"h":1}'),
});

export const insertWidgetSchema = createInsertSchema(widgets).omit({
  id: true,
});

export type InsertWidget = z.infer<typeof insertWidgetSchema>;
export type Widget = typeof widgets.$inferSelect;

// Data Source schema
export const dataSources = pgTable("data_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'csv', 'json', 'template'
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDataSourceSchema = createInsertSchema(dataSources).omit({
  id: true,
  createdAt: true,
});

export type InsertDataSource = z.infer<typeof insertDataSourceSchema>;
export type DataSource = typeof dataSources.$inferSelect;

// TypeScript types for widget configuration
export type WidgetType = 'metric' | 'chart' | 'table' | 'list';
export type ChartType = 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'funnel';

export interface MetricConfig {
  metricKey: string;
  comparisonKey?: string;
  showTrend?: boolean;
  showSparkline?: boolean;
  format?: 'number' | 'percentage' | 'currency';
}

export interface ChartConfig {
  xAxisKey: string;
  yAxisKeys: string[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}

export interface TableConfig {
  columns: Array<{
    key: string;
    label: string;
    sortable?: boolean;
  }>;
  pageSize?: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}
