# DataHub - Product Manager Dashboard Tool

## Overview
DataHub is a mobile-friendly data dashboard tool designed for product managers to build custom dashboards and reports on the go. The application features an intuitive interface with drag-and-drop functionality, interactive charts, and templates for common product metrics.

**Tech Stack:**
- Frontend: React, TypeScript, Tailwind CSS, Shadcn UI, Recharts
- Backend: Express.js, Node.js
- Storage: In-memory (MemStorage)
- Routing: Wouter
- Data Fetching: TanStack Query (React Query)
- Forms: React Hook Form with Zod validation

## Project Architecture

### Data Models (shared/schema.ts)
- **Dashboard**: Main container for organizing widgets
  - id, name, description, layout (jsonb)
- **Widget**: Individual visualization components
  - id, dashboardId, type (metric/chart/table/list), title, chartType, dataSourceId, config, position
- **DataSource**: Data storage for widgets
  - id, name, type (csv/json/template), data (jsonb), createdAt

### Frontend Structure

#### Pages
- **DashboardList** (`/`): Displays all dashboards with create/edit/delete/duplicate actions
- **DashboardView** (`/dashboard/:id`): Shows individual dashboard with widget grid
- **DataSourcesPage** (`/data-sources`): Upload and manage CSV/JSON data sources
- **TemplatesPage** (`/templates`): Generate sample data for product metrics
- **ProfilePage** (`/profile`): User profile settings (placeholder)
- **NotFound**: 404 error page

#### Core Components
- **AppSidebar**: Desktop navigation (hidden on mobile)
- **BottomNav**: Mobile bottom navigation with FAB
- **ThemeProvider & ThemeToggle**: Dark/light mode support

#### Widget Components
- **MetricCard**: KPI display with trend indicators and sparklines
- **ChartWidget**: Recharts visualizations (line, bar, area, pie, donut)
- **TableWidget**: Sortable data tables with responsive design
- **ListWidget**: Compact metric lists with badges

#### Dialogs & Sheets
- **DashboardDialog**: Create/edit dashboard modal
- **WidgetLibrary**: Sheet for selecting widget types to add

#### Empty States
- **EmptyDashboards**: First-time user experience for dashboard list
- **EmptyDashboard**: Prompt to add first widget to dashboard

### Backend Structure

#### Storage Interface (server/storage.ts)
Implements `IStorage` interface with in-memory storage (MemStorage):
- Dashboard CRUD operations (create, read, update, delete, duplicate)
- Widget CRUD operations (create, read, delete by ID or dashboard ID)
- Data source management (create, read, delete, upload CSV/JSON)

#### API Routes (server/routes.ts)
Complete REST API implementation:
- `GET /api/dashboards` - List all dashboards
- `GET /api/dashboards/:id` - Get single dashboard with widgets
- `POST /api/dashboards` - Create new dashboard
- `PUT /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard
- `POST /api/dashboards/:id/duplicate` - Duplicate dashboard
- `GET /api/widgets/:dashboardId` - Get widgets for dashboard
- `POST /api/widgets` - Create widget
- `DELETE /api/widgets/:id` - Delete widget
- `GET /api/data-sources` - List all data sources
- `POST /api/data-sources/upload` - Upload CSV/JSON file with parsing
- `DELETE /api/data-sources/:id` - Delete data source
- `GET /api/templates` - Get available metric templates
- `POST /api/templates/:templateId/generate` - Generate template data

## Design System

### Colors
- Primary: Blue (#2563eb) - Action buttons, primary UI elements
- Charts: 5 distinct colors for data visualization
- Semantic: Success (green), Error (red), Warning (amber)

### Typography
- Primary font: Inter (sans-serif)
- Monospace font: JetBrains Mono (for metrics)
- Hierarchy: Dashboard titles (text-2xl), Widget headers (text-lg), Metrics (text-4xl mono)

### Spacing
- Consistent use of 4, 6, 8, 12, 16, 24 units
- Card padding: p-5 to p-6
- Section spacing: gap-6 (mobile), gap-8 (desktop)

### Responsive Breakpoints
- Mobile: < 768px (single column, bottom nav)
- Tablet: 768px - 1024px (2 column grid)
- Desktop: > 1024px (3-4 column grid, sidebar)

## Current Status

### ✅ Completed
**Task 1: Schema & Frontend**
- ✅ Data models and TypeScript interfaces defined
- ✅ Complete component library built with Material + Linear design
- ✅ Responsive layouts for all screen sizes
- ✅ Dark/light theme support with smooth transitions
- ✅ Navigation (sidebar for desktop + bottom nav for mobile)
- ✅ All widget types (metric cards, charts, tables, lists)
- ✅ Empty states and loading skeletons
- ✅ Dashboard creation/edit/delete/duplicate UI

**Task 2: Backend Implementation**
- ✅ Complete storage interface with in-memory MemStorage
- ✅ All REST API endpoints implemented
- ✅ CSV/JSON file upload and parsing with multer and papaparse
- ✅ Template data generation for 5 product metrics
- ✅ Request validation with Zod schemas
- ✅ Error handling and proper HTTP status codes

**Task 3: Integration & Polish**
- ✅ Frontend connected to backend with React Query
- ✅ All mutations with proper cache invalidation
- ✅ Loading states and error handling throughout
- ✅ Mobile FAB and sidebar buttons wired to dashboard creation
- ✅ Data source upload/delete functionality working
- ✅ Template data generation integrated
- ✅ All navigation flows functional (no 404s)
- ✅ Architect review passed

### 📋 Future Enhancements
- Drag-and-drop widget repositioning
- Widget resize functionality
- Date range filtering and time-based analytics
- Export dashboards as PDF/PNG
- Persistent database storage (currently in-memory)
- Real-time data updates with WebSockets
- Custom widget formulas and calculations
- Team collaboration features

## Development

### Running the Application
```bash
npm run dev
```
The app runs on port 5000 with both frontend (Vite) and backend (Express) on the same server.

### Key Dependencies
- @tanstack/react-query - Data fetching and caching
- recharts - Chart library
- wouter - Lightweight routing
- zod - Schema validation
- drizzle-zod - Type-safe schema generation
- lucide-react - Icon library

## User Workflows

1. **Dashboard Creation**
   - Click "Create Dashboard" → Enter name/description → Save
   - Redirected to empty dashboard view

2. **Adding Widgets**
   - Click "Add Widget" → Select widget type → Widget added to grid
   - Configure data source and visualization options

3. **Data Upload**
   - Navigate to Data Sources → Upload CSV/JSON
   - Select data source when configuring widgets

4. **Mobile Experience**
   - Single column widget layout
   - Bottom navigation with centered FAB
   - Touch-optimized interactions
   - Collapsible sidebar accessed via hamburger menu

## Notes
- Using in-memory storage for development (data not persisted between restarts)
- All interactive elements have data-testid attributes for testing
- Follows Material Design + Linear aesthetics as per design guidelines
- Mobile-first responsive design throughout
