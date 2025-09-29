# PTFD Backend (Projects Timeline & Financial Dashboard)

## Overview

The PTFD (Projects Timeline & Financial Dashboard) backend is a Node.js/Express application that provides RESTful APIs for managing project timelines, financial tracking, and dashboard visualization.

## Features

- Project management and tracking
- Timeline management and scheduling
- Financial dashboard with real-time metrics
- Project progress tracking
- Budget monitoring and alerts
- Chatbot AI assistant for project queries
- User authentication and management
- Reporting and analytics

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt.js for password hashing
- Nodemailer for email notifications
- PDFKit for report generation
- Twilio for SMS notifications (if implemented)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or cloud connection)
- npm (v6 or higher)

## Installation

1. Navigate to the PTFD backend directory:
   ```bash
   cd Workflows_Engineering/PTFD/Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongodb_connection_string
```

## Available Scripts

### `npm start`

Runs the app in production mode.

### `npm run dev`

Runs the app in development mode with nodemon for auto-reloading.

## API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Projects
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Timelines
- `GET /timelines` - Get all timelines
- `GET /timelines/:id` - Get timeline by ID
- `POST /timelines` - Create new timeline
- `PUT /timelines/:id` - Update timeline
- `DELETE /timelines/:id` - Delete timeline

### Project Timelines
- `GET /project-timelines` - Get all project timelines
- `GET /project-timelines/:id` - Get project timeline by ID
- `POST /project-timelines` - Create new project timeline
- `PUT /project-timelines/:id` - Update project timeline
- `DELETE /project-timelines/:id` - Delete project timeline

### Financial Dashboard
- `GET /financial-dashboard` - Get financial dashboard data
- `GET /financial-dashboard/:id` - Get financial dashboard by project ID

### Chatbot
- `POST /chatbot/query` - Submit chatbot query
- `GET /chatbot/knowledge` - Get chatbot knowledge base

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Database Schema

The application uses MongoDB with the following main collections:

### Users
- `_id`: ObjectId
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: String (admin, user)
- `createdAt`: Date
- `updatedAt`: Date

### Projects
- `_id`: ObjectId
- `pname`: String (Project Name)
- `pcode`: String (Project Code)
- `plocation`: String (Project Location)
- `ptype`: String (Project Type)
- `pdescription`: String (Project Description)
- `pobservations`: String (Project Observations)
- `pstatus`: String (Project Status)
- `ppriority`: String (Project Priority)
- `pbudget`: Number (Project Budget)
- `pcreatedat`: Date (Project Created At)
- `penddate`: Date (Project End Date)
- `pimg`: Array (Project Images)
- `pissues`: Array (Project Issues)
- `pownername`: String (Project Owner Name)
- `pnumber`: String (Project Number)
- `createdAt`: Date
- `updatedAt`: Date

### Timelines
- `_id`: ObjectId
- `projectId`: String (reference to Projects)
- `date`: Date
- `activity`: String
- `description`: String
- `status`: String
- `assignedTo`: String
- `createdAt`: Date
- `updatedAt`: Date

### ProjectTimelines
- `_id`: ObjectId
- `projectId`: String (reference to Projects)
- `title`: String
- `startDate`: Date
- `endDate`: Date
- `milestones`: Array
  - `name`: String
  - `date`: Date
  - `status`: String
- `createdAt`: Date
- `updatedAt`: Date

### FinancialDashboard
- `_id`: ObjectId
- `projectId`: String (reference to Projects)
- `budget`: Number
- `spent`: Number
- `remaining`: Number
- `expenses`: Array
  - `date`: Date
  - `category`: String
  - `amount`: Number
  - `description`: String
- `revenue`: Array
  - `date`: Date
  - `source`: String
  - `amount`: Number
- `createdAt`: Date
- `updatedAt`: Date

### ChatbotKnowledge
- `_id`: ObjectId
- `question`: String
- `answer`: String
- `category`: String
- `keywords`: Array
- `createdAt`: Date
- `updatedAt`: Date

## Authentication

The system uses JWT-based authentication:
- Users can register and login
- Two roles: admin and user
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
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your MongoDB connection string is correct and the database service is running.

2. **JWT Issues**: Verify JWT_SECRET is set correctly in your `.env` file.

3. **Port Conflicts**: If port 5050 is in use, change the port in the app.js file.

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