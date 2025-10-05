# Smart Construction Workflow & Safety Management System (SCWMS)

## Overview

The Smart Construction Workflow & Safety Management System (SCWMS) is a comprehensive platform designed to streamline construction project management, enhance safety protocols, and provide real-time insights through advanced analytics. This system integrates multiple modules to handle various aspects of construction workflows including worker safety, equipment management, compliance monitoring, material tracking, and financial oversight.

## Project Structure

The system is organized into five distinct modules:

1. **WSPM (Worker Safety & Payroll Management)**
   - Manages worker attendance, payroll, safety incidents, training records, and shift scheduling
   - Features QR code-based attendance tracking and safety compliance monitoring

2. **ETM (Equipment Tracking Management)**
   - Tracks construction equipment rental, maintenance schedules, and condition monitoring
   - Provides real-time equipment status and utilization reports

3. **CIM (Compliance & Inspection Management)**
   - Handles compliance monitoring, inspection scheduling, and complaint management
   - Features automated inspection scheduling and compliance trend analysis

4. **MISTM (Materials & Suppliers Tracking Management)**
   - Manages material inventory, supplier information, and cost analysis
   - Provides real-time material tracking and supplier performance metrics

5. **PTFD (Projects Timeline & Financial Dashboard)**
   - Manages project timelines, financial tracking, and dashboard visualization
   - Features interactive project timelines and comprehensive financial reporting

## Technology Stack

### Frontend
- React.js (Create React App)
- React Router for navigation
- Bootstrap 5 for UI components
- Chart.js and Recharts for data visualization
- Axios for API communication

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Mongoose for ODM
- JWT for authentication
- Nodemailer for email notifications

### Additional Tools
- Concurrently for running multiple services
- Nodemon for development
- Dotenv for environment management

## Quick Start

For group members, you can use the provided scripts to quickly set up and run the application:

1. **Make scripts executable**:
   ```bash
   chmod +x setup.sh setup-env.sh start.sh
   ```

2. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

3. **Set up environment variables**:
   ```bash
   ./setup-env.sh
   ```

4. **Update environment variables** as needed (see below)

5. **Start all services**:
   ```bash
   ./start.sh
   ```

For detailed instructions, see [QUICKSTART.md](QUICKSTART.md).

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (local instance or cloud connection)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ShanthanosJr/SCWSMS.git
   cd SCWSMS
   ```

2. Install dependencies for each module:

   ### WSPM Backend
   ```bash
   cd Workflows_Engineering/WSPM/backend
   npm install
   ```

   ### ETM Backend
   ```bash
   cd Workflows_Engineering/ETM/backend
   npm install
   ```

   ### CIM Backend
   ```bash
   cd Workflows_Engineering/CIM/backend
   npm install
   ```

   ### MISTM Backend
   ```bash
   cd Workflows_Engineering/MISTM/Backend
   npm install
   ```

   ### PTFD Backend
   ```bash
   cd Workflows_Engineering/PTFD/Backend
   npm install
   ```

   ### Unified Frontend
   ```bash
   cd Workflows_Engineering/client
   npm install
   ```

3. Install root dependencies:
   ```bash
   cd Workflows_Engineering
   npm install
   ```

## Configuration

Each backend module requires environment variables. Create a `.env` file in each backend directory with the following configurations:

### WSPM Backend (.env)
```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=Worker System <your_email@gmail.com>
```

### ETM Backend (.env)
```env
PORT=5002
```

### CIM Backend (.env)
```env
PORT=5003
MONGO_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

### MISTM Backend (.env)
```env
PORT=5004
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
```

### PTFD Backend (.env)
```env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

## Running the Application

### Development Mode

To run all services simultaneously in development mode:

```bash
cd Workflows_Engineering
npm start
```

This command will start:
- Unified frontend on port 3000
- WSPM backend on port 5001
- ETM backend on port 5002
- CIM backend on port 5003
- MISTM backend on port 5004
- PTFD backend on port 5050

### Running Individual Services

If you prefer to run services individually:

1. **Frontend**:
   ```bash
   cd Workflows_Engineering/client
   npm start
   ```

2. **WSPM Backend**:
   ```bash
   cd Workflows_Engineering/WSPM/backend
   npm start
   ```

3. **ETM Backend**:
   ```bash
   cd Workflows_Engineering/ETM/backend
   npm run dev
   ```

4. **CIM Backend**:
   ```bash
   cd Workflows_Engineering/CIM/backend
   npm start
   ```

5. **MISTM Backend**:
   ```bash
   cd Workflows_Engineering/MISTM/Backend
   npm start
   ```

6. **PTFD Backend**:
   ```bash
   cd Workflows_Engineering/PTFD/Backend
   npm start
   ```

## Accessing the Application

Once all services are running:

1. Open your browser and navigate to `http://localhost:3000`
2. You will see the main dashboard with navigation to all five modules:
   - WSPM (Worker Safety & Payroll Management)
   - ETM (Equipment Tracking Management)
   - CIM (Compliance & Inspection Management)
   - MISTM (Materials & Suppliers Tracking Management)
   - PTFD (Projects Timeline & Financial Dashboard)

## Features

### Unified Dashboard
- Single interface to access all construction management modules
- Consistent navigation across all modules
- Responsive design for desktop and tablet usage

### Module-Specific Features

#### WSPM
- Worker attendance tracking with QR codes
- Payroll management and reporting
- Safety incident logging and analysis
- Training record management
- Shift scheduling and swap requests

#### ETM
- Equipment rental management
- Maintenance scheduling and tracking
- Equipment condition monitoring
- Rental history and financial reporting

#### CIM
- Automated inspection scheduling
- Compliance monitoring and reporting
- Complaint management system
- Trend analysis and analytics

#### MISTM
- Material inventory tracking
- Supplier information management
- Cost analysis and reporting
- Material usage forecasting

#### PTFD
- Project timeline management
- Financial dashboard with real-time metrics
- Project progress tracking
- Budget monitoring and alerts

## API Documentation

Each backend module exposes RESTful APIs for data management:

- WSPM: `http://localhost:5001/api/`
- ETM: `http://localhost:5002/api/`
- CIM: `http://localhost:5003/api/`
- MISTM: `http://localhost:5004/api/`
- PTFD: `http://localhost:5050/`

Refer to each module's specific documentation for detailed API endpoints:

- [WSPM Backend README](WSPM/backend/README.md)
- [ETM Backend README](ETM/backend/README.md)
- [CIM Backend README](CIM/backend/README.md)
- [MISTM Backend README](MISTM/Backend/README.md)
- [PTFD Backend README](PTFD/Backend/README.md)
- [Unified Frontend README](client/README.md)

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If you encounter port conflicts, modify the PORT variable in each module's `.env` file or server configuration.

2. **MongoDB Connection**: Ensure your MongoDB connection string is correct and the database service is running.

3. **CORS Errors**: Check that the CORS configuration in each backend allows requests from your frontend URL.

4. **Missing Dependencies**: Run `npm install` in each module directory if you encounter module not found errors.

### Logs and Debugging

Each backend service outputs logs to the console. Check these logs for error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For support or inquiries, please contact the development team at [contact@workflowsengineering.com](mailto:contact@workflowsengineering.com).

## Acknowledgments

- Thanks to all contributors who have helped develop and maintain this system
- Special recognition to the construction industry professionals who provided valuable feedback