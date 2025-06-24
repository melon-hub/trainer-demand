# Trainer Demand v1.11 - Standalone Build

This directory contains the v1.11 version of the Trainer Demand application with tools to rebuild the portable HTML file.

## Files Overview

- `index.html` - Main HTML template  
- `app.js` - All JavaScript functionality (661KB)
- `styles.css` - All CSS styles (151KB)
- `trainer-demand-1.12.4.html` - Portable single-file version (951KB)

## Rebuilding the Standalone File

### Quick Rebuild
```bash
./build-standalone.sh
```

### Verify Integrity
```bash
./verify-standalone.sh
```

## What the Build Process Does

1. **Preserves All Functionality** - Inlines all CSS and JavaScript
2. **Maintains External Dependencies** - Keeps Chart.js CDN link
3. **Preserves Error Handling** - Maintains localStorage try/catch blocks
4. **No Functionality Loss** - All 2,986 JS declarations and 6,626 CSS selectors preserved
5. **Includes Latest Features** - Scenario name editing and all enhancements

## Quality Assurance

The verification script checks for:
- ✅ CSS properly embedded (6,626 selectors)
- ✅ JavaScript properly embedded (2,986 declarations)  
- ✅ Chart.js CDN preserved
- ✅ All core UI components present
- ✅ Error handling maintained
- ✅ Browser compatibility preserved
- ✅ New features included (scenario name editing)

## Usage

The standalone file (`trainer-demand-1.12.4.html`) is completely self-contained and can be:

1. **Opened directly** in any modern browser
2. **Shared with others** - no setup required
3. **Run offline** - no internet connection needed
4. **Used on mobile** - responsive design preserved

## New Features in This Build

### ✨ Scenario Name Editing
- **Pencil icon** appears when hovering over scenario cards
- **Click the pencil** to edit scenario names inline
- **Enter** to save changes, **Escape** to cancel
- **Duplicate name validation** prevents conflicts
- **Auto-save** with instant feedback
- **Non-intrusive design** - doesn't interfere with comparison clicks

## Rebuild Triggers

Rebuild the standalone file when you modify:
- `index.html` (template changes)
- `app.js` (functionality updates)  
- `styles.css` (styling changes)

## File Sizes

- Original components: ~963KB (html + js + css)
- Standalone file: ~951KB (includes embedding overhead)
- Very efficient - minimal overhead for full portability

## Notes

- The build process uses Perl for reliable text processing
- All file paths are relative - works from any location
- Build is non-destructive - originals are preserved
- Includes comprehensive error checking and reporting 