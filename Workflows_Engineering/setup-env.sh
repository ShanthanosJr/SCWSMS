#!/bin/bash

# SCWMS Environment Setup Script
# This script helps set up environment variables for all backend modules

echo "==============================================="
echo "SCWMS - Environment Variables Setup"
echo "==============================================="

# Navigate to the project root
cd "$(dirname "$0")"

# Setup WSPM Backend .env
echo "🔧 Setting up WSPM Backend environment variables..."
cat > WSPM/backend/.env << EOF
PORT=5001
MONGO_URI=mongodb://localhost:27017/wspm_db
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Worker System <your_email@gmail.com>
EOF
echo "✅ WSPM Backend .env created"
echo ""

# Setup ETM Backend .env
echo "🔧 Setting up ETM Backend environment variables..."
cat > ETM/backend/.env << EOF
PORT=5002
EOF
echo "✅ ETM Backend .env created"
echo ""

# Setup CIM Backend .env
echo "🔧 Setting up CIM Backend environment variables..."
cat > CIM/backend/.env << EOF
PORT=5003
MONGO_URI=mongodb://localhost:27017/cim_db
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=change_me
EOF
echo "✅ CIM Backend .env created"
echo ""

# Setup MISTM Backend .env
echo "🔧 Setting up MISTM Backend environment variables..."
cat > MISTM/Backend/.env << EOF
PORT=5004
MONGODB_URI=mongodb://localhost:27017/mistm_db
CORS_ORIGIN=http://localhost:3000
EOF
echo "✅ MISTM Backend .env created"
echo ""

# Setup PTFD Backend .env
echo "🔧 Setting up PTFD Backend environment variables..."
cat > PTFD/Backend/.env << EOF
JWT_SECRET=ptfd_jwt_secret_key_2025
MONGO_URI=mongodb://localhost:27017/ptfd_db
EOF
echo "✅ PTFD Backend .env created"
echo ""

echo "==============================================="
echo "✅ Environment variables setup completed!"
echo ""
echo "📝 Please update the following in each .env file:"
echo "1. WSPM/backend/.env - Update MONGO_URI, EMAIL_USER, EMAIL_PASS"
echo "2. CIM/backend/.env - Update MONGO_URI, JWT_SECRET"
echo "3. MISTM/Backend/.env - Update MONGODB_URI"
echo "4. PTFD/Backend/.env - Update MONGO_URI, JWT_SECRET"
echo ""
echo "💾 Remember to keep your credentials secure and never commit .env files to version control!"
echo "==============================================="