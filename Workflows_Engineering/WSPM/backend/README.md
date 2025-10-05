# WSPM Backend (Worker Safety & Payroll Management)

## Overview

The WSPM (Worker Safety & Payroll Management) backend is a Node.js/Express application that provides RESTful APIs for managing worker attendance, payroll, safety incidents, training records, and shift scheduling.

## Features

- Worker management (registration, profiles, contracts)
- Attendance tracking with QR code scanning
- Payroll calculation and reporting
- Safety incident logging and analysis
- Training record management
- Shift scheduling and swap requests
- Report generation (PDF exports)

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Nodemailer for email notifications
- PDFKit for report generation
- QR Code generation and scanning

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or cloud connection)
- npm (v6 or higher)

## Installation

1. Navigate to the WSPM backend directory:
   ```bash
   cd Workflows_Engineering/WSPM/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

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

## Available Scripts

### `npm start`

Runs the app in production mode.

### `npm run dev`

Runs the app in development mode with nodemon for auto-reloading.

## API Endpoints

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get worker by ID
- `POST /api/workers` - Create new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Record attendance
- `GET /api/attendance/worker/:workerId` - Get attendance by worker

### Payroll
- `GET /api/payroll` - Get payroll records
- `POST /api/payroll` - Generate payroll
- `GET /api/payroll/worker/:workerId` - Get payroll by worker

### Safety
- `GET /api/safety` - Get safety incidents
- `POST /api/safety` - Report safety incident
- `PUT /api/safety/:id` - Update safety incident

### Training
- `GET /api/training` - Get training records
- `POST /api/training` - Add training record
- `PUT /api/training/:id` - Update training record

### Shifts
- `GET /api/shifts` - Get shift schedules
- `POST /api/shifts` - Create shift schedule
- `PUT /api/shifts/:id` - Update shift schedule

### Reports
- `GET /api/reports/attendance/:workerId` - Generate attendance report
- `GET /api/reports/payroll/:workerId` - Generate payroll report
- `GET /api/reports/safety` - Generate safety report

## Database Schema

The application uses MongoDB with the following main collections:

### Workers
- `_id`: ObjectId
- `workerId`: String (unique)
- `name`: String
- `position`: String
- `department`: String
- `email`: String
- `phone`: String
- `hireDate`: Date
- `salary`: Number
- `createdAt`: Date
- `updatedAt`: Date

### Attendance
- `_id`: ObjectId
- `workerId`: String (reference to Workers)
- `date`: Date
- `checkIn`: Date
- `checkOut`: Date
- `status`: String
- `createdAt`: Date

### Payroll
- `_id`: ObjectId
- `workerId`: String (reference to Workers)
- `periodStart`: Date
- `periodEnd`: Date
- `hoursWorked`: Number
- `hourlyRate`: Number
- `grossPay`: Number
- `deductions`: Number
- `netPay`: Number
- `status`: String
- `createdAt`: Date

### Safety
- `_id`: ObjectId
- `workerId`: String (reference to Workers)
- `incidentDate`: Date
- `location`: String
- `description`: String
- `severity`: String
- `actionsTaken`: String
- `status`: String
- `createdAt`: Date

### Training
- `_id`: ObjectId
- `workerId`: String (reference to Workers)
- `courseName`: String
- `completionDate`: Date
- `expiryDate`: Date
- `certificateId`: String
- `status`: String
- `createdAt`: Date

### Shifts
- `_id`: ObjectId
- `workerId`: String (reference to Workers)
- `date`: Date
- `startTime`: Date
- `endTime`: Date
- `location`: String
- `status`: String
- `createdAt`: Date

## Email Notifications

The system sends email notifications for:
- Payroll generation
- Safety incident reports
- Training reminders
- Shift schedule updates

## QR Code System

Workers can scan QR codes for attendance tracking. Each worker has a unique QR code that can be generated and printed.

## Report Generation

The system can generate PDF reports for:
- Individual worker attendance
- Payroll summaries
- Safety incident logs
- Training records

## Error Handling

The application includes comprehensive error handling with:
- Validation middleware
- Custom error classes
- Global error handler
- Detailed error logging

## Logging

All important events and errors are logged to the console for debugging and monitoring.

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configuration
- Input validation and sanitization
- Rate limiting (if configured)

## Testing

Unit tests and integration tests can be added using testing frameworks like Jest or Mocha.

## Deployment

The application can be deployed to any Node.js hosting platform:
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform
- Google Cloud Run
- Azure App Service

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `CLIENT_URL` | Frontend application URL | Yes |
| `EMAIL_HOST` | SMTP host for email service | Yes |
| `EMAIL_PORT` | SMTP port | Yes |
| `EMAIL_USER` | Email account username | Yes |
| `EMAIL_PASS` | Email account password or app password | Yes |
| `EMAIL_FROM` | Sender email address | Yes |

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your MongoDB connection string is correct and the database service is running.

2. **Email Configuration**: Verify SMTP settings and credentials are correct.

3. **Port Conflicts**: If port 5001 is in use, change the PORT variable in your `.env` file.

4. **CORS Errors**: Check that the CLIENT_URL in your `.env` file matches your frontend URL.

### Logs

Check the console output for error messages and debugging information.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.