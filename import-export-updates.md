# Import/Export Updates for Multi-Location Support

## Current Issues
1. Cross-location training format mismatch
2. Legacy format handling needs improvement
3. Smart Excel import generates incorrect cross-location format

## Cross-Location Training Format

### Current (Incorrect) Format
```json
"crossLocationTraining": { 
    "1": "AU", 
    "2": "AU" 
}
```

### Correct Format (v1.5+)
```json
"crossLocationTraining": {
    "AU": {
        "phases": {
            "LT-CAD": [19, 20],  // Global fortnight numbers
            "LT-FO": [21, 22]
        }
    }
}
```

## Required Updates

### 1. Update getCrossLocationTraining in smart-excel-import.html
```javascript
function getCrossLocationTraining(pathwayId, startYear, startFortnight) {
    const crossLocation = {};
    
    const pathwayPhases = {
        'A202': [
            { phase: 'GS+SIM', duration: 2 },
            { phase: 'LT-CP', duration: 6 }
        ],
        // ... other pathways
    };
    
    const phases = pathwayPhases[pathwayId];
    if (!phases) return crossLocation;
    
    // Initialize AU training structure
    crossLocation.AU = { phases: {} };
    
    // Calculate global fortnights for each phase
    let phaseStartFortnight = 1;
    phases.forEach(phase => {
        if (phase.phase.startsWith('LT-')) {
            const globalFortnights = [];
            for (let i = 0; i < phase.duration; i++) {
                const localFortnight = phaseStartFortnight + i;
                const yearOffset = Math.floor((startFortnight + localFortnight - 2) / 24);
                const globalFortnight = (yearOffset * 24) + ((startFortnight + localFortnight - 2) % 24) + 1;
                globalFortnights.push(globalFortnight);
            }
            crossLocation.AU.phases[phase.phase] = globalFortnights;
        }
        phaseStartFortnight += phase.duration;
    });
    
    return crossLocation;
}
```

### 2. Import Function Updates (app.js)

Add validation and format conversion:
```javascript
function importScenarios(event) {
    // ... existing code ...
    
    // Convert legacy cross-location format if needed
    if (scenario.state && scenario.state.cohorts) {
        scenario.state.cohorts.forEach(cohort => {
            if (cohort.crossLocationTraining) {
                // Check if it's the old format (fortnight numbers as keys)
                const keys = Object.keys(cohort.crossLocationTraining);
                if (keys.length > 0 && !isNaN(keys[0])) {
                    // Convert old format to new
                    cohort.crossLocationTraining = convertLegacyCrossLocation(cohort);
                }
            }
        });
    }
}

function convertLegacyCrossLocation(cohort) {
    // Convert { "1": "AU", "2": "AU" } to new format
    const oldFormat = cohort.crossLocationTraining;
    const newFormat = {};
    
    // Group by location
    const locationPhases = {};
    Object.entries(oldFormat).forEach(([fortnight, location]) => {
        if (!locationPhases[location]) {
            locationPhases[location] = [];
        }
        locationPhases[location].push(parseInt(fortnight));
    });
    
    // Build new format with phase detection
    Object.entries(locationPhases).forEach(([location, fortnights]) => {
        newFormat[location] = { phases: {} };
        // Need pathway info to properly assign phases
        // For now, assign to appropriate phase based on fortnight
        const pathway = pathways.find(p => p.id === cohort.pathwayId);
        if (pathway) {
            // Determine which phase each fortnight belongs to
            let currentFortnight = 1;
            pathway.phases.forEach(phase => {
                if (phase.trainerDemandType) {
                    const phaseFortnights = fortnights.filter(fn => 
                        fn >= currentFortnight && fn < currentFortnight + phase.duration
                    );
                    if (phaseFortnights.length > 0) {
                        // Convert to global fortnights
                        const globalFortnights = phaseFortnights.map(fn => {
                            const yearOffset = Math.floor((cohort.startFortnight + fn - 2) / 24);
                            return (cohort.startYear - 2024 + yearOffset) * 24 + ((cohort.startFortnight + fn - 2) % 24) + 1;
                        });
                        newFormat[location].phases[phase.trainerDemandType] = globalFortnights;
                    }
                }
                currentFortnight += phase.duration;
            });
        }
    });
    
    return newFormat;
}
```

### 3. Export Function Updates

Ensure exported scenarios include all necessary fields:
- locationData (for v1.5+)
- Legacy fields for backward compatibility
- Proper cross-location format

### 4. Validation Functions

Add validation to ensure:
- Cross-location training format is correct
- Global fortnight calculations are accurate
- Phase assignments match pathway definitions

## Testing Plan

1. Export current scenario and verify format
2. Import legacy format scenarios and verify conversion
3. Import Excel-generated scenarios with NZ cohorts
4. Verify cross-location demand calculations work correctly
5. Test round-trip (export then import) maintains data integrity

## Migration Strategy

1. On import, detect format version
2. Convert legacy formats automatically
3. Preserve original data in case of issues
4. Show notification about format updates