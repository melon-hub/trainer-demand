# TrainerApp Namespace Guide

## Overview
The app.js file now uses a namespace structure for better organization. All functions remain available globally for backward compatibility.

## Namespace Structure

```javascript
TrainerApp = {
    Config: {},      // Configuration constants
    State: {},       // Application state
    Utils: {},       // Utility functions
    Calculations: {}, // Business logic calculations
    UI: {            // User Interface
        Dashboard: {},
        Planner: {},
        Settings: {},
        Scenarios: {},
        Modals: {},
        Charts: {}
    },
    Data: {},        // Data management
    ImportExport: {}, // Import/Export functionality
    Help: {}         // Help system
}
```

## Using the Namespace

### Old Way (Still Works)
```javascript
showNotification('Success!', 'success');
calculateDemand();
START_YEAR;
```

### New Way (Recommended)
```javascript
TrainerApp.Utils.showNotification('Success!', 'success');
TrainerApp.Calculations.calculateDemand();
TrainerApp.Config.START_YEAR;
```

## Common Functions by Namespace

### Config
- `TrainerApp.Config.START_YEAR` - Start year (2024)
- `TrainerApp.Config.END_YEAR` - End year (2034)
- `TrainerApp.Config.MONTHS` - Month names array
- `TrainerApp.Config.TRAINER_CATEGORIES` - Trainer types

### State
- `TrainerApp.State.currentLocation` - Current location (AU/NZ)
- `TrainerApp.State.locationData` - All location data
- `TrainerApp.State.priorityConfig` - Priority configuration
- `TrainerApp.State.dragState` - Drag and drop state

### Utils
- `TrainerApp.Utils.showNotification()` - Show toast notification
- `TrainerApp.Utils.markDirty()` - Mark scenario as modified
- `TrainerApp.Utils.showAlertDialog()` - Show alert dialog
- `TrainerApp.Utils.updateCurrentScenarioDisplay()` - Update scenario display

### Calculations
- `TrainerApp.Calculations.calculateDemand()` - Calculate trainer demand
- `TrainerApp.Calculations.calculateSupplyDeficit()` - Calculate supply/deficit
- `TrainerApp.Calculations.calculateCrossLocationDemand()` - Cross-location demand

### UI.Dashboard
- `TrainerApp.UI.Dashboard.updateDashboardV2()` - Update enhanced dashboard
- `TrainerApp.UI.Dashboard.navigateDashboard()` - Navigate dashboard time

### UI.Planner
- `TrainerApp.UI.Planner.renderGanttChart()` - Render Gantt chart
- `TrainerApp.UI.Planner.updateAllTables()` - Update all planner tables

### UI.Settings
- `TrainerApp.UI.Settings.renderPathwaysTable()` - Render pathways
- `TrainerApp.UI.Settings.openFTEModal()` - Open FTE editor

### Data
- `TrainerApp.Data.saveDefaultFTE()` - Save default FTE values
- `TrainerApp.Data.loadDefaultPathways()` - Load saved pathways

## Benefits

1. **Better Organization** - Functions grouped by purpose
2. **Easier to Find** - Know where to look for specific functionality
3. **IntelliSense Support** - Type `TrainerApp.` to see available namespaces
4. **No Breaking Changes** - All old code continues to work
5. **Gradual Migration** - Update code to use namespaces over time

## Future Steps

1. **Update function calls** - Gradually update to use namespace
2. **Add JSDoc comments** - Document functions in namespace
3. **Consider TypeScript** - Add type definitions for better IDE support
4. **Extract to modules** - Eventually split into separate files

## Testing

Open `test-namespace.html` to verify the namespace structure is working correctly.