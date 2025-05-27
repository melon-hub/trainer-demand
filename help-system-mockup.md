# Interactive Help System - How It Works

## Visual Mockup & User Flow

### 1. Entry Points

```
┌─────────────────────────────────────────────────────────┐
│ Pilot Trainer Supply/Demand Planner            [?] Help │
│ ┌────────┬────────┬──────────┬───────────┐            │
│ │Dashboard│ Planner│ Settings │ Scenarios │            │
│ └────────┴────────┴──────────┴───────────┘            │
└─────────────────────────────────────────────────────────┘
```

**How it works:**
- **Help Icon [?]**: Always visible in top-right corner
- **F1 Key**: Press anywhere in the app to open help
- **Contextual [?] icons**: Next to complex features
- **First-time user**: Auto-prompt "Need help? Take a tour!"

### 2. Help Modal Interface

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ X │
│ │ 🔍 Search help... (e.g., "how to add cohort")          │   │
│ └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─────────────────┬─────────────────────────────────────────┐ │
│ │ NAVIGATION      │ CONTENT AREA                            │ │
│ │                 │                                          │ │
│ │ 📚 Getting Started                                        │ │
│ │   • Welcome     │ Welcome to Trainer Planner! 👋          │ │
│ │   • Quick Start │                                          │ │
│ │   • Key Concepts│ This tool helps you optimize pilot      │ │
│ │                 │ training by balancing trainer supply    │ │
│ │ 📊 Dashboard    │ with training demand.                   │ │
│ │   • Overview    │                                          │ │
│ │   • Metrics     │ ┌─────────────────────────────┐         │ │
│ │   • Charts      │ │ 🚀 Start Guided Tour       │         │ │
│ │                 │ └─────────────────────────────┘         │ │
│ │ 📅 Planner      │                                          │ │
│ │   • Add Cohorts │ Popular Topics:                          │ │
│ │   • Gantt View  │ • How to add a training cohort           │ │
│ │   • Tables      │ • Understanding trainer categories       │ │
│ │                 │ • Setting up cross-location training     │ │
│ └─────────────────┴─────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Search Experience

When user types "add cohort":

```
┌─────────────────────────────────────────────────────────┐
│ 🔍 add cohort                                         X │
├─────────────────────────────────────────────────────────┤
│ Search Results (5 matches)                              │
│                                                         │
│ 📄 Adding Individual Cohorts                    95% match│
│    ...click Add Cohort button and fill in the form...  │
│                                                         │
│ 📄 Bulk Cohort Entry                            85% match│
│    ...use the grid or bulk text entry for multiple...  │
│                                                         │
│ 📄 Quick Start: Your First Cohort               80% match│
│    ...step-by-step guide to creating your first...     │
└─────────────────────────────────────────────────────────┘
```

### 4. Interactive Guided Tour

```
┌─────────────────────────────────────────────────────────┐
│ Dashboard  Planner  Settings  Scenarios              AU │
│                                                         │
│  ╔══════════════════════════════════════════╗          │
│  ║ Step 2 of 8: Understanding the Dashboard ║          │
│  ║                                           ║          │
│  ║ These metric cards show key indicators:  ║          │
│  ║ • Trainees in Training                   ║          │
│  ║ • Trainer Utilization %                  ║──────────┐
│  ║ • Upcoming Completions                   ║          │
│  ║                                           ║          ↓
│  ║ [Skip Tour] [Previous] [Next]            ║   ┌──────────┐
│  ╚══════════════════════════════════════════╝   │TRAINEES  │
│                                                  │   150    │
│                                                  └──────────┘
└─────────────────────────────────────────────────────────┘
```

### 5. Contextual Help Tooltips

```
                    ┌─────────────────────────┐
FTE Management [?] ←│ Full-Time Equivalent    │
                    │ Enter annual FTE values │
                    │ System divides by 24    │
                    │ to get fortnightly      │
                    │ [Learn More]            │
                    └─────────────────────────┘
```

### 6. Interactive Calculation Examples

```
┌─────────────────────────────────────────────────────────┐
│ Try It: Calculate Training Demand                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Cohort Size: [12 ▼] trainees                          │
│ Phase: [Line Training - FO ▼]                          │
│ Duration: [8 ▼] fortnights                             │
│                                                         │
│ [Calculate Demand]                                      │
│                                                         │
│ Result:                                                 │
│ ┌─────────────────────────────────────┐                │
│ │ 12 trainees × 1:1 ratio × 8 FN      │                │
│ │ = 12 FTE demand per fortnight       │                │
│ │ = 96 total trainer-fortnights       │                │
│ └─────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

## How Different Features Work

### 1. **Smart Search**
- **Fuzzy matching**: "trnr categry" → "Trainer Categories"
- **Synonyms**: "FTE" also finds "Full-Time Equivalent"
- **Context awareness**: Shows relevant results based on current page
- **Search history**: Recent searches appear as suggestions

### 2. **Progressive Disclosure**
```
Basic Info → [Show More Details] → [Advanced Topics]
```
- Start with essential information
- "Learn More" buttons for deeper dives
- Collapsible sections for advanced users

### 3. **Visual Learning Aids**

**Animated Demonstrations:**
```
┌─────────────────────┐    ┌─────────────────────┐
│ Click "Add Cohort"  │ => │ Fill in the form    │
│ [Button highlight]  │    │ [Form appears]      │
└─────────────────────┘    └─────────────────────┘
```

**Interactive Diagrams:**
```
Trainer Allocation Flow:
    
    CATB/CATA/STP ──┐
                     ├──> P1: LT-CAD (Cadets)
                     ↓ (overflow)
    RHS ────────────┼──> P2: LT-CP (Captains)
                     ↓ (overflow)
    LHS ────────────┴──> P3: LT-FO (First Officers)
```

### 4. **Context-Sensitive Help**

The help system knows where you are:

**On Dashboard:**
- Emphasizes metric interpretation
- Shows dashboard-specific tips
- Links to relevant settings

**On Planner:**
- Focuses on cohort management
- Explains table colors/symbols
- Gantt chart navigation tips

### 5. **Learning Paths**

Different paths for different users:

```
New User Path:
1. Welcome & Overview
2. Quick Start Tutorial
3. Basic Cohort Creation
4. Understanding Results

Advanced User Path:
1. Optimization Strategies
2. Cross-Location Planning
3. Scenario Comparison
4. Excel Import/Export
```

### 6. **Real-Time Assistance**

**Problem Detection:**
```
┌──────────────────────────────────┐
│ ⚠️ Trainer Shortage Detected     │
│                                  │
│ You have 85 FTE demand but only │
│ 70 FTE supply in March 2025.     │
│                                  │
│ [Show Me How to Fix This]        │
└──────────────────────────────────┘
```

**Smart Suggestions:**
- "Try using cross-location training"
- "Consider spreading cohorts"
- "Check if RHS trainers are available"

## User Journey Example

**Sarah, a new training manager:**

1. **Opens app** → Sees "Welcome! New here? Take a tour"
2. **Clicks tour** → Guided through main features
3. **Tries to add cohort** → Gets confused about pathways
4. **Clicks [?]** → Learns about CAD/FO/CP differences
5. **Searches "trainer types"** → Finds detailed explanation
6. **Uses calculator** → Understands demand calculation
7. **Sees red cells** → Tooltip explains deficit
8. **Clicks "Show me how to fix"** → Learns about solutions

## Technical Implementation

**Performance:**
- Content lazy-loaded as needed
- Search index pre-built
- Images optimized and cached
- Smooth 60fps animations

**Accessibility:**
- Keyboard navigation throughout
- Screen reader friendly
- High contrast mode support
- Text scalable to 200%

**Responsive:**
- Mobile: Full-screen help
- Tablet: Slide-out panel
- Desktop: Modal overlay

This creates an intuitive, helpful experience that teaches users as they work!