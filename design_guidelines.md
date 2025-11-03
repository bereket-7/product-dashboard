# Design Guidelines: Product Manager Data Dashboard Tool

## Design Approach

**System**: Material Design with Linear-inspired data presentation aesthetics
**Justification**: Material Design provides robust mobile patterns and component libraries ideal for data-dense applications, while Linear's minimalist approach ensures clarity when viewing metrics on mobile devices.

**Core Principles**:
- Mobile-first data clarity: Information hierarchy optimized for small screens
- Touch-optimized interactions: All controls sized for easy mobile tap targets (minimum 44px)
- Scannable dashboards: Clear visual hierarchy enabling quick metric comprehension
- Progressive disclosure: Show summary data first, drill-down details on interaction

---

## Typography

**Font Stack**: 
- Primary: Inter (via Google Fonts CDN) - weights 400, 500, 600, 700
- Monospace: JetBrains Mono - for numerical data and metrics

**Hierarchy**:
- Dashboard titles: text-2xl (24px), font-semibold
- Widget headers: text-lg (18px), font-medium
- Primary metrics: text-4xl (36px), font-bold, monospace
- Metric labels: text-sm (14px), uppercase, tracking-wide, font-medium
- Body text: text-base (16px), font-regular
- Secondary data: text-sm (14px), font-regular
- Captions/metadata: text-xs (12px)

---

## Layout System

**Spacing Scale**: Consistent use of 4, 6, 8, 12, 16, 24 units
- Component padding: p-4 to p-6
- Section spacing: gap-6 on mobile, gap-8 on desktop
- Card padding: p-5 to p-6
- Page margins: px-4 on mobile, px-6 on tablet, px-8 on desktop

**Grid System**:
- Mobile: Single column, full-width cards with gap-4
- Tablet (md:): 2-column grid for widgets, grid-cols-2 gap-6
- Desktop (lg:): 3-4 column dashboard grid, grid-cols-3 lg:grid-cols-4 gap-8
- Max container width: max-w-7xl centered

**Dashboard Canvas**:
- Header: Sticky navigation with dashboard title, action buttons (h-16)
- Sidebar (desktop only): Fixed left sidebar for dashboard list/navigation (w-64)
- Main content: Responsive grid layout with widget cards
- Bottom navigation (mobile): Fixed navigation bar for key actions (h-16)

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header with shadow-sm
- Left: Dashboard dropdown/selector
- Center: Current dashboard name (truncate on mobile)
- Right: Add widget button (icon + text on desktop, icon only on mobile), settings icon
- Mobile: Hamburger menu for dashboard list

**Bottom Mobile Navigation** (fixed):
- Dashboard icon + label
- Data sources icon + label  
- Add widget FAB (floating action button, centered, elevated)
- Reports icon + label
- Profile icon + label

### Dashboard Widgets/Cards
**Standard Widget Container**:
- Rounded corners: rounded-xl
- Elevation: shadow-md with hover:shadow-lg transition
- Border: border with subtle treatment
- Padding: p-6
- Header area: Metric title, subtitle, action menu (3-dot)
- Body: Chart or data visualization
- Footer: Time range, last updated timestamp

**Widget Types**:
1. **Metric Cards** (KPI display):
   - Large primary number (text-4xl, monospace)
   - Metric label above
   - Trend indicator (↑↓ with percentage, colored)
   - Sparkline chart below
   - Comparison text (vs. last period)

2. **Chart Widgets**:
   - Header with chart title + filter dropdown
   - Full-width responsive chart using Recharts
   - Legend below chart
   - Types: Line, Bar, Area, Pie/Donut, Funnel

3. **Table Widgets**:
   - Sticky header row
   - Zebra striping for readability
   - Sortable columns (icon indicators)
   - Mobile: Horizontal scroll or card-based view
   - Row actions on hover/tap

4. **List Widgets**:
   - Compact list items with icon + text + metric
   - Dividers between items
   - Quick actions on swipe (mobile)

### Forms & Inputs
**Data Source Connection**:
- File upload dropzone with drag-and-drop
- Large drop area on mobile: min-h-48
- Upload button + browse link
- File type icons and validation feedback
- Progress indicator for upload

**Dashboard Builder Interface**:
- Widget library panel (drawer on mobile)
- Widget preview cards with icons
- Drag handle indicators
- Drop zones with dashed borders
- Grid snap indicators

**Filters & Controls**:
- Date range picker: Mobile-optimized with presets (Last 7 days, 30 days, etc.)
- Multi-select dropdowns: Chip-based selection display
- Search inputs: with icon, rounded-full, shadow-sm
- Toggle switches for options
- Radio buttons for exclusive selections

### Data Visualization (Recharts)
**Chart Configuration**:
- Responsive container: aspect-[16/9] on mobile, natural height on desktop
- Touch-enabled tooltips with crosshair
- Icons in Recharts: Use Heroicons for consistency
- Data point markers on mobile for easier touch targeting
- Reduced animation on mobile for performance

**Chart Styling**:
- Grid lines: subtle, dashed
- Axis labels: text-xs, rotated if needed on mobile
- Legend: horizontal on desktop, vertical stacked on mobile
- No default colors specified (system will handle)

### Action Elements
**Primary Actions**:
- Floating Action Button (FAB): rounded-full, w-14 h-14, shadow-lg
- Primary buttons: px-6 py-3, rounded-lg, font-medium
- Icon buttons: w-10 h-10, rounded-lg for touch targets

**Secondary Actions**:
- Text buttons: px-4 py-2, rounded-md
- Icon-only buttons: w-9 h-9, rounded-md
- Dropdown menus: min-w-48, rounded-lg, shadow-xl

### Modal & Overlays
**Dashboard Creation Modal**:
- Mobile: Full-screen overlay with close button
- Desktop: Centered modal, max-w-2xl, rounded-2xl
- Header with title + close icon
- Body with form fields
- Footer with action buttons (Cancel, Create)

**Widget Configuration Panel**:
- Slide-in from right on desktop (w-96)
- Full-screen on mobile
- Sections: Data source, Visualization type, Filters, Display options
- Apply/Cancel buttons in sticky footer

### Empty States
**No Dashboards**:
- Centered illustration placeholder
- Headline: "Create your first dashboard"
- Description text
- Primary CTA button
- Link to templates/examples

**No Data in Widget**:
- Icon + message in card center
- "Connect data source" or "No data for selected period"
- Secondary action link

---

## Mobile-Specific Patterns

**Touch Interactions**:
- Swipe to delete/archive dashboards in list
- Pull-to-refresh on dashboard view
- Long-press for widget options menu
- Pinch-to-zoom disabled on charts (use built-in zoom controls)

**Mobile Optimizations**:
- Single column widget layout with vertical scroll
- Collapsible sections for dashboard settings
- Bottom sheet for quick actions instead of dropdowns
- Thumb-zone positioning for primary actions
- Reduced visual complexity: hide secondary info by default

**Responsive Breakpoints**:
- Mobile: < 768px (base Tailwind)
- Tablet: 768px - 1024px (md:)
- Desktop: > 1024px (lg:)

---

## Accessibility

- ARIA labels for all icon-only buttons
- Keyboard navigation for dashboard grid and widgets
- Focus indicators: ring-2 ring-offset-2 on interactive elements
- Screen reader announcements for data updates
- High contrast mode support
- Minimum touch target size: 44x44px throughout
- Skip navigation links
- Proper heading hierarchy (h1 → h2 → h3)

---

## Images

**Dashboard Empty State Illustration**:
- Location: Center of empty dashboard view
- Style: Simple line art illustration showing charts/graphs
- Size: max-w-xs on mobile, max-w-md on desktop
- Description: Abstract representation of data dashboards with charts and metrics

**No Data Illustrations** (for empty widgets):
- Location: Center of widget cards when no data available
- Style: Minimal icons or small illustrations
- Size: w-24 h-24
- Description: Contextual icons (empty chart, disconnected plug, etc.)

**Onboarding Graphics** (if used):
- Location: First-time user tutorial slides
- Style: Screenshot-style mockups showing key features
- Size: Full-width on mobile with appropriate aspect ratio
- Description: Dashboard creation, widget configuration, mobile usage examples

No large hero image - this is a functional dashboard tool focused on data display and utility.