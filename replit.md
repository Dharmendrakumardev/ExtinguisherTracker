# Fire Extinguisher Maintenance Tracker

## Overview

This is a full-stack web application for managing fire extinguisher maintenance and tracking. The application allows users to generate QR codes for fire extinguishers, manage static information, and maintain detailed maintenance logs. Originally designed as a React Native mobile application, this has been adapted as a modern web application using React with TypeScript.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### January 25, 2025
- **Database Integration**: Successfully migrated from in-memory storage to PostgreSQL
- **Camera Scanner**: Added real-time QR code scanning with device camera for mobile users
- **Storage Layer**: Implemented DatabaseStorage class with Drizzle ORM relations

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI components wrapped in shadcn/ui
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Middleware**: Express middleware for JSON parsing and request logging
- **Development**: Hot module replacement with Vite integration

### Data Storage Strategy
- **Database**: PostgreSQL with Drizzle ORM (fully implemented)
- **Current Storage**: PostgreSQL database with Drizzle relations
- **Session Management**: connect-pg-simple for session storage
- **Migration**: Drizzle Kit for database migrations

## Key Components

### Core Features
1. **Barcode Management**
   - Single QR code generation
   - Batch QR code generation (up to 200 codes)
   - Barcode scanning simulation
   - Sharing functionality (email, WhatsApp, clipboard)

2. **Static Information Management**
   - Fire extinguisher registration
   - Location tracking
   - Testing date management

3. **Maintenance Logging**
   - Work date tracking
   - Maintenance remarks
   - Technician identification
   - Historical log viewing

### UI Component Structure
- **shadcn/ui Components**: Comprehensive set of accessible UI components
- **Custom Components**: 
  - QR code generator with sharing capabilities
  - Batch QR code modal
  - Maintenance log forms
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### API Endpoints
- `GET /api/extinguishers/:barcode` - Retrieve extinguisher data
- `POST /api/extinguishers` - Create new extinguisher
- `POST /api/maintenance-logs` - Add maintenance log entry

## Data Flow

### Frontend Data Flow
1. User generates QR codes or scans existing ones
2. Static information is collected and stored locally/server
3. Maintenance logs are added and associated with extinguishers
4. Data is synchronized between local storage and server APIs

### Backend Data Flow
1. Express server handles API requests
2. Data validation using Zod schemas
3. PostgreSQL database operations through Drizzle ORM
4. Response formatting and error handling

### Storage Abstraction
- Interface-based storage design for flexibility
- Current implementation uses PostgreSQL database
- DatabaseStorage class implements full CRUD operations with Drizzle ORM

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI primitives, Lucide React icons
- **Utilities**: class-variance-authority, clsx, date-fns
- **QR Code**: react-qr-code for QR code generation
- **Form Handling**: React Hook Form with Hookform resolvers

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, @neondatabase/serverless
- **Validation**: Zod for schema validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin
- **Database**: Drizzle Kit for migrations
- **Type Checking**: TypeScript compiler
- **Styling**: PostCSS with Tailwind CSS and Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations can be pushed to production database

### Environment Configuration
- **Development**: Uses tsx for server execution with hot reload
- **Production**: Node.js serves bundled application
- **Database**: Configured for PostgreSQL with environment-based URL

### File Structure
- **Client**: All frontend code in `client/` directory
- **Server**: Backend code in `server/` directory  
- **Shared**: Common types and schemas in `shared/` directory
- **Build Output**: Production files generated in `dist/` directory

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon database configured)
- Environment variables for database connection
- Static file serving capability for frontend assets