# Scenario Management Improvements - TODO List

## Priority Order:

### 1. ✅ Update/Overwrite Existing Scenarios
- [x] Add "Update" button to current scenario when it has changes
- [x] Confirm dialog before overwriting
- [x] Update timestamp when scenario is updated

### 2. ✅ Move Scenarios to Main Tab
- [x] Add "Scenarios" as fourth main navigation tab
- [x] Move all scenario functionality to dedicated view
- [x] Better layout with more space for features
- [x] Keep current scenario indicator in header
- [x] Add search functionality
- [x] Show scenario count

### 3. ✅ Better Scenario UI/UX
- [x] Replace prompt() with proper modal for naming
- [x] Add description/notes field
- [x] Show preview of what will be saved
- [x] Better visual feedback for save/load operations
- [x] Center modals on page
- [x] Add toast notifications for all operations
- [x] Replace alerts with notifications

### 4. ✅ Duplicate Scenario
- [x] Add "Duplicate" button to scenario cards
- [x] Auto-name as "Copy of [original name]"
- [x] Open naming modal after duplication

### 5. ✅ Export/Import Scenarios
- [x] Export single scenario as JSON
- [x] Export all scenarios as JSON
- [x] Import scenario(s) from JSON file
- [x] Handle naming conflicts on import

### 6. ✅ Search/Filter Scenarios
- [x] Add search box to filter by name
- [ ] Add date range filter (postponed - may not be needed)
- [x] Show scenario count
- [x] Sort options (name, date, size)

### 7. ⏳ Scenario Templates
- [ ] Create pre-built scenario templates
- [ ] "New from Template" option
- [ ] Common patterns (e.g., "Quarterly Intake", "Peak Season")

### 8. ⏳ Scenario Comparison
- [ ] Select two scenarios to compare
- [ ] Show differences in cohorts, FTE, etc.
- [ ] Visual diff highlighting

### 9. ⏳ Basic Versioning
- [ ] Track save count/version number
- [ ] Show "last modified" info
- [ ] Simple revision history

## Implementation Notes:
- Each feature will be implemented and tested individually
- User will validate before moving to next feature
- Focus on maintaining existing functionality while adding new features