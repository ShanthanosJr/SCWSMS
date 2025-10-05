#!/bin/bash

# SCWMS Complete Distribution Zip Creator
# This script creates a complete distribution zip file including ALL files for easy sharing with team members

echo "==============================================="
echo "SCWMS - Creating COMPLETE Distribution Package"
echo "==============================================="

# Navigate to the project root
cd "$(dirname "$0")"

# Define the output zip file name with timestamp
ZIP_NAME="SCWMS-COMPLETE-ALL-FILES-$(date +%Y%m%d-%H%M%S).zip"

echo "📦 Creating COMPLETE distribution package: $ZIP_NAME"
echo ""

# Create the zip file including ALL files in the Workflows_Engineering directory
echo "🗜️  Adding ALL files to zip archive..."

# Include all files and directories without exclusions to ensure nothing is missed
zip -r "$ZIP_NAME" . -x "*.git/*" "SCWMS-COMPLETE-ALL-FILES-*.zip"

echo ""
echo "✅ COMPLETE distribution package created successfully!"
echo "📁 Location: $(pwd)/$ZIP_NAME"
echo ""
echo "📋 This package includes:"
echo "  • All source code files for all modules:"
echo "    - CIM (backend, frontend, README.md)"
echo "    - ETM (backend, frontend, README.md)"
echo "    - MISTM (Backend, Frontend, README.md)"
echo "    - PTFD (Backend, frontend, README.md, package.json, etc.)"
echo "    - WSPM (backend, frontend, README.md)"
echo "    - client (React frontend with node_modules)"
echo "  • All configuration files (.env, .gitignore)"
echo "  • All package management files (package.json, package-lock.json)"
echo "  • All documentation files (README.md, QUICKSTART.md, etc.)"
echo "  • All shell scripts (setup.sh, start.sh, setup-env.sh, check-services.sh)"
echo "  • All node_modules directories"
echo "  • All other files in the Workflows_Engineering directory"
echo ""
echo "📥 To use this package:"
echo "  1. Extract the zip file"
echo "  2. All files will be in their correct locations"
echo "  3. Run './start.sh' to start all services (dependencies already included)"
echo "  4. Access the application at http://localhost:3000"
echo ""
echo "==============================================="