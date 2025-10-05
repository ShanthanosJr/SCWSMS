# SCWMS Distribution Package

This distribution package contains a complete, ready-to-use version of the Smart Construction Workflow & Safety Management System (SCWMS) that can be easily shared with team members.

## Purpose

This package was created to allow team members to:
1. Get started quickly without manual setup
2. Avoid common configuration issues
3. Have a consistent development environment
4. Reduce time spent on project initialization

## Contents

The distribution package includes:
- All source code files for all modules (WSPM, ETM, CIM, MISTM, PTFD)
- All necessary configuration files (.env files for each module)
- Package management files (package.json, package-lock.json)
- Documentation (README.md, QUICKSTART.md)
- Shell scripts for setup and execution (setup.sh, start.sh, etc.)
- All dependencies and node_modules directories

## Usage Instructions

1. Extract the zip file to your desired location
2. Navigate to the extracted directory
3. Run the setup scripts:
   ```bash
   chmod +x setup.sh setup-env.sh start.sh
   ./setup.sh
   ./setup-env.sh
   ```
4. Update the environment variables in the generated .env files as needed
5. Start all services:
   ```bash
   ./start.sh
   ```

## File Information

- **File Name**: SCWMS-complete-distribution-*.zip (timestamped)
- **Size**: ~2.5MB (much smaller than full zip due to exclusions)
- **Created**: September 30, 2025
- **Created By**: Automated distribution script

## Notes

- This package excludes git history, temporary files, and other unnecessary files
- All dependencies are included so team members don't need to run npm install
- Environment files are included but should be customized for each deployment
- This package is intended for team collaboration and quick setup, not for production deployment

For detailed usage instructions, refer to the main README.md and QUICKSTART.md files included in the package.