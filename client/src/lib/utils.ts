import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function generateUUID(): string {
  return 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function validateField(value: string, fieldName: string): string | null {
  if (!value || value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateDate(date: string, fieldName: string): string | null {
  if (!date) {
    return `${fieldName} is required`;
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return `${fieldName} must be a valid date`;
  }
  
  return null;
}

export function shareBarcode(barcode: string, method: 'email' | 'whatsapp' | 'copy' | 'download') {
  const message = `Fire Extinguisher Barcode: ${barcode}`;
  
  switch (method) {
    case 'email':
      window.open(`mailto:?subject=Fire Extinguisher Barcode&body=${encodeURIComponent(message)}`);
      break;
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
      break;
    case 'copy':
      navigator.clipboard.writeText(barcode);
      return true;
    case 'download':
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(message));
      element.setAttribute('download', `barcode-${barcode}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return true;
  }
  return false;
}
