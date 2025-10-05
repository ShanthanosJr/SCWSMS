# MISTM Backend (Materials & Suppliers Tracking Management)

## Overview

The MISTM (Materials & Suppliers Tracking Management) backend is a Node.js/Express application that provides RESTful APIs for managing material inventory, supplier information, and cost analysis.

## Features

- Material inventory tracking
- Supplier information management
- Cost analysis and reporting
- Material usage forecasting
- Supplier performance metrics
- Reporting and analytics

## Technology Stack

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication (if implemented)
- CORS for cross-origin resource sharing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or cloud connection)
- npm (v6 or higher)

## Installation

1. Navigate to the MISTM backend directory:
   ```bash
   cd Workflows_Engineering/MISTM/Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5004
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000
```

## Available Scripts

### `npm start`

Runs the app in production mode.

## API Endpoints

### Materials
- `GET /api/materials` - Get all materials
- `GET /api/materials/:id` - Get material by ID
- `POST /api/materials` - Create new material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Reports
- `GET /api/reports/materials` - Get material usage report
- `GET /api/reports/suppliers` - Get supplier performance report
- `GET /api/reports/costs` - Get cost analysis report

## Database Schema

The application uses MongoDB with the following main collections:

### Materials
- `_id`: ObjectId
- `name`: String
- `description`: String
- `category`: String
- `unit`: String
- `unitPrice`: Number
- `quantity`: Number
- `reorderLevel`: Number
- `supplierId`: String (reference to Suppliers)
- `lastUpdated`: Date
- `createdAt`: Date
- `updatedAt`: Date

### Suppliers
- `_id`: ObjectId
- `name`: String
- `contactPerson`: String
- `email`: String
- `phone`: String
- `address`: String
- `rating`: Number
- `totalOrders`: Number
- `totalSpent`: Number
- `lastOrderDate`: Date
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
| `MONGODB_URI` | MongoDB connection string | Yes |
| `CORS_ORIGIN` | Frontend application URL | Yes |

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure your MongoDB connection string is correct and the database service is running.

2. **Port Conflicts**: If port 5004 is in use, change the PORT variable in your server configuration.

3. **CORS Errors**: Check that the CORS_ORIGIN in your `.env` file matches your frontend URL.

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