import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import Papa from "papaparse";
import { storage } from "./storage";
import {
  insertDashboardSchema,
  insertWidgetSchema,
  insertDataSourceSchema,
} from "@shared/schema";

const upload = multer({ storage: multer.memoryStorage() });

// Helper function to generate template data
function generateTemplateData(templateType: string) {
  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  switch (templateType) {
    case "user-growth":
      return last30Days.map((date, i) => ({
        date,
        users: Math.floor(1000 + i * 50 + Math.random() * 100),
        newUsers: Math.floor(50 + Math.random() * 30),
        activeUsers: Math.floor(800 + i * 40 + Math.random() * 80),
      }));

    case "retention":
      return last30Days.map((date, i) => ({
        date,
        day1: 85 + Math.random() * 10,
        day7: 65 + Math.random() * 10,
        day30: 45 + Math.random() * 10,
      }));

    case "conversion-funnel":
      const visitors = 10000;
      return [
        { stage: "Visitors", users: visitors, percentage: 100 },
        { stage: "Signups", users: Math.floor(visitors * 0.3), percentage: 30 },
        { stage: "Trial", users: Math.floor(visitors * 0.2), percentage: 20 },
        { stage: "Paid", users: Math.floor(visitors * 0.05), percentage: 5 },
      ];

    case "revenue":
      return last30Days.map((date, i) => ({
        date,
        revenue: Math.floor(5000 + i * 200 + Math.random() * 500),
        mrr: Math.floor(4500 + i * 180 + Math.random() * 400),
        arr: Math.floor(54000 + i * 2160 + Math.random() * 4800),
      }));

    case "feature-usage":
      const features = ["Dashboard", "Reports", "Analytics", "Exports", "API"];
      return features.map((feature) => ({
        feature,
        users: Math.floor(500 + Math.random() * 1500),
        sessions: Math.floor(2000 + Math.random() * 5000),
        engagement: (50 + Math.random() * 40).toFixed(1) + "%",
      }));

    default:
      return [];
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboards", async (req, res) => {
    try {
      const dashboards = await storage.getDashboards();
      res.json(dashboards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboards" });
    }
  });

  app.get("/api/dashboards/:id", async (req, res) => {
    try {
      const dashboard = await storage.getDashboard(req.params.id);
      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard not found" });
      }
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard" });
    }
  });

  app.post("/api/dashboards", async (req, res) => {
    try {
      const result = insertDashboardSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid dashboard data", details: result.error });
      }
      const dashboard = await storage.createDashboard(result.data);
      res.status(201).json(dashboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dashboard" });
    }
  });

  app.put("/api/dashboards/:id", async (req, res) => {
    try {
      const result = insertDashboardSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid dashboard data", details: result.error });
      }
      const dashboard = await storage.updateDashboard(req.params.id, result.data);
      if (!dashboard) {
        return res.status(404).json({ error: "Dashboard not found" });
      }
      res.json(dashboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to update dashboard" });
    }
  });

  app.delete("/api/dashboards/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDashboard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Dashboard not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete dashboard" });
    }
  });

  // Widget routes
  app.get("/api/widgets/:dashboardId", async (req, res) => {
    try {
      const widgets = await storage.getWidgets(req.params.dashboardId);
      res.json(widgets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch widgets" });
    }
  });

  app.post("/api/widgets", async (req, res) => {
    try {
      const result = insertWidgetSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid widget data", details: result.error });
      }
      const widget = await storage.createWidget(result.data);
      res.status(201).json(widget);
    } catch (error) {
      res.status(500).json({ error: "Failed to create widget" });
    }
  });

  app.put("/api/widgets/:id", async (req, res) => {
    try {
      const result = insertWidgetSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid widget data", details: result.error });
      }
      const widget = await storage.updateWidget(req.params.id, result.data);
      if (!widget) {
        return res.status(404).json({ error: "Widget not found" });
      }
      res.json(widget);
    } catch (error) {
      res.status(500).json({ error: "Failed to update widget" });
    }
  });

  app.delete("/api/widgets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWidget(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Widget not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete widget" });
    }
  });

  // Data source routes
  app.get("/api/data-sources", async (req, res) => {
    try {
      const dataSources = await storage.getDataSources();
      res.json(dataSources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data sources" });
    }
  });

  app.get("/api/data-sources/:id", async (req, res) => {
    try {
      const dataSource = await storage.getDataSource(req.params.id);
      if (!dataSource) {
        return res.status(404).json({ error: "Data source not found" });
      }
      res.json(dataSource);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data source" });
    }
  });

  app.post("/api/data-sources/upload", upload.single("file"), async (req: Request, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileName = req.file.originalname;
      const fileContent = req.file.buffer.toString("utf-8");
      let parsedData: any = [];
      let type = "json";

      // Determine file type and parse accordingly
      if (fileName.endsWith(".csv")) {
        type = "csv";
        const result = Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
        });
        parsedData = result.data;
      } else if (fileName.endsWith(".json")) {
        try {
          parsedData = JSON.parse(fileContent);
          if (!Array.isArray(parsedData)) {
            parsedData = [parsedData];
          }
        } catch (e) {
          return res.status(400).json({ error: "Invalid JSON format" });
        }
      } else {
        return res.status(400).json({ error: "Unsupported file type. Please upload CSV or JSON." });
      }

      const dataSource = await storage.createDataSource({
        name: fileName,
        type,
        data: parsedData,
      });

      res.status(201).json(dataSource);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload data source" });
    }
  });

  app.delete("/api/data-sources/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDataSource(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Data source not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete data source" });
    }
  });

  // Template data routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = [
        { id: "user-growth", name: "User Growth", description: "Track user acquisition and growth over time" },
        { id: "retention", name: "Retention Metrics", description: "Analyze user retention rates" },
        { id: "conversion-funnel", name: "Conversion Funnel", description: "Visualize conversion rates through stages" },
        { id: "revenue", name: "Revenue Tracking", description: "Monitor revenue, MRR, and ARR" },
        { id: "feature-usage", name: "Feature Usage", description: "Track feature adoption and engagement" },
      ];
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates/:templateId/generate", async (req, res) => {
    try {
      const { templateId } = req.params;
      const data = generateTemplateData(templateId);

      if (data.length === 0) {
        return res.status(404).json({ error: "Template not found" });
      }

      const dataSource = await storage.createDataSource({
        name: `Template: ${templateId}`,
        type: "template",
        data,
      });

      res.status(201).json(dataSource);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate template data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
