# CIM Backend (Compliance & Inspection Management)

## Overview

The CIM (Compliance & Inspection Management) backend is a Node.js/Express application that provides RESTful APIs for managing compliance monitoring, inspection scheduling, and complaint management.

## Features

- Inspection scheduling and management
- Compliance monitoring and reporting
- Complaint logging and tracking
- Automated inspection scheduling
- Compliance trend analysis
- Reporting and analytics

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt.js for password hashing
- Nodemailer for email notifications
- PDFKit for report generation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or cloud connection)
- npm (v6 or higher)

## Installation

1. Navigate to the CIM backend directory:
   ```bash
   cd Workflows_Engineering/CIM/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5003
MONGO_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## Available Scripts

### `npm start`

Runs the app in production mode.

### `npm run dev`

Runs the app in development mode with node for auto-reloading.

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Inspections
- `GET /api/inspections` - Get all inspections
- `GET /api/inspections/:id` - Get inspection by ID
- `POST /api/inspections` - Create new inspection
- `PUT /api/inspections/:id` - Update inspection
- `DELETE /api/inspections/:id` - Delete inspection

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create new complaint
- `PUT /api/complaints/:id` - Update complaint
- `DELETE /api/complaints/:id` - Delete complaint

### Analytics
- `GET /api/analytics/compliance` - Get compliance trends
- `GET /api/analytics/recurring` - Get recurring issues

### Reports
- `GET /api/reports/inspection/:id` - Generate inspection report
- `GET /api/reports/complaint/:id` - Generate complaint report

## Database Schema

The application uses MongoDB with the following main collections:

### Users
- `_id`: ObjectId
- `username`: String (unique)
- `password`: String (hashed)
- `role`: String (ADMIN, WORKER)
- `name`: String
- `createdAt`: Date
- `updatedAt`: Date

### Inspections
- `_id`: ObjectId
- `project`: String
- `area`: String
- `inspector`: String
- `dueAt`: Date
- `notes`: String
- `status`: String (SCHEDULED, IN_PROGRESS, COMPLETED, OVERDUE)
- `result`: Object
  - `outcome`: String (PASS, FAIL)
  - `score`: Number
  - `completedAt`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Complaints
- `_id`: ObjectId
- `ticket`: String (unique)
- `complainantName`: String
- `complainantId`: String
- `mobile`: String
- `area`: String
- `type`: String (SAFETY, QUALITY, DELAY, OTHER)
- `description`: String
- `photoUrl`: String
- `status`: String (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
- `assignee`: String
- `escalated`: Boolean
- `createdAt`: Date
- `updatedAt`: Date

## Authentication

The system uses JWT-based authentication:
- Users can register and login
- Two roles: ADMIN and WORKER
- JWT tokens are required for most API endpoints

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
| `CLIENT_ORIGIN` | Frontend application URL | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your MongoDB connection string is correct and the database service is running.

2. **JWT Issues**: Verify JWT_SECRET is set correctly in your `.env` file.

3. **Port Conflicts**: If port 5003 is in use, change the PORT variable in your `.env` file.

4. **CORS Errors**: Check that the CLIENT_ORIGIN in your `.env` file matches your frontend URL.

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