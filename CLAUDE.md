# Pilot Trainer Supply/Demand Planner - Project Context

## Project Overview
This is a web-based application for managing pilot training cohorts and forecasting trainer supply and demand across multiple years. It helps airlines optimize their training capacity by tracking trainer availability, cohort scheduling, and identifying capacity constraints.

## Key Technical Details

### Technology Stack
- Pure JavaScript (ES6+) - No frameworks or build tools
- HTML5 and CSS3
- Chart.js for data visualization
- No external dependencies except Chart.js
- Runs directly in browser (no server required)

### Project Structure
```
trainer-view/
├── index.html          # Main application HTML with all views (Dashboard, Planner, Settings, Scenarios)
├── app.js              # Core application logic (~7000+ lines)
├── styles.css          # Application styling with dark mode support
├── trainer-view-standalone.html  # Single-file version with embedded CSS/JS
├── screenshots/        # UI screenshots for reference
├── scenario-improvements-todo.md  # Completed scenario enhancements checklist
├── fte-dialog-changes.md   # Documentation of FTE dialog simplification
└── previous-viewer.html    # Reference implementation (do not modify)
```

## Business Logic & Domain Knowledge

### Training Pathways
The system supports three types of training pathways:
- **CP (Captain)**: Shortest pathway (typically 3-8 fortnights)
- **FO (First Officer)**: Medium pathway (typically 11 fortnights)
- **CAD (Cadet)**: Longest pathway (typically 8-12 fortnights)

Each pathway consists of phases:
1. **Ground School + Simulator (GS+SIM)**: No trainer demand
2. **Line Training (LT)**: Requires 1:1 trainer-to-trainee ratio
   - LT-CAD: Cadet line training
   - LT-CP: Captain line training
   - LT-FO: First officer line training

### Trainer Categories & Qualifications
Five trainer categories with specific qualifications:
- **CATB, CATA, STP**: Can perform all line training types (LT-CAD, LT-CP, LT-FO)
- **RHS**: Can perform LT-CP and LT-FO only (cannot do LT-CAD)
- **LHS**: Can perform LT-FO only

### Priority-Based Allocation System
Training demands are served in priority order with cascading allocation:
1. **P1 (LT-CAD)**: Highest priority, served by CATB/CATA/STP only
2. **P2 (LT-CP)**: Served primarily by RHS, with overflow from P1 trainers
3. **P3 (LT-FO)**: Served primarily by LHS, with overflow from all other trainers

### Time System
- Uses fortnights (2-week periods) as the base time unit
- 24 fortnights per year (simplified from 26 in previous version)
- Planning horizon: 2024-2034 (configurable in app.js)

## Important Code Patterns

### Data Structures
- `pathways[]`: Array of training pathway definitions
- `activeCohorts[]`: Array of active training cohorts
- `trainerFTE{}`: Nested object storing FTE by year and category
- `priorityConfig[]`: Configurable priority allocation rules

### Key Functions
- `calculateDemand()`: Calculates trainer demand across all cohorts
- `calculateSupplyDeficit()`: Calculates surplus/deficit with cascading allocation
- `renderGanttChart()`: Renders the visual cohort timeline with drag-drop support
- `updateDashboard()`: Updates executive dashboard metrics (app.js:5903)
- `showNotification()`: Displays toast-style notifications
- `handleDragStart/End()`: Manages drag and drop functionality in Gantt chart
- `parseBulkInput()`: Parses natural language cohort entries
- `generateGrid()`: Creates Excel-like grid for cohort entry

### UI/UX Patterns
- Modal dialogs for complex inputs (FTE, pathways, priorities)
- Synchronized scrolling between related tables
- Dark mode support throughout
- Sticky headers and columns for large tables
- Color coding: Red for deficits, green for surplus
- Grouped Gantt chart view by pathway type

## Current Features

### Executive Dashboard
- Key metrics cards: Total trainees, utilization %, upcoming completions, capacity warnings
- Demand over time chart with 12-month forecast
- Training distribution chart (pie chart by pathway type)
- Training pipeline visualization showing current cohorts
- Alerts and warnings section with capacity issues
- Real-time calculations based on current date
- Charts update dynamically with dark mode support

### Training Planner
- Add individual cohorts with pathway selection
- **Training Planner Modal** with three tabs:
  - **Grid Entry**: Excel-like grid for quick cohort entry with paste support
  - **Target Optimizer**: Set pilot targets by type and optimize schedule
  - **Bulk Input**: Parse natural language entries (e.g., "Jan 2025: 12 FO, 8 CP")
- Visual Gantt chart with grouping options
- **Drag and Drop**: Move cohorts on Gantt chart timeline
- Supply/deficit analysis tables with two view modes:
  - Classic view (positive/negative numbers)
  - Intuitive view (surplus in green, deficit in red)
- Copy table data functionality

### Settings Management
- Pathway configuration with comments field
- Pathway types: CP (Captain), FO (First Officer), CAD (Cadet)
- Priority settings with trainer capability matrix
- FTE management by year and category
- Quick fill options for rapid FTE configuration:
  - Fill All (same value across years)
  - Fill Down (copy to subsequent years)
  - Copy from Previous Year
- Detailed FTE dialog with fortnightly entry

### Scenarios Management
- Dedicated Scenarios tab with enhanced UI
- Save/load complete configurations
- Update existing scenarios with changes
- Duplicate scenarios functionality
- Export/import scenarios as JSON files
- Bulk export all scenarios
- Search and filter scenarios
- Sort by date, name, or size
- Grid/list view toggle
- Scenario preview with statistics
- Import conflict resolution (rename/overwrite/skip)
- Persistent current scenario indicator

### Advanced Features
- Dark mode with persistent preference
- Synchronized table scrolling across demand/supply tables
- Real-time demand calculations
- Cascading priority-based allocation
- **Toast notifications** instead of alerts
- **Notification system** for user feedback
- Collapsible sections (FTE Summary, Commencement Summary)
- Month-based navigation controls (6M, 12M views)
- "Today" button to jump to current period
- Standalone single-file version available

## Testing & Validation

### Common Test Scenarios:
1. Add multiple cohorts with overlapping schedules
2. Test cascading allocation by creating trainer shortages
3. Verify optimizer respects capacity constraints
4. Test edge cases: 0 FTE, very large cohorts, etc.
5. Verify priority settings properly cascade surplus trainers

### Browser Compatibility:
- Chrome (recommended) - Full support
- Firefox - Full support
- Safari - Full support
- Edge - Full support
- IE11 - Not supported (ES6+ features)

## Common Commands & Operations

### Quick Actions:
- Toggle dark mode: Click moon icon in header
- View scenarios: Click "Scenarios" button
- Run optimizer: Planner → Training Planner → Set targets and optimize
- Bulk FTE entry: Edit Detailed FTE → Quick Fill buttons
- Group cohorts: Use "Group by" dropdown in Gantt view

### Debugging:
- Check console for detailed error messages
- All major functions log operations in verbose mode
- LocalStorage stores: scenarios, dark mode preference
- Optimizer provides detailed feedback on constraints

## Performance Considerations
- Gantt chart rendering optimized for 100+ cohorts
- Tables use efficient rendering for large datasets
- Chart.js updates are managed for smooth interaction
- Demand calculations cached where possible

## Security Notes
- No server communication - all data stays local
- Scenarios stored in browser LocalStorage
- No authentication/authorization implemented
- Safe for sensitive planning data (air-gapped)

## Deployment
Simply serve the files via any web server or open index.html directly in a browser. No build process required.

#Github
- Never commit to main
- When committing anything at users request, it must always have a tag

## Version History
- **v0.9**: Major improvements to optimizer and UI
  - Enhanced Training Planner with grid entry, bulk input, and target optimizer
  - Added drag-and-drop functionality to Gantt chart
  - Implemented toast notifications system
  - Added intuitive surplus/deficit view toggle
  - Improved scenario management with import/export
  - Added standalone single-file version
- **v0.8**: Major optimizer improvements with priority-based trainer allocation
  - Added executive dashboard with real-time metrics
  - Implemented dark mode support
  - Fixed optimizer capacity constraints
  - Improved Training Planner UI and validation

---
*Last updated: January 2025*