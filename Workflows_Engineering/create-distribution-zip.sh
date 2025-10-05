#!/bin/bash

# SCWMS Distribution Zip Creator
# This script creates a complete distribution zip file for easy sharing with team members

echo "==============================================="
echo "SCWMS - Creating Distribution Package"
echo "==============================================="

# Navigate to the project root
cd "$(dirname "$0")"

# Define the output zip file name
ZIP_NAME="SCWMS-complete-distribution-$(date +%Y%m%d-%H%M%S).zip"

echo "📦 Creating distribution package: $ZIP_NAME"
echo ""

# Create the zip file including all necessary files
echo "🗜️  Adding files to zip archive..."

# Include all files and directories except those that should be excluded
zip -r "$ZIP_NAME" . \
  -x "*.git/*" \
  "*.DS_Store" \
  "*node_modules/*" \
  "*dist/*" \
  "*build/*" \
  "*.log" \
  "*tmp/*" \
  "*temp/*" \
  "*.env.local" \
  "*.env.*.local" \
  "SCWMS-complete-distribution-*.zip" \
  "SCWMS-COPY-full.zip"

echo ""
echo "✅ Distribution package created successfully!"
echo "📁 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "📋 Contents include:"
echo "  • All source code files"
echo "  • Configuration files (.env, .gitignore)"
echo "  • Package management files (package.json, package-lock.json)"
echo "  • Documentation (README.md, QUICKSTART.md)"
echo "  • Shell scripts (setup.sh, start.sh, etc.)"
echo ""
echo "📥 To use this package:"
echo "  1. Extract the zip file"
echo "  2. Run './setup.sh' to install dependencies"
echo "  3. Run './setup-env.sh' to create environment files"
echo "  4. Update environment variables as needed"
echo "  5. Run './start.sh' to start all services"
echo ""
echo "==============================================="