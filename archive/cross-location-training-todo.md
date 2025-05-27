# Cross-Location Trainer Utilization - Implementation Plan

## Overview
Allow cohorts to utilize trainer capacity from other locations for specific Line Training (LT) fortnights. This enables flexible trainer allocation when one location has surplus capacity while another has deficits.

## Implementation Tasks

### Phase 1: Data Structure Enhancement
- [x] Extend cohort object to include `crossLocationTraining` property
  ```javascript
  cohort = {
    id: 1,
    location: 'NZ',  // Primary location
    crossLocationTraining: {
      'AU': {
        phases: {
          'LT-FO': [5, 6, 7]  // Use AU trainers for these fortnights
        }
      }
    }
  }
  ```
- [x] Update cohort migration to include empty crossLocationTraining object
- [x] Ensure scenario save/load handles cross-location data

### Phase 2: UI Enhancement - Edit Cohort Modal
- [x] Add "Cross-Location Training" section after Location dropdown
- [x] Create collapsible section that expands when enabled
- [x] For each LT phase in the pathway:
  - [x] Show phase name and fortnight range
  - [x] Add radio buttons for each fortnight to select location
  - [x] Default to cohort's primary location
- [x] Add visual indicators (flags/colors) for selected locations

### Phase 3: Demand Calculation Updates
- [x] Modify `calculateDemand()` to check cross-location assignments
- [x] When processing cohort phases:
  - [x] Check if current fortnight has cross-location override
  - [x] Add demand to appropriate location's calculation
  - [x] Track cross-location allocations for reporting
- [x] Update demand aggregation to handle split allocations

### Phase 4: Visual Indicators
- [x] Gantt Chart enhancements:
  - [x] Add pattern/stripe overlay for cross-location phases
  - [x] Different color intensity for phases using other location
  - [x] Update tooltips to show "Using [Location] trainers"
  - [x] Add legend explaining visual indicators
- [x] Demand tables:
  - [x] Add footnote indicators for cross-location usage
  - [x] Show allocation details in tooltips

### Phase 5: Supply/Demand Analysis
- [x] Update `calculateSupplyDeficit()` to account for cross-location demand
- [x] Create new summary section showing:
  - [x] Cross-location trainer movements by period
  - [x] Net trainer flow between locations
  - [x] Impact on capacity utilization
- [ ] Add validation warnings for over-allocation

### Phase 6: Reporting & Analytics
- [ ] Add "Cross-Location Summary" table showing:
  - [ ] Trainers borrowed/lent by fortnight
  - [ ] Which cohorts are using cross-location training
  - [ ] Net impact on each location
- [ ] Export functionality to include cross-location data

### Phase 7: Advanced Features
- [ ] Constraints system:
  - [ ] Maximum trainers that can be borrowed per fortnight
  - [ ] Minimum local trainer retention
  - [ ] Travel/availability constraints
- [ ] Optimizer integration:
  - [ ] Consider cross-location options when optimizing
  - [ ] Suggest cross-location solutions for deficits
- [ ] Bulk assignment tools:
  - [ ] Apply cross-location pattern to multiple cohorts
  - [ ] Templates for common cross-location scenarios

## Technical Considerations

### Data Flow
1. User edits cohort and enables cross-location training
2. Selects specific fortnights for each LT phase
3. System validates capacity availability
4. Demand calculations split between locations
5. Visual indicators update across all views

### Validation Rules
- Cannot assign more trainers than available in lending location
- Must maintain minimum trainer levels in each location
- Cross-location assignments must be whole fortnights
- Warnings for excessive cross-location dependency

### Performance
- Demand calculations will need optimization for cross-location checks
- Consider caching cross-location assignments
- Minimize re-calculations on view switches

## UI Mockup

### Edit Cohort Modal Addition:
```
┌─ Cross-Location Training ──────────────────┐
│ ☑ Enable cross-location trainer usage      │
│                                            │
│ LT-FO Phase (FN5-FN7):                    │
│   FN5: ● NZ (home) ○ AU                  │
│   FN6: ○ NZ (home) ● AU                  │
│   FN7: ○ NZ (home) ● AU                  │
│                                            │
│ Summary: Using AU trainers for FN6-7      │
└────────────────────────────────────────────┘
```

### Gantt Chart Visual:
```
Normal phase:     █████████
Cross-location:   ▓▓▓▓▓▓▓▓▓ (striped pattern)
```

## Testing Scenarios
1. Single cohort using AU trainers for 2 fortnights
2. Multiple cohorts with overlapping cross-location needs
3. Capacity exceeded scenarios
4. Location switching with cross-location cohorts
5. Scenario save/load with complex cross-location setup

## Success Criteria
- [ ] Users can easily assign cross-location trainers
- [ ] Visual indicators clearly show cross-location usage
- [ ] Demand calculations accurately reflect split allocations
- [ ] No performance degradation with cross-location enabled
- [ ] Clear reporting of cross-location trainer movements