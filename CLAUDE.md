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
├── index.html          # Main application HTML with all views (Dashboard, Planner, Settings)
├── app.js              # Core application logic (~3000+ lines)
├── styles.css          # Application styling with dark mode support
├── screenshots/        # UI screenshots for reference
├── migration-summary.md    # Notes on missing features from previous version
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
- `calculateDemand()`: Calculates trainer demand across all cohorts (app.js:1070)
- `calculateSupplyDeficit()`: Calculates surplus/deficit with cascading allocation (app.js:1130)
- `renderGanttChart()`: Renders the visual cohort timeline (app.js:1850)
- `optimizeTraining()`: AI-powered optimization with priority constraints (app.js:2650)
- `updateDashboard()`: Updates executive dashboard metrics (app.js:3200)

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
- Demand over time chart
- Training distribution chart
- Training pipeline visualization
- Alerts and warnings section

### Training Planner
- Add individual cohorts with pathway selection
- Target-based optimizer in separate tab
- Visual Gantt chart with grouping options
- Supply/deficit analysis tables

### Settings Management
- Pathway configuration with comments
- Priority settings with trainer capability matrix
- FTE management by year and category
- Quick fill options for rapid FTE configuration

### Advanced Features
- Scenarios functionality for what-if analysis
- Dark mode with persistent preference
- Synchronized table scrolling
- Real-time demand calculations
- Cascading priority-based allocation

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

## Version History
- v0.8: Major optimizer improvements with priority-based trainer allocation
- Added executive dashboard and dark mode
- Fixed optimizer capacity constraints
- Improved Training Planner UI and validation

---
*Last updated: January 2025*