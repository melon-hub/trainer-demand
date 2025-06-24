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
├── app.js              # Core application logic (~9000+ lines)
├── styles.css          # Application styling with dark mode support
├── trainer-view-standalone.html  # Single-file version with embedded CSS/JS
├── smart-excel-import.html  # Excel data extraction tool for FSO training
├── screenshots/        # UI screenshots for reference
├── dashboard-improvements.md  # Pending dashboard enhancements
├── import-export-updates.md   # Pending import/export updates
├── optimizer-improvements.md  # Pending optimizer enhancements
└── archive/            # Test files, utilities, and completed docs
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
- `locationData{}`: Master object containing AU and NZ data separately
- `pathways[]`: Array of training pathway definitions
- `activeCohorts[]`: Array of active training cohorts (now per location)
- `trainerFTE{}`: Nested object storing FTE by year and category (per location)
- `priorityConfig[]`: Configurable priority allocation rules
- `crossLocationTraining{}`: Fortnight-level cross-location assignments

### Key Functions
- `calculateDemand()`: Calculates trainer demand with cross-location support
- `calculateCrossLocationDemand()`: Two-pass algorithm for cross-location allocation
- `calculateSupplyDeficit()`: Calculates surplus/deficit with cascading allocation
- `renderGanttChart()`: Renders timeline with cross-location cohorts section
- `updateDashboardV2()`: Updates enhanced dashboard metrics
- `showNotification()`: Displays toast-style notifications
- `handleDragStart/End()`: Manages drag and drop functionality in Gantt chart
- `parseBulkInput()`: Parses natural language cohort entries
- `generateGrid()`: Creates Excel-like grid for cohort entry
- `convertLegacyCrossLocation()`: Migrates old format to new structure

### UI/UX Patterns
- Modal dialogs for complex inputs (FTE, pathways, priorities)
- Synchronized scrolling between related tables
- Dark mode support throughout
- Sticky headers and columns for large tables
- Color coding: Red for deficits, green for surplus
- Grouped Gantt chart view by pathway type

## Current Features

### Executive Dashboard (V2)
- Enhanced metrics cards with trend indicators:
  - Total trainees with period-over-period changes
  - Utilization % with visual indicators
  - Upcoming completions with timeline
  - Capacity warnings with severity levels
- Demand over time chart with 12-month forecast
- Training distribution chart (pie chart by pathway type)
- Enhanced pipeline visualization with phase breakdown
- Smart alerts system with prioritized warnings
- Real-time calculations based on current date
- Charts update dynamically with dark mode support

### Training Planner
- Add individual cohorts with pathway selection and location
- **Cross-Location Training**: Assign specific fortnights to use trainers from other locations
- **Training Planner Modal** with three tabs:
  - **Grid Entry**: Excel-like grid for quick cohort entry with paste support
  - **Target Optimizer**: Set pilot targets by type and optimize schedule
  - **Bulk Input**: Parse natural language entries (e.g., "Jan 2025: 12 FO, 8 CP")
- Visual Gantt chart with grouping options
- **Drag and Drop**: Move cohorts on Gantt chart timeline
- **Cross-Location Display**: Shows cohorts from other locations using current location's trainers
- Supply/deficit analysis tables with two view modes:
  - Classic view (positive/negative numbers)
  - Intuitive view (surplus in green, deficit in red)
- **Split View Toggle**: Separate local vs cross-location demand in tables
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

## Screenshots analysis 
- When user mention "latest screenshot" or ask you to review a screenshot, please check the screenshots/ folder in this project directory and analyze the most recently created/modified image file.
- Check the screenshots/ folder
- Identify the most recent file by timestamp
- Analyze that image and provide feedback
- If multiple recent screenshots exist, ask which specific one to review

#Github
- Never commit to main
- When committing anything at users request, it must always have a tag

## Version History
- **v1.5.1**: Cross-location fixes and enhancements
  - Fixed NZ cohorts display in AU Gantt cross-location section
  - Dashboard V2 with enhanced metrics and trends
  - Smart Excel import tool for FSO training data
  - Legacy scenario format migration
  - Project cleanup and organization
- **v1.5**: Enhanced cross-location visibility
  - Split view toggle for demand tables (local vs cross-location breakdown)
  - Cross-location cohorts section in Gantt showing only relevant fortnights
  - Removed decimal points throughout for cleaner display
  - Dynamic table height adjustment for split view
  - Simplified demand display with highlighting
- **v1.4**: Cross-location training implementation
  - Multi-location support (AU/NZ)
  - Fortnight-level cross-location trainer assignments
  - Visual indicators (flags, striped patterns, footnotes)
  - Cross-location demand calculation with two-pass algorithm
- **v1.3**: Major UI/UX improvements
  - Executive dashboard with real-time metrics and charts
  - Dark mode support throughout
  - Enhanced scenario management
- **v0.9**: Major improvements to optimizer and UI
  - Enhanced Training Planner with grid entry, bulk input, and target optimizer
  - Added drag-and-drop functionality to Gantt chart
  - Implemented toast notifications system
  - Added intuitive surplus/deficit view toggle
  - Improved scenario management with import/export
  - Added standalone single-file version

## Excel Import Tool

### smart-excel-import.html
Standalone tool for extracting training data from FSO Excel files:
- Automatically parses cohort data from specific Excel layout
- Extracts pathways A209 (CAD) and A210 (FO) training schedules
- Generates scenarios with proper cross-location training format
- Sets appropriate FTE values (240 for all trainer types)
- Creates cohorts with correct phase durations and timing

## Local Storage Implementation

### Current Usage
The application uses browser localStorage for persisting:

1. **Scenarios** (`pilotTrainerScenarios`)
   - Stores all saved scenarios as JSON array
   - No size limits implemented
   - No compression or optimization

2. **UI Preferences**
   - `darkMode`: Dark mode on/off state
   - `activeTab`: Last active tab (dashboard/planner/settings/scenarios)
   - `scenarioViewMode`: Grid or list view in scenarios tab
   - `dashboardVersion`: Classic or enhanced dashboard
   - `currentLocation`: Selected location (AU/NZ)

3. **User State**
   - `acknowledgedAlerts`: Array of dismissed alert IDs

### Storage Analysis
- **Total Keys**: 7 localStorage keys
- **Largest Data**: Scenarios array (can grow very large with 90+ cohorts per scenario)
- **No Data Validation**: Direct JSON parse without error handling
- **No Size Management**: Could hit browser's ~5-10MB limit

### Data Persistence Gaps

**Current Issue**: FTE, pathways, and priority settings are only saved as part of scenarios. If you configure these but don't save a scenario, they're lost on reload.

### Additional Data NOT Currently Saved

1. **UI Collapse States**
   - FTE Summary expanded/collapsed state
   - Training Commencement Summary expanded/collapsed state
   - Details sections in various tables

2. **View Settings** (partially saved)
   - ✅ Surplus/Deficit view (classic/intuitive) - saved in scenarios
   - ✅ Demand split by location toggle - saved in scenarios
   - ✅ Group by setting - saved in scenarios
   - ❌ Current time view offset (navigation position)
   - ❌ Scroll positions in tables

3. **Form States**
   - ❌ Last used values in add cohort form
   - ❌ Grid entry date ranges
   - ❌ Optimizer settings (last targets)

4. **User Preferences Not Saved**
   - ❌ Preferred number format (with/without decimals)
   - ❌ Table column widths (if adjustable)
   - ❌ Default location for new cohorts

5. **Working Data**
   - ❌ Undo/redo history
   - ❌ Temporary cohort selections
   - ❌ Filter states in various views

### Recommended Improvements

1. **Auto-Save Working State**
   ```javascript
   // Save working state every 30 seconds
   setInterval(() => {
       if (viewState.isDirty) {
           localStorage.setItem('workingState', JSON.stringify({
               pathways, trainerFTE, priorityConfig, activeCohorts,
               lastSaved: new Date().toISOString()
           }));
       }
   }, 30000);
   ```

2. **Separate Settings Storage**
   - Save FTE/pathways/priorities independently of scenarios
   - `localStorage.setItem('defaultFTE', JSON.stringify(trainerFTE))`
   - `localStorage.setItem('defaultPathways', JSON.stringify(pathways))`
   - Load these as defaults instead of hardcoded values

3. **Add Storage Management**
   ```javascript
   function getStorageSize() {
       let total = 0;
       for (let key in localStorage) {
           total += localStorage[key].length + key.length;
       }
       return (total / 1024).toFixed(2) + ' KB';
   }
   ```

4. **Implement Scenario Compression**
   - Use LZ-string or similar for scenario compression
   - Could reduce storage by 60-80% for large scenarios

5. **Add Error Handling**
   ```javascript
   function safeLocalStorage(key, value) {
       try {
           localStorage.setItem(key, JSON.stringify(value));
           return true;
       } catch (e) {
           if (e.name === 'QuotaExceededError') {
               showNotification('Storage full! Please delete old scenarios.', 'error');
           }
           return false;
       }
   }
   ```

6. **Add Export/Import All Data**
   - Single button to export all localStorage data
   - Useful for backup/restore or sharing between browsers

7. **Storage Cleanup Options**
   - Delete scenarios older than X months
   - Archive scenarios to file
   - Limit number of scenarios (e.g., keep latest 50)

---
*Last updated: January 2025*