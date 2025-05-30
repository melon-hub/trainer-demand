# Refactoring Opportunities - Pilot Trainer Supply/Demand Planner

## Overview
This document outlines potential refactoring opportunities identified during code review. These are organized by priority and impact.

## 🔴 CRITICAL Priority (High Impact, Relatively Easy)

### 1. Remove V1 Dashboard Code (~400-500 lines reduction)
**Current State**: Duplicate dashboard functions exist (v1 and v2 versions)
**Opportunity**: Delete all v1 dashboard functions since only v2 is used
**Functions to Remove**:
- `updateDashboard()` - line 9821
- `updateMetrics()` - line 9828
- `updateCharts()` - line 9904
- `updateDemandChart()` - line 9909
- `updateDistributionChart()` - line 10010
- `updatePipeline()` - line 10178
- `updateAlerts()` - line 10236
- `toggleDashboardView()` - line 12414

**Action Steps**:
1. Change line 12432 from `updateDashboard()` to `updateDashboardV2()`
2. Delete all v1 functions listed above
3. Rename v2 functions (remove "V2" suffix)

**Risk**: Low - HTML only contains enhanced dashboard

### 2. Split app.js into Modules (~9000 lines → multiple files)
**Current State**: Single 9000+ line file
**Opportunity**: Split into logical modules
**Suggested Structure**:
```
js/
├── app.js (main initialization, <1000 lines)
├── dashboard.js (dashboard functions)
├── planner.js (training planner logic)
├── scenarios.js (scenario management)
├── calculations.js (demand/supply calculations)
├── charts.js (Chart.js related functions)
├── modals.js (modal handling)
├── utils.js (shared utilities)
└── constants.js (configuration constants)
```

### 3. Consolidate Demand Calculation Logic
**Current State**: Similar calculation logic in multiple places
**Functions with Duplicated Logic**:
- `calculateDemand()` - line 3548
- `calculateMetricsForPeriod()` - line 757
- `calculateAvailableTrainerCapacity()` - line 7186

**Opportunity**: Create single source of truth
```javascript
// New shared function
function getTrainerDemandForPeriod(year, fortnight, location = currentLocation) {
    // Consolidated demand calculation logic
}
```

## 🟠 HIGH Priority (Significant Impact, More Effort)

### 4. Implement Proper State Management
**Current State**: Global variables scattered throughout
**Issues**:
- `activeCohorts`, `pathways`, `trainerFTE` as globals
- State changes happen in multiple places
- Hard to track what modifies what

**Opportunity**: Centralized state object
```javascript
const AppState = {
    locations: {
        AU: { cohorts: [], pathways: [], trainerFTE: {} },
        NZ: { cohorts: [], pathways: [], trainerFTE: {} }
    },
    ui: {
        currentLocation: 'AU',
        currentView: 'dashboard',
        darkMode: false
    },
    updateCohorts(location, cohorts) {
        this.locations[location].cohorts = cohorts;
        this.notifyListeners();
    }
};
```

### 5. Add Storage Management
**Current State**: No size limits or cleanup for localStorage
**Issues**:
- Can hit 5-10MB browser limit
- No user visibility of storage usage
- No cleanup options

**Opportunity**:
```javascript
const StorageManager = {
    getUsage() { /* return KB used */ },
    cleanup(daysOld) { /* remove old scenarios */ },
    compress(data) { /* use LZ compression */ },
    showWarning() { /* alert when near limit */ }
};
```

### 6. Consolidate Modal Handling
**Current State**: Repeated modal open/close logic
**Repeated Pattern**:
```javascript
function openSomeModal() {
    modal.style.display = 'flex';
    // populate data
}
```

**Opportunity**: Generic modal system
```javascript
const ModalManager = {
    open(modalId, data) { /* generic open */ },
    close(modalId) { /* generic close */ },
    populate(modalId, data) { /* generic populate */ }
};
```

## 🟡 MEDIUM Priority (Good Improvements, Moderate Effort)

### 7. Create Shared Table Generation Utilities
**Current State**: Similar HTML table generation in multiple functions
**Functions with Similar Logic**:
- `renderDemandTable()` - line 2857
- `renderSupplyDeficitTable()`
- `renderCommencementSummary()`

**Opportunity**:
```javascript
const TableBuilder = {
    createHeaders(config) { /* shared header logic */ },
    createRow(data, columns) { /* shared row logic */ },
    applyStyles(table, options) { /* shared styling */ }
};
```

### 8. Extract Time/Date Utilities
**Current State**: Fortnight/month/year calculations scattered
**Repeated Logic**:
- Converting fortnights to months
- Calculating date ranges
- Time period validation

**Opportunity**:
```javascript
const TimeUtils = {
    fortnightToMonth(year, fortnight) { /* ... */ },
    getMonthRange(startYear, startFn, endYear, endFn) { /* ... */ },
    validateDateRange(start, end) { /* ... */ }
};
```

### 9. Implement Chart Manager
**Current State**: Direct Chart.js calls throughout
**Opportunity**: Centralized chart management
```javascript
const ChartManager = {
    charts: {},
    create(id, type, data, options) { /* ... */ },
    update(id, data) { /* ... */ },
    destroy(id) { /* ... */ },
    exportAll() { /* ... */ }
};
```

### 10. Add Error Recovery
**Current State**: Limited error handling
**Issues**:
- Storage errors can crash app
- Import errors not gracefully handled
- No recovery mechanisms

**Opportunity**: Comprehensive error handling
```javascript
const ErrorHandler = {
    wrap(fn) {
        return (...args) => {
            try {
                return fn(...args);
            } catch (error) {
                this.handle(error);
            }
        };
    },
    handle(error) { /* graceful recovery */ }
};
```

## 🟢 LOW Priority (Nice to Have)

### 11. Add Performance Optimizations
- Implement calculation caching
- Add debouncing for frequent updates
- Use requestAnimationFrame for animations
- Lazy load scenarios

### 12. Improve Data Validation
- Add schema validation for imports
- Validate user inputs thoroughly
- Add data integrity checks

### 13. Create Test Infrastructure
- Add unit tests for calculations
- Integration tests for workflows
- Performance benchmarks

### 14. Enhance Documentation
- Add JSDoc comments
- Create architecture diagrams
- Document business logic

### 15. Mobile Responsiveness
- Add responsive breakpoints
- Touch-friendly controls
- Mobile-optimized modals

## Implementation Strategy

### Phase 1: Quick Wins (1-2 days)
1. Remove v1 dashboard code
2. Create basic file structure
3. Extract constants

### Phase 2: Core Refactoring (1-2 weeks)
1. Split app.js into modules
2. Consolidate duplicate functions
3. Add storage management

### Phase 3: Enhancement (2-3 weeks)
1. Implement state management
2. Add error handling
3. Create shared utilities

### Phase 4: Polish (ongoing)
1. Performance optimizations
2. Documentation
3. Testing

## Estimated Impact

- **Code Reduction**: ~20-30% fewer lines
- **Performance**: ~40% faster for large datasets
- **Maintainability**: Much easier to find and fix issues
- **Reliability**: Fewer bugs from duplicated logic
- **Developer Experience**: Easier onboarding for new developers

## Notes

- Always create a branch before refactoring
- Test thoroughly after each change
- Keep the application working at each step
- Consider user impact for each change

---
*Created: January 2025*
*Status: Planning*