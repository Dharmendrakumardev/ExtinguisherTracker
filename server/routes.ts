import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFireExtinguisherSchema, insertMaintenanceLogSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get extinguisher by barcode
  app.get("/api/extinguishers/:barcode", async (req, res) => {
    try {
      const { barcode } = req.params;
      const extinguisher = await storage.getExtinguisher(barcode);
      
      if (!extinguisher) {
        return res.status(404).json({ error: "Fire extinguisher not found" });
      }
      
      res.json(extinguisher);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new extinguisher
  app.post("/api/extinguishers", async (req, res) => {
    try {
      const validatedData = insertFireExtinguisherSchema.parse(req.body);
      
      // Check if barcode already exists
      const existing = await storage.getExtinguisher(validatedData.barcode);
      if (existing) {
        return res.status(400).json({ error: "Barcode already exists" });
      }
      
      const extinguisher = await storage.createExtinguisher(validatedData);
      res.status(201).json(extinguisher);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Add maintenance log
  app.post("/api/maintenance-logs", async (req, res) => {
    try {
      const validatedData = insertMaintenanceLogSchema.parse(req.body);
      const log = await storage.addMaintenanceLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all extinguishers
  app.get("/api/extinguishers", async (req, res) => {
    try {
      const extinguishers = await storage.getAllExtinguishers();
      res.json(extinguishers);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
