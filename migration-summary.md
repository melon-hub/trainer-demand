# Migration Summary: Previous-viewer.html to app.js

## 1. Training Pathways Extraction

### Previous-viewer.html Pathways (Lines 234-257):
```javascript
// Formatted for app.js
const pathways = {
    "A202": {
        id: "A202",
        name: "A202 (2xCP)",
        groupSize: 2,
        type: "CP",
        phases: [
            { name: "GS+SIM", duration: 2, trainerDemandType: null },
            { name: "LT-CP", duration: 6, trainerDemandType: "LTCP" }
        ]
    },
    "A210": {
        id: "A210",
        name: "A210 (2xFO)",
        groupSize: 2,
        type: "FO",
        phases: [
            { name: "GS+SIM", duration: 4, trainerDemandType: null },
            { name: "LT-FO", duration: 4, trainerDemandType: "LTFO" },
            { name: "LT-FO", duration: 3, trainerDemandType: "LTFO" }
        ]
    },
    "A209": {
        id: "A209",
        name: "A209 (2xCAD)",
        groupSize: 2,
        type: "CAD",
        phases: [
            { name: "GS+SIM", duration: 4, trainerDemandType: null },
            { name: "LT-CAD", duration: 4, trainerDemandType: "LTCAD" },
            { name: "LT-FO", duration: 3, trainerDemandType: "LTFO" }
        ]
    },
    "A212": {
        id: "A212",
        name: "A212 (2xCAD)",
        groupSize: 2,
        type: "CAD",
        phases: [
            { name: "GS+SIM", duration: 4, trainerDemandType: null },
            { name: "LT-CAD", duration: 3, trainerDemandType: "LTCAD" },
            { name: "LT-FO", duration: 5, trainerDemandType: "LTFO" }
        ]
    },
    "A211": {
        id: "A211",
        name: "A211 (2xCAD)",
        groupSize: 2,
        type: "CAD",
        phases: [
            { name: "GS+SIM", duration: 4, trainerDemandType: null },
            { name: "LT-CAD", duration: 2, trainerDemandType: "LTCAD" },
            { name: "LT-FO", duration: 2, trainerDemandType: "LTFO" }
        ]
    },
    "A203": {
        id: "A203",
        name: "A203 (4xCP)",
        groupSize: 4,
        type: "CP",
        phases: [
            { name: "GS+SIM", duration: 2, trainerDemandType: null },
            { name: "LT-CP", duration: 1, trainerDemandType: "LTCP" }
        ]
    }
};
```

## 2. Key Logic Differences

### A. Trainer Categories and Qualifications (Missing in app.js)
**Previous-viewer.html (Lines 266-285):**
- Defines 5 trainer categories: CATB, CATA, STP, RHS, LHS
- Trainer qualifications mapping:
  - LTCAD: ["CATB", "CATA", "STP"]
  - LTCP: ["CATB", "CATA", "STP", "RHS"]
  - LTFO: ["CATB", "CATA", "STP", "RHS", "LHS"]

**Current app.js:**
- Uses simple FTE total per year without categories
- Uses student:trainer ratio instead of qualified trainer allocation

### B. Demand Calculation Methods
**Previous-viewer.html:**
- Calculates demand based on `trainerDemandType` (LTCAD, LTCP, LTFO)
- Demand = numInstances × groupSize (for phases with trainer demand)
- Tracks three priority levels: P1 (LTCAD), P2 (LTCP), P3 (LTFO)

**Current app.js:**
- Calculates demand using: numTrainees / phase.ratio
- No differentiation between trainer types or priorities

### C. Surplus/Deficit Calculation (Lines 771-820)
**Previous-viewer.html - Cascading Allocation Logic:**
1. Allocates trainers to P1 (LTCAD) first from qualified categories
2. Remaining trainers allocated to P2 (LTCP)
3. Finally allocates to P3 (LTFO)
4. Tracks individual S/D for each priority level
5. Calculates "LT-CP Training Deficit" specifically
6. **Total Net S/D = Total Initial FTE - Total Line Training Demand**

**Current app.js:**
- Simple calculation: Supply - Demand per fortnight
- No cascading allocation or priority system
- No trainer category consideration

### D. Fortnight System Differences
**Previous-viewer.html:**
- Uses 26 fortnights per year
- More detailed month mapping

**Current app.js:**
- Uses 24 fortnights per year
- Simplified month mapping

## 3. Missing Features in app.js

1. **Trainer Categories System**
   - No FTE breakdown by trainer type (CATB, CATA, STP, RHS, LHS)
   - No qualification-based allocation

2. **Priority-based Demand System**
   - Missing P1/P2/P3 demand categorization
   - No cascading allocation logic

3. **Detailed Surplus/Deficit Tracking**
   - No individual S/D by demand type
   - Missing LT-CP Training Deficit calculation
   - Missing Total Net S/D calculation

4. **Pathway Properties**
   - Missing `type` field (CP/FO/CAD)
   - Missing `trainerDemandType` for phases
   - Using ratio instead of direct demand calculation

5. **UI Features**
   - No pathway deletion in settings
   - No cohort information in Gantt chart tooltips
   - Less detailed phase color coding

## 4. Recommended Updates to app.js

### High Priority:
1. Add trainer categories system with FTE breakdown
2. Implement trainer qualification mapping
3. Add priority-based demand calculation (P1/P2/P3)
4. Implement cascading allocation logic for S/D
5. Add LT-CP Training Deficit calculation
6. Add Total Net S/D calculation

### Medium Priority:
1. Update pathways structure to include type and trainerDemandType
2. Change from 24 to 26 fortnights per year
3. Add pathway deletion functionality
4. Enhance Gantt chart with better tooltips

### Low Priority:
1. Add trainee type field to cohorts
2. Enhance color coding for different phase types
3. Add export/import functionality for pathways