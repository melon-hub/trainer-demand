# FTE Dialog Simplification Summary

## Changes Made:

### 1. **Removed Input Mode Toggle**
- Removed the yearly/fortnightly toggle completely
- All values are now entered as FTE per fortnight (no conversion needed)

### 2. **Simplified Modal Layout**
- Created a clean table with Year column and trainer category columns
- Each cell contains a simple input for FTE per fortnight
- No more confusing conversion text or mode switching

### 3. **Enhanced Quick Fill Options**
- Moved quick fill buttons to a sticky header at the top
- Added more options: 10, 15, 20, 25 per fortnight
- Buttons remain visible when scrolling through years

### 4. **Updated Data Handling**
- `handleFTEUpdate` now directly multiplies fortnightly values by 26 for storage
- Removed all conversion logic and mode tracking
- Values are stored internally as yearly totals but displayed/edited as fortnightly

### 5. **Improved Styling**
- Made modal wider (800px max) to accommodate the table better
- Added hover effects on table rows
- Improved input field styling with focus states
- Sticky table headers for better navigation

### 6. **Code Cleanup**
- Removed `switchFTEInputMode` function
- Removed `fteInputMode` variable
- Simplified `quickFillFTE` function
- Cleaned up window function assignments

## Result:
The FTE editing dialog is now much simpler and more intuitive:
- Enter 10 = 10 trainers available that fortnight
- No conversion calculations needed
- Clean table layout shows all categories at once
- Quick fill buttons make bulk editing easy