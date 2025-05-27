# Location Implementation Plan - AU/NZ Multi-Location Support

## Overview
This document outlines the systematic implementation of multi-location support (AU and NZ) for the Pilot Trainer Supply/Demand Planner. The implementation will be done in phases to ensure stability and maintainability.

## Architecture Decision
**Chosen Approach**: Shared Instance with Location Property
- Single codebase with location-aware data structures
- Location toggle in UI for switching between AU/NZ views
- Enables future cross-location analysis and resource sharing

## Phase 1: Data Structure Enhancement (Foundation)

### 1.1 Core Data Structure Updates
- [ ] Add `currentLocation` state variable (default: 'AU')
- [ ] Create `locationData` wrapper object for location-specific data:
  ```javascript
  locationData = {
    AU: { pathways: [], trainerFTE: {}, priorityConfig: [], activeCohorts: [] },
    NZ: { pathways: [], trainerFTE: {}, priorityConfig: [], activeCohorts: [] }
  }
  ```
- [ ] Add `location` property to cohort objects
- [ ] Add `location` property to pathway definitions
- [ ] Update `viewState` to include current location context

### 1.2 Data Migration
- [ ] Migrate existing data to AU location by default
- [ ] Create empty NZ data structures
- [ ] Update localStorage keys to be location-aware

## Phase 2: Settings UI - Location Tabs

### 2.1 Training Pathways Table
- [ ] Add AU/NZ tab switcher above pathways table
- [ ] Implement tab switching logic
- [ ] Duplicate pathway management functions for each location
- [ ] Allow copying pathways between locations
- [ ] Add location indicator to pathway display

### 2.2 FTE Management
- [ ] Add location tabs to FTE section
- [ ] Separate FTE storage by location
- [ ] Update FTE dialog to show current location
- [ ] Implement location-specific quick fill options

### 2.3 Priority Settings
- [ ] Add location context to priority configuration
- [ ] Allow different priority rules per location
- [ ] Update priority display with location indicator

## Phase 3: Core Function Updates

### 3.1 Calculation Functions
- [ ] `calculateDemand()` - Filter cohorts by current location
- [ ] `calculateSupplyDeficit()` - Use location-specific FTE values
- [ ] `calculateAvailableTrainerCapacity()` - Location-aware capacity
- [ ] `calculateOptimalSchedule()` - Respect location constraints
- [ ] `getActivePhasesAtTime()` - Filter by location

### 3.2 Rendering Functions
- [ ] `renderGanttChart()` - Show only current location cohorts
- [ ] `renderDemandTable()` - Location-specific demand
- [ ] `renderSurplusDeficitTable()` - Location-specific analysis
- [ ] `renderFTESummaryTable()` - Show current location FTE
- [ ] `renderCommencementSummary()` - Filter by location
- [ ] `updateDashboard()` - Location-specific metrics

### 3.3 Data Management
- [ ] `saveScenario()` - Include location data and current location
- [ ] `loadScenario()` - Restore location context
- [ ] `exportScenario()` - Include all location data
- [ ] `importScenario()` - Handle location data properly
- [ ] `exportAllScenarios()` - Maintain location information

## Phase 4: UI Location Toggle

### 4.1 Header Enhancement
- [ ] Add location selector (AU | NZ) to header
- [ ] Style location toggle to match dark mode
- [ ] Show current location prominently
- [ ] Add keyboard shortcut for location switching

### 4.2 Location Switching Logic
- [ ] Implement `switchLocation()` function
- [ ] Save location preference to localStorage
- [ ] Update all views on location change
- [ ] Maintain view state during switch
- [ ] Show notification on location change

### 4.3 UI Updates
- [ ] Update page title with location indicator
- [ ] Add location badge to relevant sections
- [ ] Update tooltips with location context
- [ ] Ensure charts update on location switch

## Phase 5: Planner View Enhancements

### 5.1 Cohort Management
- [ ] Add location field to cohort add form
- [ ] Default new cohorts to current location
- [ ] Update cohort edit dialog with location
- [ ] Allow location change for existing cohorts

### 5.2 Training Planner Modal
- [ ] Update Grid Entry tab for location awareness
- [ ] Modify Bulk Input parser to handle location
- [ ] Update Target Optimizer for location-specific targets
- [ ] Add location column to preview tables

### 5.3 Gantt Chart
- [ ] Add location indicator to cohort display
- [ ] Option to show all locations (grayed out non-current)
- [ ] Update drag-drop to respect location
- [ ] Add location grouping option

## Phase 6: Cross-Location Features

### 6.1 Shared Resources
- [ ] Implement cross-location trainer assignment UI
- [ ] Add "shared trainer pool" concept
- [ ] Create transfer dialog for moving trainers
- [ ] Track trainer mobility between locations

### 6.2 Reporting
- [ ] Add consolidated view option
- [ ] Create comparison reports (AU vs NZ)
- [ ] Export combined data for both locations
- [ ] Add location filter to dashboard charts

### 6.3 Advanced Features
- [ ] Cross-location capacity planning
- [ ] Shared GS capacity constraints
- [ ] Location-specific business rules
- [ ] Resource optimization across locations

## Phase 7: Testing & Validation

### 7.1 Functional Testing
- [ ] Test location switching with active data
- [ ] Verify calculations remain accurate
- [ ] Test scenario save/load with locations
- [ ] Validate import/export functionality

### 7.2 Edge Cases
- [ ] Empty location data handling
- [ ] Large cohort volumes per location
- [ ] Switching during ongoing operations
- [ ] Browser storage limits with dual locations

### 7.3 Performance Testing
- [ ] Measure impact of location filtering
- [ ] Optimize repeated location checks
- [ ] Test with maximum cohort load
- [ ] Verify smooth location switching

## Implementation Notes

### Key Principles
1. **Backward Compatibility**: Existing scenarios default to AU
2. **Data Isolation**: Clear separation between AU/NZ data
3. **User Experience**: Seamless switching without data loss
4. **Performance**: Minimal impact from location filtering
5. **Extensibility**: Easy to add more locations in future

### Technical Considerations
- Use consistent location codes ('AU', 'NZ')
- Implement location validation throughout
- Add location to all relevant console logs
- Update error messages with location context
- Consider timezone implications if needed

### UI/UX Guidelines
- Location indicator always visible
- Clear visual distinction between locations
- Consistent location switching across all views
- Confirmation for cross-location operations
- Help text explaining location features

## Future Enhancements
- Additional locations (SG, HK, etc.)
- Multi-location dashboard view
- Cross-location resource optimization
- Location-specific cost modeling
- Regional compliance tracking

## Success Criteria
- [ ] All existing features work per location
- [ ] Smooth switching between AU/NZ
- [ ] No performance degradation
- [ ] Clear location context throughout UI
- [ ] Scenarios properly handle location data
- [ ] Cross-location features functional
- [ ] Comprehensive test coverage

---
*Created: January 2025*
*Target Completion: TBD*