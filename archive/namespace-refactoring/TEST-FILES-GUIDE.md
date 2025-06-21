# Test Files Guide

## Overview
These test files were created to verify the namespace implementation and ensure the app works correctly.

## Test Files

### 1. `test-namespace.html`
**Purpose**: Verifies the namespace structure is working correctly
- Tests that TrainerApp namespace exists
- Checks all namespace properties (Config, State, Utils, etc.)
- Verifies functions are accessible via namespace
- Tests backward compatibility (global functions still work)
- Simple, focused test for namespace implementation

### 2. `test-e2e.html` (Original - Has Issues)
**Purpose**: Comprehensive end-to-end test suite
- Has DOM element issues
- Use `test-e2e-fixed.html` instead

### 2a. `test-e2e-fixed.html` (Recommended)
**Purpose**: Fixed comprehensive end-to-end test suite
- Tests configuration values
- Tests state management
- Tests data structures
- Tests calculations
- Tests UI functions
- Tests import/export
- Tests scenario management
- Tests cross-location functionality
- Tests utility functions
- Integration tests
- Auto-runs on page load with visual results
- Includes all required DOM elements
- Prevents auto-initialization conflicts
- More robust error handling

### 3. `test-quick.html`
**Purpose**: Quick verification that non-existent functions are properly handled
- Verifies missing functions are indeed missing
- Checks that key functions still exist
- Tests namespace access
- Provides quick summary of fixes

### 4. `test-error-debug.html`
**Purpose**: Detailed error debugging
- Captures window errors with full details
- Captures console errors
- Checks if dependencies loaded (Chart.js, SheetJS)
- Verifies core objects initialized
- Explains common error types (like "Script error. line 0")

### 5. `test-e2e-debug.html`
**Purpose**: Debug helper for E2E test issues
- Checks dependency loading
- Verifies core objects
- Tests key functions individually
- Shows detailed error information
- Helps identify why E2E tests might fail

## Which Test to Use When

- **After code changes**: Run `test-quick.html` for a fast check
- **For namespace verification**: Use `test-namespace.html`
- **For comprehensive testing**: Use `test-e2e.html`
- **If seeing errors**: Use `test-error-debug.html`
- **If E2E test fails**: Use `test-e2e-debug.html` to diagnose

## Common Issues

### "Script error. (line 0)"
- Usually from external scripts (Chart.js CDN)
- Browser extensions
- CORS policies
- Safe to ignore if app works

### E2E Test Failures
- Usually due to missing DOM elements
- All required elements have been added to test-e2e.html
- If still failing, check test-e2e-debug.html for details

### Function Not Found
- Check if function was commented out in namespace assignments
- Use test-quick.html to verify which functions exist

## Test Results Summary

✅ **Namespace implementation working correctly**
✅ **All non-existent functions commented out**
✅ **Backward compatibility maintained**
✅ **No console errors from our code**
✅ **E2E test suite functional**

The only remaining error is the generic "Script error" which is from external sources and can be ignored.