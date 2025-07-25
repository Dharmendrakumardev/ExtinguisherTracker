import { FireExtinguisherWithLogs, MaintenanceLog } from "@shared/schema";

export class LocalStorageService {
  private static readonly EXTINGUISHER_PREFIX = 'fe_extinguisher_';

  static saveExtinguisher(barcode: string, data: FireExtinguisherWithLogs): void {
    try {
      localStorage.setItem(
        `${this.EXTINGUISHER_PREFIX}${barcode}`, 
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Failed to save extinguisher data:', error);
      throw new Error('Failed to save data to local storage');
    }
  }

  static getExtinguisher(barcode: string): FireExtinguisherWithLogs | null {
    try {
      const data = localStorage.getItem(`${this.EXTINGUISHER_PREFIX}${barcode}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve extinguisher data:', error);
      return null;
    }
  }

  static getAllExtinguishers(): FireExtinguisherWithLogs[] {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.EXTINGUISHER_PREFIX)
      );
      
      return keys.map(key => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      }).filter(Boolean);
    } catch (error) {
      console.error('Failed to retrieve all extinguishers:', error);
      return [];
    }
  }

  static removeExtinguisher(barcode: string): void {
    try {
      localStorage.removeItem(`${this.EXTINGUISHER_PREFIX}${barcode}`);
    } catch (error) {
      console.error('Failed to remove extinguisher data:', error);
    }
  }

  static addMaintenanceLog(barcode: string, log: MaintenanceLog): void {
    try {
      const extinguisher = this.getExtinguisher(barcode);
      if (extinguisher) {
        extinguisher.maintenanceLogs = [log, ...extinguisher.maintenanceLogs];
        this.saveExtinguisher(barcode, extinguisher);
      }
    } catch (error) {
      console.error('Failed to add maintenance log:', error);
      throw new Error('Failed to add maintenance log');
    }
  }
}
