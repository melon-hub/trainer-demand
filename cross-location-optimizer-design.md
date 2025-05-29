# Smart Optimizer and Deficit Resolution Assistant Design

## 1. Smart Optimizer Tab (New Training Planner Tab)

### Overview
A new tab in the Training Planner modal that enhances the existing optimizer with partial achievement analysis and intelligent cross-location support (NZ→AU only).

### User Workflow

#### Step 1: Simple Input
```
┌─────────────────────────────────────┐
│ What do you need to achieve?       │
├─────────────────────────────────────┤
│ Captains:    [12] by [Dec 2025 ▼] │
│ First Officers: [24] by [Dec 2025 ▼] │
│ Cadets:      [8] by [Dec 2025 ▼]  │
│                                     │
│ [Analyze Feasibility →]             │
└─────────────────────────────────────┘
```

#### Step 2: Clear Results Summary
```
┌──────────────────────────────────────────────────────┐
│ Feasibility Summary                                  │
├──────────────────────────────────────────────────────┤
│ 🟡 Partial Achievement Possible                      │
│                                                      │
│ By December 2025:                                    │
│ • Captains: 12/12 ✓                                │
│ • First Officers: 18/24 (75%) ⚠️                    │
│ • Cadets: 8/8 ✓                                    │
│                                                      │
│ Complete picture:                                    │
│ • 6 FO will complete by Feb 2026 (+2 months)       │
│                                                      │
│ [See Why] [View Options] [Accept & Schedule]         │
└──────────────────────────────────────────────────────┘
```

#### Step 3: Multiple Options with Trade-offs
```
┌────────────────────────────────────────────────────────────────┐
│ Your Options                                               [X] │
├────────────────────────────────────────────────────────────────┤
│ Option 1: Work with Available Capacity                         │
│ • 75% FO target by Dec, remainder by Feb 2026                │
│ • ✓ No additional costs                                       │
│ • ✗ Extended timeline                                         │
│                                                                │
│ Option 2: Cross-Location Training (NZ only)                   │
│ • Send 6 FO trainees to AU for training                      │
│ • ✓ 100% targets achieved on time                            │
│ • ✗ Additional cost: ~$120,000                               │
│                                                                │
│ Option 3: Adjust Priorities                                   │
│ • Reduce other targets to prioritize FO                      │
│ • ✓ Flexible approach                                         │
│ • ✗ Compromises other goals                                  │
│                                                                │
│ [Compare Options] [Select & Apply]                             │
└────────────────────────────────────────────────────────────────┘
```

### Key Implementation Details

#### Cross-Location Rules
- **NZ → AU**: ✅ Allowed (NZ trainees can use AU trainers)
- **AU → NZ**: ❌ Not allowed (AU trainees cannot use NZ trainers)
- Rationale: AU has ~5x capacity; NZ capacity must be preserved for local needs

#### Partial Achievement Algorithm
```javascript
function calculatePartialAchievement(targets, targetDate) {
    // For each pilot type:
    // 1. Calculate max achievable by target date
    // 2. Identify bottlenecks (which trainer types/periods)
    // 3. Calculate when remainder can complete
    // 4. Generate multiple solution options
    
    return {
        achievableByTarget: { CP: 12, FO: 18, CAD: 8 },
        remainingAfterTarget: { CP: 0, FO: 6, CAD: 0 },
        completionDates: { FO: 'Feb 2026' },
        bottlenecks: ['LT-FO capacity in Nov-Dec'],
        options: [...]
    };
}
```

## 2. Deficit Resolution Assistant

### Overview
A context-aware assistant that detects and resolves capacity deficits in the current schedule, using the same cascading allocation logic as the Smart Optimizer.

### User Interface

#### Floating Indicator
```
┌──────────────────────┐
│ ⚠️ 5 Deficits Found  │
│ 2 CAD | 3 FO         │
│ [Resolve →]          │
└──────────────────────┘
```

#### Resolution Wizard
```
┌─────────────────────────────────────────────────────────────┐
│ Deficit Resolution Assistant                          [X]   │
├─────────────────────────────────────────────────────────────┤
│ Found 5 deficit periods affecting 8 cohorts                 │
│                                                             │
│ Priority Deficits:                                          │
│ • Mar 2025: -2 CAD trainers (CATB/CATA/STP only)          │
│ • Apr 2025: -3 FO trainers (cascading shortage)           │
│                                                             │
│ Quick Fixes Available:                                      │
│ ┌───────────────────────────────────────────────────┐     │
│ │ ✓ Move CAD-2025-03 by 2 weeks (resolves 2 CAD)   │     │
│ │ ✓ Send 3 FO trainees to AU (Apr-May)             │     │
│ │ ✓ Split large FO cohort across 2 months          │     │
│ └───────────────────────────────────────────────────┘     │
│                                                             │
│ [Preview Impact] [Apply Selected] [More Options]            │
└─────────────────────────────────────────────────────────────┘
```

### Key Implementation Details

#### Smart Detection
- Understands cascading allocation (CAD affects CP affects FO)
- Shows which trainer types can resolve each deficit
- Prioritizes minimal-disruption solutions

#### Resolution Strategies (Priority Order)
1. **Temporal Shifts**: Move cohorts by 1-2 fortnights
2. **Cross-Location** (NZ only): Send trainees to AU
3. **Cohort Optimization**: Split/combine/resize
4. **Strategic Changes**: Adjust pathways or targets

#### Integration with Optimizer
- Uses same capacity calculation engine
- Consistent cross-location rules (NZ→AU only)
- Focuses on fixing existing problems vs future planning

## Backlog/Future Enhancements

### Advanced Features
- Machine learning for pattern recognition
- Multi-location optimization (beyond AU/NZ)
- Cost optimization algorithms
- Weather/seasonal considerations
- Trainer preference management

### UI Enhancements
- Drag-and-drop schedule adjustments
- Real-time collaborative planning
- Mobile-responsive design
- Export to external scheduling systems

### Analytics
- Historical success rate tracking
- Bottleneck pattern analysis
- Cross-location ROI reporting
- Predictive deficit warnings

### Integration
- API for external systems
- Calendar sync for trainers
- Automated notifications
- Audit trail for compliance