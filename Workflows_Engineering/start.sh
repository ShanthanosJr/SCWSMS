#!/bin/bash

# SCWMS Startup Script
# This script starts all services for the Smart Construction Workflow & Safety Management System

echo "==============================================="
echo "SCWMS - Smart Construction Workflow & Safety Management System"
echo "Starting all services..."
echo "==============================================="

# Navigate to the project root
cd "$(dirname "$0")"

# Start all services using the npm start script
echo "🚀 Starting all services..."
echo "Frontend will be available at http://localhost:3000"
echo "WSPM Backend: http://localhost:5001"
echo "ETM Backend: http://localhost:5002"
echo "CIM Backend: http://localhost:5003"
echo "MISTM Backend: http://localhost:5004"
echo "PTFD Backend: http://localhost:5050"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

npm start