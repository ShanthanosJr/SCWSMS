# ETM Backend (Equipment Tracking Management)

## Overview

The ETM (Equipment Tracking Management) backend is a Node.js/Express application that provides RESTful APIs for managing construction equipment rental, maintenance schedules, and condition monitoring.

## Features

- Equipment registration and management
- Rental tracking and history
- Maintenance scheduling and tracking
- Equipment condition monitoring
- Status logging and reporting
- Financial reporting for equipment usage

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication (if implemented)
- Body-parser for request parsing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or cloud connection)
- npm (v6 or higher)

## Installation

1. Navigate to the ETM backend directory:
   ```bash
   cd Workflows_Engineering/ETM/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5002
```

## Available Scripts

### `npm start`

Runs the app in production mode.

### `npm run dev`

Runs the app in development mode with nodemon for auto-reloading.

## API Endpoints

### Tools/Equipment
- `GET /api/tools` - Get all equipment
- `GET /api/tools/:id` - Get equipment by ID
- `POST /api/tools` - Create new equipment
- `PUT /api/tools/:id` - Update equipment
- `DELETE /api/tools/:id` - Delete equipment

### Rentals
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/:id` - Get rental by ID
- `POST /api/rentals` - Create new rental
- `PUT /api/rentals/:id` - Update rental
- `DELETE /api/rentals/:id` - Delete rental

## Database Schema

The application uses MongoDB with the following main collections:

### Tools/Equipment
- `_id`: ObjectId
- `toolId`: String (unique)
- `name`: String
- `category`: String
- `description`: String
- `purchaseDate`: Date
- `purchasePrice`: Number
- `rentalRate`: Number
- `status`: String (Available, Rented, Maintenance, Retired)
- `condition`: String (New, Good, Fair, Poor)
- `lastMaintenance`: Date
- `nextMaintenance`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Rentals
- `_id`: ObjectId
- `toolId`: String (reference to Tools)
- `renterName`: String
- `renterId`: String
- `rentalDate`: Date
- `returnDate`: Date
- `expectedReturnDate`: Date
- `rentalRate`: Number
- `totalCost`: Number
- `status`: String (Active, Completed, Overdue)
- `notes`: String
- `createdAt`: Date
- `updatedAt`: Date

## Error Handling

The application includes comprehensive error handling with:
- Validation middleware
- Custom error classes
- Global error handler
- Detailed error logging

## Logging

All important events and errors are logged to the console for debugging and monitoring.

## Security

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

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 5002 is in use, change the PORT variable in your server configuration.

2. **CORS Errors**: Check CORS configuration in the app.js file.

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