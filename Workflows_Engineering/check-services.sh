#!/bin/bash

# SCWMS Service Check Script
# This script checks if all services are running properly

echo "==============================================="
echo "SCWMS - Service Health Check"
echo "==============================================="

# Check if services are running by making HTTP requests
echo "🔍 Checking service statuses..."

# Check Frontend (port 3000)
if nc -z localhost 3000; then
    echo "✅ Frontend: Running on http://localhost:3000"
else
    echo "❌ Frontend: Not running on http://localhost:3000"
fi

# Check WSPM Backend (port 5001)
if nc -z localhost 5001; then
    echo "✅ WSPM Backend: Running on http://localhost:5001"
    # Test API endpoint
    if curl -s http://localhost:5001/health | grep -q "ok"; then
        echo "   🔄 WSPM API: Healthy"
    else
        echo "   ⚠️  WSPM API: Unreachable"
    fi
else
    echo "❌ WSPM Backend: Not running on http://localhost:5001"
fi

# Check ETM Backend (port 5002)
if nc -z localhost 5002; then
    echo "✅ ETM Backend: Running on http://localhost:5002"
    # Test API endpoint
    if curl -s http://localhost:5002/ | grep -q "Hello from the backend"; then
        echo "   🔄 ETM API: Healthy"
    else
        echo "   ⚠️  ETM API: Unreachable"
    fi
else
    echo "❌ ETM Backend: Not running on http://localhost:5002"
fi

# Check CIM Backend (port 5003)
if nc -z localhost 5003; then
    echo "✅ CIM Backend: Running on http://localhost:5003"
else
    echo "❌ CIM Backend: Not running on http://localhost:5003"
fi

# Check MISTM Backend (port 5004)
if nc -z localhost 5004; then
    echo "✅ MISTM Backend: Running on http://localhost:5004"
else
    echo "❌ MISTM Backend: Not running on http://localhost:5004"
fi

# Check PTFD Backend (port 5050)
if nc -z localhost 5050; then
    echo "✅ PTFD Backend: Running on http://localhost:5050"
    # Test API endpoint
    if curl -s http://localhost:5050/test | grep -q "Test route working"; then
        echo "   🔄 PTFD API: Healthy"
    else
        echo "   ⚠️  PTFD API: Unreachable"
    fi
else
    echo "❌ PTFD Backend: Not running on http://localhost:5050"
fi

echo ""
echo "==============================================="
echo "📝 Notes:"
echo "- Services might take a few seconds to start completely"
echo "- If services show as not running, try 'npm start' in the root directory"
echo "- Make sure MongoDB is running for backend services to connect"
echo "==============================================="