#!/bin/bash

# SCWMS Setup Script
# This script automates the setup process for the Smart Construction Workflow & Safety Management System

echo "==============================================="
echo "SCWMS - Smart Construction Workflow & Safety Management System"
echo "Automated Setup Script"
echo "==============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js (v14 or higher) and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm (v6 or higher) and try again."
    exit 1
fi

echo "✅ Node.js and npm found"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo ""

# Navigate to the project root
cd "$(dirname "$0")"

echo "📂 Setting up the project..."
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo ""

# Setup WSPM Backend
echo "🔧 Setting up WSPM Backend..."
cd WSPM/backend
npm install
cd ../..
echo ""

# Setup ETM Backend
echo "🔧 Setting up ETM Backend..."
cd ETM/backend
npm install
cd ../..
echo ""

# Setup CIM Backend
echo "🔧 Setting up CIM Backend..."
cd CIM/backend
npm install
cd ../..
echo ""

# Setup MISTM Backend
echo "🔧 Setting up MISTM Backend..."
cd MISTM/Backend
npm install
cd ../..
echo ""

# Setup PTFD Backend
echo "🔧 Setting up PTFD Backend..."
cd PTFD/Backend
npm install
cd ../..
echo ""

# Setup Client (Frontend)
echo "🔧 Setting up Client (Frontend)..."
cd client
npm install
cd ..
echo ""

echo "==============================================="
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Configure environment variables for each backend module"
echo "2. Make sure MongoDB is running"
echo "3. Run 'npm start' in the root directory to start all services"
echo ""
echo "🚀 To start the application:"
echo "   cd Workflows_Engineering"
echo "   npm start"
echo ""
echo "The application will be available at http://localhost:3000"
echo "==============================================="