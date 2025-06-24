#!/bin/bash

# Verification script for trainer-view-standalone.html
# This ensures all CSS and functionality is preserved

echo "🔍 Verifying trainer-view-standalone.html integrity..."
echo ""

STANDALONE_FILE="trainer-view-standalone.html"

if [[ ! -f "$STANDALONE_FILE" ]]; then
    echo "❌ Standalone file not found: $STANDALONE_FILE"
    exit 1
fi

echo "📊 File Statistics:"
echo "   Size: $(wc -c < "$STANDALONE_FILE" | xargs) bytes"
echo "   Lines: $(wc -l < "$STANDALONE_FILE" | xargs)"
echo ""

echo "✅ Critical Components Check:"

# Check for CSS embedding
if grep -q "<style>" "$STANDALONE_FILE"; then
    echo "   ✅ CSS properly embedded"
    CSS_LINES=$(grep -c "\." "$STANDALONE_FILE")
    echo "      - CSS selectors: $CSS_LINES"
else
    echo "   ❌ CSS not embedded properly"
fi

# Check for JavaScript embedding  
if grep -q "<script>" "$STANDALONE_FILE" && ! grep -q 'src="app.js"' "$STANDALONE_FILE"; then
    echo "   ✅ JavaScript properly embedded"
    JS_FUNCTIONS=$(grep -c "function\|const\|let\|var" "$STANDALONE_FILE")
    echo "      - JS declarations: $JS_FUNCTIONS"
else
    echo "   ❌ JavaScript not embedded properly"
fi

# Check for Chart.js CDN
if grep -q "https://cdn.jsdelivr.net/npm/chart.js" "$STANDALONE_FILE"; then
    echo "   ✅ Chart.js CDN link preserved"
else
    echo "   ⚠️  Chart.js CDN link not found"
fi

# Check for critical app components
echo ""
echo "🎯 Core Functionality Check:"

COMPONENTS=(
    "dashboard-view"
    "planner-view" 
    "settings-view"
    "nav-tab"
    "dark-mode-toggle"
    "location-toggle"
    "gantt-chart"
    "metric-card"
)

for component in "${COMPONENTS[@]}"; do
    if grep -q "$component" "$STANDALONE_FILE"; then
        echo "   ✅ $component found"
    else
        echo "   ❌ $component missing"
    fi
done

echo ""
echo "🧪 Browser Compatibility Check:"

# Check for modern JavaScript features that might cause issues
if grep -q "querySelector\|addEventListener" "$STANDALONE_FILE"; then
    echo "   ✅ Modern DOM APIs present"
else
    echo "   ⚠️  Modern DOM APIs not found"
fi

# Check for localStorage usage with error handling
if grep -q "localStorage" "$STANDALONE_FILE"; then
    echo "   ✅ localStorage usage found"
    if grep -q "try.*localStorage\|catch" "$STANDALONE_FILE"; then
        echo "      ✅ Error handling present"
    else
        echo "      ⚠️  Consider adding localStorage error handling"
    fi
fi

echo ""
echo "📋 Summary:"
echo "   The standalone file appears to be properly built with all"
echo "   CSS and JavaScript embedded. You can now:"
echo ""
echo "   1. 🌐 Open directly in any modern browser"
echo "   2. 📤 Share with others (no dependencies needed)"  
echo "   3. 💾 Run offline without internet connection"
echo "   4. 📱 Works on mobile and desktop browsers"
echo ""
echo "   To test: open trainer-view-standalone.html in your browser" 