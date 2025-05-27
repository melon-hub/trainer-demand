# Training Optimizer Improvements Plan

## Current State Analysis
The current optimizer is a constraint-based scheduler that:
- Uses a greedy first-fit algorithm
- Processes pathways in order (CP → FO → CAD)
- Respects hard constraints only (GS+SIM capacity, trainer availability)
- Offers basic smoothing to avoid deficits by delaying cohorts
- Does NOT optimize for efficiency or utilization

## Proposed Improvements

### 1. True Optimization Objectives
Instead of just finding a valid schedule, optimize for:

#### A. Maximize Trainer Utilization
- Target 80-90% utilization for cost efficiency
- Avoid both under-utilization and over-utilization
- Balance workload across trainer categories

#### B. Minimize Completion Time Variance
- Spread training completions evenly across periods
- Avoid clustering that creates resource peaks/valleys
- Maintain steady pilot output

#### C. Minimize Cross-Location Complexity
- Prefer local trainers when possible
- Minimize the number of cross-location movements
- Consider travel/coordination costs

#### D. Balance Trainer Workload
- Distribute demand evenly across trainer categories
- Prevent burnout from sustained high utilization
- Allow for leave and professional development

### 2. Advanced Scheduling Algorithms

#### A. Look-Ahead Scheduling
```javascript
// Instead of placing in first available slot
// Evaluate multiple slots and choose best based on:
- Future capacity impact
- Utilization smoothness
- Completion clustering
```

#### B. Load Balancing Algorithm
```javascript
// Calculate "load score" for each potential slot
loadScore = {
  utilizationVariance: calculateVariance(utilization),
  peakPenalty: maxUtilization > 90 ? penalty : 0,
  valleyPenalty: minUtilization < 60 ? penalty : 0,
  smoothness: calculateSmoothness(demand)
}
```

#### C. Multi-Pass Optimization
1. **First Pass**: Place all cohorts using current greedy approach
2. **Second Pass**: Identify improvement opportunities
3. **Third Pass**: Relocate cohorts to improve overall score
4. **Iterate**: Until no improvements found or max iterations

#### D. Constraint Relaxation
- Start with tight constraints
- Gradually relax if no solution found
- Track which constraints were relaxed for user awareness

### 3. Cross-Location Optimization

#### A. Automatic Cross-Location Suggestions
```javascript
// When local capacity insufficient:
if (localCapacity < demand) {
  checkCrossLocationOptions({
    otherLocationCapacity: getCapacity(otherLocation),
    movementCost: calculateMovementComplexity(),
    benefit: demandMet - movementCost
  });
}
```

#### B. System-Wide Optimization
- Optimize both locations simultaneously
- Consider total system capacity
- Balance utilization across locations

#### C. Smart Cross-Location Rules
- Prefer moving smaller cohorts
- Group cross-location movements for efficiency
- Respect minimum/maximum movement thresholds

### 4. Advanced Features

#### A. Multiple Schedule Generation
- Generate 3-5 different schedules using different strategies:
  - Aggressive (maximize throughput)
  - Balanced (optimize utilization)
  - Conservative (minimize risk)
  - Cross-location (utilize both locations)

#### B. Sensitivity Analysis
```javascript
// Show impact of changes:
- "What if we add 2 more CATB trainers?"
- "What if GS+SIM capacity increases to 20?"
- "What if we allow 95% utilization?"
```

#### C. Bottleneck Analysis
- Identify constraining factors
- Quantify impact of each bottleneck
- Suggest targeted improvements

#### D. Schedule Quality Metrics
```javascript
scheduleMetrics = {
  avgUtilization: 85.2,
  peakUtilization: 92.1,
  completionVariance: 3.2,
  crossLocationMovements: 4,
  deficitPeriods: 0,
  scheduleRobustness: 0.78
}
```

### 5. User Interface Enhancements

#### A. Optimization Preferences Panel
```
[x] Maximize trainer utilization (target: 85%)
[ ] Minimize completion variance
[x] Allow cross-location training
[ ] Strict deadline compliance
    
Utilization Range: [70%]----[===]----[90%]
```

#### B. Interactive Optimization
- Drag to manually adjust cohort placement
- See real-time impact on metrics
- Lock certain cohorts in place
- Set cohort-specific priorities

#### C. Comparison View
- Side-by-side schedule comparison
- Highlight differences
- Show metric improvements
- Cost-benefit analysis

### 6. Implementation Approach

#### Phase 1: Enhanced Metrics (1-2 weeks)
- Add utilization calculations
- Implement schedule scoring
- Create quality metrics dashboard

#### Phase 2: Improved Algorithm (2-3 weeks)
- Implement look-ahead scheduling
- Add load balancing logic
- Create multi-pass optimization

#### Phase 3: Cross-Location Intelligence (2-3 weeks)
- Auto-suggest cross-location solutions
- Implement system-wide optimization
- Add movement cost calculations

#### Phase 4: Advanced Features (3-4 weeks)
- Multiple schedule generation
- Sensitivity analysis
- Interactive optimization
- Comparison tools

### 7. Algorithm Pseudocode

```javascript
function optimizeScheduleV2(targets, constraints, preferences) {
  // 1. Generate initial schedule using current algorithm
  let schedule = generateInitialSchedule(targets, constraints);
  
  // 2. Calculate baseline metrics
  let metrics = calculateMetrics(schedule);
  
  // 3. Multi-pass improvement
  for (let pass = 0; pass < MAX_PASSES; pass++) {
    let improved = false;
    
    // Try moving each cohort
    for (let cohort of schedule.cohorts) {
      let bestSlot = findBestSlot(cohort, schedule, preferences);
      if (bestSlot.score > currentSlot.score) {
        moveCohort(cohort, bestSlot);
        improved = true;
      }
    }
    
    // Try cross-location options
    if (preferences.allowCrossLocation) {
      let crossLocationImprovements = findCrossLocationOpportunities(schedule);
      applyCrossLocationOptimizations(schedule, crossLocationImprovements);
    }
    
    if (!improved) break;
  }
  
  // 4. Generate alternatives if requested
  if (preferences.generateAlternatives) {
    alternatives = generateAlternativeSchedules(targets, constraints, preferences);
  }
  
  return {
    primary: schedule,
    alternatives: alternatives,
    metrics: calculateMetrics(schedule),
    quality: assessScheduleQuality(schedule)
  };
}
```

### 8. Success Metrics
- **Utilization Improvement**: From current avg to 80-85%
- **Completion Variance**: Reduce by 50%
- **User Satisfaction**: Faster, better schedules
- **Flexibility**: Handle more complex scenarios
- **Transparency**: Clear reasoning for decisions

---
*Created: May 2025*
*Status: Proposed*
*Priority: High*