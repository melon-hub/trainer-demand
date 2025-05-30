# Dashboard Improvements Plan

## Overview
This document outlines planned improvements to the Pilot Trainer Supply/Demand Planner dashboard. The improvements will be implemented as a "Dashboard v2" that can be toggled with the existing dashboard for comparison.

## Implementation Strategy
- Create a toggle button to switch between "Classic Dashboard" and "Enhanced Dashboard"
- Implement new dashboard alongside existing one to preserve functionality
- Allow users to compare and choose their preferred view
- Store preference in localStorage

## Planned Improvements

### 1. Trend Indicators for Metric Cards (High Priority)

**Current State:**
- Static numbers displayed (e.g., "85% Trainer Utilization")
- No historical context

**Proposed Enhancement:**
- Add trend arrows (↑ ↓ →) with percentage change
- Compare current period vs previous period
- Color coding: green for positive trends, red for negative
- Example: "85% ↑ 5%" shows utilization increased by 5%

**Implementation Details:**
```javascript
// Add to metric calculations
const trend = {
    direction: 'up', // 'up', 'down', 'stable'
    percentage: 5.2,
    isPositive: true // depends on metric type
};
```

### 2. Enhanced Chart Interactivity (Medium Priority)

**Current State:**
- Basic Chart.js tooltips
- Limited interaction

**Proposed Enhancement:**
- Custom tooltips showing:
  - Exact values
  - Percentage of total capacity
  - Deficit/surplus amount
  - Comparison to previous period
- Click on data points to drill down
- Hover effects for better visibility

**Implementation Details:**
- Custom tooltip callbacks in Chart.js
- Add click handlers for drill-down functionality
- Enhanced hover states

### 3. Dashboard Export Functionality (Medium Priority)

**Current State:**
- No export options
- Manual screenshots required

**Proposed Enhancement:**
- "Export Dashboard" button with options:
  - PDF snapshot of entire dashboard
  - CSV export of chart data
  - PNG export of individual charts
- Include timestamp and current filters

**Implementation Details:**
- Use jsPDF for PDF generation
- Canvas.toBlob() for chart images
- CSV generation from data arrays

### 4. Enhanced Pipeline Visualization (Medium Priority)

**Current State:**
- Simple list of cohorts by month
- No progress indication

**Proposed Enhancement:**
- Progress bars for each cohort showing:
  - Percentage complete (visual bar)
  - Days remaining
  - Color coding by urgency
- Animated transitions
- Grouping options (by pathway, location, completion date)

**Visual Example:**
```
Jan 2025
├─ FO Training (12 trainees)
│  ████████░░ 80% • 15 days left
├─ CP Training (8 trainees)
│  ██████████ 100% • Completing today
└─ CAD Training (6 trainees)
   ██░░░░░░░░ 20% • 45 days left
```

### 5. Alert Management System (Low Priority)

**Current State:**
- All alerts displayed
- No interaction possible
- Can become cluttered

**Proposed Enhancement:**
- Filter dropdown: "All | Warnings | Critical"
- Dismiss/acknowledge buttons
- Alert history (last 7 days)
- Notification badge showing unread count
- Expandable details for each alert

**Implementation Details:**
- Store acknowledged alerts in localStorage
- Add severity levels to alerts
- Implement collapsible alert details

## Dashboard v2 Layout

### Toggle Mechanism
```
[Classic Dashboard] [Enhanced Dashboard ✓]
```

### Enhanced Metric Cards
```
┌─────────────────────────┐
│ 👥 Total Trainees      │
│ 156 ↑ 12%              │
│ +18 from last month    │
└─────────────────────────┘
```

### Interactive Charts
- Hover: Detailed tooltip with context
- Click: Drill down to fortnight view
- Legend: Toggle data series on/off

### Smart Pipeline View
- Sortable columns
- Progress visualization
- Quick filters (completing soon, delayed, on track)

### Alert Center
```
Alerts (3 new) [All ▼] [✓ Show resolved]
─────────────────────────────────────────
🚨 Critical: Trainer deficit in Mar 2025
   Details: -5 FTE shortage for LT-CAD
   [View Details] [Acknowledge] [Dismiss]
```

## Technical Implementation Notes

1. **File Structure:**
   - Keep existing `updateDashboard()` function
   - Add `updateDashboardV2()` function
   - Toggle stored in `localStorage.dashboardVersion`

2. **Backwards Compatibility:**
   - No changes to existing dashboard code
   - New functions prefixed with `v2_`
   - Separate CSS classes for v2 elements

3. **Performance Considerations:**
   - Calculate trends only when dashboard loads
   - Cache calculations for 5 minutes
   - Lazy load export libraries

## Success Metrics
- User can toggle between dashboards seamlessly
- No performance degradation
- Enhanced insights without information overload
- Improved decision-making capability

## Future Enhancements (Phase 2)
- Customizable dashboard layouts
- Saved dashboard configurations
- Email scheduling for reports
- Mobile-responsive dashboard cards