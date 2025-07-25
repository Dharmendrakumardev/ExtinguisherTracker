import { type FireExtinguisher, type InsertFireExtinguisher, type MaintenanceLog, type InsertMaintenanceLog, type FireExtinguisherWithLogs } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Fire Extinguisher operations
  getExtinguisher(barcode: string): Promise<FireExtinguisherWithLogs | undefined>;
  getAllExtinguishers(): Promise<FireExtinguisher[]>;
  createExtinguisher(extinguisher: InsertFireExtinguisher): Promise<FireExtinguisher>;
  
  // Maintenance Log operations
  addMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog>;
  getMaintenanceLogsByExtinguisher(extinguisherId: string): Promise<MaintenanceLog[]>;
}

export class MemStorage implements IStorage {
  private extinguishers: Map<string, FireExtinguisher>;
  private maintenanceLogs: Map<string, MaintenanceLog>;

  constructor() {
    this.extinguishers = new Map();
    this.maintenanceLogs = new Map();
  }

  async getExtinguisher(barcode: string): Promise<FireExtinguisherWithLogs | undefined> {
    const extinguisher = Array.from(this.extinguishers.values()).find(e => e.barcode === barcode);
    if (!extinguisher) return undefined;

    const logs = Array.from(this.maintenanceLogs.values())
      .filter(log => log.extinguisherId === extinguisher.id)
      .sort((a, b) => new Date(b.dateWorkDone).getTime() - new Date(a.dateWorkDone).getTime());

    return {
      ...extinguisher,
      maintenanceLogs: logs
    };
  }

  async getAllExtinguishers(): Promise<FireExtinguisher[]> {
    return Array.from(this.extinguishers.values());
  }

  async createExtinguisher(insertExtinguisher: InsertFireExtinguisher): Promise<FireExtinguisher> {
    const id = randomUUID();
    const extinguisher: FireExtinguisher = {
      ...insertExtinguisher,
      id,
      createdAt: new Date()
    };
    this.extinguishers.set(id, extinguisher);
    return extinguisher;
  }

  async addMaintenanceLog(insertLog: InsertMaintenanceLog): Promise<MaintenanceLog> {
    const id = randomUUID();
    const log: MaintenanceLog = {
      ...insertLog,
      id,
      createdAt: new Date()
    };
    this.maintenanceLogs.set(id, log);
    return log;
  }

  async getMaintenanceLogsByExtinguisher(extinguisherId: string): Promise<MaintenanceLog[]> {
    return Array.from(this.maintenanceLogs.values())
      .filter(log => log.extinguisherId === extinguisherId)
      .sort((a, b) => new Date(b.dateWorkDone).getTime() - new Date(a.dateWorkDone).getTime());
  }
}

export const storage = new MemStorage();
