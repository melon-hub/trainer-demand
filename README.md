# Pilot Trainer Supply/Demand Planner v1.12.4

A comprehensive web-based application for managing pilot training cohorts and forecasting trainer supply/demand across multiple locations and years. Optimized for airline training operations with sophisticated cross-location training support.

## ✨ **Latest Updates (v1.12.4)**

### **🔄 MAJOR: FTE System Simplification**
The application has been significantly simplified to improve user experience:
- **Single Source of Truth**: All FTE data now lives in scenarios only
- **Eliminated Confusion**: Removed complex localStorage FTE persistence
- **Streamlined Workflow**: New scenarios automatically copy current FTE values
- **Predictable Behavior**: What you see is exactly what gets saved

## 🎯 **Key Features**

### **Multi-Location Training Management**
- **AU/NZ Operations**: Full support for Australia and New Zealand locations
- **Cross-Location Training**: Assign trainers from one location to train in another
- **Visual Indicators**: Flags, stripes, and dots show cross-location assignments
- **Split View**: Toggle between local-only and cross-location demand views

### **Executive Dashboard V2**
- **Real-Time Metrics**: Current trainee counts with trend indicators
- **12-Month Forecast**: Demand prediction with visual charts
- **Smart Alerts**: Capacity warnings and optimization suggestions
- **Training Distribution**: Pie charts by pathway type (CP/FO/CAD)
- **Dark Mode**: Seamless theme switching throughout

### **Advanced Training Planner**
- **Drag & Drop Gantt Chart**: Visual timeline with cohort management
- **Excel-Like Grid Entry**: Bulk cohort input with paste support
- **Target Optimizer**: Set pilot targets and auto-optimize schedules
- **Bulk Input Parser**: Natural language cohort entries
- **Cross-Location Display**: See cohorts using your location's trainers

### **Simplified Data Management**
- **Scenario-Based**: All configurations saved in scenarios
- **Smart Import/Export**: JSON and CSV support with conflict resolution
- **Auto-Load**: Remembers your last scenario
- **No Complex Defaults**: Straightforward data flow

## 🚀 **Quick Start**

1. **Open** `index.html` in any modern browser
2. **Load Sample Data** or create your first scenario
3. **Configure** pathways and FTE in Settings
4. **Add Cohorts** using the Training Planner
5. **Monitor** supply/demand in the Dashboard

## 📁 **Project Structure**

```
trainer-demand-v1.11/
├── index.html                    # Main application (79KB)
├── app.js                        # Core logic (717KB)  
├── styles.css                    # Styling with dark mode (167KB)
├── trainer-demand-1.12.4.html    # Standalone version (951KB)
├── build-standalone.sh           # Build script for portable version
├── CHANGELOG.md                  # Detailed version history
├── PROJECT_EVOLUTION.md          # Development timeline
└── archive/                      # Historical files and utilities
```

## 🔧 **Technical Details**

- **Pure JavaScript**: No frameworks, runs directly in browser
- **Chart.js**: For dashboard visualizations
- **Local Storage**: Scenario persistence (browser-based)
- **Mobile Responsive**: Works on tablets and phones
- **Cross-Browser**: Chrome, Firefox, Safari, Edge support

## 💡 **Training Concepts**

### **Pathways**
- **CP (Captain)**: Short pathway, 3-8 fortnights
- **FO (First Officer)**: Medium pathway, ~11 fortnights  
- **CAD (Cadet)**: Long pathway, 8-12 fortnights

### **Trainer Categories**
- **CATB/CATA/STP**: Can train all types (CAD, CP, FO)
- **RHS**: Can train CP and FO only
- **LHS**: Can train FO only

### **Priority System**
1. **P1 (CAD Training)**: Highest priority - uses CATB/CATA/STP
2. **P2 (CP Training)**: Uses RHS primarily, overflow from P1 trainers
3. **P3 (FO Training)**: Uses LHS primarily, overflow from all trainers

## 🎨 **Usage Tips**

- **F1**: Open help system
- **Dark Mode**: Click moon icon in header
- **Bulk Entry**: Use Excel-style copy/paste in Training Planner
- **Cross-Location**: Use the split view toggle to see demand breakdown
- **Scenarios**: Save different configurations for comparison

## 📊 **Standalone Version**

The `trainer-demand-1.12.4.html` file is completely self-contained:
- No installation required
- Works offline
- Shareable with colleagues
- All features preserved
- 951KB single file

## 🔄 **Recent Evolution**

This application has evolved through 7 major phases:
1. **Foundation** (v0.8-0.9): Basic planning concept
2. **Production Ready** (v1.0): Drag & drop, grid entry
3. **Multi-Location** (v1.3-1.5): AU/NZ support, cross-location training
4. **User Experience** (v1.6-1.7): Help system, auto-loading
5. **Stability** (v1.8): Performance and bug fixes
6. **UI Polish** (v1.9): Column highlighting, enhanced modals
7. **Simplification** (v1.10-1.12): Import/export, pathway enhancements, **FTE system simplification**

The latest phase focused on eliminating user confusion and creating a more predictable, streamlined experience.

---

**Development**: Michael Hofstein | **Version**: 1.12.4 | **Updated**: January 2025