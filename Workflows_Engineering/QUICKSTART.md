# Quick Start Guide

This guide will help you quickly set up and run the Smart Construction Workflow & Safety Management System (SCWMS).

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local instance or cloud connection)

## Quick Setup

1. **Make scripts executable** (if not already done):
   ```bash
   chmod +x setup.sh setup-env.sh start.sh
   ```

2. **Run the setup script**:
   ```bash
   ./setup.sh
   ```
   This will install all dependencies for all modules.

3. **Set up environment variables**:
   ```bash
   ./setup-env.sh
   ```
   This will create default `.env` files for all backend modules.

4. **Update environment variables**:
   Edit the `.env` files in each backend directory with your specific configurations:
   - `WSPM/backend/.env`
   - `ETM/backend/.env`
   - `CIM/backend/.env`
   - `MISTM/Backend/.env`
   - `PTFD/Backend/.env`

5. **Start all services**:
   ```bash
   ./start.sh
   ```
   Or alternatively:
   ```bash
   npm start
   ```

## Access the Application

Once all services are running:
- Open your browser and navigate to `http://localhost:3000`
- The application will automatically connect to all backend services

## Stopping the Application

To stop all services, press `Ctrl+C` in the terminal where you started the application.

## Checking Service Status

To check if all services are running properly:
```bash
./check-services.sh
```

This script will verify that each service is running and accessible.

## Troubleshooting

If you encounter any issues:

1. **Port conflicts**: Modify the PORT variables in the respective `.env` files
2. **MongoDB connection errors**: Ensure MongoDB is running and connection strings are correct
3. **Missing dependencies**: Run `npm install` in any module directory that reports missing packages

## For Group Members

When sharing this project with your group members:
1. Each member should run `./setup.sh` after cloning the repository
2. Each member should run `./setup-env.sh` to create their local environment files
3. Each member should update the environment variables with their own configurations
4. Use `./start.sh` to easily start all services
5. Use `./check-services.sh` to verify all services are running correctly

## Scripts Overview

- `setup.sh`: Installs all dependencies for all modules
- `setup-env.sh`: Creates default environment variable files
- `start.sh`: Starts all services simultaneously
- `check-services.sh`: Checks if all services are running properly
- `README.md`: Complete project documentation
- `client/README.md`: Frontend-specific documentation
- `WSPM/backend/README.md`: WSPM backend documentation
- `ETM/backend/README.md`: ETM backend documentation
- `CIM/backend/README.md`: CIM backend documentation
- `MISTM/Backend/README.md`: MISTM backend documentation
- `PTFD/Backend/README.md`: PTFD backend documentation