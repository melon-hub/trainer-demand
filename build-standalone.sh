#!/bin/bash
set -euo pipefail

# Build trainer-view-standalone.html from source files with versioning
# This preserves all CSS and functionality by properly inlining everything

echo "🚀 Building trainer-view-standalone.html..."

# Get version from latest git tag + commits since tag
get_version() {
    if git rev-parse --git-dir > /dev/null 2>&1; then
        # Get latest tag
        LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v1.11.0")
        # Remove 'v' prefix if present
        BASE_VERSION=${LATEST_TAG#v}
        
        # Count commits since latest tag
        COMMITS_SINCE=$(git rev-list --count HEAD ^${LATEST_TAG} 2>/dev/null || echo "0")
        
        if [ "$COMMITS_SINCE" -gt 0 ]; then
            # Parse version into major.minor.patch
            IFS='.' read -r major minor patch <<< "$BASE_VERSION"
            # Add commits to patch version
            NEW_PATCH=$((patch + COMMITS_SINCE))
            echo "${major}.${minor}.${NEW_PATCH}"
        else
            echo "${BASE_VERSION}"
        fi
    else
        # Fallback if not in git repo
        echo "1.11.1"
    fi
}

VERSION=$(get_version)

# Files to process
TEMPLATE_FILE="index.html"
CSS_FILE="styles.css"
JS_FILE="app.js"
OUTPUT_BASE="trainer-demand"
TEMP_FILE="temp-standalone.html"

# Create output directory
mkdir -p "dist"
OUTPUT_FILE="dist/${OUTPUT_BASE}-${VERSION}.html"

# Validate source files exist
if [[ ! -f "$TEMPLATE_FILE" ]]; then
    echo "❌ Template file not found: $TEMPLATE_FILE" >&2
    exit 1
fi

if [[ ! -f "$CSS_FILE" ]]; then
    echo "❌ CSS file not found: $CSS_FILE" >&2
    exit 1
fi

if [[ ! -f "$JS_FILE" ]]; then
    echo "❌ JavaScript file not found: $JS_FILE" >&2
    exit 1
fi

echo "📄 Processing template..."
cp "$TEMPLATE_FILE" "$TEMP_FILE"

echo "🎨 Inlining CSS..."
# Read CSS content and escape for sed
CSS_CONTENT=$(cat "$CSS_FILE")

# Create a temporary CSS file with proper escaping
CSS_TEMP=$(mktemp)
cat "$CSS_FILE" > "$CSS_TEMP"

# Replace the CSS link with inline styles using Perl (more reliable than sed)
perl -i -pe "
    BEGIN { 
        undef \$/; 
        open(CSS, '<', '$CSS_TEMP') or die \"Cannot open CSS file: \$!\";
        \$css = <CSS>; 
        close(CSS);
    }
    s|<link rel=\"stylesheet\" href=\"styles\\.css[^>]*>|<style>\n\$css\n    </style>|s
" "$TEMP_FILE"

rm "$CSS_TEMP"

echo "📜 Inlining JavaScript..."
# Read JS content
JS_TEMP=$(mktemp)
cat "$JS_FILE" > "$JS_TEMP"

# Replace the script src with inline script using Perl
perl -i -pe "
    BEGIN { 
        undef \$/; 
        open(JS, '<', '$JS_TEMP') or die \"Cannot open JS file: \$!\";
        \$js = <JS>; 
        close(JS);
    }
    s|<script src=\"app\\.js\"></script>|<script>\n\$js\n    </script>|s
" "$TEMP_FILE"

rm "$JS_TEMP"

echo "✨ Finalizing standalone file..."

# Create current version in main folder for quick access (with version number)
MAIN_FILE="trainer-demand-${VERSION}.html"

# Move existing main folder version to dist/ before creating new one
echo "📦 Archiving previous version..."
if ls trainer-demand-*.html 1> /dev/null 2>&1; then
    mv trainer-demand-*.html dist/ 2>/dev/null || true
fi

# Move temp file to main folder as current version
mv "$TEMP_FILE" "$MAIN_FILE"

# Copy to dist/ for archive
cp "$MAIN_FILE" "dist/$MAIN_FILE"

# Clean up old versions in dist - keep only latest 10
echo "🧹 Cleaning up old versions in dist (keeping latest 10)..."
cd dist
# List all trainer-demand-*.html files by modification time, skip the 10 newest, delete the rest
ls -t trainer-demand-*.html 2>/dev/null | tail -n +11 | xargs rm -f
cd ..

# Get file size for reporting
FILE_SIZE=$(wc -c < "$MAIN_FILE" | xargs)
LINE_COUNT=$(wc -l < "$MAIN_FILE" | xargs)

echo "✅ Build complete!"
echo "   📁 Current: $MAIN_FILE"
echo "   📁 Archived: dist/$MAIN_FILE"
echo "   📊 Size: $FILE_SIZE bytes"
echo "   📄 Lines: $LINE_COUNT"
echo "   🏷️  Version: $VERSION"
echo ""
echo "🌐 The standalone file is ready to use!"
echo "   • Open directly in any browser"  
echo "   • No external dependencies"
echo "   • All CSS and JavaScript embedded" 
echo ""
echo "🎯 Current version: $VERSION"
echo "   📁 Quick access: $MAIN_FILE"
echo "   📁 Historical: dist/ (keeping latest 10 versions)"
echo "   To create a new release tag: git tag v[NEW_VERSION] && git push --tags" 