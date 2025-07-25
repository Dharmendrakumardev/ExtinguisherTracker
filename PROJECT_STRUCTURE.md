# Fire Extinguisher Maintenance Tracker - Project Structure Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Schema](#database-schema)
6. [Configuration Files](#configuration-files)
7. [Development Workflow](#development-workflow)
8. [Deployment Structure](#deployment-structure)

## Project Overview

This is a full-stack web application built with React.js and Node.js for managing fire extinguisher maintenance and tracking. The application provides QR code generation, barcode scanning (camera and gallery), static information management, and comprehensive maintenance logging.

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build Tool**: Vite
- **Package Manager**: npm
- **Deployment**: Replit

## Directory Structure

```
fire-extinguisher-tracker/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # shadcn/ui base components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── toaster.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   ├── camera-scanner.tsx   # Camera/gallery QR scanning
│   │   │   ├── qr-generator.tsx     # Single QR code generation
│   │   │   └── batch-qr-modal.tsx   # Batch QR code generation modal
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-mobile.tsx       # Mobile device detection
│   │   │   └── use-toast.ts         # Toast notification hook
│   │   ├── lib/                     # Utility libraries
│   │   │   ├── queryClient.ts       # TanStack Query configuration
│   │   │   ├── utils.ts             # General utility functions
│   │   │   └── storage.ts           # Local storage service
│   │   ├── pages/                   # Application pages/routes
│   │   │   ├── home.tsx             # Main dashboard page
│   │   │   ├── static-info.tsx      # Fire extinguisher registration
│   │   │   ├── maintenance-log.tsx  # Maintenance logging page
│   │   │   └── not-found.tsx        # 404 error page
│   │   ├── App.tsx                  # Main application component
│   │   ├── main.tsx                 # Application entry point
│   │   └── index.css                # Global styles and Tailwind CSS
│   └── index.html                   # HTML template
├── server/                          # Backend Node.js application
│   ├── index.ts                     # Express server entry point
│   ├── routes.ts                    # API route definitions
│   ├── storage.ts                   # Data storage abstraction layer
│   ├── db.ts                        # Database connection configuration
│   └── vite.ts                      # Vite development server integration
├── shared/                          # Shared code between client and server
│   └── schema.ts                    # Database schema and TypeScript types
├── components.json                  # shadcn/ui configuration
├── drizzle.config.ts               # Database migration configuration
├── package.json                     # Project dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── .gitignore                      # Git ignore rules
├── .replit                         # Replit configuration
├── package-lock.json               # Dependency lock file
└── replit.md                       # Project documentation and preferences
```

## Frontend Architecture

### Component Structure

#### 1. **Pages (`client/src/pages/`)**
- **home.tsx**: Main dashboard with QR generation, batch generation, and scanning
- **static-info.tsx**: Form for registering new fire extinguishers
- **maintenance-log.tsx**: Interface for adding and viewing maintenance logs
- **not-found.tsx**: 404 error page

#### 2. **Components (`client/src/components/`)**
- **qr-generator.tsx**: Single QR code generation with sharing options
- **batch-qr-modal.tsx**: Modal for batch QR code generation (up to 200 codes)
- **camera-scanner.tsx**: Camera and gallery-based QR scanning component

#### 3. **UI Components (`client/src/components/ui/`)**
Reusable shadcn/ui components providing consistent design system:
- Form controls (Button, Input, Label, Textarea)
- Layout components (Card, Dialog, Badge)
- Feedback components (Toaster, Tooltip)

#### 4. **Hooks (`client/src/hooks/`)**
- **use-mobile.tsx**: Detects mobile devices for responsive behavior
- **use-toast.ts**: Manages toast notifications across the application

#### 5. **Libraries (`client/src/lib/`)**
- **queryClient.ts**: TanStack Query setup for server state management
- **utils.ts**: Utility functions (date formatting, validation, sharing)
- **storage.ts**: Local storage service for client-side data persistence

### State Management
- **TanStack Query**: Server state management and caching
- **React Hooks**: Local component state management
- **Local Storage**: Temporary client-side data persistence

### Routing
- **Wouter**: Lightweight client-side routing
- Route structure:
  - `/` - Home page
  - `/static-info/:barcode` - Fire extinguisher registration
  - `/maintenance-log/:barcode` - Maintenance logging

## Backend Architecture

### Server Structure (`server/`)

#### 1. **index.ts** - Express Server Entry Point
```typescript
// Server initialization, middleware setup, and port configuration
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
```

#### 2. **routes.ts** - API Route Definitions
```typescript
// RESTful API endpoints:
GET    /api/extinguishers          // Get all extinguishers
GET    /api/extinguishers/:barcode // Get specific extinguisher
POST   /api/extinguishers          // Create new extinguisher
POST   /api/maintenance-logs       // Add maintenance log
```

#### 3. **storage.ts** - Data Storage Abstraction
```typescript
interface IStorage {
  getExtinguisher(barcode: string): Promise<FireExtinguisherWithLogs>
  createExtinguisher(data: InsertFireExtinguisher): Promise<FireExtinguisher>
  addMaintenanceLog(log: InsertMaintenanceLog): Promise<MaintenanceLog>
}
```

#### 4. **db.ts** - Database Connection
```typescript
// PostgreSQL connection using Neon serverless
export const db = drizzle({ client: pool, schema })
```

### API Design
- **RESTful Architecture**: Standard HTTP methods and status codes
- **Request Validation**: Zod schema validation for all inputs
- **Error Handling**: Comprehensive error responses with appropriate status codes
- **Type Safety**: Full TypeScript integration from database to API responses

## Database Schema

### Tables Structure

#### 1. **fire_extinguishers**
```sql
CREATE TABLE fire_extinguishers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode TEXT NOT NULL UNIQUE,
  extinguisher_no TEXT NOT NULL,
  location TEXT NOT NULL,
  date_of_testing TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

#### 2. **maintenance_logs**
```sql
CREATE TABLE maintenance_logs (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  extinguisher_id VARCHAR NOT NULL REFERENCES fire_extinguishers(id),
  date_work_done TIMESTAMP NOT NULL,
  remarks TEXT NOT NULL,
  user TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

### Database Relations
```typescript
// One-to-many relationship
fireExtinguishers → maintenanceLogs (1:N)
```

### Type Definitions (`shared/schema.ts`)
```typescript
export type FireExtinguisher = typeof fireExtinguishers.$inferSelect;
export type InsertFireExtinguisher = z.infer<typeof insertFireExtinguisherSchema>;
export type MaintenanceLog = typeof maintenanceLogs.$inferSelect;
export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
```

## Configuration Files

### 1. **package.json** - Project Dependencies
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --bundle --outfile=dist/index.js",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

### 2. **vite.config.ts** - Build Configuration
```typescript
// Aliases for clean imports
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'client/src'),
    '@shared': path.resolve(__dirname, 'shared'),
    '@assets': path.resolve(__dirname, 'attached_assets')
  }
}
```

### 3. **tailwind.config.ts** - Styling Configuration
```typescript
// Design system configuration with custom colors and component styles
theme: {
  extend: {
    colors: {
      primary: "hsl(207, 90%, 54%)",
      // ... custom color palette
    }
  }
}
```

### 4. **drizzle.config.ts** - Database Configuration
```typescript
export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
}
```

## Development Workflow

### 1. **Development Server**
```bash
npm run dev  # Starts both frontend (Vite) and backend (Express) servers
```

### 2. **Database Operations**
```bash
npm run db:push  # Push schema changes to database
```

### 3. **Build Process**
```bash
npm run build   # Build frontend and backend for production
npm start       # Start production server
```

### 4. **Hot Module Replacement**
- Frontend: Vite HMR for instant React updates
- Backend: tsx watch mode for server restarts

## Deployment Structure

### Production Build Output
```
dist/
├── public/          # Built frontend assets
│   ├── index.html
│   ├── assets/
│   │   ├── index-[hash].js
│   │   └── index-[hash].css
└── index.js         # Bundled backend server
```

### Environment Variables
```
DATABASE_URL=postgresql://...
PGHOST=...
PGPORT=5432
PGUSER=...
PGPASSWORD=...
PGDATABASE=...
```

### Hosting Configuration
- **Frontend**: Static files served by Express
- **Backend**: Node.js Express server
- **Database**: PostgreSQL (Neon serverless)
- **Port**: Configurable via environment (default: 5000)

## Key Features Implementation

### 1. **QR Code Generation**
- **Single Generation**: Individual QR codes with sharing options
- **Batch Generation**: Up to 200 sequential QR codes
- **Sharing Methods**: Email, WhatsApp, clipboard, download

### 2. **Barcode Scanning**
- **Camera Scanning**: Real-time QR detection using device camera
- **Gallery Upload**: Scan QR codes from uploaded images
- **Cross-Platform**: Works on mobile, tablet, and desktop devices

### 3. **Data Management**
- **Fire Extinguisher Registration**: Static information capture
- **Maintenance Logging**: Detailed maintenance history tracking
- **Data Persistence**: PostgreSQL database with proper relations

### 4. **User Interface**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: Consistent design system with shadcn/ui
- **Accessibility**: ARIA labels and keyboard navigation support

This project structure provides a scalable, maintainable, and feature-rich fire extinguisher maintenance tracking system with modern web development practices and comprehensive documentation.