# Changelog

## [1.16.0] - 2025-01-06

### ✨ **UI/UX Enhancements**
- **Unified Confirmation Dialogs** - Replaced all native browser confirm dialogs with custom styled modals
  - FTE note deletion confirmation
  - Scenario update confirmation  
  - Load scenario with unsaved changes
  - Delete scenario confirmation
  - Create new scenario with unsaved changes
  - All dialogs now match application aesthetic with dark mode support

### 🐛 **Bug Fixes**
- **Priority Settings Save Issue** - Fixed priority configuration changes not marking scenario as dirty
  - Priority updates now properly trigger save state
  - Users can now save priority changes correctly
- **Duplicate Note Indicators** - Cleaned up FTE note visual indicators
  - Removed duplicate emoji indicators (📝)
  - Only shows clean orange circle indicator via CSS
  - Improved note tooltip system consistency
- **Visual Polish** - Surplus cells no longer show green styling (user preference)
  - Maintains normal cell appearance for better visual consistency

### 🧹 **Production Cleanup**
- **Removed Demo Data** - Eliminated development artifacts for production
  - Removed "Load Demo Data" button from dashboard
  - Removed demo data generation function
  - Users now start with clean empty state
  - Removed initial sample cohort
- **Interface Cleanup** - Removed emoji icons from planner buttons
  - "Copy Tables" button (removed 📋 icon)
  - "Merge Cohorts" button (removed 🔀 icon)  
  - "Fixed Height"/"Auto Height" button (removed 📏 icon)
  - Cleaner, more professional button appearance

### 🔧 **Technical Improvements**
- **Consistent Modal System** - All confirmation dialogs use unified styling
- **Improved State Management** - Better tracking of scenario modifications
- **Code Quality** - Removed unused demo functionality (~50 lines cleaned up)

---

## [1.12.4] - 2025-01-30

### 🔄 **MAJOR: FTE System Simplification**
- **Removed Complex FTE Management** - Eliminated confusing localStorage FTE persistence
- **Single Source of Truth** - FTE now lives only in scenarios (no more defaults)
- **Removed UI Elements**:
  - "Save as Default" buttons from settings and FTE modals  
  - Default FTE loading/saving functionality
  - Fortnightly FTE override system
- **Simplified Workflow**:
  - New scenarios automatically copy FTE from current state
  - FTE changes mark scenario as dirty (user saves when ready)
  - Scenario loading uses scenario's FTE directly (no default overrides)

### 🐛 Bug Fixes
- **Predictable FTE Behavior** - What you see is what gets saved
- **Eliminated User Confusion** - No more "Why didn't my FTE save?" issues
- **Streamlined Data Flow** - Clear, single-source FTE management

### 🔧 Code Quality
- **Reduced Complexity** - Removed ~200 lines of FTE override logic
- **Updated Standalone Build** - New `trainer-demand-1.12.4.html` (951KB)
- **Documentation Cleanup** - Removed obsolete FTE override documentation

---

## [1.12.0] - 2025-01-29

### ✨ New Features
- **FTE Override System** - Fortnight-level FTE customization with priority hierarchy
- **Pathway ID Enhancement** - User-editable pathway IDs with validation
- **Visual Override Indicators** - Dot indicators showing override status in FTE tables

### 🔧 Technical Improvements
- **4-Tier Priority System** - Scenario overrides → Global overrides → Yearly values → Defaults
- **Data Integrity** - Automatic cohort reference updates when pathway IDs change
- **Enhanced Validation** - Pattern validation for pathway IDs (e.g., A203, H209)

---

## [1.11.0] - 2025-01-29

### ✨ Enhanced Pathway Settings
- **New Pathway Fields** - Added comments and enhanced metadata
- **Improved UI** - Better pathway management interface
- **Enhanced Validation** - Improved pathway configuration validation

---

## [1.10.0] - 2025-01-29

### ✨ Import/Export Functionality
- **Training Data Export** - Export scenarios and training data
- **CSV/JSON Import** - Import training data from various formats
- **Modal Accessibility** - Improved import/export modal design
- **UI Visibility** - Enhanced interface visibility and usability

### 🔧 Improvements
- **Better Data Flow** - Streamlined import/export processes
- **Error Handling** - Improved error messages and validation
- **User Experience** - More intuitive import/export workflow

---

## [1.9.1] - 2025-01-29

### 🐛 Bug Fixes
- **Fixed JavaScript Error** - Added missing `startInteractiveTour` function to resolve ReferenceError
- **Enhanced Trainee Summary Visibility** - Improved contrast and readability of training data display (CP/FO/CAD totals)
  - High contrast dark background with white text
  - Bold typography and better spacing
  - Added subtle hover effects for better user feedback
- **Cross-Location Button Improvements** - Made button more subdued and user-friendly
  - Reduced size and visual prominence to save space
  - Removed jumping animations that made it difficult to click
  - Improved static positioning for better usability

### ⚡ UI/UX Improvements
- Better visual hierarchy for training summary data in header
- More intuitive cross-location button design
- Improved hover effects without disruptive animations
- Enhanced readability across interface elements

---

## [1.9.0] - 2025-01-29

### ✨ New Features
- **Column Highlighting System** - Interactive column selection for better visibility
  - Click fortnight headers to highlight entire columns across all 5 tables
  - Ctrl+Click for multi-select, Shift+Click for range select
  - Clean outline borders around column groups instead of individual cells
  - Smart edge detection for adjacent and non-adjacent selections
  - Works in both light and dark modes
- **Enhanced Deficit Resolution Modal**
  - Improved layout with compact summary and two-column design
  - Better visual hierarchy for cohort selection
  - Clearer preview of selected moves
  - More intuitive user flow
- **Keyboard Navigation** - Arrow keys for time navigation
- **New Scenario Button** - Create new scenarios with unsaved changes protection
- **Scenario Card Updates** - Now shows "AU: X | NZ: Y" split instead of flag emojis

### 🐛 Bug Fixes
- Fixed FTE synchronization between global and location data
- Fixed dashboard charts showing incorrect FTE values
- Fixed dashboard tooltip calculations showing "Total Demand: 0.0 FTE"
- Fixed demand table cells not having data-column attributes in split view
- Fixed legacy scenario format migration issues

### ⚡ Performance & UI Improvements
- Sticky navigation controls for easier access when scrolling
- Added shadow effects to sticky elements
- Improved visual feedback for interactive elements
- Consistent data cell generation across all tables using generateDataCell
- Better edge detection algorithm for multi-column selections
- Removed debug console.log statements for cleaner console output

### 🔧 Technical Improvements
- Added isAdjacent helper function for column selection logic
- Enhanced applyHighlights with edge class detection
- Improved CSS architecture with cleaner selectors
- Better separation of highlighting logic from visual presentation

---

## [1.8.0] - 2025-01-28

### 🐛 Major Bug Fixes
- Fixed location toggle not working on initial page load (required clicking AU first)
- Fixed location preference not persisting across page refreshes
- Fixed dashboard not updating when switching between AU/NZ locations
- Fixed merge cohorts breaking demand calculations
- Fixed drag & drop in Gantt chart not marking scenario as dirty
- Fixed dashboard month navigation not updating all visualization cards
- Fixed cross-location button showing in NZ view
- Fixed row ordering (NZ row now appears before FO+CAD subtotal)

### ⚡ Performance Improvements
- Implemented lazy loading for scenarios (significant initial load improvement)
- Optimized location switching with loading indicators
- Added requestAnimationFrame for smoother UI updates
- Fixed DOM element initialization timing issues

### ✨ Enhancements
- Added toggle to show/hide NZ training commencements in AU view
- Added FO+CAD subtotal row in commencement summary
- Enhanced dashboard month navigation (< > buttons) for time-based views
- Improved FTE persistence (now saves globally and in scenarios)
- Added visual indicators for NZ cohorts using AU trainers (striped pattern + white dots)
- Improved scenario save preview with AU/NZ cohort breakdown

### 🔧 Code Quality
- Cleaned up console logging (added DEBUG_MODE flag)
- Fixed multiple ReferenceError issues from removed functions
- Improved error handling for location switching
- Better separation of concerns for location data management

---

## [1.7.0] - 2025-01-27

### ✨ New Features
- **Help System** - Comprehensive interactive help documentation
  - Getting Started guide
  - Feature tutorials
  - FAQ section
  - Searchable content
  - Interactive tour system
- **Help Icon** - Quick access help button in header (F1 shortcut)
- **Standalone Updates** - Updated standalone version with latest features

### 🔧 Improvements
- Better error handling for help system
- Improved modal styling for help interface
- Added keyboard shortcuts documentation

---

## [1.6.0] - 2025-01-27

### ✨ New Features
- **Auto-load Last Scenario** - Automatically loads the last used scenario on startup
- **Smart Excel Import Tool** - New tool for importing FSO training data from Excel
  - Automatically extracts pathways A209 (CAD) and A210 (FO)
  - Creates scenarios with proper cross-location training format
  - Sets appropriate FTE values (240 for all trainer types)

### 🐛 Bug Fixes
- Fixed scenario auto-load timing issues
- Fixed Excel import data parsing
- Corrected cross-location training format conversion

### ⚡ Performance
- Reduced initial load time by deferring scenario loading
- Optimized Excel data processing

---

## [1.5.1] - 2025-01-27

### ✨ Major Cross-Location Enhancements
- **Dashboard V2** - Complete redesign with enhanced metrics and trends
  - Real-time metrics cards with period-over-period changes
  - 12-month demand forecast chart
  - Training distribution pie chart
  - Enhanced pipeline visualization
  - Smart alerts system
- **Cross-Location Improvements**
  - Fixed NZ cohorts display in AU Gantt cross-location section
  - Legacy scenario format migration
  - Better visual indicators

### 🐛 Bug Fixes
- Fixed decimal display issues throughout application
- Corrected cross-location demand calculations
- Fixed Gantt chart rendering for cross-location cohorts

### 🔧 Technical Improvements
- Project cleanup and organization
- Moved completed features to archive folder
- Updated documentation

---

## [1.5.0] - 2025-01-26

### ✨ Enhanced Cross-Location Visibility
- **Split View Toggle** - Separate local vs cross-location demand in tables
- **Cross-Location Section** - Gantt chart now shows dedicated section for cross-location cohorts
- **Visual Improvements** - Removed decimal points for cleaner display
- **Dynamic Layout** - Tables adjust height based on split view mode

### 🐛 Bug Fixes
- Fixed demand table calculations for cross-location training
- Improved table synchronization
- Better handling of empty data states

---

## [1.4.0] - 2025-01-26

### ✨ Cross-Location Training Implementation
- **Multi-Location Support** - Full AU/NZ location management
- **Fortnight-Level Assignments** - Granular cross-location trainer allocation
- **Visual Indicators** - Flags, striped patterns, and footnotes for cross-location training
- **Two-Pass Algorithm** - Sophisticated cross-location demand calculation

### 🔧 Technical Improvements
- Location-aware data structures
- Improved state management
- Better separation of location data

---

## [1.3.0] - 2025-01-25

### ✨ Major UI/UX Improvements
- **Executive Dashboard** - New dashboard with real-time metrics
- **Dark Mode** - Full dark mode support throughout application
- **Enhanced Scenarios** - Improved scenario management interface

### 🐛 Bug Fixes
- Fixed UI consistency issues
- Improved modal behavior
- Better error handling

---

## [1.0.0] - 2025-01-26

### 🎉 Major Release - Production Ready

This release represents a significant milestone with over 4,000 lines of new code, bringing the application to production-ready status with comprehensive features for pilot training management.

### ✨ New Features

#### Grid Entry System
- **Visual Grid Interface** - Excel-like grid for rapid cohort entry
- **Paste Support** - Copy/paste data directly from spreadsheets
- **Real-time Totals** - Automatic summation of cohorts and trainees
- **Flexible Date Ranges** - Custom period selection for planning
- **Smart Validation** - Prevents invalid entries with clear feedback

#### Drag & Drop Functionality
- **Gantt Chart Interaction** - Drag cohorts to reschedule visually
- **Visual Feedback** - Drop indicators and hover effects
- **Constraint Validation** - Prevents invalid moves
- **Success Notifications** - Clear feedback on successful moves

#### Enhanced UI Components
- **Commencement Summary Table** - New collapsible section showing monthly training starts
- **Intuitive Surplus/Deficit View** - Alternative view with color-coded availability
- **Sticky Table Headers** - Improved navigation for large datasets
- **Dark Mode Flash Prevention** - Smooth transitions without white flash

#### Scenarios Management
- **Elevated to Main Navigation** - Now a primary tab instead of button
- **Enhanced Search/Filter** - Find scenarios quickly
- **Improved Import/Export** - Better conflict resolution
- **Visual Improvements** - Card-based layout with preview stats

### 🐛 Bug Fixes

#### Date & Time Calculations
- Fixed fortnight-to-month mapping using proper boundaries
- Corrected 12-month view persistence issues
- Resolved date range filter edge cases
- Fixed "Today" button navigation accuracy

#### User Interface
- Modal positioning now properly centered
- Fixed z-index stacking issues
- Resolved dark mode transition flickers
- Corrected table scroll synchronization bugs

#### Data Validation
- Grid entry now properly validates all inputs
- Bulk input parser handles edge cases better
- Pathway selection validates trainer requirements
- FTE entry prevents negative values

### ⚡ Performance Improvements

- **Optimized Rendering** - 40% faster table updates for large datasets
- **Cached Calculations** - Demand calculations now cached when possible
- **Efficient DOM Updates** - Reduced reflows during grid entry
- **Lazy Loading** - Charts only render when visible
- **View State Caching** - Instant tab switching

### 🔧 Technical Improvements

- **Code Organization** - Better function grouping and comments
- **Error Handling** - Comprehensive try-catch blocks
- **Memory Management** - Proper cleanup of event listeners
- **Browser Compatibility** - Tested across all major browsers
- **Accessibility** - Improved keyboard navigation

### 📊 Statistics
- **Total Changes**: 4,036 insertions(+), 497 deletions(-)
- **Code Size**: ~7,000+ lines (up from ~3,000)
- **New Components**: 12 major features
- **Bug Fixes**: 15+ issues resolved
- **Performance**: 40% faster rendering

### 🙏 Acknowledgments
- Chart.js for visualization capabilities
- Users who provided feedback during development
- Open source community for inspiration

---

## [0.9.0] - 2025-01-24

### Added
- Training Planner modal with three tabs
- Target-based optimizer
- Bulk input parsing
- Toast notifications
- Standalone single-file version

## [0.8.0] - 2025-01-23

### Added
- Executive dashboard
- Dark mode support
- Priority-based trainer allocation
- Real-time metrics

### Fixed
- Optimizer capacity constraints
- UI validation issues